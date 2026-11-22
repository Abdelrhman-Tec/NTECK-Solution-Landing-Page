# 09 — Social contacts, footer, and official payment marks
Read `01_GLOBAL_RULES.md` first.

## Contacts
Support Facebook, WhatsApp, email. `src/config/contact.ts` with blank defaults; validate `https` Facebook URL, international E.164 WhatsApp number (generate wa.me URL), email (mailto). Hide absent channels. Optional subtle floating WhatsApp link only if configured; no unsolicited chat popup. Secure external links and accessible labels.

## Payment methods
InstaPay, Visa, Mastercard, Vodafone Cash, Fawry. Store in `src/config/payments.ts` as typed objects `{id,label,logoPath,enabled}` with **enabled:false for all initially**. Only render methods owner explicitly verified as active. If none active, hide heading and entire payment area. Do not imply payment acceptance from displaying logos. No fake checkout, no collection of payment card data. Visa/Mastercard only enabled if suitable live merchant processor supports them. For Saudi clients do not promise cross-border payment methods without verification.

## Logo integrity
Use official, legally usable company-provided or official provider logo assets. Do not generate, trace, approximate, or recolor payment brand logos. Preserve aspect ratio. If assets missing, leave the payment option disabled and document required logo assets; no broken images. Use `next/image` where suitable.

## Footer
Original NTech Labs logo, short bilingual studio description, useful nav and services links, Book Meeting, contact links, conditional active payment logos, privacy/terms, current year, optional locale switch. No fabricated office addresses.
AR description: **NTech Labs — بنساعد رواد الأعمال والشركات الناشئة يحوّلوا أفكارهم لمنتجات رقمية بحلول هندسية مدروسة.**
EN description: **NTech Labs — Thoughtful software engineering for founders, startups, and ambitious digital ideas.**

## Acceptance
Every social link correct when configured, hidden when absent; all disabled payments hidden; original brand marks only; footer works in both directions and on mobile.
