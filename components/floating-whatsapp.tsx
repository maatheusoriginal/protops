import { MessageCircle } from "lucide-react";
import { getCopy, getWhatsAppUrl, type Locale } from "@/lib/i18n";

export function FloatingWhatsApp({
  locale,
  href,
}: {
  locale: Locale;
  href?: string;
}) {
  const copy = getCopy(locale);
  return (
    <a
      className="floating-whatsapp"
      href={href ?? getWhatsAppUrl(locale)}
      target="_blank"
      rel="noreferrer"
      aria-label={`${copy.nav.contact} — WhatsApp`}
    >
      <MessageCircle aria-hidden="true" />
      <span>{copy.nav.contact}</span>
    </a>
  );
}
