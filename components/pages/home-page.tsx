import Link from "next/link";
import { ArrowDown, ArrowUpRight, Building2, Globe2, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { ProjectCard } from "@/components/project-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cmsCityToSiteCity, cmsProjectToSiteProject } from "@/lib/cms-model";
import { getPublicCmsCities, getPublicCmsFeaturedProjects } from "@/lib/firebase/public-data";
import { cities, getCity, projects } from "@/lib/site-data";
import { getCopy, getLocalizedCity, getLocalizedProject, getWhatsAppUrl, localePath, type Locale } from "@/lib/i18n";

const featuredSlugs = ["golden-village", "bonanza", "park-sul", "vila-bela"];

export async function HomePage({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);
  const whatsappUrl = getWhatsAppUrl(locale);
  const [remoteCities, remoteFeatured] = await Promise.all([getPublicCmsCities(), getPublicCmsFeaturedProjects()]);
  const localizedCities = remoteCities === undefined
    ? cities.map((city) => getLocalizedCity(city, locale))
    : remoteCities.map((city) => cmsCityToSiteCity(city, locale));
  const featured = remoteFeatured === undefined
    ? featuredSlugs
      .map((slug) => projects.find((project) => project.slug === slug))
      .filter((project): project is NonNullable<typeof project> => Boolean(project))
      .map((project) => getLocalizedProject(project, getCity(project.city)?.name ?? "", locale))
    : remoteFeatured.map((project) => cmsProjectToSiteProject(project, localizedCities.find((city) => city.slug === project.citySlug)?.name ?? project.citySlug, locale));

  return (
    <main>
      <section className="hero">
        <SiteHeader overlay locale={locale} currentPath="/" />
        <video className="hero-video" autoPlay muted loop playsInline preload="metadata" poster="/media/golden-village.webp" aria-hidden="true">
          <source src="/media/protops-drone-loop.mp4" type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <div className="site-shell hero-content">
          <p className="eyebrow eyebrow-light">{copy.home.eyebrow}</p>
          <h1>{copy.home.title} <em>{copy.home.accent}</em></h1>
          <p className="hero-copy">{copy.home.heroCopy}</p>
          <div className="hero-actions">
            <Button asChild size="lg" className="button-red"><a href="#cidades">{copy.home.primary}</a></Button>
            <Button asChild size="lg" variant="outline" className="button-ghost-light"><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> {copy.home.secondary}</a></Button>
          </div>
        </div>
        <a href="#cidades" className="scroll-cue" aria-label={copy.home.scroll}><ArrowDown aria-hidden="true" /></a>
        <div className="hero-stats">
          {copy.home.stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
        </div>
      </section>

      <section id="cidades" className="section section-cities">
        <div className="site-shell">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">{copy.home.citiesEyebrow}</p><h2>{copy.home.citiesTitle}</h2></div>
            <p>{copy.home.citiesText}</p>
          </div>
          <div className="city-grid">
            {localizedCities.map((city, index) => (
              <Link href={localePath(locale, `/${city.slug}`)} className="city-card" key={city.slug}>
                <img src={city.image} alt={`${copy.common.cityImage} ${city.name}`} loading={index === 0 ? "eager" : "lazy"} />
                <div className="city-shade" />
                <div className="city-content"><span>0{index + 1}</span><div><p>{locale === "pt" ? city.state : copy.common.state}</p><h3>{city.name}</h3></div><ArrowUpRight aria-hidden="true" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-featured">
        <div className="site-shell">
          <div className="section-heading inline-heading">
            <div><p className="eyebrow">{copy.home.featuredEyebrow}</p><h2>{copy.home.featuredTitle}</h2></div>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">{copy.home.featuredCta} <ArrowUpRight aria-hidden="true" /></a>
          </div>
          <div className="projects-grid">{featured.map((project) => <ProjectCard key={project.slug} project={project} locale={locale} />)}</div>
        </div>
      </section>

      <section id="empresa" className="section story-section">
        <div className="site-shell story-grid">
          <div className="story-visual">
            <img src="/media/golden-village.webp" alt={`${copy.common.projectImage} Golden Village`} loading="lazy" />
            <div className="story-seal"><Building2 aria-hidden="true" /><span>{copy.home.seal.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</span></div>
          </div>
          <div className="story-copy">
            <p className="eyebrow">{copy.home.storyEyebrow}</p>
            <h2>{copy.home.storyTitle}</h2>
            <p>{copy.home.storyP1}</p>
            <p>{copy.home.storyP2}</p>
            <div className="story-links"><Link href={localePath(locale, "/uberlandia")}><MapPin aria-hidden="true" /> {copy.home.regional}</Link><Link href={localePath(locale, "/capital-partners")}><Globe2 aria-hidden="true" /> {copy.home.international}</Link></div>
          </div>
        </div>
      </section>

      <section className="capital-teaser">
        <div className="site-shell capital-teaser-grid">
          <div><img src="/media/logo-capital.png" alt="Pro-Tops Capital Partners" className="capital-logo" /><h2>{copy.home.capitalTitle}</h2></div>
          <div><p>{copy.home.capitalText}</p><Button asChild variant="outline" className="button-ghost-light"><Link href={localePath(locale, "/capital-partners")}>{copy.home.capitalCta} <ArrowUpRight aria-hidden="true" /></Link></Button></div>
        </div>
      </section>

      <section className="contact-band">
        <div className="site-shell contact-band-inner"><div><p className="eyebrow eyebrow-light">{copy.home.nextEyebrow}</p><h2>{copy.home.nextTitle}</h2></div><Button asChild size="lg" className="button-light"><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> {copy.home.nextCta}</a></Button></div>
      </section>
      <FloatingWhatsApp locale={locale} href={whatsappUrl} />
      <SiteFooter locale={locale} />
    </main>
  );
}
