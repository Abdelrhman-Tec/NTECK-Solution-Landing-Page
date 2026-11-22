import type { Locale } from "next-intl";
import { getMessages } from "next-intl/server";
import { InquiryForm } from "@/components/inquiry-form";
import { Card } from "@/components/ui/card";
import { booking } from "@/config/booking";
import { getPublicContacts } from "@/config/contact";
import { ContactLinks } from "@/components/contact-links";
import { getInquiryConfig } from "@/lib/inquiry/server";

export async function InquirySection({ locale }: { locale: Locale }) {
  const { Inquiry: copy, Footer: footer } = await getMessages({ locale });
  const enabled = getInquiryConfig() !== null;
  const contacts = getPublicContacts();

  return (
    <section id="contact" tabIndex={-1} aria-labelledby="inquiry-title" className="py-8 sm:py-11">
      <Card>
        <h2 id="inquiry-title" className="text-pretty text-3xl font-semibold sm:text-4xl">{copy.title}</h2>
        <p className="mt-3 max-w-prose leading-relaxed text-muted-foreground">{copy.intro}</p>
        {!enabled && (
          <div className="mt-5 rounded-lg border border-border bg-muted px-4 py-3 text-sm">
            <p>{copy.status.unavailable}</p>
            {contacts.length > 0 && <ContactLinks locale={locale} contacts={contacts} />}
            {!contacts.length && booking.url && <a href="#booking" className="mt-2 inline-flex min-h-11 items-center text-ring underline">{copy.bookingAlternative}</a>}
          </div>
        )}
        <InquiryForm copy={copy} enabled={enabled} privacyHref={`/${locale}/privacy`} privacyLabel={footer.privacy} />
      </Card>
    </section>
  );
}
