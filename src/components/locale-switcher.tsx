"use client";

import { Languages } from "lucide-react";
import type { Locale } from "next-intl";
import { Button } from "@/components/ui/button";
import { getPathname, usePathname } from "@/i18n/navigation";

const labels = { ar: "العربية", en: "English" } satisfies Record<Locale, string>;

export function LocaleSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const target = locale === "ar" ? "en" : "ar";
  const href = getPathname({ locale: target, href: pathname });

  return (
    <nav aria-label={label}>
      <Button asChild variant="outline">
        <a
          href={href}
          hrefLang={target}
          lang={target}
          dir={target === "ar" ? "rtl" : "ltr"}
          onClick={({ currentTarget }) => {
            // Preserve the current document state when following the alternate link.
            currentTarget.href = href + window.location.search + window.location.hash;
          }}
        >
          <Languages size={16} aria-hidden="true" />
          {labels[target]}
        </a>
      </Button>
    </nav>
  );
}
