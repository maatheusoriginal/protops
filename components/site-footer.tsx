import Link from "next/link";
import { Camera, MessageCircle } from "lucide-react";
import { getCopy, getWhatsAppUrl, localePath, type Locale } from "@/lib/i18n";

export function SiteFooter({ locale = "pt", whatsappHref }: { locale?: Locale; whatsappHref?: string }) {
  const copy = getCopy(locale);
  const whatsappUrl = whatsappHref ?? getWhatsAppUrl(locale);
  return (
    <footer className="site-footer">
      <div className="site-shell footer-grid">
        <div className="footer-brand"><img src="/media/logo-protops.png" alt="Pro-Tops" /><p>{copy.footer.about}</p></div>
        <div><p className="footer-title">{copy.footer.cities}</p><Link href={localePath(locale, "/uberlandia")}>Uberlândia</Link><Link href={localePath(locale, "/araguari")}>Araguari</Link><Link href={localePath(locale, "/sacramento")}>Sacramento</Link></div>
        <div><p className="footer-title">{copy.footer.company}</p><Link href={localePath(locale, "/#empresa")}>{copy.footer.history}</Link><Link href={localePath(locale, "/capital-partners")}>Capital Partners</Link><a href={whatsappUrl} target="_blank" rel="noreferrer">{copy.footer.service}</a></div>
        <div><p className="footer-title">{copy.footer.contact}</p><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> WhatsApp</a><a href="https://instagram.com/protops" target="_blank" rel="noreferrer"><Camera aria-hidden="true" /> Instagram</a></div>
      </div>
      <div className="site-shell footer-bottom"><span>{copy.footer.rights}</span><span>{copy.footer.note}</span></div>
    </footer>
  );
}

