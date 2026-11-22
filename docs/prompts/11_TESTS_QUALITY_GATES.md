# 11 — Tests and quality gates
Read `01_GLOBAL_RULES.md` first.

## Setup
Choose compatible Vitest + React Testing Library (or equivalent) for unit/components and Playwright for E2E. Do not add unnecessary infrastructure. Mock external email and booking; do not send real messages during tests.

## Unit tests
- Zod form validation and input limits.
- Locale path/direction helpers.
- Contact URL validation and link generation.
- Google booking URL allowlist/fallback.
- Payment method enabled filtering.

## Component tests
- Locale switcher and correct direction.
- Mobile menu and keyboard interactions.
- FAQ accordion.
- Inquiry form loading/errors/success behavior.
- Conditional contact links and payment marks.

## E2E
- `/ar` and `/en` render correctly.
- Language switch retains page/section when feasible.
- Navigation/CTAs work.
- Mobile layout at 360px and 768px, no horizontal overflow.
- Portfolio only approved entries.
- Booking configured and unconfigured states.
- Invalid inquiry rejected; unconfigured delivery never shows success.
- Footer hides disabled payment logos.
- Privacy/Terms load.

## Run
Install deps, run lint, typecheck, unit tests, E2E (where browser available), and production build. Fix failures. If browser tooling unavailable, say exactly which checks were not run. Record results in `docs/qa-report.md` with command, outcome, and unresolved issues. Never fabricate green checks.
