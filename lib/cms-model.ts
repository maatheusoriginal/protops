import { cities, projects, type City, type Project } from "@/lib/site-data";
import { getLocalizedCity, getLocalizedProject, type Locale } from "@/lib/i18n";

export const cmsLocales: Array<{ code: Locale; label: string }> = [
  { code: "pt", label: "Português" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "zh", label: "中文" },
];

export type CmsProjectStatus = "published" | "draft" | "archived";

export type CmsProjectTranslation = {
  name: string;
  summary: string;
  description: string;
};

export type CmsProject = {
  id: string;
  slug: string;
  citySlug: string;
  category: string;
  status: CmsProjectStatus;
  featured: boolean;
  heroImage: string;
  gallery: string[];
  videoUrl: string;
  address: string;
  mapUrl: string;
  priceLabel: string;
  lotSize: string;
  features: string[];
  translations: Partial<Record<Locale, CmsProjectTranslation>>;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
};

export type CmsCityTranslation = {
  name: string;
  intro: string;
  statement: string;
};

export type CmsCity = {
  id: string;
  slug: string;
  name: string;
  state: string;
  heroImage: string;
  intro: string;
  statement: string;
  translations: Partial<Record<Locale, CmsCityTranslation>>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
};

const seedDate = "2026-10-13T00:00:00.000Z";

export const seedCmsCities: CmsCity[] = cities.map((city) => {
  const translations = Object.fromEntries(cmsLocales.map(({ code }) => {
    const localized = getLocalizedCity(city, code);
    return [code, { name: localized.name, intro: localized.intro, statement: localized.statement }];
  })) as Record<Locale, CmsCityTranslation>;

  return {
    id: city.slug,
    slug: city.slug,
    name: city.name,
    state: city.state,
    heroImage: city.image,
    intro: city.intro,
    statement: city.statement,
    translations,
    active: true,
    createdAt: seedDate,
    updatedAt: seedDate,
  };
});

export const seedCmsProjects: CmsProject[] = projects.map((project) => {
  const cityName = cities.find((city) => city.slug === project.city)?.name ?? "";
  const translations = Object.fromEntries(cmsLocales.map(({ code }) => {
    const localized = getLocalizedProject(project, cityName, code);
    return [code, { name: localized.name, summary: localized.summary, description: localized.description }];
  })) as Record<Locale, CmsProjectTranslation>;

  return {
    id: `${project.city}__${project.slug}`,
    slug: project.slug,
    citySlug: project.city,
    category: project.label,
    status: "published",
    featured: ["golden-village", "bonanza", "vila-bela"].includes(project.slug),
    heroImage: project.image,
    gallery: [...project.gallery],
    videoUrl: "",
    address: "",
    mapUrl: "",
    priceLabel: "Sob consulta",
    lotSize: "",
    features: [...project.features],
    translations,
    createdAt: seedDate,
    updatedAt: seedDate,
  };
});

export function emptyCmsProject(citySlug = seedCmsCities[0]?.slug ?? ""): CmsProject {
  const now = new Date().toISOString();
  return {
    id: "",
    slug: "",
    citySlug,
    category: "Loteamento residencial",
    status: "draft",
    featured: false,
    heroImage: "",
    gallery: [],
    videoUrl: "",
    address: "",
    mapUrl: "",
    priceLabel: "Sob consulta",
    lotSize: "",
    features: [],
    translations: { pt: { name: "", summary: "", description: "" } },
    createdAt: now,
    updatedAt: now,
  };
}

export function emptyCmsCity(): CmsCity {
  const now = new Date().toISOString();
  return {
    id: "",
    slug: "",
    name: "",
    state: "Minas Gerais",
    heroImage: "",
    intro: "",
    statement: "",
    translations: { pt: { name: "", intro: "", statement: "" } },
    active: true,
    createdAt: now,
    updatedAt: now,
  };
}

export function cmsCityToSiteCity(city: CmsCity, locale: Locale): City {
  const fallback = city.translations.pt ?? { name: city.name, intro: city.intro, statement: city.statement };
  const translation = city.translations[locale] ?? fallback;
  return {
    slug: city.slug,
    name: translation.name || fallback.name,
    state: city.state,
    image: city.heroImage,
    intro: translation.intro || fallback.intro,
    statement: translation.statement || fallback.statement,
  };
}

export function cmsProjectToSiteProject(project: CmsProject, cityName: string, locale: Locale): Project {
  const fallback = project.translations.pt ?? { name: project.slug, summary: "", description: "" };
  const base: Project = {
    slug: project.slug,
    name: fallback.name || project.slug,
    city: project.citySlug,
    label: project.category,
    image: project.heroImage,
    gallery: project.gallery,
    summary: fallback.summary,
    description: fallback.description,
    features: project.features,
  };
  const generated = getLocalizedProject(base, cityName, locale);
  const translation = project.translations[locale];
  return {
    ...generated,
    name: translation?.name || generated.name,
    summary: translation?.summary || generated.summary,
    description: translation?.description || generated.description,
  };
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
