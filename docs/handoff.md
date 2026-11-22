# NTech Labs handoff

Application sections and deployment documentation are implemented. Production readiness is pending dependency installation, a full build, browser QA, and owner configuration. The repository has not been deployed.

## Architecture and entry points

| Area | Files |
| --- | --- |
| Locale routing and layout | `src/proxy.ts`, `src/i18n/`, `src/app/[locale]/layout.tsx`, and `messages/{ar,en}.json` |
| Home and navigation | `src/app/[locale]/page.tsx`, `src/components/site-header.tsx`, `src/components/site-footer.tsx`, and `src/components/marketing-sections.tsx` |
| Portfolio and assets | `src/data/projects.ts`, `src/app/[locale]/work/[slug]/page.tsx`, and `public/brand/logo.png` |
| Booking and public contact | `src/config/booking.ts`, `src/components/booking-section.tsx`, and `src/config/contact.ts` |
| Inquiry | `src/components/inquiry-form.tsx`, `src/lib/inquiry/`, and `src/app/api/inquiry/route.ts` |
| SEO and headers | `src/lib/seo.ts`, `src/app/{robots,sitemap}.ts`, and `next.config.ts` |
| Checks | `tests/unit/`, `tests/e2e/`, `playwright.config.mjs`, and [QA report](qa-report.md) |

## Implemented and pending

| Feature | Implemented | Pending configuration |
| --- | --- | --- |
| Bilingual site | Arabic default and RTL, English LTR, matching dictionaries, navigation, hero, services, audience, process, technologies, portfolio, inquiry, and footer. Original logo shown at its supplied 3:1 aspect ratio. | Verify the complete application in a browser across mobile and desktop widths. |
| Portfolio | Approved and published records only, with localized listing and detail routes. Empty state is active. | Owner approval, evidence, copy, and permission-cleared screenshots. |
| Booking | Validated Google link and localized fallback to configured contacts or the configured inquiry form. | Owner's actual public booking URL, plus verification of its availability and confirmation flow. |
| Inquiry | Localized React Hook Form/Zod implementation, server validation, honeypot, shared rate limits, and Resend acceptance checks. Production origin protects same-origin checks behind the reverse proxy. | Install React Hook Form, then configure the verified sender, recipient, key, Redis, and trusted ingress IP header. Validate delivery with permission in the intended environment. |
| Contact and payment | Validated contact links, hidden when blank. Payment marks remain hidden unless enabled, verified, and backed by valid assets. | Approved Facebook page, WhatsApp number, and email. Verify any active payment method and supply official marks. |
| SEO and legal | Localized metadata and indexing controls. Privacy and Terms are published locally as drafts and marked noindex. | Domain and hosting choice, owner review of legal identity and content, processor and mailbox retention, and public privacy contact. |

See [all pending configuration](pending-configuration.md) and [deployment instructions](../README.md#production-build-and-deployment).

## Verification and limitations

- `npm run lint`, `npm run test:unit` (13 passing), `git fsck --full`, and `git diff --check` passed. Provider tests used mocks.
- A separate Webpack test build used temporary font responses and an inquiry component fixture. It verified the two home pages and four legal pages, localized sections and internal link targets, translation parity, both logo placements, and hidden unconfigured links and payment marks.
- `npm install` and `npm audit --omit=dev` could not resolve the npm registry. The lockfile does not include the current direct inquiry and browser-test dependencies. Full TypeScript and production compilation stopped at missing React Hook Form, and Playwright could not run because its executable was unavailable.
- The local dev server could not bind to port 4173 (`EPERM`). The full form UI and hydration, keyboard navigation in a browser, responsive visual checks, live response headers, and mobile performance remain unverified. No real emails or bookings were made.

## Security and privacy before release

Keep Resend and Redis credentials in the server environment. Verify the sender domain and rate limits. Confirm the ingress overwrites the trusted IP header and the Node.js port is private on self-hosted deployments. Approve privacy and terms, then confirm configuration and provider retention match the published copy. Inspect CSP and referrer policy on the live HTTPS hostname and run the dependency audit with registry access. The baseline CSP permits inline script and styles for static Next.js rendering and UI styles.

## Possible later enhancements

Publish owner-approved case studies and a dedicated approved sharing image. If owners have recurring customer questions, agree on FAQ content and validate its keyboard behavior before adding it to the site.
