import type { MetadataRoute } from "next";
import { languageOptions, localePath } from "@/lib/i18n";
import { cities, projects } from "@/lib/site-data";
import { metadataOrigin } from "@/lib/site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/capital-partners",
    ...cities.map((city) => `/${city.slug}`),
    ...projects.map((project) => `/${project.city}/${project.slug}`),
  ];

  return languageOptions.flatMap(({ code }) => paths.map((path) => ({
    url: `${metadataOrigin}${localePath(code, path)}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" as const : "monthly" as const,
    priority: path === "/" ? 1 : path.split("/").filter(Boolean).length === 1 ? 0.8 : 0.7,
  })));
}
