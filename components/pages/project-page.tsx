import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, MapPin, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cities, getCity, getCityProjects, getProject } from "@/lib/site-data";
import { getCopy, getLocalizedProject, getWhatsAppUrl, localePath, type Locale } from "@/lib/i18n";

export function ProjectPage({ locale, citySlug, projectSlug }: { locale: Locale; citySlug: string; projectSlug: string }) {
  const baseProject = getProject(citySlug, projectSlug);
  const city = getCity(citySlug);
  if (!baseProject || !city || !cities.some((item) => item.slug === citySlug)) notFound();

  const copy = getCopy(locale);
  const project = getLocalizedProject(baseProject, city.name, locale);
  const related = getCityProjects(city.slug)
    .filter((item) => item.slug !== project.slug)
    .slice(0, 3)
    .map((item) => getLocalizedProject(item, city.name, locale));
  const projectWhatsapp = getWhatsAppUrl(locale, project.name, city.name);
  const currentPath = `/${city.slug}/${project.slug}`;

  return (
    <main><SiteHeader locale={locale} currentPath={currentPath} />
      <section className="project-hero"><img src={project.image} alt={`${copy.common.projectImage} ${project.name}`} /><div className="page-hero-shade" /><div className="site-shell project-hero-content"><Link href={localePath(locale, `/${city.slug}`)} className="back-link"><ArrowLeft aria-hidden="true" /> {copy.project.back} {city.name}</Link><p className="eyebrow eyebrow-light">{project.label}</p><h1>{project.name}</h1><p className="project-hero-location"><MapPin aria-hidden="true" /> {city.name}, {copy.common.state}</p></div></section>
      <section className="section project-overview"><div className="site-shell project-overview-grid"><div><p className="eyebrow">{copy.project.overview}</p><h2>{project.summary}</h2></div><div className="project-description"><p>{project.description}</p><ul>{project.features.map((feature) => <li key={feature}><Check aria-hidden="true" /> {feature}</li>)}</ul><Button asChild size="lg" className="button-red"><a href={projectWhatsapp} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> {copy.project.request}</a></Button></div></div></section>
      <section className="project-media-section"><div className="site-shell"><div className="project-media-heading"><span>{copy.project.recent}</span><span>{copy.project.archive}</span></div><div className="project-media"><img src={project.image} alt={`${copy.common.projectImage} ${project.name}`} loading="lazy" /></div><p className="media-note">{copy.project.note}</p></div></section>
      {related.length > 0 && <section className="section related-section"><div className="site-shell"><div className="section-heading inline-heading"><div><p className="eyebrow">{copy.project.continue}</p><h2>{copy.project.others} {city.name}</h2></div><Link href={localePath(locale, `/${city.slug}`)}>{copy.project.all} <ArrowUpRight aria-hidden="true" /></Link></div><div className="projects-grid">{related.map((item) => <ProjectCard project={item} locale={locale} key={item.slug} />)}</div></div></section>}
      <SiteFooter locale={locale} />
    </main>
  );
}
