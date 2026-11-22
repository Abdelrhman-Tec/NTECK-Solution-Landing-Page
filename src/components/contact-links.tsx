import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getPublicContacts } from "@/config/contact";

export async function ContactLinks({ locale, contacts }: {
  locale: Locale;
  contacts: ReturnType<typeof getPublicContacts>;
}) {
  const t = await getTranslations({ locale, namespace: "Footer" });

  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1">
      {contacts.map(({ id, href }) => (
        <li key={id}>
          <a href={href} rel={id === "email" ? undefined : "noreferrer"} className="inline-flex min-h-11 items-center rounded-sm text-ring hover:underline">
            {id === "facebook" ? t("facebook") : id === "whatsapp" ? t("whatsapp") : t("email")}
          </a>
        </li>
      ))}
    </ul>
  );
}
