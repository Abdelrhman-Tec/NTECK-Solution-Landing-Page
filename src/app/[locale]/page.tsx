import { ArrowDown, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AudienceAndServices, ProcessAndApproach } from "@/components/marketing-sections";
import { BookingSection } from "@/components/booking-section";
import { HeroVisual } from "@/components/hero-visual";
import { Portfolio } from "@/components/portfolio";
import { Button } from "@/components/ui/button";
import { InquirySection } from "@/components/inquiry-section";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { routing } from "@/i18n/routing";

type HomeProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "Home" });
  return pageMetadata({ locale, title: t("metadataTitle"), description: t("metadataDescription") });
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations("Home");

  const organization = site.origin ? {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.origin,
    ...(site.logo ? { logo: new URL(site.logo.src, site.origin).href } : {}),
  } : null;

  return (
    <>
      {organization && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
        }} />
      )}
      <section className="grid items-center gap-9 py-12 md:py-18 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-24">
        <div>
          <p className="mb-4 text-sm font-semibold text-ring">{t("eyebrow")}</p>
          <h1 className="text-pretty text-4xl leading-[1.16] font-semibold sm:text-5xl xl:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground sm:text-lg">
            {t("description")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a href="#booking">
                {t("booking")}
                <ArrowRight size={17} className="rtl:rotate-180" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="#work">
                {t("work")}
                <ArrowDown size={16} aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
        <HeroVisual />
      </section>
      <AudienceAndServices />
      <ProcessAndApproach />
      <Portfolio locale={locale} />
      <BookingSection locale={locale} />
      <InquirySection locale={locale} />
    </>
  );
}
