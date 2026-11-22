import { CalendarDays, ExternalLink } from "lucide-react";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { booking } from "@/config/booking";
import { getPublicContacts } from "@/config/contact";
import { ContactLinks } from "@/components/contact-links";
import { getInquiryConfig } from "@/lib/inquiry/server";

const interests = ["startup", "mvp", "existing"] as const;

export async function BookingSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Booking" });
  const contacts = getPublicContacts();
  const canInquire = !booking.url && contacts.length === 0 && getInquiryConfig() !== null;
  const unavailableText = contacts.length
    ? t("unavailableWithContact")
    : canInquire ? t("unavailableWithInquiry") : t("unavailable");

  return (
    <section id="booking" tabIndex={-1} aria-labelledby="booking-title" className="py-8 sm:py-11">
      <Card className="grid gap-7 bg-linear-to-br from-card to-muted md:grid-cols-[1.5fr_1fr] md:items-center md:gap-10">
        <div>
          <CalendarDays size={26} className="mb-4 text-ring" aria-hidden="true" />
          <h2 id="booking-title" className="text-pretty text-3xl font-semibold sm:text-4xl">
            {t("title")}
          </h2>
          {booking.url ? (
            <div className="mt-4 space-y-4">
              <p className="max-w-prose leading-relaxed text-muted-foreground">{t("description")}</p>
              <Button asChild>
                <a href={booking.url} aria-label={t("googleLabel")} rel="noreferrer">
                  {t("choose")}
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">{t("provider")}</p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <p className="max-w-prose leading-relaxed text-muted-foreground">
                {unavailableText}
              </p>
              {contacts.length > 0 && <ContactLinks locale={locale} contacts={contacts} />}
              {canInquire && (
                <Button asChild variant="outline">
                  <a href="#contact">{t("inquiryAlternative")}</a>
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="rounded-xl border border-border bg-background/50 p-5 sm:p-6">
          <h3 className="text-lg font-semibold">{t("topicsTitle")}</h3>
          <ul className="mt-3 list-disc space-y-2 ps-5 text-muted-foreground marker:text-ring">
            {interests.map((interest) => <li key={interest}>{t(`topics.${interest}`)}</li>)}
          </ul>
        </div>
      </Card>
    </section>
  );
}
