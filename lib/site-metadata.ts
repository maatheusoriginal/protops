import type { Metadata } from "next";
import { cmsCityToSiteCity, cmsProjectToSiteProject } from "@/lib/cms-model";
import { getPublicCmsCity, getPublicCmsProject } from "@/lib/firebase/public-data";
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

export async function cityMetadata(locale: Locale, citySlug: string): Promise<Metadata> {
  const remoteCity = await getPublicCmsCity(citySlug);
  const city = getCity(citySlug);
  if (remoteCity === null || (remoteCity === undefined && !city)) return {};
  const localizedCity = remoteCity ? cmsCityToSiteCity(remoteCity, locale) : getLocalizedCity(city!, locale);
  const labels: Record<Locale, string> = { pt: "Empreendimentos em", en: "Developments in", es: "Proyectos en", fr: "Projets à", de: "Projekte in", zh: "开发项目" };
  return {
    title: `${labels[locale]} ${localizedCity.name}`,
    description: localizedCity.intro,
    alternates: alternates(locale, `/${localizedCity.slug}`),
  };
}

export async function projectMetadata(locale: Locale, citySlug: string, projectSlug: string): Promise<Metadata> {
  const [remoteProject, remoteCity] = await Promise.all([getPublicCmsProject(citySlug, projectSlug), getPublicCmsCity(citySlug)]);
  const project = getProject(citySlug, projectSlug);
  const city = getCity(citySlug);
  if (remoteProject === null || remoteCity === null || (remoteProject === undefined && !project) || (remoteCity === undefined && !city)) return {};
  const localizedCity = remoteCity ? cmsCityToSiteCity(remoteCity, locale) : getLocalizedCity(city!, locale);
  const localizedProject = remoteProject ? cmsProjectToSiteProject(remoteProject, localizedCity.name, locale) : getLocalizedProject(project!, localizedCity.name, locale);
  return {
    title: localizedProject.name,
    description: localizedProject.summary,
    alternates: alternates(locale, `/${localizedCity.slug}/${localizedProject.slug}`),
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
