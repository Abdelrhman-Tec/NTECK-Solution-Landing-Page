import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/data/projects";
import { routing } from "@/i18n/routing";
import { localizedUrls } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...getPublishedProjects().map(({ slug }) => `/work/${slug}`)];
  return paths.flatMap((path) => {
    const languages = localizedUrls(path);
    return languages ? routing.locales.map((locale) => ({
      url: languages[locale],
      alternates: { languages },
    })) : [];
  });
}
