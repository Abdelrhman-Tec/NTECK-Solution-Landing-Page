# 06 — Honest portfolio and case studies
Read `01_GLOBAL_RULES.md` first.

## Goal
Implement data-driven Selected Work / Portfolio, without inventing projects or results.
AR heading: **شغل حقيقي يوضح طريقة تفكيرنا وتنفيذنا.**
EN heading: **Selected Work. Real Engineering.**

## Schema
Use a typed `PortfolioProject` with `id`, `slug`, localized title/summary, category, technology list, cover image, optional gallery, localized problem/solution, optional role/contribution, optional live URL, `published`, and explicit `approvedForPublication`. Consider whether the work is a founder project, company work, or past client work and label it truthfully.

## Implementation
- `src/data/projects.ts` with **empty approved list by default**, not fictional sample projects shown publicly.
- Responsive project cards, filters only if useful, image optimization, accessible details.
- Locale-aware detail pages only for approved items; correct 404 for unknown/unpublished slugs.
- If no approved projects: honest graceful section state or omit grid; never show invented case studies, metrics, logos, or testimonials.
- Include a brief asset onboarding guide so owner can add genuine screenshots and permission-cleared case studies.

## Acceptance
No fake project is displayed; publishing requires explicit approval; valid URLs sanitized; bilingual and responsive; build passes.
