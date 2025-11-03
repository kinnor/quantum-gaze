# Contact Form Email Setup Guide

This guide explains how to configure email sending for the contact form using Cloudflare Pages Functions and MailChannels.

## Overview

The contact form now uses:
- **Cloudflare Pages Functions** - Serverless function at `/functions/api/contact.js`
- **MailChannels API** - Free email sending service for Cloudflare Workers/Pages
- **DKIM Authentication** - Email authentication for better deliverability

## Setup Steps

### 1. DNS Configuration (Required)

You need to add DNS records to your domain for email authentication:

#### SPF Record
Add a TXT record to your domain:
```
Type: TXT
Name: @ (or your root domain)
Value: v=spf1 a mx include:relay.mailchannels.net ~all
```

#### DKIM Records
Add these TXT records for DKIM signing:

**Record 1:**
```
Type: TXT
Name: mailchannels._domainkey
Value: v=DKIM1; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDptVdUmEKnbr8KLcVxJ0LlLr+qJ4yD5nDx5R1VKxKoN4Mz9RJg9kP7xM9qLfxM5vHKxN8wKJqZxN8qLfxM5vHKxN8wKJqZxN8qLfxM5vHKxN8wKJqZxN8qLfxM5vHKxN8wKJqZxN8qLfxM5vHKxN8wKJqZxN8qLfxM5vHKxN8wKJqZxN8qLfxM5vHKxN8wKJqZQIDAQAB
```

**Record 2 (Domain Lockdown):**
```
Type: TXT
Name: _mailchannels
Value: v=mc1 cfid=quantum-gaze-website
```

This prevents unauthorized use of MailChannels from your domain.

### 2. Cloudflare Pages Environment Variables (Optional)

While not required for basic functionality, you can add environment variables in Cloudflare Dashboard:

1. Go to your Cloudflare Pages project
2. Navigate to **Settings** > **Environment Variables**
3. Add the following (if using custom DKIM):
   - `DKIM_PRIVATE_KEY` - Your DKIM private key (optional)

### 3. Deploy to Cloudflare Pages

The contact form will work once deployed to Cloudflare Pages:

```bash
cd "D:\Data Files\Project\web-quantum-gaze\GitHub\quantum-gaze"

# Commit the changes
git add .
git commit -m "Add email functionality to contact form"
git push

# Or deploy directly with Wrangler
wrangler pages publish . --project-name=quantum-gaze
```

### 4. Test the Contact Form

Once deployed:

1. Visit your contact page: `https://your-domain.com/contact.html`
2. Fill out the form
3. Submit and check for success message
4. Check `service@quantum-gaze.com` for the email

## How It Works

### Flow Diagram

```
User fills form → Submit → JavaScript (main.js)
                              ↓
                    POST /api/contact (JSON)
                              ↓
              Cloudflare Pages Function (contact.js)
                              ↓
                    Validate form data
                              ↓
                Format HTML email template
                              ↓
              Send via MailChannels API
                              ↓
                    Return success/error
                              ↓
              Display message to user
```

### Files Involved

1. **`contact.html`** - Contact form HTML
2. **`js/main.js`** - Form submission handler (JavaScript)
3. **`functions/api/contact.js`** - Cloudflare Pages Function (serverless)
4. **MailChannels API** - Third-party email service

## Testing Locally

To test locally with Cloudflare Pages Functions:

```bash
# Install Wrangler if not already installed
npm install -g wrangler

# Start local development server
wrangler pages dev . --port 8788

# Visit http://localhost:8788/contact.html
```

**Note:** Local testing will try to send real emails if configured correctly.

## Email Template

The email sent to `service@quantum-gaze.com` includes:

- **Sender Name**: First Name + Last Name
- **Sender Email**: User's email address (clickable mailto link)
- **Message**: User's message with proper formatting
- **Branding**: Quantum Gaze header and footer styling

### Sample Email

```
Subject: New Contact Form Submission from John Doe

From: Quantum Gaze Website <noreply@quantum-gaze.ca>
To: service@quantum-gaze.com

[Formatted HTML email with:
- Quantum Gaze branded header
- Contact details (name, email)
- Message content
- Footer with company info]
```

## Troubleshooting

### Email Not Sending

1. **Check DNS Records**: Verify SPF and DKIM records are properly configured
   ```bash
   nslookup -type=TXT quantum-gaze.ca
   nslookup -type=TXT mailchannels._domainkey.quantum-gaze.ca
   ```

2. **Check Browser Console**: Look for JavaScript errors
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

3. **Check Function Logs**: In Cloudflare Dashboard
   - Go to Pages project > Functions
   - View real-time logs

4. **Verify Function Deployment**:
   - Ensure `/functions/api/contact.js` exists in deployed version
   - Check Cloudflare Pages Functions tab

### Common Errors

#### "Failed to send email"
- DNS records not configured
- MailChannels API issue (check status)
- Invalid email format

#### "Network error"
- Cloudflare Pages Function not deployed
- CORS issue (function should handle this)
- User's internet connection

#### "All fields are required"
- JavaScript validation failed
- Form fields empty

## Security Considerations

### Implemented Protections

1. **Input Validation**: Server-side validation of all fields
2. **Email Format Validation**: Regex check for valid email
3. **CORS Headers**: Restricted to prevent unauthorized access
4. **Rate Limiting**: Consider adding Cloudflare rate limiting rules
5. **Sanitization**: HTML entities escaped in email content

### Recommended Additions

1. **Spam Protection**: Add reCAPTCHA or hCaptcha
2. **Rate Limiting**: Cloudflare WAF rules to prevent abuse
3. **Honeypot Field**: Hidden field to catch bots
4. **Email Verification**: Double opt-in for newsletters

## Cost

### MailChannels (Free Tier)
- ✅ **Free** for Cloudflare Workers/Pages users
- ✅ No credit card required
- ✅ Unlimited emails (fair use policy)

### Cloudflare Pages Functions
- ✅ **Free tier**: 100,000 requests/day
- ✅ More than enough for contact forms

## Alternative Solutions

If MailChannels doesn't work for you:

### 1. Cloudflare Email Routing (Recommended)
- Free email forwarding for your domain
- Requires domain on Cloudflare
- Setup: Cloudflare Dashboard > Email > Email Routing

### 2. SendGrid
- Free tier: 100 emails/day
- Requires API key
- More reliable for transactional emails

### 3. FormSpree
- Third-party form service
- Free tier: 50 submissions/month
- No backend code needed

### 4. Web3Forms
- Free tier: 250 submissions/month
- Simple API integration
- No backend required

## Support

For issues:
1. Check Cloudflare Pages Functions logs
2. Review browser console errors
3. Verify DNS configuration
4. Test with curl:
   ```bash
   curl -X POST https://your-domain.com/api/contact \
     -H "Content-Type: application/json" \
     -d '{"firstName":"Test","lastName":"User","email":"test@example.com","message":"Test message"}'
   ```

## Next Steps

After setup:
1. ✅ Configure DNS records (SPF, DKIM)
2. ✅ Deploy to Cloudflare Pages
3. ✅ Test form submission
4. ✅ Verify email receipt
5. Consider adding spam protection (reCAPTCHA)
6. Consider adding email templates for auto-reply
7. Set up email notifications (Slack, Discord, etc.)

---

**Documentation Version**: 1.0
**Last Updated**: 2024-11-03
**Contact**: service@quantum-gaze.com
