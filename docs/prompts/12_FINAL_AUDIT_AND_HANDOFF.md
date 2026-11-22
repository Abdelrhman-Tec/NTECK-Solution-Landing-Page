# 12 — Final audit, deployment and handoff
Read `01_GLOBAL_RULES.md` first.

## Audit
Review all implemented sections and routes, verify Arabic/English parity, original logo integrity, no fake content, no broken links, booking behavior, inquiry behavior, only active payment marks, responsive layouts, accessible forms, SEO, security, performance. Verify production build and actual test results.

## Deployment
Write a step-by-step README for local development, production build, env configuration, and deployment to a provider compatible with used Next.js features and **permitted commercial use**. Do not assume any hosting free tier covers commercial usage; document plan/terms verification. Include how to configure Google Calendar Appointment Schedules public link, contact provider, actual Facebook/WhatsApp/email, official logos, portfolio entries, active payments, and domain/SEO.

## Handoff
Produce `docs/handoff.md` with:
1. Architecture and important files.
2. Implemented features vs **PENDING CONFIGURATION**.
3. Required owner inputs and logo assets.
4. Tests executed with results (no guesses).
5. Security/privacy review items.
6. Deployment readiness and known limitations.
7. Suggested next enhancements, without blocking launch.

## Final definition of done
Local dev and production build work; `/ar` RTL and `/en` LTR; approved logo displayed; all sections present; CTAs functional; secure inquiry form behaves truthfully; Google booking uses real configured page; no fictitious slots; disabled payment logos hidden; SEO, tests and docs completed or accurately marked pending. Do not declare external integrations live without credentials and real verification.
