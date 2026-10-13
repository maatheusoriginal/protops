import type { Metadata } from "next";
import { getCity, getProject } from "@/lib/site-data";
import { getCopy, getHtmlLang, getLocalizedCity, getLocalizedProject, languageOptions, localePath, type Locale } from "@/lib/i18n";

const origin = "https://protops-empreendimentos.cpcley-100.chatgpt.site";

function alternates(locale: Locale, path: string) {
  return {
    canonical: localePath(locale, path),
    languages: Object.fromEntries(languageOptions.map((item) => [getHtmlLang(item.code), localePath(item.code, path)])),
  };
}

export function homeMetadata(locale: Locale): Metadata {
  const copy = getCopy(locale);
  return {
    title: locale === "pt" ? "Pro-Tops Empreendimentos" : "Pro-Tops Real Estate Developments",
    description: copy.home.heroCopy,
    alternates: alternates(locale, "/"),
  };
}

export function cityMetadata(locale: Locale, citySlug: string): Metadata {
  const city = getCity(citySlug);
  if (!city) return {};
  const localizedCity = getLocalizedCity(city, locale);
  const labels: Record<Locale, string> = { pt: "Empreendimentos em", en: "Developments in", es: "Proyectos en", fr: "Projets à", de: "Projekte in", zh: "开发项目" };
  return {
    title: `${labels[locale]} ${city.name}`,
    description: localizedCity.intro,
    alternates: alternates(locale, `/${city.slug}`),
  };
}

export function projectMetadata(locale: Locale, citySlug: string, projectSlug: string): Metadata {
  const project = getProject(citySlug, projectSlug);
  const city = getCity(citySlug);
  if (!project || !city) return {};
  const localizedProject = getLocalizedProject(project, city.name, locale);
  return {
    title: localizedProject.name,
    description: localizedProject.summary,
    alternates: alternates(locale, `/${city.slug}/${project.slug}`),
  };
}

export function capitalMetadata(locale: Locale): Metadata {
  const copy = getCopy(locale);
  return {
    title: "Capital Partners",
    description: copy.capital.hero,
    alternates: alternates(locale, "/capital-partners"),
  };
}

export const metadataOrigin = origin;
