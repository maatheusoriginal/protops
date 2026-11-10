import type { MetadataRoute } from "next";
import { metadataOrigin } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    sitemap: `${metadataOrigin}/sitemap.xml`,
  };
}
