import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import { getPublishedProjects } from "../../src/data/projects.ts";
import { getPublicContacts } from "../../src/config/contact.ts";
import { getEnabledPayments, payments } from "../../src/config/payments.ts";

const configured = process.env.QA_CONFIGURED === "1";
const copy = Object.fromEntries(["ar", "en"].map((locale) => [
  locale,
  JSON.parse(readFileSync(new URL(`../../messages/${locale}.json`, import.meta.url), "utf8")),
]));

test("default Arabic redirect and locale switch preserve query and section", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/ar$/);
  await page.goto("/ar?via=qa#services");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\?via=qa#services$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await page.getByRole("link", { name: "العربية" }).click();
  await expect(page).toHaveURL(/\/ar\?via=qa#services$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

for (const locale of ["ar", "en"]) {
  const t = copy[locale];

  for (const width of [360, 768, 1280]) {
    test(`${locale} at ${width}px renders without horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(t.Home.title);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.getByRole("link", { name: t.Home.work, exact: true }).click();
      await expect(page).toHaveURL(/#work$/);
      await page.getByRole("link", { name: t.Home.booking, exact: true }).click();
      await expect(page).toHaveURL(/#booking$/);
    });
  }

  test(`${locale} mobile menu traps focus, dismisses with Escape, and follows a section link`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(`/${locale}`);
    const trigger = page.getByRole("button", { name: t.Navigation.open });
    const dialog = page.getByRole("dialog", { name: t.Navigation.label });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
    await expect(dialog.getByRole("button", { name: t.Navigation.close })).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("link", { name: t.Navigation.booking })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.press("Enter");
    await dialog.getByRole("link", { name: t.Navigation.services }).click();
    await expect(page).toHaveURL(/#services$/);
    await expect(dialog).toBeHidden();
    await expect(page.locator("#services")).toBeFocused();
  });

  test(`${locale} booking state, public portfolio, footer, and legal routes`, async ({ page, request }) => {
    await page.goto(`/${locale}`);
    const booking = page.locator("#booking");
    if (configured) {
      const link = booking.getByRole("link", { name: t.Booking.googleLabel });
      await expect(link).toHaveAttribute("href", "https://calendar.app.google/TestScheduleToken");
      await page.route("https://calendar.app.google/TestScheduleToken", (route) => route.fulfill({
        contentType: "text/html",
        body: "<h1>Booking page fixture</h1>",
      }));
      await link.click();
      await expect(page.getByRole("heading", { name: "Booking page fixture" })).toBeVisible();
      await page.goto(`/${locale}`);
    } else {
      await expect(booking.getByRole("link", { name: t.Booking.googleLabel })).toHaveCount(0);
      const unavailable = getPublicContacts().length ? t.Booking.unavailableWithContact : t.Booking.unavailable;
      await expect(booking.getByText(unavailable, { exact: true })).toBeVisible();
    }
    const expected = getPublishedProjects().map(({ slug }) => `/${locale}/work/${slug}`);
    expect(await page.locator("#work a").evaluateAll((links) => links.map((link) => link.getAttribute("href")))).toEqual(expected);
    expect((await request.get(`/${locale}/work/missing-qa-slug`)).status()).toBe(404);
    const footer = page.getByRole("contentinfo");
    for (const { id, href } of getPublicContacts()) {
      await expect(footer.getByRole("link", { name: t.Footer[id] })).toHaveAttribute("href", href);
    }
    for (const id of ["facebook", "whatsapp", "email"]) {
      if (!getPublicContacts().some((contact) => contact.id === id)) {
        await expect(footer.getByRole("link", { name: t.Footer[id] })).toHaveCount(0);
      }
    }
    const enabled = getEnabledPayments();
    if (!enabled.length) await expect(footer.locator("#payment-marks-title")).toHaveCount(0);
    for (const method of payments.filter((method) => !enabled.some(({ id }) => id === method.id))) {
      await expect(footer.getByRole("img", { name: method.label, exact: true })).toHaveCount(0);
    }
    for (const kind of ["privacy", "terms"]) {
      await footer.getByRole("link", { name: t.Footer[kind], exact: true }).click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(t.LegalNotice[kind].title);
    }
  });

  test(`${locale} inquiry handles validation, loading, failure and mocked acceptance`, async ({ page, request, baseURL }) => {
    await page.goto(`/${locale}#contact`);
    const submit = page.getByRole("button", { name: t.Inquiry.submit });
    if (!configured) {
      await expect(submit).toBeDisabled();
      await expect(page.getByText(t.Inquiry.status.unavailable, { exact: true })).toBeVisible();
      const response = await request.post("/api/inquiry", {
        headers: { origin: baseURL, "idempotency-key": randomUUID() },
        data: { name: "QA Founder", email: "qa@example.org", country: "Egypt", customerType: "founder",
          projectType: "mvp", description: "A synthetic QA inquiry for the test.", consent: true },
      });
      expect(response.status()).toBe(503);
      expect(await response.json()).toEqual({ result: "unavailable" });
      return;
    }

    await submit.click();
    await expect(page.getByText(t.Inquiry.errors.email, { exact: true })).toBeVisible();
    await expect(page.locator("#inquiry-name")).toHaveAttribute("aria-invalid", "true");
    await page.locator("#inquiry-name").fill("QA Founder");
    await page.locator("#inquiry-email").fill("qa@example.org");
    await page.locator("#inquiry-country").fill(t.Inquiry.countries.egypt);
    await page.locator("#inquiry-customerType").selectOption("founder");
    await page.locator("#inquiry-projectType").selectOption("mvp");
    const description = "A synthetic QA inquiry for the test.";
    await page.locator("#inquiry-description").fill(description);
    await page.locator("#inquiry-consent").check();

    let accept = false;
    let release = () => {};
    const responseGate = new Promise((resolve) => { release = resolve; });
    const attempts = [];
    await page.route("**/api/inquiry", async (route) => {
      attempts.push(route.request().headers()["idempotency-key"]);
      await responseGate;
      return route.fulfill({ status: accept ? 202 : 502, json: { result: accept ? "accepted" : "failed" } });
    });
    await submit.click();
    await expect(page.getByRole("button", { name: t.Inquiry.sending })).toBeDisabled();
    release();
    await expect(page.getByRole("status")).toHaveText(t.Inquiry.status.failed);
    await expect(page.locator("#inquiry-description")).toHaveValue(description);
    accept = true;
    await submit.click();
    await expect(page.getByRole("status")).toHaveText(t.Inquiry.status.accepted);
    await expect(page.locator("#inquiry-description")).toHaveValue("");
    expect(attempts).toHaveLength(2);
    expect(attempts[0]).toBe(attempts[1]);
  });
}

test("inquiry route rejects invalid form data and accepts a valid request only with mocked providers", async ({ request, baseURL }) => {
  test.skip(!configured, "Runs with the isolated provider fixtures");
  const payload = { name: "QA Founder", email: "qa@example.org", country: "Egypt", customerType: "founder",
    projectType: "mvp", description: "A synthetic QA inquiry for the test.", consent: true };
  const post = (data) => request.post("/api/inquiry", {
    headers: { origin: baseURL, "idempotency-key": randomUUID(), "x-qa-ip": "192.0.2.1" },
    data,
  });
  const invalid = await post({ ...payload, consent: false });
  expect(invalid.status()).toBe(400);
  expect(await invalid.json()).toEqual({ result: "invalid" });
  const accepted = await post(payload);
  expect(accepted.status()).toBe(202);
  expect(await accepted.json()).toEqual({ result: "accepted" });
});
