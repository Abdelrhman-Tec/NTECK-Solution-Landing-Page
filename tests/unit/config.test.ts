import assert from "node:assert/strict";
import test from "node:test";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { getGoogleBookingUrl } from "../../src/config/booking.ts";
import { getFacebookHref, getPublicContacts, getPublicEmailHref, getWhatsAppHref } from "../../src/config/contact.ts";
import { getEnabledPayments, type PaymentMethod } from "../../src/config/payments.ts";
import { getSiteOrigin } from "../../src/config/site.ts";
import { getPublishedProject, getPublishedProjects, isPublicProject, type PortfolioProject } from "../../src/data/projects.ts";
import { getLocaleDirection, routing } from "../../src/i18n/routing.ts";

test("locale routing defaults to Arabic despite English preference and retains explicit locale paths", () => {
  const route = createMiddleware(routing);
  const headers = { "accept-language": "en", cookie: "NEXT_LOCALE=en" };
  const root = route(new NextRequest("https://studio.example.org/", { headers }));
  assert.equal(new URL(root.headers.get("location")!).pathname, "/ar");
  for (const locale of routing.locales) {
    const explicit = route(new NextRequest(`https://studio.example.org/${locale}`, { headers }));
    assert.equal(explicit.headers.get("location"), null);
  }
  assert.equal(getLocaleDirection("ar"), "rtl");
  assert.equal(getLocaleDirection("en"), "ltr");
});

test("Google booking accepts only the supported HTTPS hosts and paths", () => {
  const short = "https://calendar.app.google/TestScheduleToken";
  const full = "https://calendar.google.com/calendar/appointments/schedules/TestScheduleToken";
  assert.equal(getGoogleBookingUrl(short + "?next=untrusted"), short);
  assert.equal(getGoogleBookingUrl(full + "?gv=true&next=untrusted#extra"), full + "?gv=true");
  for (const invalid of [undefined, "", "http://calendar.app.google/Test", "https://calendar.app.google.example.org/Test",
    "https://login@calendar.app.google/Test", "https://calendar.app.google:8443/Test", "https://calendar.google.com/calendar/u/0/r",
    "https://calendar.app.google/Test%2fMore", "https://calendar.app.google/"]) {
    assert.equal(getGoogleBookingUrl(invalid), null);
  }
});

test("contact links normalize valid values and omit invalid channels", () => {
  assert.deepEqual(getPublicContacts({ facebookUrl: "", whatsappNumber: "", email: "" }), []);
  assert.deepEqual(getPublicContacts({
    facebookUrl: "https://m.facebook.com/Studio.Page?tracking=1",
    whatsappNumber: "+201000000000",
    email: "team+site@example.org",
  }), [
    { id: "facebook", href: "https://www.facebook.com/Studio.Page" },
    { id: "whatsapp", href: "https://wa.me/201000000000" },
    { id: "email", href: "mailto:team%2Bsite@example.org" },
  ]);
  assert.equal(getFacebookHref("https://facebook.com/profile.php?id=123"), "https://www.facebook.com/profile.php?id=123");
  assert.equal(getFacebookHref("https://facebook.com/l.php?u=http://example.org"), null);
  assert.equal(getFacebookHref("https://facebook.com.example.org/page"), null);
  assert.equal(getWhatsAppHref("01234567890"), null);
  assert.equal(getWhatsAppHref("+00123456789"), null);
  assert.equal(getPublicEmailHref("hello@example.org?bcc=ignored@example.org"), null);
});

test("a payment mark requires enablement, a local asset, valid dimensions, and card processor approval", () => {
  const mark: PaymentMethod = {
    id: "visa", label: "Visa", logoPath: "/payments/visa.svg",
    logoWidth: 240, logoHeight: 80, enabled: true,
  };
  assert.deepEqual(getEnabledPayments([mark]), []);
  const verified = { ...mark, liveCardProcessorVerified: true };
  assert.equal(getEnabledPayments([verified]).length, 1);
  assert.deepEqual(getEnabledPayments([
    { ...verified, enabled: false },
    { ...verified, logoPath: null },
    { ...verified, logoPath: "/payments/../logo.png" },
    { ...verified, logoWidth: 0 },
  ]), []);
});

test("project publication requires both flags and a valid slug", () => {
  const copy = { ar: "اختبار", en: "Fixture" };
  const fixture: PortfolioProject = {
    id: "fixture", slug: "test-project", title: copy, summary: copy, category: copy,
    ownership: "founder", technologies: [], cover: { src: "/work/fixture.png", height: 1, width: 1, alt: copy },
    problem: copy, solution: copy, published: true, approvedForPublication: true,
  };
  assert.equal(isPublicProject(fixture), true);
  assert.equal(isPublicProject({ ...fixture, approvedForPublication: false }), false);
  assert.equal(isPublicProject({ ...fixture, published: false }), false);
  assert.equal(isPublicProject({ ...fixture, slug: "../private" }), false);
  assert.equal(getPublishedProject("unlisted-qa-fixture"), undefined);
  assert.ok(getPublishedProjects().every(isPublicProject));
});

test("production origin rejects missing or unsafe values", () => {
  assert.equal(getSiteOrigin(" https://Studio.example.org/ "), "https://studio.example.org");
  for (const value of [undefined, "", "http://studio.example.org", "https://localhost", "https://studio.example.org/path", "https://user@studio.example.org"]) {
    assert.equal(getSiteOrigin(value), null);
  }
});
