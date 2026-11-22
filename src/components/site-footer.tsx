import { stat } from "node:fs/promises";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Brand } from "@/components/brand";
import { ContactLinks } from "@/components/contact-links";
import { getPublicContacts } from "@/config/contact";
import { getEnabledPayments } from "@/config/payments";

async function paymentMarks() {
  const candidates = await Promise.all(getEnabledPayments().map(async (method) => {
    const asset = await stat(join(process.cwd(), "public", method.logoPath)).catch(() => null);
    return asset?.isFile() ? method : null;
  }));
  return candidates.filter((method) => method !== null);
}

export async function SiteFooter({ locale }: { locale: Locale }) {
  const [t, nav, methods] = await Promise.all([
    getTranslations({ locale, namespace: "Footer" }),
    getTranslations({ locale, namespace: "Navigation" }),
    paymentMarks(),
  ]);
  const home = `/${locale}`;
  const contacts = getPublicContacts();
  const links = [
    { href: `${home}#services`, label: nav("services") },
    { href: `${home}#work`, label: nav("work") },
    { href: `${home}#process`, label: nav("process") },
    { href: `${home}#booking`, label: nav("booking") },
    { href: `${home}#contact`, label: nav("contact") },
  ];

  return (
    <footer className="border-t border-border bg-card/45">
      <div className="site-container space-y-6 py-9 sm:py-12">
        <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
          <div>
            <Link href={home} aria-label={nav("brandHome")} className="inline-flex min-h-11 items-center rounded-sm">
              <Brand />
            </Link>
            <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">{t("description")}</p>
          </div>
          <div>
            <nav aria-label={t("navigation")}>
              <ul className="flex flex-wrap gap-x-5 gap-y-1">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="inline-flex min-h-11 items-center rounded-sm text-sm text-muted-foreground hover:text-foreground">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {contacts.length > 0 && (
              <nav className="mt-3" aria-label={t("contactTitle")}>
                <ContactLinks locale={locale} contacts={contacts} />
              </nav>
            )}
          </div>
        </div>
        {methods.length > 0 && (
          <section aria-labelledby="payment-marks-title">
            <h2 id="payment-marks-title" className="text-base font-semibold">{t("paymentsTitle")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("paymentDetails")}</p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {methods.map((method) => (
                <li key={method.id} className="grid min-h-12 min-w-18 place-items-center rounded-lg bg-white px-3 py-2">
                  <Image src={method.logoPath} alt={method.label} width={method.logoWidth} height={method.logoHeight} unoptimized={method.logoPath.endsWith(".svg")} className="h-auto max-h-7 w-auto max-w-20 object-contain" />
                </li>
              ))}
            </ul>
          </section>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
          <p>{t("copyright", { year: String(new Date().getUTCFullYear()) })}</p>
          <nav aria-label={t("legalNavigation")}>
            <ul className="flex flex-wrap gap-x-5">
              <li><Link href={`${home}/privacy`} className="inline-flex min-h-11 items-center rounded-sm hover:text-foreground">{t("privacy")}</Link></li>
              <li><Link href={`${home}/terms`} className="inline-flex min-h-11 items-center rounded-sm hover:text-foreground">{t("terms")}</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
