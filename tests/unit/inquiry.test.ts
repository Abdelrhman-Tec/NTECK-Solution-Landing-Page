import assert from "node:assert/strict";
import test from "node:test";
import { inquirySchema, fieldLimits } from "../../src/lib/inquiry/schema.ts";
import { getInquiryConfig, handleInquiry } from "../../src/lib/inquiry/server.ts";

const payload = {
  name: "  أحمد حسن ", email: "user@example.org", country: "Jordan", customerType: "founder",
  projectType: "mobile", description: "An overview of the project.\r\nSecond line.", consent: true,
  whatsapp: "+201000000000", website: "",
};
const origin = "https://studio.example.org";
const requestId = "72e591c4-96ce-43bc-b36e-f35a7fa3daa1";
const config = getInquiryConfig({
  NODE_ENV: "test",
  CONTACT_RECIPIENT_EMAIL: "team@example.org",
  CONTACT_SENDER_EMAIL: "site@example.org",
  EMAIL_PROVIDER_API_KEY: "fixture-email-key",
  UPSTASH_REDIS_REST_URL: "https://fixture.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "fixture-redis-key",
  INQUIRY_TRUSTED_IP_HEADER: "x-fixture-ip",
});
assert.ok(config);
const noNetwork: typeof fetch = () => assert.fail("unexpected outgoing request");

function submission(data: unknown = payload, headers = {}) {
  return new Request(origin + "/api/inquiry", {
    method: "POST",
    headers: { origin, "content-type": "application/json", "idempotency-key": requestId,
      "x-fixture-ip": "192.0.2.1", ...headers },
    body: typeof data === "string" ? data : JSON.stringify(data),
  });
}

async function check(response: Response, status: number, result: string) {
  assert.equal(response.status, status);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { result });
}

test("shared schema normalizes input, accepts other countries, and validates field limits and consent", () => {
  const inquiry = inquirySchema.parse(payload);
  assert.equal(inquiry.name, "أحمد حسن");
  assert.equal(inquiry.description, "An overview of the project.\nSecond line.");
  assert.equal(inquiry.country, "Jordan");
  for (const overrides of [
    { consent: false }, { email: "bad" }, { customerType: "invalid" }, { projectType: "invalid" },
    { description: "x".repeat(fieldLimits.description + 1) }, { description: "short" },
    { country: "" }, { name: "A\nB" }, { whatsapp: "123" }, { unknown: true },
  ]) {
    assert.ok(!inquirySchema.safeParse({ ...payload, ...overrides }).success);
  }
});

test("inquiry handler blocks invalid submissions, spam, oversized bodies and cross-origin requests", async () => {
  await check(await handleInquiry(submission({ ...payload, website: "spam" }), config, noNetwork), 400, "invalid");
  await check(await handleInquiry(submission({ ...payload, consent: false }), config, noNetwork), 400, "invalid");
  await check(await handleInquiry(submission("x".repeat(17000)), config, noNetwork), 400, "invalid");
  await check(await handleInquiry(submission(payload, { origin: "https://unrelated.example" }), config, noNetwork), 403, "invalid");
  await check(await handleInquiry(submission(payload, { "idempotency-key": "bad" }), config, noNetwork), 400, "invalid");
});

test("missing config, untrusted IP, or unavailable Redis fail closed", async () => {
  await check(await handleInquiry(submission(), null, noNetwork), 503, "unavailable");
  await check(await handleInquiry(submission(payload, { "x-fixture-ip": "192.0.2.1, 192.0.2.2" }), config, noNetwork), 503, "unavailable");
  await check(await handleInquiry(submission(), config, async () => Response.json({}, { status: 503 })), 503, "unavailable");
});

test("configured public origin takes precedence over the upstream server origin", async () => {
  const makeRequest = (requestOrigin: string) => new Request("http://127.0.0.1:3000/api/inquiry", {
    method: "POST",
    headers: { origin: requestOrigin, "content-type": "application/json", "idempotency-key": requestId },
    body: JSON.stringify(payload),
  });
  await check(await handleInquiry(makeRequest(origin), null, noNetwork, origin), 503, "unavailable");
  await check(await handleInquiry(makeRequest("http://127.0.0.1:3000"), null, noNetwork, origin), 403, "invalid");
});

test("the distributed limit reports throttling before contacting the mail provider", async () => {
  let called = 0;
  const response = await handleInquiry(submission(), config, async (url) => {
    assert.equal(url, "https://fixture.upstash.io/");
    called++;
    return Response.json({ result: 0 });
  });
  assert.equal(response.headers.get("retry-after"), "3600");
  await check(response, 429, "rateLimited");
  assert.equal(called, 1);
});

test("accepted delivery uses fixed headers, a hashed visitor key, and a stable idempotency key", async () => {
  const calls: string[] = [];
  const response = await handleInquiry(submission(), config, async (url, init) => {
    calls.push(String(url));
    assert.ok(typeof init?.body === "string");
    const body = JSON.parse(init.body);
    if (url === "https://fixture.upstash.io/") {
      assert.equal(body[0], "EVAL");
      assert.match(body[3], /ip:[a-f0-9]{64}$/);
      assert.ok(!init.body.includes("192.0.2.1") && !init.body.includes(payload.email));
      return Response.json({ result: 1 });
    }
    assert.equal(url, "https://api.resend.com/emails");
    assert.equal(new Headers(init.headers).get("idempotency-key"), "ntech-inquiry/" + requestId);
    assert.equal(body.reply_to, payload.email);
    assert.equal(body.subject, "New NTech Labs project inquiry");
    assert.match(body.text, /أحمد حسن/);
    assert.ok(!("html" in body));
    return Response.json({ id: "fixture-message" });
  });
  await check(response, 202, "accepted");
  assert.deepEqual(calls, ["https://fixture.upstash.io/", "https://api.resend.com/emails"]);
});

test("provider failure or missing acceptance ID never returns success", async () => {
  const mock: typeof fetch = async (url) =>
    url === "https://fixture.upstash.io/" ? Response.json({ result: 1 }) : Response.json({});
  await check(await handleInquiry(submission(), config, mock), 502, "failed");
});
