# SEO, legal review, and launch checks

Set `SITE_ORIGIN` to the verified HTTPS origin in the build environment. Rebuild and verify the Arabic and English canonicals, alternate language URLs, and social previews. The sitemap covers both home pages and approved case studies. Until the origin is configured, the pages declare noindex, robots.txt disallows crawling, and the sitemap is empty. Privacy and Terms remain outside the sitemap and marked noindex while they are drafts.

Review the Arabic and English privacy and terms copy with the owner before publication. Confirm the legal entity, applicable jurisdiction, privacy contact, inquiry retention in the mailbox and processor, rights request process, and approved commercial terms. Confirm the production inquiry and booking settings match the privacy notice.

## Verification

- `npm run lint` and `git diff --check` passed.
- The isolated Webpack build passed with and without a test origin, using temporary font responses and an inquiry component fixture. Static HTML checks covered bilingual document direction, a single main heading per home page, skip-link target, localized metadata, alternates, social cards, draft legal pages, sitemap, robots, and production response-header configuration.
- Contrast spot checks covered body text (18.05:1), muted text on the elevated background (7.26:1), primary buttons (6.60:1, 5.29:1 on hover), the control border on the elevated background (3.57:1), and the focus ring on the elevated background (7.90:1).
- The full project typecheck is blocked by the missing React Hook Form installation. `npm audit --omit=dev` could not reach the npm registry. Mobile performance metrics, keyboard behavior in a browser, and CSP behavior on a running deployment remain unverified.
- The baseline CSP permits inline scripts and styles for static Next.js rendering and UI styles. Production excludes unsafe-eval. Verify the CSP against a production browser session before release. The Google booking link navigates externally and inquiry delivery runs server-side.
