# NTech Labs — AI Agent Implementation Pack

## Goal
Build a real, bilingual (Arabic RTL default / English LTR), premium dark-purple NTech Labs marketing website for startup founders and idea owners in Egypt and Saudi Arabia.

## How to run
1. Place this entire folder in the repository under `prompts/`.
2. Supply the **original approved logo** in `public/brand/` (do not regenerate it). Supply approved portfolio assets if available.
3. Open the repo in Cursor Agent or Claude Code. Ask the agent to **read `prompts/00_README.md` and `prompts/01_GLOBAL_RULES.md`**.
4. Run each phase **in numeric order**. For each phase, ask: `Read prompts/XX_NAME.md and implement it completely. Follow prompts/01_GLOBAL_RULES.md. Run the specified checks and report what changed, tests, and pending configuration. Do not start the next phase.`
5. Review the output, commit the changes, then continue to the next phase. Keep all files in the repo so the agent can refer to them.
6. Run `12_FINAL_AUDIT_AND_HANDOFF.md` at the end.

## Phase index
- 01 — Global rules and source of truth (read every time)
- 02 — Repo audit and architecture
- 03 — Foundation, design system, i18n
- 04 — Header and Hero
- 05 — Audience, services, process, why us, technologies
- 06 — Portfolio and case studies
- 07 — Google Calendar meeting booking
- 08 — Project inquiry and secure lead capture
- 09 — Contact, footer, conditional payment logos
- 10 — SEO, legal pages, performance, accessibility
- 11 — Tests and quality gates
- 12 — Final audit, deployment, handoff

## Rules
- Each phase produces actual code, not a mockup or plan alone.
- Never fabricate contact details, client work, metrics, payment acceptance, or meeting availability.
- Missing external credentials must be labeled **PENDING CONFIGURATION**; never fake success.
- No mandatory paid services or unapproved third-party subscriptions.
- Treat the included copy as a strong baseline; refine it without changing the business positioning.
