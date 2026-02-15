# Dynamic Form Implementation - Complete Guide

## Overview
The form is now fully dynamic and auto-populated from the `/data/formFields.json` file. All hardcoded form fields have been removed from the HTML, and the JavaScript now handles rendering all form fields based on the JSON configuration.

## Changes Made

### 1. Fixed JavaScript Initialization (dynamicFormHandler.js)
**Fixed the `init()` function** to properly load and render form fields:
- Now calls `loadFormFields()` to fetch form configuration from JSON
- Calls `renderFormFields()` to dynamically render all fields
- Sets up form submission, modal scroll lock, and reCAPTCHA with proper timing

### 2. Removed All Hardcoded Fields (index.html)
**Replaced ~85 lines of hardcoded form HTML** with a single container:
```html
<div class="circle-form_fields">
  <!-- Form fields will be dynamically rendered here by dynamicFormHandler.js -->
</div>
```

### 3. Field Name Mapping
All form fields now match the field names in `/data/formFields.json`:
- `full_name` - Full Name (text)
- `email` - Email Address (email) - **REQUIRED**
- `phone` - Phone Number (tel) - **REQUIRED**
- `company` - Company/Organization (text) - **REQUIRED**
- `jobtitle` - Job Title (text) - **REQUIRED**
- `hs_linkedin_url` - LinkedIn Profile (text) - **REQUIRED**
- `career_level` - Career Level (select) - **REQUIRED**
- `what_is_your_specialization_` - Specialization (select) - **REQUIRED**
- `industry` - Industry (select) - **REQUIRED**
- `years_of_experience_in_hr_` - Years of Experience (select) - **REQUIRED**
- `how_do_you_see_yourself_contributing_to_the_circle_community_` - Contributing (checkboxes) - **REQUIRED**

### 4. Field Rendering Logic
The `renderFormFields()` function:
- **Loads JSON data** with field configuration, options, and validation rules
- **Creates 2-column grid layouts** for text/select fields (desktop)
- **Creates single-column layouts** for checkbox fields (one per row)
- **Attaches required attributes** based on JSON configuration
- **Generates unique IDs** for all inputs and labels
- **Adds data attributes** for field mapping and object type tracking

### 5. Form Data Collection
The `collectFormData()` function:
- **Maps form input names** to the JSON field names (e.g., `career_level`, `email`)
- **Collects multiple checkbox values** and joins them with "; " separator
- **Extracts object type IDs** for proper HubSpot integration
- **Returns properly formatted payload** matching HubSpot API requirements

### 6. Form Submission
All field names sent to HubSpot match `/data/formFields.json`:
```json
{
  "fields": [
    {"name": "full_name", "value": "John Doe", "objectTypeId": "0-1"},
    {"name": "email", "value": "john@example.com", "objectTypeId": "0-1"},
    {"name": "phone", "value": "+1234567890", "objectTypeId": "0-1"},
    ...
  ]
}
```

## Benefits

✅ **Single Source of Truth** - All field configuration in one JSON file
✅ **Easy to Maintain** - Add/remove/modify fields by editing JSON only
✅ **Field Name Consistency** - All submissions use correct HubSpot field names
✅ **Scalable Design** - Can easily add new fields without touching HTML/JS
✅ **Validation Sync** - Required fields configured in JSON are enforced in form
✅ **Responsive Layout** - 2-col grid for desktop, 1-col for mobile

## How to Add New Fields

1. Add field configuration to `/data/formFields.json`:
```json
{
  "name": "field_name",
  "label": "Field Label",
  "type": "string",
  "fieldType": "text|select|checkbox",
  "placeholder": "Enter value",
  "required": true,
  "options": [...],  // For select/checkbox fields
  "propertyObjectType": "CONTACT|COMPANY"
}
```

2. Form will automatically:
   - Render the new field in the correct position
   - Apply validation rules
   - Include it in form submissions
   - Map it correctly to HubSpot

## How to Modify Existing Fields

1. Edit the field configuration in `/data/formFields.json`
2. Changes apply immediately on page reload:
   - Label text
   - Placeholder text
   - Required status
   - Options (for select/checkbox)
   - Field order

## Testing the Dynamic Form

1. **Open the modal** by clicking "Apply to Join the Circle"
2. **Verify all fields render** from the JSON configuration
3. **Fill in required fields** marked with asterisks
4. **Complete reCAPTCHA**
5. **Submit the form** and verify data is sent to HubSpot

## Field Order in Form

Fields render in the order they appear in `/data/formFields.json`:
1. Full Name + Email
2. Phone + Job Title
3. Company + LinkedIn
4. Career Level + Specialization
5. Industry + Years of Experience
6. Contributing (checkboxes - full width)

## Debugging

Check browser console for logs:
- `[v0] Form fields loaded: 11` - Confirms JSON loaded
- `[v0] Form fields rendered successfully` - Confirms rendering complete
- `[v0] Submitting form with payload:` - Shows data being sent

## Files Modified

- ✅ `/js/dynamicFormHandler.js` - Fixed init(), added renderFormFields()
- ✅ `/index.html` - Removed all hardcoded fields, kept container only
- ✅ `/data/formFields.json` - Contains complete field configuration

## API Integration

**Endpoint:** `https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}`

**Field Names Sent:** Match exactly with `/data/formFields.json` field `name` property

**Example Request:**
```json
{
  "fields": [
    {"name": "full_name", "value": "..."},
    {"name": "email", "value": "..."},
    {"name": "phone", "value": "..."},
    {"name": "company", "value": "..."},
    ...
  ],
  "context": {
    "pageUri": "https://example.com",
    "pageName": "PaidHR Circle"
  }
}
```
