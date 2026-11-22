# 01 — Global rules (read before EVERY phase)

## Business
NTech Labs is a founder-led software engineering studio, initially serving Egypt and Saudi Arabia. Audience: startup founders, entrepreneurs with app/platform ideas, and early-stage teams building or improving digital products. Sell outcomes and clarity, not technology buzzwords. Never portray a large team or invented company history.

Services: product discovery/technical planning; MVP development; Flutter mobile apps; custom web apps; Laravel/PHP backend and REST APIs; Filament dashboards; existing product improvement and technical consulting. Technologies may include Flutter, Dart, Laravel, PHP, MySQL, Filament, REST APIs, Next.js, TypeScript. Do not claim expertise or work not evidenced by provided materials.

## Stack (required)
Next.js App Router, React, TypeScript strict, Tailwind CSS v4, shadcn/ui with Radix primitives, Lucide React, Motion for React, React Hook Form, Zod, next-intl (or another maintained compatible approach only if justified). Prefer Server Components; client components only where needed.

## Brand
Use **only the supplied original NTech Labs logo**, unchanged and with preserved aspect ratio; do not redraw it, substitute an AI-generated icon, or claim it is present if absent. Assets in `public/brand/`. Dark-purple premium design: background #10091E; surface #1D1232; elevated #291A43; primary #6D28D9; primary hover #7C3AED; accent #A855F7; highlight #C9A7FF; text #F8F5FF; muted #B9A9CC; border #44315F. Subtle gradients/glow, restrained glass surfaces, purposeful motion, high contrast. Fonts: IBM Plex Sans Arabic or Cairo for Arabic; Inter or Plus Jakarta Sans for English.

## Localization
Arabic is default, route `/ar`, `lang=ar`, `dir=rtl`; English route `/en`, `lang=en`, `dir=ltr`. Correct CSS logical properties, mirrored directional icons, semantic locale links, translated metadata, accessible switcher that preserves current route. Use translation dictionaries; no runtime machine translation. Arabic copy: clear professional Arabic suitable for both Egypt and Saudi Arabia, not exaggerated slang.

## Integrity and security
No invented clients, testimonials, project metrics, addresses, contact details, payment processors, prices, credentials, booking slots, or legal guarantees. No fabricated success state. Secrets server-side; `.env.example` placeholders only; no card data collection. Secure form validation, anti-spam, safe external links, privacy-conscious analytics. Payment methods hidden unless explicitly active and verified. Booking availability and confirmations belong to Google Calendar.

## Quality gates
Responsive mobile-first; WCAG 2.2 AA target; semantic HTML; reduced motion; fast loading; SEO; strict TypeScript; clean reusable components; test actual behaviors. Never say tests passed unless run. Never delete existing code/assets without inspecting. Each phase: summarize changed files, commands executed, test results, blockers, and next phase.

## Operating mode
First inspect existing code. Make a short phase-specific plan, then **implement immediately**. Do not stop at planning. Ask a question only when an essential irreversible decision cannot safely be deferred; otherwise implement a disabled/configurable fallback. Do not start later phases unless needed for current phase dependencies.
