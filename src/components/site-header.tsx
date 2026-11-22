import { getLocaleDirection } from "@/i18n/routing";
import { NextIntlClientProvider, type Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Brand } from "@/components/brand";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { HeaderFrame, MobileNavigation } from "@/components/header-interactions";
import { Button } from "@/components/ui/button";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Navigation" });
  const layout = await getTranslations({ locale, namespace: "Layout" });
  const home = `/${locale}`;
  const links = [
    { href: home, label: t("home") },
    { href: `${home}#services`, label: t("services") },
    { href: `${home}#work`, label: t("work") },
    { href: `${home}#process`, label: t("process") },
    { href: `${home}#contact`, label: t("contact") },
  ];
  const bookingLink = { href: `${home}#booking`, label: t("booking") };

  return (
    <HeaderFrame>
      <div className="site-container flex min-h-18 items-center justify-between gap-3 py-3">
        <a className="min-w-0 rounded-sm" href={home} aria-label={t("brandHome")}>
          <Brand />
        </a>
        <nav aria-label={t("label")} className="hidden items-center gap-4 text-sm lg:flex xl:gap-6">
          {links.map(({ href, label }) => (
            <a key={href} href={href} className="inline-flex min-h-11 items-center text-muted-foreground hover:text-foreground">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <NextIntlClientProvider locale={locale} messages={null}>
            <LocaleSwitcher locale={locale} label={layout("language")} />
          </NextIntlClientProvider>
          <Button asChild className="hidden lg:inline-flex">
            <a href={bookingLink.href}>{bookingLink.label}</a>
          </Button>
          <MobileNavigation
            direction={getLocaleDirection(locale)}
            title={t("label")}
            openLabel={t("open")}
            closeLabel={t("close")}
            links={links}
            booking={bookingLink}
          />
        </div>
      </div>
    </HeaderFrame>
  );
}
