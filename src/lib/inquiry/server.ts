import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { z } from "zod";
import { inquirySchema, type Inquiry, type InquiryResult } from "./schema";

const providerEndpoint = "https://api.resend.com/emails";
const maxBodyBytes = 16 * 1024;
const windowSeconds = 3600;
const perVisitorLimit = 5;
const overallLimit = 40;

const credentialsSchema = z.object({
  recipient: z.email().max(254),
  sender: z.email().max(254),
  emailToken: z.string().regex(/^[\x21-\x7e]+$/),
  redisUrl: z.url(),
  redisToken: z.string().regex(/^[\x21-\x7e]+$/),
  ipHeader: z.string().regex(/^[a-z0-9-]+$/),
});

export function getInquiryConfig(env = process.env) {
  const parsed = credentialsSchema.safeParse({
    recipient: env.CONTACT_RECIPIENT_EMAIL?.trim(),
    sender: env.CONTACT_SENDER_EMAIL?.trim(),
    emailToken: env.EMAIL_PROVIDER_API_KEY?.trim(),
    redisUrl: env.UPSTASH_REDIS_REST_URL?.trim(),
    redisToken: env.UPSTASH_REDIS_REST_TOKEN?.trim(),
    ipHeader: env.INQUIRY_TRUSTED_IP_HEADER?.trim().toLowerCase(),
  });
  if (!parsed.success) return null;

  const endpoint = new URL(parsed.data.redisUrl);
  if (endpoint.protocol !== "https:" || !endpoint.hostname.endsWith(".upstash.io")
    || endpoint.username || endpoint.password || endpoint.port || endpoint.pathname !== "/"
    || endpoint.search || endpoint.hash) return null;

  return { ...parsed.data, redisUrl: endpoint.href };
}

type InquiryConfig = NonNullable<ReturnType<typeof getInquiryConfig>>;

const rateLimitScript = `
local visitor = tonumber(redis.call("GET", KEYS[1]) or "0")
local total = tonumber(redis.call("GET", KEYS[2]) or "0")
if visitor >= tonumber(ARGV[1]) or total >= tonumber(ARGV[2]) then return 0 end
for _, key in ipairs(KEYS) do
  if redis.call("INCR", key) == 1 then redis.call("EXPIRE", key, ARGV[3]) end
end
return 1
`;

async function enforceRateLimit(config: InquiryConfig, ip: string, requestFetch: typeof fetch) {
  const visitor = createHmac("sha256", config.redisToken).update("inquiry-ip:" + ip).digest("hex");
  const response = await requestFetch(config.redisUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.redisToken}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      "EVAL", rateLimitScript, 2, `{ntech-inquiry}:ip:${visitor}`, "{ntech-inquiry}:global",
      perVisitorLimit, overallLimit, windowSeconds,
    ]),
    signal: AbortSignal.timeout(5000),
    redirect: "error",
    cache: "no-store",
  });
  if (!response.ok) return null;
  const result = await response.json();
  return result.result === 1 ? true : result.result === 0 ? false : null;
}

async function readBody(request: Request) {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength !== null && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > maxBodyBytes)) return null;
  if (!request.body) return null;

  const reader = request.body.getReader();
  const buffer = new Uint8Array(maxBodyBytes);
  let received = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (received + value.byteLength > maxBodyBytes) {
        void reader.cancel().catch(() => {});
        return null;
      }
      buffer.set(value, received);
      received += value.byteLength;
    }
    const text = new TextDecoder("utf-8", { fatal: true }).decode(buffer.subarray(0, received));
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}

function emailBody(inquiry: Inquiry) {
  const { consent, website, ...details } = inquiry;
  void website;
  const fields = Object.entries(details)
    .filter(([, value]) => value)
    .map(([field, value]) => `${field}: ${value}`);
  return [...fields, `privacyConsent: ${consent ? "yes" : "no"}`].join("\n\n");
}

async function submitEmail(config: InquiryConfig, inquiry: Inquiry, idempotencyKey: string, requestFetch: typeof fetch) {
  const response = await requestFetch(providerEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.emailToken}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `ntech-inquiry/${idempotencyKey}`,
    },
    body: JSON.stringify({
      from: config.sender,
      to: [config.recipient],
      reply_to: inquiry.email,
      subject: "New NTech Labs project inquiry",
      text: emailBody(inquiry),
    }),
    signal: AbortSignal.timeout(8000),
    redirect: "error",
    cache: "no-store",
  });
  if (!response.ok) return false;
  const result = await response.json();
  return typeof result.id === "string" && result.id.length > 0;
}

function reply(status: number, result: InquiryResult, retryAfter?: number) {
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (retryAfter) headers.set("Retry-After", String(retryAfter));
  return Response.json({ result }, { status, headers });
}

export async function handleInquiry(
  request: Request,
  config = getInquiryConfig(),
  requestFetch = fetch,
  siteOrigin: string | null = null,
): Promise<Response> {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (origin !== (siteOrigin ?? new URL(request.url).origin) || (fetchSite && fetchSite !== "same-origin")) {
    return reply(403, "invalid");
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return reply(415, "invalid");
  }

  const key = z.uuidv4().safeParse(request.headers.get("idempotency-key"));
  if (!key.success) return reply(400, "invalid");
  const parsed = inquirySchema.safeParse(await readBody(request));
  if (!parsed.success || parsed.data.website) return reply(400, "invalid");
  if (!config) return reply(503, "unavailable");

  const ip = request.headers.get(config.ipHeader);
  if (!ip || !isIP(ip)) return reply(503, "unavailable");

  try {
    const allowed = await enforceRateLimit(config, ip, requestFetch);
    if (allowed === null) return reply(503, "unavailable");
    if (!allowed) return reply(429, "rateLimited", windowSeconds);
  } catch {
    return reply(503, "unavailable");
  }

  try {
    const accepted = await submitEmail(config, parsed.data, key.data, requestFetch);
    return accepted ? reply(202, "accepted") : reply(502, "failed");
  } catch {
    return reply(502, "failed");
  }
}
