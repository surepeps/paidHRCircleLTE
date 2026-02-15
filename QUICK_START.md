# Quick Start Guide

Get the dynamic form running in 5 minutes.

## 1. Set Environment Variable (2 min)

### For Vercel

1. Go to your Vercel project → Settings → Environment Variables
2. Click "Add New"
3. Name: `HUBSPOT_ACCESS_TOKEN`
4. Value: Your HubSpot access token
5. Click Save
6. Redeploy project

### For Local Testing

1. Create `.env.local` in project root
2. Add: `HUBSPOT_ACCESS_TOKEN=your_token_here`
3. Save file

**Need a token?**
- Go to https://app.hubspot.com/private-apps/
- Create private app with `forms.submissions.write` scope
- Copy access token

## 2. Verify Files Exist (1 min)

Check these files are in your project:

```
✓ data/formFields.json
✓ js/dynamicFormHandler.js
✓ api/hubspot-token.js
✓ css/dynamicForm.css
✓ index.html (updated)
```

## 3. Test Form (2 min)

1. Open form page in browser
2. Fill out form fields (scroll to see all)
3. Complete CAPTCHA
4. Click "Apply to Join the Circle"
5. Wait for success message
6. Check HubSpot for submission

## That's It!

Your form is now live with:
- ✅ Dynamic fields from JSON
- ✅ CAPTCHA validation
- ✅ Loading preloader
- ✅ Secure HubSpot submission

---

## Troubleshooting

### Form fields not showing?
- Check browser console (F12)
- Look for `[v0]` messages
- Verify `data/formFields.json` exists

### Submission fails?
- Check if `HUBSPOT_ACCESS_TOKEN` is set
- Verify token is valid in HubSpot
- Check Network tab in DevTools

### CAPTCHA error?
- Verify reCAPTCHA script loaded (check Network tab)
- Check if site key is correct for your domain

---

## Add New Field

1. Open `data/formFields.json`
2. Add new field object before closing `]`
3. Save file
4. Refresh form page
5. New field appears automatically

**Example:**
```json
{
  "name": "company_size",
  "label": "Company Size",
  "type": "enumeration",
  "fieldType": "select",
  "placeholder": "Select size...",
  "required": true,
  "options": [
    {"label": "1-10", "value": "1-10"},
    {"label": "11-50", "value": "11-50"},
    {"label": "50+", "value": "50+"}
  ],
  "groupName": "companyinformation",
  "propertyObjectType": "COMPANY",
  "objectTypeId": "0-2"
}
```

---

## Need Help?

1. Read `DYNAMIC_FORM_README.md` - Full documentation
2. Check `ENV_SETUP.md` - Environment setup details
3. Review `TESTING_CHECKLIST.md` - Test your form
4. Check console logs with `[v0]` prefix - Debug info

---

## What's Happening

```
When user submits:
1. Form validates locally
2. CAPTCHA verifies
3. Data collected
4. Backend gets token from env var
5. Form posted to HubSpot API
6. Success/error message shown
7. Form resets on success
```

---

**Ready to go!** The form is production-ready. Deploy and start collecting signups. 🚀
