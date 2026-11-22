const bookingPaths = new Map([
  ["calendar.app.google", /^\/[a-zA-Z0-9_-]+\/?$/],
  ["calendar.google.com", /^\/calendar\/appointments\/schedules\/[a-zA-Z0-9_-]+\/?$/],
]);

export function getGoogleBookingUrl(value: string | undefined): string | null {
  const input = value?.trim();
  if (!input || !/^https:\/\/[^/]/i.test(input) || /[\s\\\u0000-\u001f\u007f]/u.test(input)) return null;

  try {
    const url = new URL(input);
    const allowedPath = bookingPaths.get(url.hostname);
    if (url.username || url.password || url.port || !allowedPath?.test(url.pathname)) return null;

    const guestView = url.hostname === "calendar.google.com" && url.searchParams.get("gv") === "true";
    url.search = guestView ? "?gv=true" : "";
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}

const url = getGoogleBookingUrl(process.env.NEXT_PUBLIC_GOOGLE_BOOKING_URL);
export const booking = { enabled: url !== null, url };
