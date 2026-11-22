import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getProjectLiveUrl, getPublishedProject, getPublishedProjects } from "@/data/projects";
import { pageMetadata } from "@/lib/seo";
import { routing } from "@/i18n/routing";

type ProjectPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedProjects().map(({ slug }) => ({ slug }));
}

async function resolveProject(params: ProjectPageProps["params"]) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const project = getPublishedProject(slug);
  if (!project) notFound();

  return { locale, project };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, project } = await resolveProject(params);
  return pageMetadata({
    locale, title: project.title[locale], description: project.summary[locale],
    path: `/work/${project.slug}`, image: project.cover,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, project } = await resolveProject(params);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Portfolio" });
  const liveUrl = getProjectLiveUrl(project.liveUrl);

  return (
    <article className="mx-auto max-w-4xl space-y-8 pt-10 sm:pt-16">
      <Link href={`/${locale}#work`} className="inline-flex min-h-11 items-center gap-2 rounded-sm text-ring hover:underline">
        <ArrowLeft size={17} className="rtl:rotate-180" aria-hidden="true" />
        {t("back")}
      </Link>
      <header className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {project.category[locale]} · {t(`ownership.${project.ownership}`)}
        </p>
        <h1 className="text-pretty text-4xl font-semibold sm:text-5xl">{project.title[locale]}</h1>
        <p className="max-w-prose text-lg leading-relaxed text-muted-foreground">{project.summary[locale]}</p>
      </header>
      <Image
        src={project.cover.src}
        alt={project.cover.alt[locale]}
        width={project.cover.width}
        height={project.cover.height}
        sizes="(min-width: 960px) 896px, calc(100vw - 2rem)"
        className="h-auto w-full rounded-xl border border-border bg-card"
      />
      {(["problem", "solution", "contribution"] as const).map((field) => {
        const content = project[field]?.[locale];
        return content ? (
          <section key={field} aria-labelledby={field}>
            <h2 id={field} className="mb-2 text-2xl font-semibold">{t(field)}</h2>
            <p className="max-w-prose whitespace-pre-line leading-relaxed text-muted-foreground">{content}</p>
          </section>
        ) : null;
      })}
      {project.technologies.length > 0 && (
        <section aria-labelledby="project-technologies">
          <h2 id="project-technologies" className="mb-3 text-2xl font-semibold">{t("technologies")}</h2>
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <li key={technology} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
                <bdi>{technology}</bdi>
              </li>
            ))}
          </ul>
        </section>
      )}
      {project.gallery && project.gallery.length > 0 && (
        <section aria-labelledby="project-gallery">
          <h2 id="project-gallery" className="mb-3 text-2xl font-semibold">{t("gallery")}</h2>
          <ul className="grid items-start gap-4 sm:grid-cols-2">
            {project.gallery.map((image) => (
              <li key={image.src}>
                <Image
                  src={image.src}
                  alt={image.alt[locale]}
                  width={image.width}
                  height={image.height}
                  sizes="(min-width: 960px) 440px, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full rounded-xl border border-border"
                />
              </li>
            ))}
          </ul>
        </section>
      )}
      {liveUrl && <Button asChild><a href={liveUrl}>{t("visit")}</a></Button>}
    </article>
  );
}
