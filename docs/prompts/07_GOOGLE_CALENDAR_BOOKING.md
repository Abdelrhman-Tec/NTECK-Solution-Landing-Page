# 07 — Google Calendar Appointment Schedules integration
Read `01_GLOBAL_RULES.md` first.

## Objective
Let visitors book **real** meetings using Google Calendar Appointment Schedules. Google owns availability, timezone handling, and confirmation. Do not build fake slots or fake booking success.

## Configuration
Use `NEXT_PUBLIC_GOOGLE_BOOKING_URL` (public link only, never an API key). Validate HTTPS and approved Google booking URL format; don't accept arbitrary URLs. Create `src/config/booking.ts` with disabled state when URL is absent/invalid. Document how owner creates a Google Calendar appointment schedule and obtains the public booking link; availability and supported features depend on Google account/plan.

## UI
AR heading **خلّينا نتكلم عن فكرتك.**
AR description **احجز موعد مناسب ليك علشان نفهم مشروعك ونناقش الخطوات التقنية اللي ممكن تبدأ بيها.**
AR CTA **اختار موعد الاجتماع**
EN heading **Let's Talk About Your Product.**
EN description **Book a convenient time to discuss your idea, product requirements, and potential next steps.**
EN CTA **Choose a Meeting Time**

Informational meeting interests: Startup Idea Discussion, MVP Planning, Existing Product Development. **Do not present them as bookable types** unless separate actual schedules are configured.

## Behavior
- Use official Google booking button/link by default. Embed only if Google officially supports the provided integration and it is tested; no arbitrary iframe assumption.
- If no URL configured, show a truthful contact alternative, not an inert booking button.
- Use safe external links and accessible labels.
- Avoid fixed Cairo UTC offsets; provider handles Egypt/Saudi time zones and DST.
- No custom Calendar API/OAuth unless truly required.

## Tests
Configured link shown; invalid link rejected; absent link falls back; both languages work; no fictitious time slots/confirmation.
