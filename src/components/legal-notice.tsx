import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export type LegalPageProps = { params: Promise<{ locale: string }> };
type LegalKind = "privacy" | "terms";
const sections = ["first", "second", "third", "review"] as const;

async function getLegalCopy(params: LegalPageProps["params"]) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return { locale, t: await getTranslations({ locale, namespace: "LegalNotice" }) };
}

export async function getLegalMetadata(params: LegalPageProps["params"], kind: LegalKind): Promise<Metadata> {
  const { locale, t } = await getLegalCopy(params);
  return pageMetadata({
    locale, title: t(`${kind}.title`), description: t(`${kind}.description`),
    path: `/${kind}`, noIndex: true,
  });
}

export async function LegalNotice({ params, kind }: LegalPageProps & { kind: LegalKind }) {
  const { t } = await getLegalCopy(params);

  return (
    <article className="mx-auto max-w-3xl pt-10 sm:pt-16">
      <Card>
        <h1 className="text-3xl font-semibold sm:text-4xl">{t(`${kind}.title`)}</h1>
        <p className="mt-4 inline-block rounded-lg border border-border px-3 py-2 text-sm font-semibold text-ring">{t("pending")}</p>
        <p className="mt-5 leading-relaxed text-muted-foreground">{t(`${kind}.description`)}</p>
        <div className="mt-7 space-y-6">
          {sections.map((section) => (
            <section key={section} aria-labelledby={`legal-${section}`}>
              <h2 id={`legal-${section}`} className="text-xl font-semibold">{t(`${kind}.${section}.title`)}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{t(`${kind}.${section}.body`)}</p>
            </section>
          ))}
        </div>
      </Card>
    </article>
  );
}
