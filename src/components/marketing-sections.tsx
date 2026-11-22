import {
  ArrowRight, Compass, Globe, Layers3, Lightbulb, Rocket, Server, Smartphone, Wrench,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const audiences = [
  { key: "founders", Icon: Rocket },
  { key: "ideas", Icon: Lightbulb },
  { key: "products", Icon: Layers3 },
] as const;

const services = [
  { key: "discovery", Icon: Compass },
  { key: "mvp", Icon: Rocket },
  { key: "mobile", Icon: Smartphone },
  { key: "web", Icon: Globe },
  { key: "backend", Icon: Server },
  { key: "improvement", Icon: Wrench },
] as const;

const steps = ["discover", "plan", "build", "launch"] as const;
const principles = ["communication", "scope", "engineering", "product", "visibility", "choices"] as const;
const technologies = ["Flutter", "Dart", "Laravel", "PHP", "MySQL", "REST APIs", "Filament", "Next.js", "TypeScript"];

function MarketingSection({ id, title, children }: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} tabIndex={-1} aria-labelledby={`${id}-title`} className="py-8 sm:py-11">
      <h2 id={`${id}-title`} className="mb-6 max-w-3xl text-pretty text-3xl font-semibold sm:mb-8 sm:text-4xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export async function AudienceAndServices() {
  const t = await getTranslations("Marketing");

  return (
    <>
      <MarketingSection id="audience" title={t("audience.title")}>
        <ul className="grid gap-4 md:grid-cols-3">
          {audiences.map(({ key, Icon }) => (
            <li key={key}>
              <Card className="h-full p-5 sm:p-6">
                <Icon aria-hidden="true" size={22} className="mb-4 text-ring" />
                <h3 className="text-lg font-semibold">{t(`audience.${key}.title`)}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{t(`audience.${key}.description`)}</p>
              </Card>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection id="services" title={t("services.title")}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ key, Icon }) => {
            const title = t(`services.${key}.title`);
            return (
              <li key={key}>
                <Card className="flex h-full flex-col p-5 sm:p-6">
                  <div className="mb-4 grid size-11 place-items-center rounded-lg bg-muted text-ring">
                    <Icon aria-hidden="true" size={22} />
                  </div>
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{t(`services.${key}.benefit`)}</p>
                  <ul className="mb-5 mt-4 list-disc space-y-1 ps-5 text-sm leading-relaxed marker:text-ring">
                    <li>{t(`services.${key}.deliverableOne`)}</li>
                    <li>{t(`services.${key}.deliverableTwo`)}</li>
                  </ul>
                  <Button asChild variant="outline" className="mt-auto self-start text-start">
                    <a href="#contact" aria-label={t("services.ctaLabel", { service: title })}>
                      {t("services.cta")}
                      <ArrowRight size={16} className="shrink-0 rtl:rotate-180" aria-hidden="true" />
                    </a>
                  </Button>
                </Card>
              </li>
            );
          })}
        </ul>
      </MarketingSection>
    </>
  );
}

export async function ProcessAndApproach() {
  const t = await getTranslations("Marketing");

  return (
    <>
      <MarketingSection id="process" title={t("process.title")}>
        <p className="-mt-2 mb-6 max-w-prose leading-relaxed text-muted-foreground">{t("process.scope")}</p>
        <ol className="grid gap-5 lg:grid-cols-4 lg:gap-0">
          {steps.map((step) => (
            <li key={step} className="relative border-s-2 border-border ps-5 lg:border-s-0 lg:border-t-2 lg:pe-5 lg:ps-0 lg:pt-5">
              <span aria-hidden="true" className="absolute start-0 top-1.5 size-3 -translate-x-1/2 rounded-full bg-ring rtl:translate-x-1/2 lg:-top-px lg:translate-x-0 lg:-translate-y-1/2 lg:rtl:translate-x-0" />
              <h3 className="text-lg font-semibold">{t(`process.${step}.title`)}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{t(`process.${step}.description`)}</p>
            </li>
          ))}
        </ol>
      </MarketingSection>

      <MarketingSection id="why-us" title={t("why.title")}>
        <Card className="p-5 sm:p-7">
          <ul className="grid list-disc gap-x-8 gap-y-3 ps-5 leading-relaxed marker:text-ring sm:grid-cols-2">
            {principles.map((principle) => <li key={principle}>{t(`why.${principle}`)}</li>)}
          </ul>
        </Card>
      </MarketingSection>

      <MarketingSection id="technologies" title={t("technologies.title")}>
        <p className="-mt-2 mb-5 max-w-prose leading-relaxed text-muted-foreground">{t("technologies.description")}</p>
        <ul className="flex flex-wrap gap-2.5">
          {technologies.map((technology) => (
            <li key={technology} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
              <bdi>{technology}</bdi>
            </li>
          ))}
        </ul>
      </MarketingSection>
    </>
  );
}
