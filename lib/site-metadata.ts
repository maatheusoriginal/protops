import type { Metadata } from "next";
import { cmsCityToSiteCity, cmsProjectToSiteProject } from "@/lib/cms-model";
import { getPublicCmsCity, getPublicCmsProject } from "@/lib/firebase/public-data";
import { getCity, getProject } from "@/lib/site-data";
import { getCopy, getHtmlLang, getLocalizedCity, getLocalizedProject, languageOptions, localePath, type Locale } from "@/lib/i18n";

const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://protops.vercel.app").replace(/\/$/, "");

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
    openGraph: {
      title: locale === "pt" ? "Pro-Tops Empreendimentos" : "Pro-Tops Real Estate Developments",
      description: copy.home.heroCopy,
      url: localePath(locale, "/"),
      images: [{ url: "/media/golden-village.webp", alt: "Pro-Tops Empreendimentos" }],
    },
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
    openGraph: {
      title: `${labels[locale]} ${localizedCity.name}`,
      description: localizedCity.intro,
      url: localePath(locale, `/${localizedCity.slug}`),
      images: [{ url: localizedCity.image, alt: localizedCity.name }],
    },
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
    openGraph: {
      title: localizedProject.name,
      description: localizedProject.summary,
      url: localePath(locale, `/${localizedCity.slug}/${localizedProject.slug}`),
      images: [{ url: localizedProject.image, alt: localizedProject.name }],
    },
  };
}

export function capitalMetadata(locale: Locale): Metadata {
  const copy = getCopy(locale);
  return {
    title: "Capital Partners",
    description: copy.capital.hero,
    alternates: alternates(locale, "/capital-partners"),
    openGraph: {
      title: "Pro-Tops Capital Partners",
      description: copy.capital.hero,
      url: localePath(locale, "/capital-partners"),
      images: [{ url: "/media/golden-village.webp", alt: "Pro-Tops Capital Partners" }],
    },
  };
}

export const metadataOrigin = origin;
