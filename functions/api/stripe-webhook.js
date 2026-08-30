/**
 * Stripe fulfillment webhook — Quant AI Pro Toolkit ($97 CAD Payment Link).
 *
 * POST /api/stripe/webhook  (configure this URL in the Stripe dashboard:
 * Developers → Webhooks → checkout.session.completed only).
 *
 * Security model (ported from the proven accordandharmony Workers pattern,
 * hardened for this SDK-free Worker):
 *  - FAIL CLOSED: no STRIPE_WEBHOOK_SECRET configured → 503, nothing processed.
 *  - Signature: HMAC-SHA256 over `${t}.${rawBody}` (Web Crypto), constant-time
 *    compare, 5-minute timestamp tolerance — the same scheme Stripe's SDK
 *    `constructEvent` implements.
 *  - Defense in depth: the session is re-fetched from the Stripe API with
 *    STRIPE_SECRET_KEY; fulfillment requires payment_status === "paid" from
 *    Stripe's own answer, never just the webhook payload.
 *  - GitHub invite success/failure is reported truthfully — a skipped or
 *    failed invite is never presented as done (manual follow-up is emailed
 *    to the owner instead).
 *
 * Secrets (wrangler secret put …): STRIPE_WEBHOOK_SECRET, STRIPE_SECRET_KEY,
 * GITHUB_FULFILLMENT_TOKEN (optional — fine-grained token, invite scope on the
 * private pro repo only).
 * Optional vars: FULFILLMENT_NOTIFY (owner email), GITHUB_PRO_REPO.
 */

const OWNER_FALLBACK = 'service@quantum-gaze.com';
const FROM_ADDRESS = 'service@quantum-gaze.com';
const DEFAULT_PRO_REPO = 'kinnor/quant-ai-pro';
const TOLERANCE_SECONDS = 300;

// ---------------------------------------------------------------- signature

function timingSafeEqualHex(aHex, bHex) {
    if (typeof aHex !== 'string' || typeof bHex !== 'string' || aHex.length !== bHex.length) return false;
    let diff = 0;
    for (let i = 0; i < aHex.length; i++) diff |= aHex.charCodeAt(i) ^ bHex.charCodeAt(i);
    return diff === 0;
}

async function verifyStripeSignature(rawBody, sigHeader, secret) {
    if (!sigHeader) return false;
    const parts = {};
    for (const item of sigHeader.split(',')) {
        const idx = item.indexOf('=');
        if (idx < 1) continue;
        const k = item.slice(0, idx).trim();
        const v = item.slice(idx + 1).trim();
        if (k === 'v1') (parts.v1 = parts.v1 || []).push(v);
        else parts[k] = v;
    }
    const timestamp = Number(parts.t);
    if (!Number.isFinite(timestamp) || !parts.v1 || parts.v1.length === 0) return false;
    if (Math.abs(Date.now() / 1000 - timestamp) > TOLERANCE_SECONDS) return false;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const mac = await crypto.subtle.sign('HMAC', key, enc.encode(`${parts.t}.${rawBody}`));
    const expected = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('');
    return parts.v1.some((sig) => timingSafeEqualHex(expected, sig));
}

// ---------------------------------------------------------------- stripe API

async function fetchVerifiedSession(sessionId, env) {
    const res = await fetch(
        `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=line_items`,
        { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } }
    );
    if (!res.ok) throw new Error(`Stripe session retrieve failed: HTTP ${res.status}`);
    return res.json();
}

// ---------------------------------------------------------------- github

async function inviteGithubCollaborator(username, env) {
    // Returns { attempted, ok, detail } — callers must report this truthfully.
    if (!env.GITHUB_FULFILLMENT_TOKEN) return { attempted: false, ok: false, detail: 'no GITHUB_FULFILLMENT_TOKEN configured' };
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37})$/.test(username)) return { attempted: false, ok: false, detail: 'invalid GitHub username format' };

    const repo = env.GITHUB_PRO_REPO || DEFAULT_PRO_REPO;
    const res = await fetch(`https://api.github.com/repos/${repo}/collaborators/${encodeURIComponent(username)}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${env.GITHUB_FULFILLMENT_TOKEN}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'QuantumGaze-Fulfillment',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permission: 'pull' }),
    });
    // 201 = invitation created, 204 = already a collaborator.
    if (res.status === 201 || res.status === 204) return { attempted: true, ok: true, detail: `HTTP ${res.status}` };
    return { attempted: true, ok: false, detail: `HTTP ${res.status}` };
}

// ---------------------------------------------------------------- email

async function sendMail(env, to, subject, html, text) {
    if (!env.EMAIL || typeof env.EMAIL.send !== 'function') throw new Error('EMAIL binding missing');
    return env.EMAIL.send({
        to,
        from: { email: FROM_ADDRESS, name: 'Quantum Gaze Software Inc.' },
        subject,
        html,
        text,
    });
}

function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function customerEmailBody({ name, github }) {
    const first = escapeHtml((name || 'there').split(' ')[0]);
    const githubBlock = github.ok
        ? `<p>We've sent a collaborator invitation to <strong>@${escapeHtml(github.username)}</strong> for the private repository. Accept it at <a href="https://github.com/notifications">github.com/notifications</a> — you'll have read access and receive updates for 12 months.</p>`
        : `<p><strong>To get your private repository access:</strong> reply to this email with your GitHub username and we'll send the invitation (includes 12 months of updates).</p>`;
    const text = github.ok
        ? `Hi ${first},\n\nThank you for your purchase — your order is confirmed.\n\nWe've invited @${github.username} to the private repository: accept at https://github.com/notifications\n\nGetting started: pip install -r requirements.txt && streamlit run dashboard.py\n\nSupport: reply to this email (answered within one business day). 14-day refund policy.\n\nQuantum Gaze Software Inc., Montréal\n\nQuant AI Pro Toolkit is an educational software-engineering product — not investment advice, and no performance is claimed.`
        : `Hi ${first},\n\nThank you for your purchase — your order is confirmed.\n\nTo get your private repository access: reply to this email with your GitHub username.\n\nGetting started: pip install -r requirements.txt && streamlit run dashboard.py\n\nSupport: reply to this email (answered within one business day). 14-day refund policy.\n\nQuantum Gaze Software Inc., Montréal\n\nQuant AI Pro Toolkit is an educational software-engineering product — not investment advice, and no performance is claimed.`;
    const html = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <h2 style="color:#0f3460">Your Quant AI Pro Toolkit — access inside</h2>
  <p>Hi ${first},</p>
  <p>Thank you for your purchase — your order is confirmed.</p>
  ${githubBlock}
  <p><strong>Getting started (5 minutes):</strong></p>
  <pre style="background:#f4f4f8;padding:12px;border-radius:6px">pip install -r requirements.txt
streamlit run dashboard.py</pre>
  <p><strong>Support:</strong> just reply to this email — it reaches a human at Quantum Gaze Software Inc. (Montréal). We answer within one business day. 14-day refund policy, no questions asked.</p>
  <p>Bien cordialement / Best regards,<br><strong>Quantum Gaze Software Inc.</strong> · Montréal, QC · quantum-gaze.com</p>
  <hr style="border:none;border-top:1px solid #ddd">
  <p style="font-size:12px;color:#666"><em>Quant AI Pro Toolkit is an educational software-engineering product. It is not investment advice, a trading system, or a financial service, and no performance is claimed or implied. Quantum Gaze Software Inc. is not a registered dealer or adviser.</em></p>
</div>`;
    return { html, text };
}

function ownerEmailBody(report) {
    const rows = Object.entries(report)
        .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${escapeHtml(k)}</td><td style="padding:4px 0"><strong>${escapeHtml(typeof v === 'object' ? JSON.stringify(v) : v)}</strong></td></tr>`)
        .join('');
    return {
        html: `<div style="font-family:Arial,sans-serif;max-width:600px"><h2>Quant AI Pro — order received</h2><table>${rows}</table></div>`,
        text: Object.entries(report).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`).join('\n'),
    };
}

// ---------------------------------------------------------------- handler

export async function onRequestPost(context) {
    const { request, env } = context;
    const json = (obj, status) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

    // FAIL CLOSED — never process unverifiable events.
    if (!env.STRIPE_WEBHOOK_SECRET || !env.STRIPE_SECRET_KEY) {
        return json({ received: false, error: 'Webhook not configured' }, 503);
    }

    const rawBody = await request.text();
    const verified = await verifyStripeSignature(rawBody, request.headers.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET);
    if (!verified) return json({ received: false, error: 'Invalid signature' }, 400);

    let event;
    try {
        event = JSON.parse(rawBody);
    } catch {
        return json({ received: false, error: 'Invalid payload' }, 400);
    }

    // Only fulfillment events; acknowledge everything else so Stripe stops retrying.
    if (event.type !== 'checkout.session.completed') return json({ received: true, ignored: event.type }, 200);

    // From here on we return 200 even if fulfillment hits an internal error —
    // the event is authentic, and endless Stripe retries would only duplicate
    // customer emails. Failures are surfaced to the owner instead.
    try {
        // Defense in depth: trust Stripe's API answer, not the posted payload.
        const session = await fetchVerifiedSession(event.data?.object?.id, env);
        if (session.payment_status !== 'paid') {
            return json({ received: true, fulfilled: false, reason: `payment_status=${session.payment_status}` }, 200);
        }

        const customerEmail = session.customer_details?.email || session.customer_email;
        const customerName = session.customer_details?.name || '';
        const amount = `${((session.amount_total ?? 0) / 100).toFixed(2)} ${String(session.currency || '').toUpperCase()}`;
        const githubUsername =
            session.metadata?.github_username ||
            (session.custom_fields || []).find((f) => /github/i.test(f.key || ''))?.text?.value ||
            '';

        // GitHub invite — outcome reported truthfully, never assumed.
        let github = { attempted: false, ok: false, detail: 'no username provided', username: githubUsername };
        if (githubUsername) {
            try {
                github = { ...(await inviteGithubCollaborator(githubUsername.trim(), env)), username: githubUsername.trim() };
            } catch (e) {
                github = { attempted: true, ok: false, detail: String(e && e.message), username: githubUsername.trim() };
            }
        }

        const report = {
            event_id: event.id,
            session_id: session.id,
            livemode: !!event.livemode,
            customer_email: customerEmail || '(none on session!)',
            customer_name: customerName,
            amount_paid: amount,
            product: session.metadata?.product_sku || (session.line_items?.data?.[0]?.description ?? 'unknown'),
            github_username: githubUsername || '(not provided)',
            github_invite: `${github.ok ? 'OK' : 'NOT DONE'} (${github.detail})`,
            manual_action: github.ok ? 'none' : 'send GitHub invite manually or await customer reply',
        };

        // Owner notification first (never lose an order), then customer welcome.
        const ownerTo = env.FULFILLMENT_NOTIFY || OWNER_FALLBACK;
        const owner = ownerEmailBody(report);
        await sendMail(env, ownerTo, `Quant AI Pro order — ${amount} — ${customerEmail || 'no email'}`, owner.html, owner.text);

        if (customerEmail) {
            const body = customerEmailBody({ name: customerName, github });
            await sendMail(env, customerEmail, 'Your Quant AI Pro Toolkit — access inside', body.html, body.text);
        }

        return json({ received: true, fulfilled: true }, 200);
    } catch (err) {
        console.error('Fulfillment error:', err && err.message);
        try {
            const ownerTo = env.FULFILLMENT_NOTIFY || OWNER_FALLBACK;
            await sendMail(env, ownerTo, 'Quant AI Pro — FULFILLMENT ERROR (manual action needed)',
                `<p>Event <strong>${escapeHtml(event.id || '?')}</strong> verified but fulfillment failed: ${escapeHtml(String(err && err.message))}. Check the Stripe dashboard and fulfill manually.</p>`,
                `Event ${event.id || '?'} verified but fulfillment failed: ${String(err && err.message)}. Fulfill manually via the Stripe dashboard.`);
        } catch { /* email also failed; wrangler tail will show the console.error */ }
        return json({ received: true, fulfilled: false }, 200);
    }
}
