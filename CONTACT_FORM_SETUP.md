# Contact Form — Setup & Operations (2026-08-30)

The contact form posts JSON to `/api/contact`, handled by the Cloudflare **Worker** `quantum-gaze`
(`src/worker.js` → `functions/api/contact.js`). Mail is sent through **Cloudflare Email Service**
(Email Sending) via the `EMAIL` binding declared in `wrangler.toml`. No API keys are involved.

> History: until 2026-08-30 the site was deployed as a Worker with static assets while the API lived in the
> Pages-only `functions/` folder, which Workers never executes — `/api/contact` returned 404 ("Network error"
> in the form). The old MailChannels free transport is also discontinued. Both are fixed by the router + binding.

## Architecture

| Piece | Where | Notes |
|---|---|---|
| Router | `src/worker.js` | `/api/*` → handlers (CORS for quantum-gaze.ca/.com); everything else → static assets (`env.ASSETS`) |
| Handler | `functions/api/contact.js` | validation, reCAPTCHA v3 check, notification to the team, auto-reply to the visitor, optional webhook |
| Transport | `env.EMAIL.send()` | Cloudflare Email Sending. Legacy MailChannels only if `MAILCHANNELS_API_KEY` is set |
| Config | `wrangler.toml` | `name = "quantum-gaze"`, `main`, `[assets] run_worker_first = ["/api/*"]`, `[[send_email]] name = "EMAIL"` |
| Assets exclusions | `.assetsignore` | keeps `functions/`, `src/`, `.wrangler/`, docs, configs out of the public asset bundle |

## One-time setup (Dashboard or CLI)

1. **Onboard the sending domain — `quantum-gaze.ca`** (the `from` address is `noreply@quantum-gaze.ca`)
   - Dashboard: *Compute & AI → Email Service → Email Sending → Onboard domain → quantum-gaze.ca → Add records and onboard*
   - CLI (token needs Email Sending permissions): `npx wrangler email sending enable quantum-gaze.ca`
   - This adds SPF/DKIM records only. **Do not enable Email Routing on `quantum-gaze.com`** — that domain's inbox is on Zoho (MX/SPF/DKIM) and Routing would replace its MX records.
2. **reCAPTCHA secret** (site key is public in `js/config.js`; the secret is never committed):
   `npx wrangler secret put RECAPTCHA_SECRET_KEY --name quantum-gaze`
   When unset, verification is skipped; when set, submissions without a token are rejected (400).
3. Optional: `npx wrangler secret put WEBHOOK_URL --name quantum-gaze` (Slack/Discord), `CONTACT_TO` var to change the recipient (default `service@quantum-gaze.com`).

## Deploy

Pushes to `main` deploy via Workers Builds; `npx wrangler deploy` also works (same Worker name).

## Verify

```bash
curl -s -X POST https://quantum-gaze.ca/api/contact -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"you@example.com","message":"hello","language":"en","recaptchaToken":null}'
```

| Response | Meaning |
|---|---|
| `{"success":true}` | working |
| `code: E_RECIPIENT_NOT_ALLOWED` / `E_SENDER_NOT_VERIFIED` | sending domain not onboarded yet (step 1) |
| `400 reCAPTCHA verification failed` | secret is set and no/invalid token was sent (expected for curl; the page obtains a token) |
| `404` | the Worker router is not deployed (check `wrangler.toml` `main` and `run_worker_first`) |

Logs: Cloudflare Dashboard → Workers & Pages → quantum-gaze → Logs (observability is enabled in `wrangler.toml`).
