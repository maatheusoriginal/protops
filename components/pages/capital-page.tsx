import Link from "next/link";
import { ArrowLeft, Building2, Globe2, House, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCopy, getWhatsAppUrl, localePath, type Locale } from "@/lib/i18n";

const pillarIcons = [House, Building2, ShieldCheck, Globe2];

export function CapitalPage({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);
  const whatsappUrl = getWhatsAppUrl(locale);

  return (
    <main className="capital-page"><SiteHeader overlay locale={locale} currentPath="/capital-partners" />
      <section className="capital-hero"><div className="capital-orbit" aria-hidden="true" /><div className="site-shell capital-hero-inner"><Link href={localePath(locale, "/")} className="back-link"><ArrowLeft aria-hidden="true" /> {copy.capital.back}</Link><img src="/media/logo-capital.png" alt="Pro-Tops Capital Partners" /><h1>{copy.capital.title}</h1><p>{copy.capital.hero}</p><Button asChild size="lg" className="button-red"><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> {copy.capital.cta}</a></Button></div></section>
      <section className="section capital-intro"><div className="site-shell capital-intro-grid"><div><p className="eyebrow">{copy.capital.eyebrow}</p><h2>{copy.capital.introTitle}</h2></div><p>{copy.capital.intro}</p></div></section>
      <section className="capital-pillars"><div className="site-shell capital-pillars-grid">{copy.capital.pillars.map(([title, description], index) => { const Icon = pillarIcons[index]; return <article key={title}><Icon aria-hidden="true" /><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>; })}</div></section>
      <section className="capital-disclaimer"><div className="site-shell"><h2>{copy.capital.disclaimerTitle}</h2><p>{copy.capital.disclaimer}</p></div></section>
      <SiteFooter locale={locale} />
    </main>
  );
}
