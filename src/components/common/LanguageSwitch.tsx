"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/i18n/routing";
import { Dropdown, DropdownItem } from "flowbite-react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useTransition } from "react";
// Import flag-icons CSS in your layout.tsx or here
import "flag-icons/css/flag-icons.min.css";

export default function LanguageSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  // Sync Locale to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentLang", locale);
    // Dispatch a global event that the language has changed
    window.dispatchEvent(new Event("localeChange"));
  }, [locale]);

  const handleLocaleChange = (nextLocale: string) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- dynamic params handling
        { pathname, params },
        { locale: nextLocale }
      );
    });
  };

  // Helper to get flag and label
  const getLocaleDetails = (l: string) => {
    switch (l) {
      case "en":
        return { label: "English", flag: "fi-us" };
      case "ar":
        return { label: "العربية", flag: "fi-eg" };
      default:
        return { label: l.toUpperCase(), flag: "" };
    }
  };

  const current = getLocaleDetails(locale);

  return (
    <Dropdown
      label={
        <div className="flex items-center gap-2">
          <span className={`fi ${current.flag}`}></span>
          <span>{current.label}</span>
        </div>
      }
      inline
      disabled={isPending}
    >
      {locales.map((lang) => {
        const { label, flag } = getLocaleDetails(lang);
        return (
          <DropdownItem
            key={lang}
            onClick={() => handleLocaleChange(lang)}
            className="flex items-center gap-1"
          >
            <span className={`fi ${flag}`}></span>
            {label}
          </DropdownItem>
        );
      })}
    </Dropdown>
  );
}