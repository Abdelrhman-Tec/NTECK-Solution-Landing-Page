type BrandLogo = {
  src: `/brand/${string}`;
  width: number;
  height: number;
};

type SiteConfig = {
  name: string;
  origin: string | null;
  logo: BrandLogo | null;
};

export function getSiteOrigin(value: string | undefined): string | null {
  const input = value?.trim();
  if (!input || !/^https:\/\/[^/]/i.test(input) || /[\s\\]/u.test(input)) return null;
  try {
    const url = new URL(input);
    if (url.protocol !== "https:" || url.username || url.password || url.port
      || url.pathname !== "/" || url.search || url.hash
      || !url.hostname.includes(".") || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(url.hostname)) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export const site: SiteConfig = {
  name: "NTech Labs",
  origin: getSiteOrigin(process.env.SITE_ORIGIN),
  logo: { src: "/brand/logo.png", width: 2172, height: 724 },
};
