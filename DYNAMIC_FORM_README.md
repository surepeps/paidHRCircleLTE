# Dynamic Form Implementation Guide

## Overview

This implementation provides a complete solution for dynamically rendering and managing the "Join Circle by PaidHR" form with the following features:

- **Dynamic Form Field Rendering**: Form fields are loaded from a JSON configuration file (`data/formFields.json`)
- **Responsive Layout**: Fields are displayed 2 per row on desktop, 1 per row on mobile
- **CAPTCHA Validation**: Google reCAPTCHA v3 verification before submission
- **Processing Preloader**: Visual feedback during form submission
- **Secure API Integration**: HubSpot API submission with secure token management
- **Extensibility**: Easy to add new fields by updating the JSON file

## File Structure

```
/vercel/share/v0-project/
├── data/
│   └── formFields.json          # Form fields configuration (JSON data source)
├── js/
│   └── dynamicFormHandler.js    # Main form handler script (vanilla JS)
├── api/
│   └── hubspot-token.js         # Backend endpoint for secure token retrieval
├── index.html                    # Updated with script reference
└── DYNAMIC_FORM_README.md       # This file
```

## How It Works

### 1. Form Fields Configuration (`data/formFields.json`)

All form fields are defined in this JSON file. Each field object contains:

```json
{
  "name": "field_name",
  "label": "Field Label",
  "type": "string|enumeration",
  "fieldType": "text|select|checkbox|phonenumber",
  "placeholder": "Placeholder text",
  "required": true|false,
  "options": [],  // For select/checkbox fields
  "groupName": "contactinformation|socialmediainformation|companyinformation",
  "propertyObjectType": "CONTACT|COMPANY",
  "objectTypeId": "0-1|0-2"
}
```

### 2. Dynamic Form Handler (`js/dynamicFormHandler.js`)

The main script handles:

- **Loading Form Fields**: Fetches the JSON file on initialization
- **Rendering Fields**: Dynamically creates HTML for each field type
- **Form Validation**: Ensures all required fields are filled
- **CAPTCHA Integration**: Manages Google reCAPTCHA v3
- **Form Submission**: Collects data and sends to HubSpot API
- **User Feedback**: Shows loading preloader and success/error messages

### 3. Backend Token Endpoint (`api/hubspot-token.js`)

Provides secure access to the HubSpot API token:

- **Never exposes tokens in frontend code**
- **Retrieves token from `HUBSPOT_ACCESS_TOKEN` environment variable**
- **Should be deployed to Vercel or similar serverless platform**

### 4. Updated HTML (`index.html`)

- Includes script reference: `<script src="js/dynamicFormHandler.js"></script>`
- Form structure remains the same, fields are populated dynamically
- reCAPTCHA script already included in head

## Key Features

### Responsive Design

Fields are automatically arranged:
- **Desktop**: 2 fields per row
- **Mobile**: 1 field per row
- **Checkbox groups**: Full width

### Form Validation

- Checks all required fields are filled
- Validates email format automatically
- Ensures at least one checkbox is selected in checkbox groups

### CAPTCHA Integration

- Google reCAPTCHA v3 (invisible)
- Automatically validates before form submission
- Shows user-friendly error if CAPTCHA fails

### Loading State

- Shows processing preloader during submission
- Displays spinner and "Submitting your request..." message
- Prevents multiple submissions

### API Integration

- Submits to HubSpot with proper payload structure:
```json
{
  "fields": [
    {
      "objectTypeId": "0-1",
      "name": "field_name",
      "value": "field_value"
    }
  ],
  "context": {
    "pageUri": "https://current-page-url.com",
    "pageName": "PaidHR Circle"
  }
}
```

## Environment Setup

### 1. Set HubSpot Access Token

Add the HubSpot access token as an environment variable in your Vercel project:

```
HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token_here
```

**IMPORTANT**: Never commit this token to git. Always use environment variables.

### 2. Configure reCAPTCHA

The form currently uses these reCAPTCHA credentials:
- **Site Key**: `6Lf3L-4qAAAAAERPjdUuPVlXHxQ7pSwHaL5Zs7Jq`
- **Secret Key**: Keep secure in your backend environment

To update:
1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Create or update your site configuration
3. Update the site key in `dynamicFormHandler.js` line where `grecaptcha.render()` is called

### 3. HubSpot Configuration

Update these constants in `dynamicFormHandler.js`:

```javascript
const CONFIG = {
  hubspotPortalId: '26055346',
  hubspotFormGuid: '66851a67-87da-466c-b329-ee915bb8312f',
};
```

## How to Add New Form Fields

1. **Edit `data/formFields.json`**:
   - Add a new object to the array with the field configuration
   - Use the same structure as existing fields
   - Ensure `objectTypeId` is correct (0-1 for CONTACT, 0-2 for COMPANY)

2. **Example - Adding a new text field**:
```json
{
  "name": "new_field_name",
  "label": "New Field Label",
  "type": "string",
  "fieldType": "text",
  "placeholder": "Enter value...",
  "required": true,
  "groupName": "contactinformation",
  "propertyObjectType": "CONTACT",
  "objectTypeId": "0-1",
  "options": []
}
```

3. **The form will automatically**:
   - Load the new field
   - Render it in the form layout
   - Include it in form submission
   - Validate if required

## Form Submission Flow

```
User fills form
     ↓
Clicks "Apply to Join the Circle"
     ↓
JavaScript validates form
     ↓
CAPTCHA verification triggered
     ↓
Loading preloader shown
     ↓
Form data collected
     ↓
Access token fetched from backend
     ↓
HubSpot API submission (POST)
     ↓
Response handled (success/error)
     ↓
Success message or error message displayed
     ↓
Form reset (on success)
```

## Security Considerations

### Token Management

- ✅ **CORRECT**: Token stored in environment variable, accessed via backend API
- ❌ **INCORRECT**: Token hardcoded in JavaScript or exposed in frontend

### Form Data

- All data is validated on the frontend
- Data is submitted securely via HTTPS
- reCAPTCHA prevents automated submissions

### Cross-Origin Requests

- Backend API has proper CORS headers
- Only GET requests allowed for token endpoint
- Frontend makes authenticated requests to HubSpot

## Debugging

### Enable Console Logs

All debug information is logged with `[v0]` prefix:

```javascript
console.log('[v0] Form fields loaded:', formFields.length);
console.log('[v0] Form validation failed');
console.log('[v0] Submitting form with payload:', payload);
```

Monitor the browser console (F12) for detailed information about:
- Form initialization
- Field rendering
- Validation results
- API requests and responses

### Common Issues

**Issue**: Form fields not appearing
- Check if `data/formFields.json` exists and is valid JSON
- Check browser console for fetch errors
- Verify `.circle-form_fields` container exists in HTML

**Issue**: CAPTCHA not appearing
- Verify `https://www.google.com/recaptcha/api.js` script is loaded
- Check if site key is correct
- Check browser console for reCAPTCHA errors

**Issue**: Form submission fails
- Verify `HUBSPOT_ACCESS_TOKEN` environment variable is set
- Check if `/api/hubspot-token` endpoint responds correctly
- Verify HubSpot Portal ID and Form GUID are correct
- Check API response in browser Network tab

## Testing

### Manual Testing Checklist

- [ ] Form fields load dynamically from JSON
- [ ] Form displays 2 fields per row on desktop
- [ ] Form displays 1 field per row on mobile
- [ ] Checkbox group displays full width
- [ ] Required field validation works
- [ ] Email field validates email format
- [ ] CAPTCHA appears and validates
- [ ] Loading preloader shows during submission
- [ ] Success message displays on successful submission
- [ ] Error message displays on failed submission
- [ ] Form resets after successful submission
- [ ] New fields can be added by updating JSON

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Form fields loaded asynchronously (non-blocking)
- reCAPTCHA token cached after first validation
- Form data collected only when needed
- Minimal DOM manipulation

## Maintenance

### Updating Form Fields

1. Edit `data/formFields.json`
2. No code changes needed
3. Changes take effect after page refresh

### Updating HubSpot Configuration

1. Update constants in `dynamicFormHandler.js`
2. Update environment variable if needed
3. Test submission flow

### Monitoring

Monitor these metrics:
- Form load time
- Form validation errors
- Form submission success rate
- API response times
- CAPTCHA validation failures

## Support

For issues or questions:

1. Check the browser console for error messages (prefixed with `[v0]`)
2. Review the debugging section above
3. Verify all environment variables are set correctly
4. Test form submission manually
5. Check HubSpot portal for received submissions

## Additional Notes

- This implementation uses vanilla JavaScript (no framework dependencies)
- Compatible with existing Webflow setup
- Supports dynamic field additions without code changes
- Secure token handling via backend API
- Extensible architecture for future enhancements

---

**Last Updated**: February 2025
**Implementation Version**: 1.0
