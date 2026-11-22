# Enable project inquiries

The basic site renders with inquiry submission disabled. Enable it by configuring all inquiry variables from `.env.example` in the server environment and rebuilding the site. Keep these values out of public build variables and source control.

- **Email**. Set `CONTACT_SENDER_EMAIL` to an address on a domain verified with [Resend](https://resend.com/docs/api-reference/emails/send-email), `CONTACT_RECIPIENT_EMAIL` to the approved inbox, and `EMAIL_PROVIDER_API_KEY` to a sending key. Resend acceptance confirms that the provider accepted the request for delivery. Check the inbox separately.
- **Rate limiting**. Set the [Upstash Redis REST URL and token](https://upstash.com/docs/redis/features/restapi). Use a database dedicated to this deployment so counters are independent of other environments. The endpoint allows five validated inquiries per visitor and forty overall per one-hour counter window. Storage contains expiring counters and keyed hashes of visitor IPs. If the limiter becomes unavailable, inquiry submission pauses.
- **Trusted visitor IP**. Set `INQUIRY_TRUSTED_IP_HEADER` to the header your ingress overwrites with a single verified IPv4 or IPv6 address. Verify that client-supplied values are overwritten and that traffic cannot bypass the ingress. A forwarded list or a missing address disables submission for that request.
- **Privacy**. Approve the site privacy notice and retention policy before enabling live intake. Inquiries are sent to the configured inbox through Resend, with no local database of form submissions. Confirm mailbox and provider retention settings. The form asks for consent and tells visitors to omit confidential project details.

With live configuration, verify both languages on the deployed hostname. Use an approved test inbox for a delivery check, then confirm the provider result and mailbox receipt. No external service is required to run the basic site.
