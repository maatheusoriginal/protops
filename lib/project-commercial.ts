import type { Locale } from "@/lib/i18n";

export type PriceMode = "consultation" | "from" | "fixed";
export type LotMode = "area" | "dimensions";
export type ExchangeRates = {
  BRL: number;
  USD?: number;
  EUR?: number;
  CNY?: number;
  date?: string;
};

const pricePrefix = "@price:v1:";
const lotPrefix = "@lot:v1:";

const localeSettings: Record<Locale, {
  currency: "BRL" | "USD" | "EUR" | "CNY";
  intlLocale: string;
  from: string;
  consultation: string;
  approximate: string;
}> = {
  pt: { currency: "BRL", intlLocale: "pt-BR", from: "A partir de", consultation: "Sob consulta", approximate: "" },
  en: { currency: "USD", intlLocale: "en-US", from: "From", consultation: "On request", approximate: "approx." },
  es: { currency: "USD", intlLocale: "es-419", from: "Desde", consultation: "A consultar", approximate: "aprox." },
  fr: { currency: "EUR", intlLocale: "fr-FR", from: "À partir de", consultation: "Sur demande", approximate: "env." },
  de: { currency: "EUR", intlLocale: "de-DE", from: "Ab", consultation: "Auf Anfrage", approximate: "ca." },
  zh: { currency: "CNY", intlLocale: "zh-CN", from: "起价", consultation: "欢迎咨询", approximate: "约" },
};

export function encodeProjectPrice(mode: PriceMode, amountCents: number) {
  if (mode === "consultation") return `${pricePrefix}consultation`;
  return `${pricePrefix}${mode}:${Math.max(0, Math.round(amountCents))}`;
}

export function parseProjectPrice(value: string) {
  if (value.startsWith(pricePrefix)) {
    const [mode, rawCents] = value.slice(pricePrefix.length).split(":");
    if (mode === "from" || mode === "fixed") {
      return { mode, amountCents: Number(rawCents) || 0 } as const;
    }
    return { mode: "consultation", amountCents: 0 } as const;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized.includes("consulta") || normalized.includes("request")) {
    return { mode: "consultation", amountCents: 0 } as const;
  }

  const numeric = value.match(/[\d.]+(?:,\d{1,2})?/u)?.[0];
  if (numeric) {
    let amount = Number(numeric.replace(/\./g, "").replace(",", "."));
    if (/\b(milh(?:ão|ao|ões|oes)|million)\b/u.test(normalized)) amount *= 1_000_000;
    else if (/\b(mil|thousand)\b/u.test(normalized)) amount *= 1_000;
    return {
      mode: normalized.includes("partir") || normalized.includes("from") ? "from" : "fixed",
      amountCents: Math.round(amount * 100),
    } as const;
  }

  return { mode: "consultation", amountCents: 0 } as const;
}

export function formatProjectPrice(
  value: string,
  locale: Locale,
  rates?: ExchangeRates | null,
) {
  if (!value.startsWith(pricePrefix)) return value || localeSettings[locale].consultation;
  const parsed = parseProjectPrice(value);
  const settings = localeSettings[locale];
  if (parsed.mode === "consultation" || parsed.amountCents <= 0) return settings.consultation;

  const rate = settings.currency === "BRL" ? 1 : rates?.[settings.currency];
  const converted = (parsed.amountCents / 100) * (rate ?? 1);
  const currency = rate ? settings.currency : "BRL";
  const intlLocale = rate ? settings.intlLocale : "pt-BR";
  const formatted = new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "BRL" ? 2 : 0,
  }).format(converted);
  const prefix = parsed.mode === "from" ? `${settings.from} ` : "";
  const approximation = currency !== "BRL" && settings.approximate
    ? locale === "zh" ? settings.approximate : ` (${settings.approximate})`
    : "";
  return locale === "zh"
    ? `${approximation}${prefix}${formatted}`
    : `${prefix}${formatted}${approximation}`;
}

function cleanDecimal(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "";
  return String(Math.round(value * 100) / 100);
}

export function encodeLotSize(
  mode: LotMode,
  values: { area?: number; width?: number; length?: number },
) {
  if (mode === "dimensions") {
    const width = cleanDecimal(values.width ?? 0);
    const length = cleanDecimal(values.length ?? 0);
    return width && length ? `${lotPrefix}dimensions:${width}:${length}` : "";
  }
  const area = cleanDecimal(values.area ?? 0);
  return area ? `${lotPrefix}area:${area}` : "";
}

export function parseLotSize(value: string) {
  if (value.startsWith(lotPrefix)) {
    const [mode, first, second] = value.slice(lotPrefix.length).split(":");
    if (mode === "dimensions") {
      return { mode: "dimensions", area: 0, width: Number(first) || 0, length: Number(second) || 0 } as const;
    }
    return { mode: "area", area: Number(first) || 0, width: 0, length: 0 } as const;
  }
  const firstNumber = value.match(/[\d.,]+/u)?.[0];
  return {
    mode: "area",
    area: firstNumber ? Number(firstNumber.replace(/\./g, "").replace(",", ".")) || 0 : 0,
    width: 0,
    length: 0,
  } as const;
}

export function formatLotSize(value: string, locale: Locale) {
  if (!value.startsWith(lotPrefix)) return value;
  const parsed = parseLotSize(value);
  const intlLocale = localeSettings[locale].intlLocale;
  const number = (amount: number) => new Intl.NumberFormat(intlLocale, { maximumFractionDigits: 2 }).format(amount);
  if (parsed.mode === "dimensions") {
    const area = parsed.width * parsed.length;
    return `${number(parsed.width)} m × ${number(parsed.length)} m · ${number(area)} m²`;
  }
  return parsed.area > 0 ? `${number(parsed.area)} m²` : "";
}

export function buildOsmMapUrl(latitude: number, longitude: number) {
  return `https://www.openstreetmap.org/?mlat=${latitude.toFixed(6)}&mlon=${longitude.toFixed(6)}#map=16/${latitude.toFixed(6)}/${longitude.toFixed(6)}`;
}

export function parseOsmCoordinates(value: string) {
  try {
    const url = new URL(value);
    const latitude = Number(url.searchParams.get("mlat"));
    const longitude = Number(url.searchParams.get("mlon"));
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return { latitude, longitude };
  } catch {
    return null;
  }
}

export function buildOsmEmbedUrl(latitude: number, longitude: number) {
  const longitudeDelta = 0.008;
  const latitudeDelta = 0.005;
  const bbox = [
    longitude - longitudeDelta,
    latitude - latitudeDelta,
    longitude + longitudeDelta,
    latitude + latitudeDelta,
  ].join(",");
  const params = new URLSearchParams({
    bbox,
    layer: "mapnik",
    marker: `${latitude},${longitude}`,
  });
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}
