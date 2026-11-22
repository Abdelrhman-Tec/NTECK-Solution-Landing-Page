# NTech Labs

Bilingual software engineering studio site for founders in Egypt and Saudi Arabia. The default route redirects to `/ar` (RTL). English is available at `/en` (LTR).

## Run locally

1. Use Node.js 24 LTS. With nvm, run `nvm install` once and `nvm use` from the project root.
2. Run `npm install` while the lockfile is being reconciled. Review and commit the resulting `package-lock.json`. Use `npm ci` for repeatable installs after the lockfile is synchronized.
3. Optionally copy `.env.example` to `.env.local`. Leave entries blank to review the unconfigured site.
4. Run `npm run dev` and open [localhost:3000](http://localhost:3000).
5. Run `npm run lint`, `npm run typecheck`, and `npm run test:unit`. Install Chromium using `npx playwright install chromium`, then run `npm run test:e2e` and `QA_CONFIGURED=1 npm run test:e2e`. See the [QA report](docs/qa-report.md).

## Configure the site

| Setting | What to supply |
| --- | --- |
| Domain and SEO | Set `SITE_ORIGIN` to the verified public HTTPS origin with no path. Leave it blank in previews intended to remain unindexed. See [SEO and launch checks](docs/seo-launch.md). |
| Google Calendar | Set `NEXT_PUBLIC_GOOGLE_BOOKING_URL` to the public appointment schedule URL copied from Google. Verify it in a private browser session. See [booking setup](docs/booking.md). |
| Inquiry delivery | In the server environment set `CONTACT_RECIPIENT_EMAIL`, `CONTACT_SENDER_EMAIL`, `EMAIL_PROVIDER_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `INQUIRY_TRUSTED_IP_HEADER`. Use a verified Resend sender and Redis credentials for the deployment. See [inquiry setup](docs/inquiry.md). |
| Public contact | Set the verified Facebook page URL, WhatsApp number in international E.164 format, and public email in `src/config/contact.ts`. |
| Brand and portfolio | The original logo is configured in `public/brand/logo.png`. Add only publication-approved screenshots and bilingual facts. See [brand assets](public/brand/README.md) and [portfolio onboarding](docs/portfolio.md). |
| Payments | Supply authorized provider marks under `public/payments/`. Enable only verified active methods in `src/config/payments.ts` and confirm live processor support before enabling cards. See [payment marks](public/payments/README.md). |
| Privacy and Terms | Approve the business identity, contact, privacy retention and rights, jurisdiction, and terms in both languages. The current pages are unpublished drafts for indexing purposes. |

## Production build and deployment

A compatible option is a Node.js 24 LTS server on a VPS or managed Node.js service whose plan explicitly allows commercial hosting. Confirm the provider's terms, traffic limits, and support for outgoing HTTPS and secret environment variables before choosing a plan. A Node.js deployment supports the inquiry endpoint and Next.js image optimization. [Next.js deployment guide](https://nextjs.org/docs/app/getting-started/deploying)

1. Install with `npm ci` from the synchronized lockfile. Set production configuration through the host's environment settings. Keep all credential values server-side. The build needs access to Google Fonts.
2. Run `npm run build`. Run `npm run start` under the platform's process manager. For self-hosting, run `npm run start -- --hostname 127.0.0.1 --port 3000` and put a TLS reverse proxy in front of it. Serve the built app and its `public/` assets together. [Next.js self-hosting guide](https://nextjs.org/docs/app/guides/self-hosting)
3. Point DNS at the proxy or managed host and enable HTTPS. For enabled inquiry delivery, configure the proxy to overwrite the trusted IP header with one verified address and prevent direct access to the upstream port. Keep build-time and runtime values for `SITE_ORIGIN` consistent. Rebuild after changing the public domain or Google booking URL.
4. Smoke-test `/`, `/ar`, `/en`, booking, inquiry, both legal routes, `/robots.txt`, and `/sitemap.xml`. Check the booking page publicly, confirm an authorized inquiry reaches a test inbox, check CSP in the browser, and verify payment marks remain hidden until approved.
5. Use the [handoff](docs/handoff.md) for remaining release issues and the [pending configuration list](docs/pending-configuration.md) for owner inputs.

[Architecture](docs/architecture.md) · [Implementation checklist](docs/implementation-checklist.md) · [Original prompts](docs/prompts/00_README.md)
