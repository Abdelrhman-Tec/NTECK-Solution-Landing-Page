export const contact = {
  facebookUrl: "",
  whatsappNumber: "",
  email: "",
};

export function getPublicEmailHref(value: string): string | null {
  const email = value.trim();
  const parts = /^([a-z0-9_+-]+(?:\.[a-z0-9_+-]+)*)@((?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,})$/i.exec(email);
  return parts ? `mailto:${encodeURIComponent(parts[1])}@${parts[2]}` : null;
}

export function getFacebookHref(value: string): string | null {
  const input = value.trim();
  if (!/^https:\/\/[^/]/i.test(input) || /[\s\\\u0000-\u001f\u007f]/u.test(input)) return null;
  try {
    const url = new URL(input);
    if (!["facebook.com", "www.facebook.com", "m.facebook.com"].includes(url.hostname)
      || url.username || url.password || url.port) return null;

    const profileId = url.searchParams.get("id");
    if (url.pathname === "/profile.php" && profileId && /^\d+$/.test(profileId)) {
      return `https://www.facebook.com/profile.php?id=${profileId}`;
    }
    if (!/^\/(?:[a-z0-9_-]+(?:\.[a-z0-9_-]+)*|people\/[a-z0-9_-]+\/\d+)\/?$/i.test(url.pathname)
      || /\/(?:l\.php|flx|login|profile\.php)\/?$/i.test(url.pathname)) return null;
    return `https://www.facebook.com${url.pathname}`;
  } catch {
    return null;
  }
}

export function getWhatsAppHref(value: string): string | null {
  const number = value.trim();
  return /^\+[1-9]\d{6,14}$/.test(number) ? `https://wa.me/${number.slice(1)}` : null;
}

export function getPublicContacts(config = contact) {
  return [
    { id: "facebook", href: getFacebookHref(config.facebookUrl) },
    { id: "whatsapp", href: getWhatsAppHref(config.whatsappNumber) },
    { id: "email", href: getPublicEmailHref(config.email) },
  ].flatMap(({ id, href }) => href ? [{ id, href }] : []);
}
