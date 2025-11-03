# DNS Configuration Guide for Quantum Gaze Email

This guide shows you exactly how to configure DNS records in Cloudflare for email functionality.

## Overview

You need to add 3 DNS TXT records to enable email sending via MailChannels.

---

## DNS Records to Add

### Record 1: SPF (Sender Policy Framework)

**Purpose**: Tells receiving mail servers that MailChannels is authorized to send email from your domain.

```
Type: TXT
Name: @ (or quantum-gaze.ca if @ is not available)
Value: v=spf1 a mx include:relay.mailchannels.net ~all
TTL: Auto (or 3600)
```

**What it does**: Authorizes MailChannels to send emails on behalf of quantum-gaze.ca

---

### Record 2: Domain Lockdown

**Purpose**: Prevents unauthorized use of MailChannels from your domain (security).

```
Type: TXT
Name: _mailchannels
Value: v=mc1 cfid=quantum-gaze-website
TTL: Auto (or 3600)
```

**What it does**: Only allows YOUR Cloudflare Pages project to send emails from this domain.

---

### Record 3: DKIM (Optional but Recommended)

**Purpose**: Email authentication and improved deliverability.

```
Type: TXT
Name: mailchannels._domainkey
Value: v=DKIM1; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9... (use MailChannels default or generate your own)
TTL: Auto (or 3600)
```

**Note**: DKIM is optional. The form will work without it, but deliverability may be slightly lower.

---

## How to Add DNS Records in Cloudflare

### Step 1: Open Cloudflare DNS Manager

1. Log into Cloudflare Dashboard
2. Select your domain: **quantum-gaze.ca**
3. Click on **DNS** in the left sidebar

### Step 2: Add Record 1 (SPF)

1. Click **Add record** button
2. Fill in:
   - **Type**: TXT
   - **Name**: @ (or leave empty for root domain)
   - **Content**: `v=spf1 a mx include:relay.mailchannels.net ~all`
   - **TTL**: Auto
3. Click **Save**

### Step 3: Add Record 2 (Domain Lockdown)

1. Click **Add record** button again
2. Fill in:
   - **Type**: TXT
   - **Name**: _mailchannels
   - **Content**: `v=mc1 cfid=quantum-gaze-website`
   - **TTL**: Auto
3. Click **Save**

### Step 4: Add Record 3 (DKIM - Optional)

1. Click **Add record** button again
2. Fill in:
   - **Type**: TXT
   - **Name**: mailchannels._domainkey
   - **Content**: (Use MailChannels default or your own DKIM key)
   - **TTL**: Auto
3. Click **Save**

---

## Verification

After adding the records, verify they're working:

### Method 1: Using nslookup (Windows)

```bash
# Check SPF
nslookup -type=TXT quantum-gaze.ca

# Check Domain Lockdown
nslookup -type=TXT _mailchannels.quantum-gaze.ca

# Check DKIM
nslookup -type=TXT mailchannels._domainkey.quantum-gaze.ca
```

### Method 2: Online DNS Checker

Visit: https://mxtoolbox.com/SuperTool.aspx

**Check SPF:**
- Enter: `quantum-gaze.ca`
- Select: "TXT Lookup"
- Should see: `v=spf1 a mx include:relay.mailchannels.net ~all`

**Check Domain Lockdown:**
- Enter: `_mailchannels.quantum-gaze.ca`
- Select: "TXT Lookup"
- Should see: `v=mc1 cfid=quantum-gaze-website`

---

## Propagation Time

- DNS changes typically propagate within **5-10 minutes**
- Can take up to **24 hours** in rare cases
- Cloudflare is usually very fast (< 5 minutes)

---

## Testing Email After DNS Setup

Once DNS records are added and propagated:

1. **Wait 5-10 minutes** for propagation
2. **Test the contact form** on your website
3. **Check your email** (both notification and auto-reply)
4. If emails don't arrive, check:
   - DNS records are correct (use verification above)
   - Spam/junk folder
   - Cloudflare Pages Function logs

---

## Troubleshooting

### Emails Not Sending

**Problem**: Form submits successfully but no emails received

**Solutions**:
1. Verify DNS records are added correctly
2. Wait 10-15 minutes for DNS propagation
3. Check spam/junk folder
4. Verify environment variable `RECAPTCHA_SECRET_KEY` is set in Cloudflare
5. Check MailChannels API status: https://status.mailchannels.com/

### SPF Record Already Exists

**Problem**: You already have an SPF record

**Solution**: Merge the records. SPF records must be combined, not duplicated.

**Example:**
- Existing: `v=spf1 include:_spf.google.com ~all`
- New merged: `v=spf1 a mx include:_spf.google.com include:relay.mailchannels.net ~all`

### DNS Changes Not Visible

**Problem**: nslookup doesn't show new records

**Solutions**:
1. Clear DNS cache: `ipconfig /flushdns` (Windows)
2. Wait a few more minutes
3. Check you added records to the correct domain
4. Try different DNS checker (Google DNS: 8.8.8.8)

---

## Summary

**Required Records** (must add):
- ✅ SPF record (@ or root)
- ✅ Domain lockdown (_mailchannels)

**Optional Records** (recommended):
- ⚠️ DKIM (mailchannels._domainkey)

**After Adding:**
1. Wait 5-10 minutes
2. Verify with nslookup or online tool
3. Test contact form
4. Check email inbox

---

**Need Help?**
- MailChannels Docs: https://mailchannels.zendesk.com
- Cloudflare DNS Docs: https://developers.cloudflare.com/dns
- Contact: service@quantum-gaze.com

---

**Last Updated**: 2024-11-03
