import "server-only";
import { cache } from "react";
import type { ExchangeRates } from "@/lib/project-commercial";

type FrankfurterRate = {
  date?: string;
  base?: string;
  quote?: string;
  rate?: number;
};

export const getExchangeRates = cache(async (): Promise<ExchangeRates> => {
  const response = await fetch(
    "https://api.frankfurter.dev/v2/rates?base=BRL&quotes=USD,EUR,CNY",
    { next: { revalidate: 21_600 } },
  );
  if (!response.ok) throw new Error("Não foi possível atualizar as cotações.");

  const payload = (await response.json()) as FrankfurterRate[] | {
    date?: string;
    rates?: Record<string, number>;
  };
  const rates: ExchangeRates = { BRL: 1 };

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const quote = item.quote?.toUpperCase();
      if ((quote === "USD" || quote === "EUR" || quote === "CNY") && typeof item.rate === "number") {
        rates[quote] = item.rate;
        rates.date ??= item.date;
      }
    }
  } else {
    rates.date = payload.date;
    for (const quote of ["USD", "EUR", "CNY"] as const) {
      if (typeof payload.rates?.[quote] === "number") rates[quote] = payload.rates[quote];
    }
  }

  if (!rates.USD || !rates.EUR || !rates.CNY) {
    throw new Error("A cotação retornou incompleta.");
  }
  return rates;
});
