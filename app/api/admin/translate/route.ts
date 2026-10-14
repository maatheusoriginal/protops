import { jsonError, requireAdmin } from "@/lib/server/admin-auth";

export const runtime = "nodejs";

const targetLocales = ["en", "es", "fr", "de", "zh"] as const;
const deeplLanguages = {
  en: "EN-US",
  es: "ES",
  fr: "FR",
  de: "DE",
  zh: "ZH-HANS",
} as const;
const localeNames = {
  en: "inglês",
  es: "espanhol",
  fr: "francês",
  de: "alemão",
  zh: "chinês simplificado",
} as const;

type TranslationKind = "project" | "city";
type SourceContent = Record<string, string>;

const fieldsByKind: Record<TranslationKind, readonly string[]> = {
  project: ["name", "summary", "description"],
  city: ["name", "intro", "statement"],
};

function cleanSource(kind: TranslationKind, value: unknown) {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const limits = kind === "project"
    ? { name: 160, summary: 500, description: 6000 }
    : { name: 120, intro: 1200, statement: 300 };
  const cleaned: SourceContent = {};

  for (const field of fieldsByKind[kind]) {
    const content = source[field];
    if (typeof content !== "string") return null;
    cleaned[field] = content.trim().slice(0, limits[field as keyof typeof limits]);
  }
  return cleaned;
}

async function translateLocale(
  apiKey: string,
  kind: TranslationKind,
  source: SourceContent,
  locale: (typeof targetLocales)[number],
) {
  // City and development names are brands/proper nouns and should not be translated.
  const translatedFields = fieldsByKind[kind].filter(
    (field) => field !== "name" && source[field],
  );
  const translated: SourceContent = { name: source.name };
  if (translatedFields.length === 0) {
    for (const field of fieldsByKind[kind]) translated[field] ??= source[field] ?? "";
    return translated;
  }

  const response = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      authorization: `DeepL-Auth-Key ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      text: translatedFields.map((field) => source[field]),
      source_lang: "PT",
      target_lang: deeplLanguages[locale],
      preserve_formatting: true,
      context: `Conteúdo institucional de um empreendimento imobiliário chamado ${source.name}. Preserve nomes próprios, marcas, cidades, números e condições comerciais.`,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const failure = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    console.error("DeepL translation error", response.status, failure);
    if (response.status === 456) {
      throw new Error("O limite mensal gratuito da DeepL foi atingido.");
    }
    if (response.status === 403) {
      throw new Error("A chave da DeepL é inválida ou não pertence ao plano de API.");
    }
    throw new Error(
      failure?.message || `A tradução para ${localeNames[locale]} não respondeu.`,
    );
  }

  const result = (await response.json()) as {
    translations?: Array<{ text?: string }>;
  };
  if (result.translations?.length !== translatedFields.length) {
    throw new Error(`A tradução para ${localeNames[locale]} retornou incompleta.`);
  }

  translatedFields.forEach((field, index) => {
    translated[field] = result.translations?.[index]?.text?.trim() ?? "";
  });
  for (const field of fieldsByKind[kind]) translated[field] ??= source[field] ?? "";
  return translated;
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);

    const apiKey = process.env.DEEPL_API_KEY?.trim();
    if (!apiKey) {
      return Response.json(
        {
          error:
            "A tradução automática ainda não está configurada. Adicione DEEPL_API_KEY nas variáveis da Vercel.",
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as {
      kind?: TranslationKind;
      source?: unknown;
    };
    const kind = body.kind;
    if (kind !== "project" && kind !== "city") {
      return Response.json({ error: "Tipo de conteúdo inválido." }, { status: 400 });
    }

    const source = cleanSource(kind, body.source);
    if (!source || !source.name) {
      return Response.json(
        { error: "Preencha o conteúdo em português antes de traduzir." },
        { status: 400 },
      );
    }

    const translatedEntries = await Promise.all(
      targetLocales.map(async (locale) => [
        locale,
        await translateLocale(apiKey, kind, source, locale),
      ] as const),
    );

    return Response.json({ translations: Object.fromEntries(translatedEntries) });
  } catch (error) {
    return jsonError(error);
  }
}
