/**
 * Quantum Gaze — Worker entry (Workers static assets + API routes).
 *
 * The site is deployed as a Cloudflare Worker with static assets (wrangler.toml
 * [assets]); the Pages-only `functions/` convention is NOT executed in that mode,
 * which is why /api/contact used to 404. This module routes /api/* to the same
 * handlers and lets everything else fall through to the static assets binding.
 */
import { onRequestPost as contactPost } from '../functions/api/contact.js';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

function cors(request) {
    // Same-origin form posts; allow the two production hosts and local dev.
    const origin = request.headers.get('Origin') || '';
    const allowed = /^https:\/\/(www\.)?quantum-gaze\.(ca|com)$|^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin);
    return {
        'Access-Control-Allow-Origin': allowed ? origin : 'https://quantum-gaze.ca',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Vary': 'Origin',
    };
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        if (url.pathname.startsWith('/api/')) {
            const corsHeaders = cors(request);
            if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });

            if (url.pathname === '/api/contact') {
                if (request.method !== 'POST') {
                    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), { status: 405, headers: { ...JSON_HEADERS, ...corsHeaders } });
                }
                // Pages-Functions-style context so the existing handler works unchanged.
                const res = await contactPost({ request, env, waitUntil: (p) => ctx.waitUntil(p) });
                const h = new Headers(res.headers);
                for (const [k, v] of Object.entries(corsHeaders)) h.set(k, v);
                return new Response(res.body, { status: res.status, headers: h });
            }

            // Retired endpoints (e.g. the old /api/ai-chat proxy) are not exposed.
            return new Response(JSON.stringify({ success: false, error: 'Not found' }), { status: 404, headers: { ...JSON_HEADERS, ...corsHeaders } });
        }

        return env.ASSETS.fetch(request);
    },
};
