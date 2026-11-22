import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { getPublishedProjects } from "@/data/projects";

export async function Portfolio({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Portfolio" });
  const projects = getPublishedProjects();

  return (
    <section id="work" tabIndex={-1} aria-labelledby="work-title" className="py-8 sm:py-11">
      <h2 id="work-title" className="mb-6 max-w-3xl text-pretty text-3xl font-semibold sm:text-4xl">
        {t("title")}
      </h2>
      {projects.length === 0 ? (
        <Card className="p-5 sm:p-6">
          <p className="text-muted-foreground">{t("empty")}</p>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
              <Card className="flex h-full flex-col gap-3 p-4 sm:p-5">
                <Image
                  src={project.cover.src}
                  alt={project.cover.alt[locale]}
                  width={project.cover.width}
                  height={project.cover.height}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-video w-full rounded-lg bg-muted object-cover"
                />
                <p className="text-sm text-muted-foreground">
                  {project.category[locale]} · {t(`ownership.${project.ownership}`)}
                </p>
                <h3 className="text-xl font-semibold">{project.title[locale]}</h3>
                <p className="leading-relaxed text-muted-foreground">{project.summary[locale]}</p>
                <Link
                  href={`/${locale}/work/${project.slug}`}
                  aria-label={t("readProject", { project: project.title[locale] })}
                  className="mt-auto inline-flex min-h-11 items-center gap-2 self-start rounded-sm font-semibold text-ring hover:underline"
                >
                  {t("read")}
                  <ArrowRight size={16} className="shrink-0 rtl:rotate-180" aria-hidden="true" />
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
