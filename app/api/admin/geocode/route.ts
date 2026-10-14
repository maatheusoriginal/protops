import { jsonError, requireAdmin } from "@/lib/server/admin-auth";

export const runtime = "nodejs";

type NominatimResult = {
  place_id?: number;
  display_name?: string;
  lat?: string;
  lon?: string;
};

type ViaCepResult = {
  erro?: boolean | string;
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  estado?: string;
};

type GeocodeBody = {
  query?: unknown;
  city?: unknown;
  state?: unknown;
};

function cleanPart(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function folded(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function withoutHouseNumber(value: string) {
  return value
    .replace(/(?:,\s*)?\b\d{1,6}(?:\s*[-/]\s*\d{1,6})?\b/gu, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+,/g, ",")
    .replace(/,{2,}/g, ",")
    .replace(/^\s*,|,\s*$/g, "")
    .trim();
}

function contextualize(query: string, city: string, state: string) {
  const normalized = folded(query);
  return [
    query,
    city && !normalized.includes(folded(city)) ? city : "",
    state && !normalized.includes(folded(state)) ? state : "",
    !normalized.includes("brasil") ? "Brasil" : "",
  ].filter(Boolean).join(", ");
}

function extractCep(value: string) {
  const match = value.match(/\b\d{5}-?\d{3}\b/u);
  return match ? match[0].replace(/\D/g, "") : "";
}

async function lookupCep(cep: string) {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
    headers: { accept: "application/json" },
    next: { revalidate: 2_592_000 },
  });
  if (!response.ok) throw new Error("CEP_UNAVAILABLE");
  const payload = (await response.json()) as ViaCepResult;
  if (payload.erro === true || payload.erro === "true") return null;
  return payload;
}

function canonicalCepAddress(value: ViaCepResult) {
  return [
    value.logradouro,
    value.complemento,
    value.bairro,
    value.localidade,
    value.uf,
    value.cep,
    "Brasil",
  ].filter(Boolean).join(", ");
}

async function searchNominatim(query: string) {
  const baseUrl = process.env.NOMINATIM_BASE_URL?.trim() || "https://nominatim.openstreetmap.org";
  const searchUrl = new URL("/search", baseUrl);
  searchUrl.searchParams.set("q", query);
  searchUrl.searchParams.set("format", "jsonv2");
  searchUrl.searchParams.set("addressdetails", "1");
  searchUrl.searchParams.set("countrycodes", "br");
  searchUrl.searchParams.set("limit", "5");
  searchUrl.searchParams.set("accept-language", "pt-BR");

  const response = await fetch(searchUrl, {
    headers: {
      accept: "application/json",
      "user-agent": "Pro-Tops-Admin/1.1 (https://protops.vercel.app)",
      referer: "https://protops.vercel.app/admin",
    },
    next: { revalidate: 86_400 },
  });
  if (!response.ok) throw new Error("GEOCODING_UNAVAILABLE");
  return (await response.json()) as NominatimResult[];
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    const body = (await request.json().catch(() => null)) as GeocodeBody | null;
    const query = cleanPart(body?.query, 300);
    const city = cleanPart(body?.city, 100);
    const state = cleanPart(body?.state, 100);
    if (query.length < 3) {
      return Response.json({ error: "Digite um endereço mais completo." }, { status: 400 });
    }

    const cep = extractCep(query);
    if (cep) {
      const viaCep = await lookupCep(cep);
      if (!viaCep) {
        return Response.json({ error: "CEP não encontrado. Confira os oito números digitados." }, { status: 404 });
      }

      const officialAddress = canonicalCepAddress(viaCep);
      let cepLocations = await searchNominatim(officialAddress);
      if (cepLocations.length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1_100));
        cepLocations = await searchNominatim(contextualize(
          [viaCep.logradouro, viaCep.bairro].filter(Boolean).join(", "),
          viaCep.localidade ?? "",
          viaCep.uf ?? viaCep.estado ?? "",
        ));
      }

      const location = cepLocations.find((item) => {
        const latitude = Number(item.lat);
        const longitude = Number(item.lon);
        return Number.isFinite(latitude) && Number.isFinite(longitude);
      });
      if (!location) return Response.json({ results: [], verifiedAddress: officialAddress });

      return Response.json({
        results: [{
          id: `cep-${cep}`,
          displayName: officialAddress,
          verifiedAddress: officialAddress,
          precision: "postal",
          latitude: Number(location.lat),
          longitude: Number(location.lon),
        }],
      });
    }

    const relaxedQuery = withoutHouseNumber(query);
    const candidates = Array.from(new Set([
      contextualize(query, city, state),
      relaxedQuery && relaxedQuery !== query ? contextualize(relaxedQuery, city, state) : "",
      contextualize(query, "", ""),
    ].filter(Boolean)));

    let payload: NominatimResult[] = [];
    for (let index = 0; index < candidates.length; index += 1) {
      payload = await searchNominatim(candidates[index]);
      if (payload.length > 0) break;
      if (index < candidates.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1_100));
      }
    }
    const requestedNumber = query.match(/\b\d{1,6}\b/u)?.[0] ?? "";
    const results = payload.flatMap((item) => {
      const latitude = Number(item.lat);
      const longitude = Number(item.lon);
      if (!item.display_name || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return [];
      return [{
        id: String(item.place_id ?? `${latitude}-${longitude}`),
        displayName: item.display_name,
        precision: requestedNumber && new RegExp(`\\b${requestedNumber}\\b`, "u").test(item.display_name)
          ? "exact"
          : "street",
        latitude,
        longitude,
      }];
    });

    return Response.json({ results });
  } catch (error) {
    if (error instanceof Error && (error.message === "GEOCODING_UNAVAILABLE" || error.message === "CEP_UNAVAILABLE")) {
      return Response.json(
        { error: "O serviço de endereços está temporariamente indisponível." },
        { status: 502 },
      );
    }
    return jsonError(error);
  }
}
