# 08 — Secure project inquiry and lead capture
Read `01_GLOBAL_RULES.md` first.

## Form
Create a premium bilingual React Hook Form + Zod form with accessible labels/errors. Required: name, email, country, customer type, project type, description, privacy consent. Optional: WhatsApp, company/startup, stage, budget range, timeline. Customer types: startup founder, entrepreneur, existing business, other. Project types: mobile app, MVP, SaaS, web app, backend/API, existing product, consulting, other. Include Egypt/Saudi but don't prevent other legitimate countries unless owner requires it.

## Submission
Use a secure server action or route handler, server-side Zod validation, bounded lengths, sensible request size, normalized input, and email provider integration. Env placeholders: `CONTACT_RECIPIENT_EMAIL`, `CONTACT_SENDER_EMAIL`, `EMAIL_PROVIDER_API_KEY`; provider can be Resend or a suitable equivalent but must not require a paid plan to run the basic site. If missing credentials, show a clear unavailable state and contact alternative; **never pretend an email was sent**. No secret in `NEXT_PUBLIC_*`.

## Abuse prevention
Honeypot, anti-bot protection where appropriate, production-safe distributed rate limiting (do not pretend an in-memory limiter protects serverless), server-side checks, safe email formatting (no header injection), limited logs, privacy policy and consent. Avoid collecting unnecessary sensitive idea details.

## UX
Localized loading, validation, success and failure states; disable duplicate submissions; preserve user input on failure; success only after confirmed delivery/accepted request by configured provider. Use semantic form and keyboard navigation.

## Tests
Invalid inputs rejected on client/server; missing provider cannot show success; spam checks; valid configured delivery path with mocked provider; bilingual labels and errors; accessibility.
