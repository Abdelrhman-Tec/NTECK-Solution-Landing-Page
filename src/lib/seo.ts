import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { site } from "@/config/site";

export function localizedUrls(path = "") {
  if (!site.origin) return null;
  const ar = new URL(`/ar${path}`, site.origin).href;
  const en = new URL(`/en${path}`, site.origin).href;
  return { ar, en, "x-default": ar };
}

export function pageMetadata({ locale, title, description, path = "", noIndex = false, image = site.logo }: {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  image?: { src: string; width: number; height: number } | null;
}): Metadata {
  const languages = localizedUrls(path);
  const url = languages?.[locale];
  const imageUrl = site.origin && image ? new URL(image.src, site.origin).href : undefined;

  return {
    title,
    description,
    ...(languages && { alternates: { canonical: languages[locale], languages } }),
    ...(noIndex || !url ? { robots: { index: false } } : {}),
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      locale,
      alternateLocale: [locale === "ar" ? "en" : "ar"],
      url,
      images: imageUrl && image ? [{ url: imageUrl, width: image.width, height: image.height }] : [],
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}
