import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "always",
  localeDetection: false,
});

export function getLocaleDirection(locale: (typeof routing.locales)[number]) {
  return locale === "ar" ? "rtl" : "ltr";
}
