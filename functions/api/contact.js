/**
 * Enhanced Cloudflare Pages Function for Contact Form
 * Features:
 * - reCAPTCHA v3 verification
 * - Auto-reply emails (multilingual)
 * - Slack/Discord webhook notifications
 * - Multilingual email templates
 */

// Email templates in multiple languages
const EMAIL_TEMPLATES = {
    notification: {
        en: {
            subject: (name) => `New Contact Form Submission from ${name}`,
            header: 'New Contact Form Submission',
            labels: { name: 'Name', email: 'Email', message: 'Message', language: 'Language' }
        },
        fr: {
            subject: (name) => `Nouvelle soumission du formulaire de contact de ${name}`,
            header: 'Nouvelle soumission du formulaire de contact',
            labels: { name: 'Nom', email: 'Courriel', message: 'Message', language: 'Langue' }
        },
        de: {
            subject: (name) => `Neues Kontaktformular von ${name}`,
            header: 'Neue Kontaktformular-Einreichung',
            labels: { name: 'Name', email: 'E-Mail', message: 'Nachricht', language: 'Sprache' }
        }
    },
    autoReply: {
        en: {
            subject: 'Thank you for contacting Quantum Gaze',
            greeting: (name) => `Dear ${name},`,
            body: `
                <p>Thank you for reaching out to Quantum Gaze Software Inc.</p>
                <p>We have received your message and one of our team members will get back to you within 24-48 business hours.</p>
                <p>In the meantime, feel free to explore our services and solutions on our website.</p>
            `,
            signature: `
                <p>Best regards,<br>
                <strong>Quantum Gaze Team</strong><br>
                Quebec, Canada</p>
            `
        },
        fr: {
            subject: 'Merci de contacter Quantum Gaze',
            greeting: (name) => `Cher(e) ${name},`,
            body: `
                <p>Merci de nous avoir contactés chez Logiciel Quantum Gaze Inc.</p>
                <p>Nous avons bien reçu votre message et un membre de notre équipe vous répondra dans les 24 à 48 heures ouvrables.</p>
                <p>En attendant, n'hésitez pas à explorer nos services et solutions sur notre site web.</p>
            `,
            signature: `
                <p>Cordialement,<br>
                <strong>L'équipe Quantum Gaze</strong><br>
                Québec, Canada</p>
            `
        },
        de: {
            subject: 'Vielen Dank für Ihre Kontaktaufnahme mit Quantum Gaze',
            greeting: (name) => `Sehr geehrte(r) ${name},`,
            body: `
                <p>Vielen Dank, dass Sie sich an Quantum Gaze Software Inc. gewandt haben.</p>
                <p>Wir haben Ihre Nachricht erhalten und ein Mitglied unseres Teams wird sich innerhalb von 24-48 Werktagen bei Ihnen melden.</p>
                <p>In der Zwischenzeit können Sie gerne unsere Dienstleistungen und Lösungen auf unserer Website erkunden.</p>
            `,
            signature: `
                <p>Mit freundlichen Grüßen,<br>
                <strong>Das Quantum Gaze Team</strong><br>
                Québec, Kanada</p>
            `
        }
    }
};

// Verify a reCAPTCHA token.
//  - Enterprise (preferred when RECAPTCHA_PROJECT_ID + RECAPTCHA_API_KEY are set): Assessments API,
//    site key comes from the RECAPTCHA_SITE_KEY var (public value, wrangler.toml [vars])
//  - Classic / legacy secret: siteverify with RECAPTCHA_SECRET_KEY
async function verifyRecaptcha(token, secretKey, env, request) {
    env = env || {};
    if (env.RECAPTCHA_PROJECT_ID && env.RECAPTCHA_API_KEY && env.RECAPTCHA_SITE_KEY) {
        const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${encodeURIComponent(env.RECAPTCHA_PROJECT_ID)}/assessments?key=${encodeURIComponent(env.RECAPTCHA_API_KEY)}`;
        const event = { token, siteKey: env.RECAPTCHA_SITE_KEY, expectedAction: 'contact_form' };
        // Recommended by Google for better detection (user agent + client IP from Cloudflare)
        if (request && request.headers) {
            const ua = request.headers.get('User-Agent');
            const ip = request.headers.get('CF-Connecting-IP') || (request.headers.get('X-Forwarded-For') || '').split(',')[0].trim();
            if (ua) event.userAgent = ua;
            if (ip) event.userIpAddress = ip;
        }
        const res = await fetch(url, {
            method: 'POST',
            // Referer satisfies an API key restricted to HTTP referrers (the site's own domain).
            headers: { 'Content-Type': 'application/json', 'Referer': env.RECAPTCHA_REFERER || 'https://quantum-gaze.ca/' },
            body: JSON.stringify({ event })
        });
        const a = await res.json();
        const tp = a.tokenProperties || {};
        const ok = !!tp.valid && (!tp.action || tp.action === 'contact_form');
        const score = a.riskAnalysis ? a.riskAnalysis.score : undefined;
        console.log('recaptcha enterprise assessment', JSON.stringify({ valid: tp.valid, action: tp.action, hostname: tp.hostname, invalidReason: tp.invalidReason, score, reasons: a.riskAnalysis && a.riskAnalysis.reasons, error: a.error && a.error.message }));
        return { success: ok, score: typeof score === 'number' ? score : (ok ? 1 : 0), 'error-codes': ok ? [] : [tp.invalidReason || (a.error && a.error.status) || 'assessment-failed'] };
    }

    if (!secretKey || secretKey === 'YOUR_RECAPTCHA_SECRET_KEY') {
        // Skip verification if not configured
        console.warn('reCAPTCHA not configured, skipping verification');
        return { success: true, score: 1.0 };
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`
    });

    const result = await response.json();
    // Diagnostic log (visible in `wrangler tail` / dashboard logs): never includes the secret or token.
    console.log('recaptcha siteverify', JSON.stringify({
        success: result.success,
        score: result.score,
        action: result.action,
        hostname: result.hostname,
        errors: result['error-codes'] || []
    }));
    return result;
}

// Send notification to Slack/Discord
async function sendWebhookNotification(webhookUrl, formData, language) {
    if (!webhookUrl || webhookUrl.includes('YOUR_WEBHOOK_URL')) {
        return; // Skip if not configured
    }

    const lang = language || 'en';
    const template = EMAIL_TEMPLATES.notification[lang];

    // Format for both Slack and Discord
    const message = {
        text: `📬 ${template.header}`,
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: `📬 ${template.header}`
                }
            },
            {
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*${template.labels.name}:*\n${formData.firstName} ${formData.lastName}`
                    },
                    {
                        type: 'mrkdwn',
                        text: `*${template.labels.email}:*\n${formData.email}`
                    }
                ]
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*${template.labels.message}:*\n${formData.message.substring(0, 200)}${formData.message.length > 200 ? '...' : ''}`
                }
            },
            {
                type: 'context',
                elements: [
                    {
                        type: 'mrkdwn',
                        text: `Language: ${language.toUpperCase()} | Time: ${new Date().toISOString()}`
                    }
                ]
            }
        ]
    };

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        });
    } catch (error) {
        console.error('Webhook notification failed:', error);
    }
}

// Generate notification email HTML
function generateNotificationEmail(formData, language) {
    const lang = language || 'en';
    const template = EMAIL_TEMPLATES.notification[lang];

    return {
        subject: template.subject(`${formData.firstName} ${formData.lastName}`),
        html: `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #147dbf 0%, #10b8ce 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                    .content { background: #f8f9fa; padding: 20px; border: 1px solid #e0e0e0; }
                    .field { margin-bottom: 15px; }
                    .label { font-weight: bold; color: #147dbf; }
                    .value { margin-top: 5px; padding: 10px; background: white; border-radius: 3px; }
                    .footer { background: #212121; color: white; padding: 15px; text-align: center; border-radius: 0 0 5px 5px; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>${template.header}</h2>
                    </div>
                    <div class="content">
                        <div class="field">
                            <div class="label">${template.labels.name}:</div>
                            <div class="value">${formData.firstName} ${formData.lastName}</div>
                        </div>
                        <div class="field">
                            <div class="label">${template.labels.email}:</div>
                            <div class="value"><a href="mailto:${formData.email}">${formData.email}</a></div>
                        </div>
                        <div class="field">
                            <div class="label">${template.labels.language}:</div>
                            <div class="value">${lang.toUpperCase()}</div>
                        </div>
                        <div class="field">
                            <div class="label">${template.labels.message}:</div>
                            <div class="value">${formData.message.replace(/\n/g, '<br>')}</div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This email was sent from the Quantum Gaze website contact form</p>
                        <p>© 2024 Quantum Gaze Software Inc.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
}

// Generate auto-reply email HTML
function generateAutoReplyEmail(formData, language) {
    const lang = language || 'en';
    const template = EMAIL_TEMPLATES.autoReply[lang];
    const firstName = formData.firstName;

    return {
        subject: template.subject,
        html: `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #147dbf 0%, #10b8ce 100%); color: white; padding: 30px 20px; border-radius: 5px 5px 0 0; text-align: center; }
                    .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                    .content { background: white; padding: 30px; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0; }
                    .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 5px 5px; font-size: 12px; color: #666; border: 1px solid #e0e0e0; }
                    .footer a { color: #147dbf; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">Quantum Gaze Software Inc.</div>
                        <div>AI Solutions & Legacy Modernization</div>
                    </div>
                    <div class="content">
                        ${template.greeting(firstName)}
                        ${template.body}
                        ${template.signature}
                    </div>
                    <div class="footer">
                        <p>
                            <strong>Quantum Gaze Software Inc.</strong><br>
                            Phone: <a href="tel:+14387383887">+1 438 738 3887</a><br>
                            Email: <a href="mailto:service@quantum-gaze.com">service@quantum-gaze.com</a><br>
                            Web: <a href="https://quantum-gaze.ca">quantum-gaze.ca</a>
                        </p>
                        <p style="margin-top: 15px; font-size: 11px;">
                            © 2024 Quantum Gaze Software Inc. All rights reserved.<br>
                            Quebec Business Number: 1179525945
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
}

// Plain-text fallback for HTML bodies (clients that ignore HTML; better spam scores)
function htmlToText(html) {
    return String(html)
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

// Send email — Cloudflare Email Service binding (env.EMAIL) first; legacy MailChannels only
// when an API key is explicitly configured.
async function sendEmail(from, to, subject, html, context, replyTo) {
    const env = context.env || {};
    if (env.EMAIL && typeof env.EMAIL.send === 'function') {
        const msg = {
            to,
            from: { email: from, name: 'Quantum Gaze Software Inc.' },
            subject,
            html,
            text: htmlToText(html)
        };
        if (replyTo) msg.replyTo = replyTo;
        return env.EMAIL.send(msg);
    }
    if (!env.MAILCHANNELS_API_KEY) {
        const err = new Error('No email transport configured: add the send_email binding (EMAIL) and onboard the sending domain, or set MAILCHANNELS_API_KEY');
        err.code = 'E_NO_TRANSPORT';
        throw err;
    }
    return sendEmailMailChannels(from, to, subject, html, context);
}

// Legacy transport (MailChannels now requires a paid API key)
async function sendEmailMailChannels(from, to, subject, html, context) {
    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': context.env.MAILCHANNELS_API_KEY
        },
        body: JSON.stringify({
            personalizations: [
                {
                    to: [{ email: to }],
                    dkim_domain: 'quantum-gaze.ca',
                    dkim_selector: 'mailchannels',
                    dkim_private_key: context.env.DKIM_PRIVATE_KEY || ''
                }
            ],
            from: {
                email: from,
                name: 'Quantum Gaze Software Inc.'
            },
            subject: subject,
            content: [
                {
                    type: 'text/html',
                    value: html
                }
            ]
        })
    });

    if (!response.ok) {
        throw new Error(`Email API error: ${response.status} ${await response.text()}`);
    }

    return response;
}

export async function onRequestPost(context) {
    try {
        // Parse the incoming form data
        const formData = await context.request.json();

        // Validate required fields
        const { firstName, lastName, email, message, recaptchaToken, language } = formData;

        if (!firstName || !lastName || !email || !message) {
            return new Response(JSON.stringify({
                success: false,
                error: 'All fields are required'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid email format'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Verify reCAPTCHA if token provided
        const recaptchaConfigured = (context.env.RECAPTCHA_SECRET_KEY &&
            context.env.RECAPTCHA_SECRET_KEY !== 'YOUR_RECAPTCHA_SECRET_KEY') ||
            (context.env.RECAPTCHA_PROJECT_ID && context.env.RECAPTCHA_API_KEY);

        if (!recaptchaToken) {
            if (recaptchaConfigured) {
                // reCAPTCHA is configured server-side, so a missing token is not
                // acceptable — reject instead of silently skipping verification.
                return new Response(JSON.stringify({
                    success: false,
                    error: 'reCAPTCHA verification failed. Please try again.'
                }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }
        } else {
            const recaptchaResult = await verifyRecaptcha(
                recaptchaToken,
                context.env.RECAPTCHA_SECRET_KEY,
                context.env,
                context.request
            );

            if (!recaptchaResult.success || (recaptchaResult.score && recaptchaResult.score < 0.5)) {
                return new Response(JSON.stringify({
                    success: false,
                    error: 'reCAPTCHA verification failed. Please try again.'
                }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }
        }

        // Generate notification email for admin
        const notificationEmail = generateNotificationEmail(formData, language);

        // Send notification email to admin (Reply-To = the visitor, so replying just works)
        await sendEmail(
            'noreply@quantum-gaze.ca',
            context.env.CONTACT_TO || 'service@quantum-gaze.com',
            notificationEmail.subject,
            notificationEmail.html,
            context,
            email
        );

        // Auto-reply to the visitor — best effort; the submission already reached the team
        const autoReplyEmail = generateAutoReplyEmail(formData, language);
        try {
            await sendEmail(
                'noreply@quantum-gaze.ca',
                email,
                autoReplyEmail.subject,
                autoReplyEmail.html,
                context,
                context.env.CONTACT_TO || 'service@quantum-gaze.com'
            );
        } catch (autoReplyError) {
            console.error('Auto-reply failed:', autoReplyError && autoReplyError.code, autoReplyError && autoReplyError.message);
        }

        // Webhook notification (Slack/Discord) — best effort, does not block the response
        if (context.env.WEBHOOK_URL) {
            const hook = sendWebhookNotification(context.env.WEBHOOK_URL, formData, language);
            if (typeof context.waitUntil === 'function') context.waitUntil(hook); else await hook;
        }

        // Return success response
        return new Response(JSON.stringify({
            success: true,
            message: 'Email sent successfully'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        console.error('Contact form error:', error && error.code, error && error.message);

        // Never echo provider error bodies to the client; expose only a stable code.
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to send email. Please try again later.',
            code: (error && error.code) || 'E_SEND_FAILED'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

// Handle CORS preflight requests
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
