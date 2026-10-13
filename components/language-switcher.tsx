"use client";

import { useEffect } from "react";
import { Globe2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCopy, getHtmlLang, languageOptions, localePath, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale, currentPath }: { locale: Locale; currentPath: string }) {
  const copy = getCopy(locale);
  const currentLanguage = languageOptions.find((language) => language.code === locale);

  useEffect(() => {
    document.documentElement.lang = getHtmlLang(locale);
  }, [locale]);

  return (
    <div className="language-switcher">
      <Globe2 aria-hidden="true" />
      <Select
        value={locale}
        onValueChange={(value) => window.location.assign(localePath(value as Locale, currentPath))}
      >
        <SelectTrigger aria-label={copy.nav.language} title={currentLanguage?.name} className="language-trigger">
          <SelectValue>{currentLanguage?.short}</SelectValue>
        </SelectTrigger>
        <SelectContent position="popper" align="end">
          {languageOptions.map((language) => (
            <SelectItem key={language.code} value={language.code}>{language.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
