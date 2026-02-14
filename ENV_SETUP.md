# Environment Setup Guide

## Overview

This guide explains how to set up all required environment variables for the dynamic form implementation.

## Required Environment Variables

### 1. HubSpot Access Token (REQUIRED)

This is the most critical variable. It's used to authenticate API requests to HubSpot.

**Variable Name**: `HUBSPOT_ACCESS_TOKEN`

**How to get it**:
1. Go to [HubSpot App Marketplace](https://app.hubspot.com/marketplace)
2. Navigate to **Private apps** (or create one if needed)
3. Create a new private app with the following scopes:
   - `crm.objects.contacts.write`
   - `forms.submissions.write`
4. Copy the **Access Token** from your private app details

**Where to add it**:

#### For Vercel Deployment
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `HUBSPOT_ACCESS_TOKEN`
   - **Value**: Your access token
   - **Scope**: Production, Preview, Development (select as needed)
4. Click **Save**
5. Redeploy your project

#### For Local Development
Create a `.env.local` file in the project root:

```
HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token_here
```

**Note**: Never commit `.env.local` to git. Add it to `.gitignore`:

```
.env.local
.env
```

### 2. reCAPTCHA Keys (OPTIONAL - but recommended)

Used for bot prevention and form validation.

**Current Configuration**:
- **Site Key**: `6Lf3L-4qAAAAAERPjdUuPVlXHxQ7pSwHaL5Zs7Jq`
- **Secret Key**: Store securely in backend only

**To update with your own keys**:

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Sign in with Google account
3. Click **Create** or select existing site
4. Choose reCAPTCHA v3
5. Add your domain: `yourdomain.com`
6. Accept terms and create

**Update in code**:
- Update Site Key in `js/dynamicFormHandler.js` (line where `grecaptcha.render()` is called)

**Backend Environment Variable** (if using secret key validation):
```
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
```

### 3. Allowed Origins (OPTIONAL - CORS)

For production security, specify which domains can make API requests.

**Variable Name**: `ALLOWED_ORIGIN`

**Default**: `*` (all origins allowed)

**For Vercel**:
```
ALLOWED_ORIGIN=https://yourdomain.com
```

## Setup Steps

### Step 1: Get HubSpot Access Token

```bash
# 1. Go to HubSpot Dashboard
# 2. Navigate to: https://app.hubspot.com/private-apps/
# 3. Create or select a private app
# 4. Get the Access Token
```

### Step 2: Add to Vercel Project

```bash
# Using Vercel CLI
vercel env add HUBSPOT_ACCESS_TOKEN
# Then paste your token when prompted

# Or via Dashboard:
# - Go to Project Settings → Environment Variables
# - Add HUBSPOT_ACCESS_TOKEN
# - Paste token value
# - Save and redeploy
```

### Step 3: Test Locally (Optional)

```bash
# 1. Create .env.local in project root
# 2. Add: HUBSPOT_ACCESS_TOKEN=your_token_here
# 3. Run local development server
npm run dev
# 4. Test form submission
```

### Step 4: Deploy and Test

```bash
# Deploy to Vercel
git push origin main

# Wait for deployment
# Test form on production URL
```

## Verifying Setup

### Check if Environment Variables are Set

**For Vercel**:
1. Go to Project Settings → Environment Variables
2. Verify `HUBSPOT_ACCESS_TOKEN` is listed
3. Verify it has correct scope (Production, etc.)

**For Local**:
1. Check `.env.local` exists in root
2. Run: `cat .env.local | grep HUBSPOT_ACCESS_TOKEN`
3. Should print: `HUBSPOT_ACCESS_TOKEN=your_token_value`

### Test API Endpoint

```bash
# Test if backend endpoint works
curl -X GET https://yourdomain.com/api/hubspot-token

# Should return:
# {"token":"your_hubspot_token_here"}
```

### Test Form Submission

1. Open form page in browser
2. Fill out all required fields
3. Complete reCAPTCHA
4. Click "Apply to Join the Circle"
5. Check:
   - Loading preloader appears
   - Form submits successfully
   - Success message displays
   - Check HubSpot for received submission

## Troubleshooting

### Error: "Access token not configured"

**Cause**: `HUBSPOT_ACCESS_TOKEN` environment variable not set

**Solution**:
1. Verify environment variable is added to Vercel
2. Check variable name is exactly: `HUBSPOT_ACCESS_TOKEN`
3. Redeploy project after adding variable
4. Check variable has correct scope (Production if on prod)

### Error: "401 Unauthorized"

**Cause**: Invalid or expired HubSpot access token

**Solution**:
1. Go to HubSpot private app settings
2. Regenerate access token
3. Update in Vercel environment variables
4. Redeploy project

### Error: "CORS error"

**Cause**: Origin not allowed to make requests

**Solution**:
1. Add `ALLOWED_ORIGIN` environment variable
2. Set to your domain: `https://yourdomain.com`
3. Or leave default `*` for all origins (less secure)
4. Redeploy project

### Error: "Form submission failed with 404"

**Cause**: Backend API endpoint not found

**Solution**:
1. Verify `/api/hubspot-token.js` exists
2. Verify API route is correctly configured
3. Check deployment logs for errors
4. Test endpoint directly: `curl https://yourdomain.com/api/hubspot-token`

### reCAPTCHA not validating

**Cause**: Outdated or incorrect site key

**Solution**:
1. Update site key in `dynamicFormHandler.js`
2. Verify site key matches your reCAPTCHA project
3. Check reCAPTCHA console for errors
4. Test with different browser/incognito mode

## Security Best Practices

### DO ✅

- Store tokens in environment variables only
- Use private environment variables for sensitive data
- Regenerate tokens periodically
- Use strong, complex access tokens
- Limit API scopes to minimum required
- Monitor API usage for suspicious activity

### DON'T ❌

- Hardcode tokens in source code
- Commit `.env.local` to git
- Share tokens via email or chat
- Use same token across multiple projects
- Expose tokens in error messages
- Log tokens to console or files

## Token Rotation

### Regular Maintenance (Monthly Recommended)

```bash
# 1. Go to HubSpot Private Apps
# 2. Select your app
# 3. Click "Refresh token"
# 4. Copy new token
# 5. Update in Vercel Environment Variables
# 6. Redeploy project
# 7. Verify everything works
```

## Additional Resources

- [HubSpot API Documentation](https://developers.hubspot.com/)
- [HubSpot Private Apps Guide](https://developers.hubspot.com/docs/api/private-apps)
- [Google reCAPTCHA v3 Guide](https://developers.google.com/recaptcha/docs/v3)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Support

If you encounter issues:

1. Check browser console for errors (F12)
2. Check Vercel deployment logs
3. Verify all environment variables are set
4. Test API endpoint manually
5. Review error messages in console logs

---

**Last Updated**: February 2025
**Version**: 1.0
