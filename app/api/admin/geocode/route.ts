import { jsonError, requireAdmin } from "@/lib/server/admin-auth";

export const runtime = "nodejs";

type NominatimResult = {
  place_id?: number;
  display_name?: string;
  lat?: string;
  lon?: string;
};

export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    const body = (await request.json().catch(() => null)) as { query?: unknown } | null;
    const query = typeof body?.query === "string" ? body.query.trim().slice(0, 300) : "";
    if (query.length < 3) {
      return Response.json({ error: "Digite um endereço mais completo." }, { status: 400 });
    }

    const baseUrl = process.env.NOMINATIM_BASE_URL?.trim() || "https://nominatim.openstreetmap.org";
    const searchUrl = new URL("/search", baseUrl);
    searchUrl.searchParams.set("q", query);
    searchUrl.searchParams.set("format", "jsonv2");
    searchUrl.searchParams.set("addressdetails", "1");
    searchUrl.searchParams.set("countrycodes", "br");
    searchUrl.searchParams.set("layer", "address");
    searchUrl.searchParams.set("limit", "5");
    searchUrl.searchParams.set("accept-language", "pt-BR");

    const response = await fetch(searchUrl, {
      headers: {
        accept: "application/json",
        "user-agent": "Pro-Tops-Admin/1.0 (https://protops.vercel.app)",
        referer: "https://protops.vercel.app/admin",
      },
      next: { revalidate: 86_400 },
    });
    if (!response.ok) {
      return Response.json(
        { error: "O serviço de endereços está temporariamente indisponível." },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as NominatimResult[];
    const results = payload.flatMap((item) => {
      const latitude = Number(item.lat);
      const longitude = Number(item.lon);
      if (!item.display_name || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return [];
      return [{
        id: String(item.place_id ?? `${latitude}-${longitude}`),
        displayName: item.display_name,
        latitude,
        longitude,
      }];
    });

    return Response.json({ results });
  } catch (error) {
    return jsonError(error);
  }
}
