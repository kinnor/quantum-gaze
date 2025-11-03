# Contact Form Enhancements Guide

This guide covers the advanced features added to the Quantum Gaze contact form.

## Features Overview

✅ **reCAPTCHA v3** - Invisible spam protection
✅ **Auto-Reply Emails** - Multilingual confirmation emails to users
✅ **Webhook Notifications** - Real-time Slack/Discord alerts
✅ **Multilingual Templates** - Email content in EN/FR/DE

---

## 1. reCAPTCHA v3 Setup

### What is reCAPTCHA v3?

Google reCAPTCHA v3 provides invisible spam protection. It scores user interactions (0.0 to 1.0) without requiring the user to solve puzzles. Scores below 0.5 are considered suspicious.

### Setup Steps

#### Step 1: Get reCAPTCHA Keys

1. Visit [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Click **+** to create a new site
3. Configure:
   - **Label**: Quantum Gaze Contact Form
   - **reCAPTCHA type**: reCAPTCHA v3
   - **Domains**:
     - `quantum-gaze.ca`
     - `quantum-gaze.com`
     - `localhost` (for testing)
4. Accept terms and click **Submit**
5. Copy both keys:
   - **Site Key** (public - goes in frontend)
   - **Secret Key** (private - goes in Cloudflare env)

#### Step 2: Configure Frontend

Edit `js/config.js`:
```javascript
window.RECAPTCHA_SITE_KEY = 'YOUR_ACTUAL_SITE_KEY_HERE';
```

#### Step 3: Configure Backend

In Cloudflare Pages Dashboard:
1. Go to your project > **Settings** > **Environment Variables**
2. Add variable:
   - **Variable name**: `RECAPTCHA_SECRET_KEY`
   - **Value**: Your secret key
   - **Environment**: Both Production and Preview

Or for local testing, create `.env.local`:
```bash
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### Testing

1. Submit the form
2. Check browser console - should see reCAPTCHA token being generated
3. Check server logs - should see verification score
4. Try submitting rapidly - should be blocked if score < 0.5

---

## 2. Auto-Reply Emails

### What Are Auto-Reply Emails?

When users submit the contact form, they automatically receive a confirmation email in their selected language (EN/FR/DE).

### Email Content

**Subject** (English): "Thank you for contacting Quantum Gaze"
**Subject** (French): "Merci de contacter Quantum Gaze"
**Subject** (German): "Vielen Dank für Ihre Kontaktaufnahme mit Quantum Gaze"

**Content**:
- Personalized greeting with user's first name
- Confirmation that message was received
- Expected response time (24-48 hours)
- Company contact information
- Professional branding with Quantum Gaze logo style

### How It Works

1. User submits form in their preferred language
2. System sends TWO emails:
   - **Notification email** → service@quantum-gaze.com (for you)
   - **Auto-reply email** → User's email address
3. Auto-reply uses the same language as the website when submitted

### Testing

1. Submit form with your email address
2. Check your inbox for auto-reply
3. Verify it's in the correct language
4. Check service@quantum-gaze.com for notification

### Customization

To modify auto-reply templates, edit `functions/api/contact.js`:

```javascript
const EMAIL_TEMPLATES = {
    autoReply: {
        en: {
            subject: 'Your custom subject',
            greeting: (name) => `Hello ${name},`,
            body: `Your custom body HTML`,
            signature: `Your signature`
        }
        // ... fr, de
    }
}
```

---

## 3. Slack/Discord Notifications

### What Are Webhook Notifications?

Get instant notifications in Slack or Discord when someone submits the contact form.

### Slack Setup

#### Step 1: Create Slack Incoming Webhook

1. Go to your Slack workspace
2. Visit [Slack Apps](https://api.slack.com/apps)
3. Click **Create New App** > **From scratch**
4. Name: "Quantum Gaze Contact Form"
5. Select your workspace
6. Go to **Incoming Webhooks**
7. Activate **Incoming Webhooks**
8. Click **Add New Webhook to Workspace**
9. Choose channel (e.g., #customer-inquiries)
10. Copy the webhook URL

#### Step 2: Configure in Cloudflare

In Cloudflare Pages Dashboard:
1. **Settings** > **Environment Variables**
2. Add variable:
   - **Variable name**: `WEBHOOK_URL`
   - **Value**: Your Slack webhook URL
   - **Environment**: Production and Preview

### Discord Setup

#### Step 1: Create Discord Webhook

1. Open your Discord server
2. Go to **Server Settings** > **Integrations** > **Webhooks**
3. Click **New Webhook**
4. Name: "Quantum Gaze Contact"
5. Choose channel (e.g., #contact-forms)
6. **Copy Webhook URL**

#### Step 2: Configure in Cloudflare

Same as Slack - add `WEBHOOK_URL` environment variable with Discord webhook URL.

### Notification Format

```
📬 New Contact Form Submission

Name: John Doe
Email: john@example.com

Message:
I'm interested in your AI solutions for legacy system modernization...

Language: EN | Time: 2024-11-03T14:30:00.000Z
```

### Testing

1. Submit a test form
2. Check your Slack/Discord channel
3. Should receive notification within seconds

---

## 4. Multilingual Email Templates

### Supported Languages

- 🇬🇧 **English** (en)
- 🇫🇷 **French** (fr)
- 🇩🇪 **German** (de)

### How Language Detection Works

1. User selects language on website (EN/FR/DE selector)
2. Language is stored in `localStorage`
3. When form is submitted, current language is included
4. Both notification and auto-reply use that language

### Email Types by Language

#### Notification Email (to admin)
- Subject line in selected language
- Field labels in selected language
- Shows which language user selected

#### Auto-Reply Email (to user)
- Complete template in selected language
- Greeting, body, signature all translated
- Professional formatting with Quantum Gaze branding

### Adding a New Language

To add support for another language (e.g., Spanish):

1. Edit `functions/api/contact.js`
2. Add to `EMAIL_TEMPLATES`:

```javascript
const EMAIL_TEMPLATES = {
    notification: {
        // ... en, fr, de
        es: {
            subject: (name) => `Nuevo envío de formulario de ${name}`,
            header: 'Nuevo envío de formulario de contacto',
            labels: {
                name: 'Nombre',
                email: 'Correo',
                message: 'Mensaje',
                language: 'Idioma'
            }
        }
    },
    autoReply: {
        // ... en, fr, de
        es: {
            subject: 'Gracias por contactar Quantum Gaze',
            greeting: (name) => `Estimado/a ${name},`,
            body: `<p>Gracias por contactarnos...</p>`,
            signature: `<p>Saludos,<br><strong>Equipo Quantum Gaze</strong></p>`
        }
    }
};
```

3. Add language selector option in HTML
4. Update `js/translations.js` with Spanish translations

---

## Environment Variables Summary

All environment variables needed for full functionality:

| Variable | Required | Description | Where to get |
|----------|----------|-------------|--------------|
| `RECAPTCHA_SITE_KEY` | Recommended | Public reCAPTCHA key | google.com/recaptcha/admin |
| `RECAPTCHA_SECRET_KEY` | Recommended | Private reCAPTCHA key | google.com/recaptcha/admin |
| `WEBHOOK_URL` | Optional | Slack/Discord webhook | Slack/Discord settings |
| `DKIM_PRIVATE_KEY` | Optional | Email authentication | MailChannels or generate |

### Setting in Cloudflare Pages

1. Log into Cloudflare Dashboard
2. Go to **Workers & Pages**
3. Select your project (quantum-gaze)
4. Go to **Settings** > **Environment Variables**
5. Click **Add variable** for each one
6. Select **Production** and **Preview** environments
7. Click **Save**

### Setting for Local Development

Create `.env.local` (not committed to git):

```bash
RECAPTCHA_SECRET_KEY=your_secret_key
WEBHOOK_URL=your_webhook_url
DKIM_PRIVATE_KEY=your_dkim_key
```

---

## Testing All Features

### Test Checklist

- [ ] **Basic Form Submission**
  - Fill out all fields
  - Submit form
  - See success message

- [ ] **reCAPTCHA v3**
  - Check browser console for reCAPTCHA token
  - Submit form successfully
  - Try rapid submissions (should work but with lower score)

- [ ] **Notification Email**
  - Check service@quantum-gaze.com inbox
  - Verify you received notification
  - Check language matches form language

- [ ] **Auto-Reply Email**
  - Check your email inbox
  - Verify you received confirmation
  - Check language is correct (EN/FR/DE)
  - Verify personalization (your name)

- [ ] **Slack/Discord Notification**
  - Check your Slack/Discord channel
  - Verify instant notification
  - Check all details included

- [ ] **Multilingual**
  - Test in English
  - Test in French
  - Test in German
  - Verify emails match language

### Testing Commands

```bash
# Start local development server
cd "D:\Data Files\Project\web-quantum-gaze\GitHub\quantum-gaze"
wrangler pages dev . --port 8788

# Open in browser
start http://localhost:8788/contact.html

# Test API directly with curl
curl -X POST http://localhost:8788/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "your-email@example.com",
    "message": "Test message",
    "language": "en",
    "recaptchaToken": null
  }'
```

---

## Troubleshooting

### reCAPTCHA Not Working

**Issue**: Form submits but no reCAPTCHA verification

**Solutions**:
1. Check `js/config.js` has correct `RECAPTCHA_SITE_KEY`
2. Check browser console for reCAPTCHA errors
3. Verify domain is whitelisted in reCAPTCHA admin
4. Check `RECAPTCHA_SECRET_KEY` in Cloudflare env variables

### Auto-Reply Not Received

**Issue**: User doesn't receive confirmation email

**Solutions**:
1. Check spam/junk folder
2. Verify DNS records (SPF, DKIM) configured
3. Check MailChannels API status
4. Check function logs in Cloudflare

### Webhook Not Sending

**Issue**: No Slack/Discord notification

**Solutions**:
1. Verify `WEBHOOK_URL` environment variable set
2. Test webhook URL with curl:
   ```bash
   curl -X POST YOUR_WEBHOOK_URL \
     -H "Content-Type: application/json" \
     -d '{"text": "Test message"}'
   ```
3. Check webhook is active in Slack/Discord
4. Check function logs

### Wrong Language in Emails

**Issue**: Email in wrong language

**Solutions**:
1. Check language selector on page
2. Verify `language` field sent in form data
3. Check browser localStorage for saved language
4. Default is English if language not specified

---

## Cost & Limits

### reCAPTCHA v3
- ✅ **Free**: 1,000,000 assessments/month
- Sufficient for most small-medium businesses

### MailChannels
- ✅ **Free** for Cloudflare Workers/Pages users
- Fair use policy applies

### Cloudflare Pages Functions
- ✅ **Free tier**: 100,000 requests/day
- More than enough for contact forms

### Slack/Discord Webhooks
- ✅ **Free**: Unlimited messages
- Part of Slack/Discord free plans

### Total Cost
**$0/month** for typical usage!

---

## Security Best Practices

1. **Never commit secrets** to git
   - Use `.env.local` for local development
   - Use Cloudflare environment variables for production
   - `.env.example` shows what variables are needed

2. **Validate all inputs** server-side
   - Already implemented in `contact.js`
   - Email format validation
   - Required field validation

3. **Use reCAPTCHA** to prevent spam
   - Score-based filtering (< 0.5 rejected)
   - Invisible to legitimate users

4. **Rate limiting** (optional enhancement)
   - Add Cloudflare WAF rules
   - Limit to 10 submissions per IP per hour

5. **Monitor for abuse**
   - Check Cloudflare analytics
   - Review webhook notifications
   - Monitor email delivery rates

---

## Support & Resources

- **reCAPTCHA**: https://developers.google.com/recaptcha
- **MailChannels**: https://mailchannels.zendesk.com
- **Slack Webhooks**: https://api.slack.com/messaging/webhooks
- **Discord Webhooks**: https://discord.com/developers/docs/resources/webhook
- **Cloudflare Pages**: https://developers.cloudflare.com/pages

---

**Last Updated**: 2024-11-03
**Contact**: service@quantum-gaze.com
