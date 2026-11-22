# Pending configuration

Every row is **PENDING CONFIGURATION**. At the Phase 02 baseline there were no owner-approved assets or integration settings in the repository.

| Item | Owner input | Behavior until configured |
| --- | --- | --- |
| Portfolio | Supply approved case studies, publication permissions, localized project facts, credits, and original cover/gallery assets. | Keep published projects empty. |
| Facebook | Verified page HTTPS URL. | Hide the link. |
| WhatsApp | Approved public number in international E.164 format. | Hide the link. |
| Public email | Approved contact address. | Hide the email link. |
| Google Calendar | Public Appointment Schedules link for `NEXT_PUBLIC_GOOGLE_BOOKING_URL`. Verify that visitors can access and use the intended schedule. | Show booking as unavailable and offer configured contacts where possible. |
| Inquiry delivery | Approved recipient, verified sender, server-only provider key, Upstash Redis, and a trusted ingress IP header. See [inquiry setup](inquiry.md) for the server environment names. | Disable submission and show available contact channels. |
| Payments | Confirm active methods and supply official, authorized marks for any enabled method. The candidate list is InstaPay, Visa, Mastercard, Vodafone Cash, and Fawry. Verify processor support for cards and any cross-border use. | Keep all methods disabled and hide the payment area. |
| Legal and business details | Confirm legal business identity and applicable jurisdiction, privacy contact, actual data processors and retention, and approved bilingual Privacy and Terms content before launch. | Flag supplied drafts for owner review. |
| Hosting and domain | Confirm a commercial-use-eligible Next.js host, production origin, and approved social preview image if available. | Wait for the verified origin before publishing production canonical URLs. |

Local development can run with integrations disabled. Keep real credentials in server-side environment settings and use only blank placeholders in committed examples.
