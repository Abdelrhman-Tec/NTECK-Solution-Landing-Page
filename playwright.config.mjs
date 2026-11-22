import { fileURLToPath } from "node:url";
import { defineConfig } from "@playwright/test";

const configured = process.env.QA_CONFIGURED === "1";
const baseURL = "http://localhost:4173";
const mockProviders = fileURLToPath(new URL("./tests/e2e/mock-providers.mjs", import.meta.url));
const mockFonts = fileURLToPath(new URL("./tests/e2e/fonts.cjs", import.meta.url));

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  use: { baseURL, browserName: "chromium", trace: "retain-on-failure" },
  webServer: {
    command: "npm run dev -- --webpack --hostname localhost --port 4173",
    url: baseURL + "/en",
    reuseExistingServer: false,
    timeout: 120000,
    env: {
      SITE_ORIGIN: "",
      NEXT_FONT_GOOGLE_MOCKED_RESPONSES: mockFonts,
      NODE_OPTIONS: `--import ${JSON.stringify(mockProviders)}`,
      NEXT_PUBLIC_GOOGLE_BOOKING_URL: configured ? "https://calendar.app.google/TestScheduleToken" : "",
      CONTACT_RECIPIENT_EMAIL: configured ? "test-inbox@example.org" : "",
      CONTACT_SENDER_EMAIL: configured ? "test-sender@example.org" : "",
      EMAIL_PROVIDER_API_KEY: configured ? "fixture-email-key" : "",
      UPSTASH_REDIS_REST_URL: configured ? "https://fixture.upstash.io" : "",
      UPSTASH_REDIS_REST_TOKEN: configured ? "fixture-redis-key" : "",
      INQUIRY_TRUSTED_IP_HEADER: configured ? "x-qa-ip" : "",
    },
  },
});
