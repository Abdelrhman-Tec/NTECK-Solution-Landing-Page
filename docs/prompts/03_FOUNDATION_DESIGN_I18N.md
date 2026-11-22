# 03 — Foundation, design system, localization
Read `01_GLOBAL_RULES.md` first. Implement code, not only docs.

## Build
- Configure Next.js App Router + strict TypeScript + Tailwind CSS v4, shadcn/ui, Lucide and Motion with compatible versions.
- Locale-aware `/ar` (default) and `/en` routing using next-intl; locale switch preserving path; correct `<html lang dir>`; default root redirect or negotiation with deterministic fallback to `/ar`.
- Translation files `messages/ar.json`, `messages/en.json`; typed/organized keys for every visible string.
- Use `next/font` for appropriate Arabic/English typography; avoid layout shift.
- Implement brand CSS tokens with the exact palette in global rules, consistent spacing, typography scale, buttons, cards, focus rings, borders, and subtle gradients.
- Build base layout and reusable primitives, mobile-first; logical CSS properties for RTL.
- Integrate **actual provided logo asset** if available; otherwise use a clearly marked asset placeholder and document missing file. Never draw a replacement N logo.
- Establish config modules: `src/config/site.ts`, `contact.ts`, `booking.ts`, `payments.ts` with disabled/missing defaults.

## Acceptance
`/ar` and `/en` load with correct direction and localized labels; language switch works; responsive foundation; no hydration errors; no invented logo; lint/typecheck/build succeed where dependencies allow. Report exact commands.
