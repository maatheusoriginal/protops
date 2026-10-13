import { ArrowUpRight, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCity, getCityProjects } from "@/lib/site-data";
import { formatCount, getCopy, getLocalizedCity, getLocalizedProject, getWhatsAppUrl, type Locale } from "@/lib/i18n";

export function CityPage({ locale, citySlug }: { locale: Locale; citySlug: string }) {
  const baseCity = getCity(citySlug);
  if (!baseCity) notFound();

  const copy = getCopy(locale);
  const city = getLocalizedCity(baseCity, locale);
  const cityProjects = getCityProjects(city.slug).map((project) => getLocalizedProject(project, city.name, locale));
  const whatsappUrl = getWhatsAppUrl(locale);
  const currentPath = `/${city.slug}`;

  return (
    <main><SiteHeader locale={locale} currentPath={currentPath} />
      <section className="page-hero"><img src={city.image} alt={`${copy.common.cityImage} ${city.name}`} /><div className="page-hero-shade" /><div className="site-shell page-hero-content"><p className="eyebrow eyebrow-light">{copy.city.presence} {city.name}</p><h1>{city.statement}</h1><p>{city.intro}</p><a href="#projetos" className="text-link-light">{formatCount(copy.city.view, cityProjects.length)} <ArrowUpRight aria-hidden="true" /></a></div></section>
      <section id="projetos" className="section city-projects"><div className="site-shell"><div className="section-heading split-heading"><div><p className="eyebrow">{copy.city.localEyebrow}</p><h2>{copy.city.title} {city.name}</h2></div><p>{copy.city.intro}</p></div><div className="projects-grid">{cityProjects.map((project) => <ProjectCard project={project} locale={locale} key={project.slug} />)}</div></div></section>
      <section className="city-contact"><div className="site-shell city-contact-inner"><div><span>{city.name}, {locale === "pt" ? "MG" : copy.common.state}</span><h2>{copy.city.contactTitle}</h2><p>{copy.city.contactText}</p></div><Button asChild size="lg" className="button-red"><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> {copy.city.contactCta}</a></Button></div></section>
      <SiteFooter locale={locale} />
    </main>
  );
}
