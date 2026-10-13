import Link from "next/link";
import { Menu, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getCopy, getWhatsAppUrl, localePath, type Locale } from "@/lib/i18n";

export function SiteHeader({ overlay = false, locale = "pt", currentPath = "/", whatsappHref }: { overlay?: boolean; locale?: Locale; currentPath?: string; whatsappHref?: string }) {
  const copy = getCopy(locale);
  const whatsappUrl = whatsappHref ?? getWhatsAppUrl(locale);
  return (
    <header className={`site-header ${overlay ? "site-header-overlay" : ""}`}>
      <div className="site-shell header-inner">
        <Link href={localePath(locale, "/")} className="brand" aria-label="Pro-Tops">
          <img src="/media/logo-protops.png" alt="Pro-Tops" />
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <Link href={localePath(locale, "/#empresa")}>{copy.nav.company}</Link><Link href={localePath(locale, "/uberlandia")}>Uberlândia</Link><Link href={localePath(locale, "/araguari")}>Araguari</Link><Link href={localePath(locale, "/sacramento")}>Sacramento</Link><Link href={localePath(locale, "/capital-partners")}>{copy.nav.capital}</Link>
        </nav>
        <LanguageSwitcher locale={locale} currentPath={currentPath} />
        <Button asChild className="header-cta"><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> {copy.nav.contact}</a></Button>
        <details className="mobile-nav">
          <summary aria-label={copy.nav.open}><Menu aria-hidden="true" /></summary>
          <nav aria-label="Navegação móvel">
            <Link href={localePath(locale, "/#empresa")}>{copy.nav.company}</Link><Link href={localePath(locale, "/uberlandia")}>Uberlândia</Link><Link href={localePath(locale, "/araguari")}>Araguari</Link><Link href={localePath(locale, "/sacramento")}>Sacramento</Link><Link href={localePath(locale, "/capital-partners")}>{copy.nav.capital}</Link><a href={whatsappUrl} target="_blank" rel="noreferrer">{copy.nav.contact}</a>
          </nav>
        </details>
      </div>
    </header>
  );
}

