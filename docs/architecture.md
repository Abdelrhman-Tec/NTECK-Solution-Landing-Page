# NTech Labs architecture

## Repository baseline

Phase 02 started from clean `main` at `fec8f9d`, tracking `origin/main`. The repository contained the root README and the phase prompts under `docs/prompts/`. There was no application code, package manifest, lockfile, asset directory, environment configuration, CI workflow, or runnable app scripts. The local tools reported Node.js 26.0.0 and npm 11.12.1. There is no legacy compatibility constraint or scaffold repair to make before Phase 03.

## Dependencies

Use npm and commit `package-lock.json` in Phase 03. Standardize development and hosting on Node.js 24 LTS. Keep strict TypeScript enabled and use ESLint directly for the lint script. Select stable releases, validate their peer ranges without overrides, and verify the resulting graph with a clean install and production build.

| Area | Recommended versions and integration |
| --- | --- |
| App Router | Next.js 16.4.6 and a matched React/React DOM 19 pair within the framework's supported peer range. Keep `eslint-config-next` aligned with Next.js. [Next.js release metadata](https://www.npmjs.com/package/next?activeTab=versions) |
| Styling and UI | Tailwind CSS 4 and matching `@tailwindcss/postcss` 4. Use the stable shadcn CLI with the Radix component base, checked-in component source, and `lucide-react` icons. [shadcn/ui Tailwind v4 and React 19 support](https://ui.shadcn.com/docs/tailwind-v4) |
| Motion | Motion 12 for React, which supports React 18.2 and later. Use `motion/react` in interactive client components and honor reduced-motion preferences. [Motion installation](https://motion.dev/docs/react-installation) |
| Inquiry | React Hook Form 7, Zod 4, and a stable Zod 4-compatible `@hookform/resolvers` release whose peers accept the selected RHF version. Add at the inquiry phase. [Resolver documentation](https://github.com/react-hook-form/resolvers#zod) |
| Localization | next-intl 4.15.3 with its documented Next.js 16 App Router proxy and locale-layout setup. [Release metadata](https://www.npmjs.com/package/next-intl) · [routing setup](https://next-intl.dev/docs/routing/setup) |

These are dependency targets. The local npm metadata lookups returned `ENOTFOUND registry.npmjs.org`. Exact peer resolution, installation, and runtime verification remain pending registry access in Phase 03. Use a supported Node.js version on the deployment host and validate the production build in that runtime.

## Routing and rendering

- Use `src/app/[locale]/layout.tsx` as the locale root layout. Support `/ar` (Arabic, RTL) and `/en` (English, LTR), with a deterministic redirect from `/` to `/ar`. Validate supported locale params and return 404 for unknown routes. Exclude API and asset paths from locale routing.
- Keep the landing sections on the locale home route. Reserve `/[locale]/work/[slug]` for approved projects and `/[locale]/privacy` and `/[locale]/terms` for legal pages. The language switcher preserves the matching pathname, query, and section fragment where applicable.
- Keep routing, navigation, and message loading in `src/i18n/`. Store typed, namespace-aligned dictionaries in `messages/ar.json` and `messages/en.json`. Use localized metadata and the verified production origin for canonicals, alternate links, and sitemap.
- Render marketing copy, portfolio, metadata, and configuration-driven links as Server Components. Use client components for interactive navigation, required locale-switch behavior, form state, and motion. Pass each client component the translations and public configuration it needs. Use logical CSS properties, direction-aware icons, and locale-appropriate fonts.

## Inquiry, booking, and configuration

- Submit inquiries to a Node.js App Router POST handler at `/api/inquiry`. Share the Zod schema with the client and validate independently on the server. Bound request size and fields, normalize input, apply honeypot and production-safe rate limiting, and send via a configured server-side email provider. Use localized result codes and report success only after provider acceptance. If delivery or required abuse protection is unconfigured, disable submissions and show any verified contact alternatives.
- Use the public Google Calendar appointment link from `NEXT_PUBLIC_GOOGLE_BOOKING_URL`. Validate HTTPS and the supported Google booking URL format. Google handles availability, time zones, and confirmations. With an absent or invalid URL, show the booking-unavailable state and any verified contact alternative.
- Keep public site, contact, booking, and payment configuration in `src/config/{site,contact,booking,payments}.ts`. Keep email credentials and rate-limit configuration server-side and environment-specific. Document blank placeholders in `.env.example` when introduced. Start with an empty approved portfolio, hidden unconfigured contact channels, and all payment methods disabled. See [pending configuration](pending-configuration.md).

## Hosting

Deploy to a commercial-use-eligible host with a Node.js runtime supporting Next.js routing, image optimization, and the inquiry POST handler. Static export alone cannot run the proposed inquiry endpoint. In a multi-instance or serverless deployment, use shared rate-limit state or a verified equivalent at the host boundary. Confirm build-time access to font assets if using `next/font` with Google Fonts. No provider is selected. Verify commercial terms, limits, secrets management, and outbound email access before choosing a host.

The baseline site and local checks require neither credentials nor paid subscriptions. Live booking can use the [single booking page Google offers for personal accounts](https://support.google.com/calendar/answer/190998?hl=en), subject to verifying the owner's account. Live inquiry is optional configuration and requires real delivery credentials and production abuse protection. The site can run with inquiry disabled.
