import type { ReactNode } from "react";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getLocaleDirection, routing } from "@/i18n/routing";
import "../globals.css";

const arabicFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-plex-arabic",
});

const englishFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Layout" });

  return (
    <html
      lang={locale}
      dir={getLocaleDirection(locale)}
      className={locale === "ar" ? arabicFont.variable : englishFont.variable}
    >
      <body>
        <a className="skip-link" href="#main-content">{t("skipToContent")}</a>
        <SiteHeader locale={locale} />
        <main id="main-content" tabIndex={-1} className="site-container pb-16">
          {children}
        </main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
