import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { site } from "@/config/site";

export async function Brand() {
  if (site.logo) {
    return (
      <Image
        src={site.logo.src}
        alt={site.name}
        width={site.logo.width}
        height={site.logo.height}
        className="h-9 w-auto"
      />
    );
  }

  const t = await getTranslations("Layout");
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <bdi className="font-semibold">{site.name}</bdi>
      <span className="text-xs text-muted-foreground">{t("logoPending")}</span>
    </div>
  );
}
