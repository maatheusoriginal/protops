import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Project } from "@/lib/site-data";
import { getCity } from "@/lib/site-data";
import { getCopy, localePath, type Locale } from "@/lib/i18n";

export function ProjectCard({ project, locale = "pt" }: { project: Project; locale?: Locale }) {
  const city = getCity(project.city);
  const copy = getCopy(locale);
  return (
    <Link href={localePath(locale, `/${project.city}/${project.slug}`)} className="project-card">
      <div className="project-image-wrap"><img src={project.image} alt={`${copy.common.projectImage} ${project.name}`} loading="lazy" /><span className="project-label">{project.label}</span></div>
      <div className="project-card-body">
        <p className="project-location"><MapPin aria-hidden="true" /> {city?.name}, {locale === "pt" ? "MG" : copy.common.state}</p>
        <div className="project-title-row"><h3>{project.name}</h3><ArrowUpRight aria-hidden="true" /></div>
        <p>{project.summary}</p>
      </div>
    </Link>
  );
}

