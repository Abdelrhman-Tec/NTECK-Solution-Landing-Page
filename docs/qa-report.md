# QA report

Phase 11 adds a Node.js test suite for application logic and Playwright checks against the actual localized pages. The browser suite has separate unconfigured and configured profiles. Booking navigation is intercepted by the browser fixture. The configured profile uses synthetic credentials and intercepts Resend and Redis requests. The tests do not send live mail or book meetings.

| Command | Result |
| --- | --- |
| `npm run lint` | Passed. |
| `npm run test:unit` | Passed all 12 tests. Covers locale defaults and direction, booking URLs, contact links, payment visibility rules, portfolio approval, production origin, shared inquiry validation, and server-side inquiry outcomes with mocked services. |
| `git diff --check` | Passed. |
| `npm install` | Blocked by DNS resolution of `registry.npmjs.org`. React Hook Form and Playwright remain missing. The lockfile still needs to be regenerated with both direct dependencies and Zod. |
| `npm run typecheck` | Route type generation passed. TypeScript stopped at the missing React Hook Form package. |
| `npm run test:e2e` and `QA_CONFIGURED=1 npm run test:e2e` | Both commands stopped because the Playwright executable is missing. No browser assertions ran. |
| `npm run build -- --webpack` with the test font fixture | Blocked at compilation by the missing React Hook Form package. |

The pending browser checks cover locale switching with a retained query and fragment, mobile menu focus and Escape, widths of 360, 768, and 1280 pixels, work and booking CTAs, approved project links and unknown slugs, booking link visibility, form errors and submission states, conditional footer channels and payment marks, and localized legal pages. The FAQ accordion has no implemented feature or agreed content in phases 03–10, so there is no FAQ behavior to verify.

## Re-run on a host with registry and local browser access

1. Use Node.js 24 LTS, run `npm install`, and review the resulting `package-lock.json`.
2. Install Chromium with `npx playwright install chromium`.
3. Run `npm run lint`, `npm run typecheck`, and `npm run test:unit`.
4. Run `npm run test:e2e` and `QA_CONFIGURED=1 npm run test:e2e`. The test server uses a local port and controlled font responses.
5. Run `npm run build` with access to Google Fonts for the production font fetch.

## Final handoff recheck

Phase 12 reran lint and the unit suite. All 13 tests passed, including the public-origin regression check for a reverse-proxied inquiry endpoint. An isolated Webpack test build with temporary fonts and an inquiry fixture verified six localized HTML pages, navigation targets, original logo dimensions, and hidden unconfigured integrations. The default app typecheck, build, and browser suite remain blocked by missing dependencies. The registry audit remains blocked by DNS.
