# Dynamic Form Testing Checklist

## Pre-Testing Setup

- [ ] Environment variable `HUBSPOT_ACCESS_TOKEN` is set
- [ ] reCAPTCHA keys are configured (or using defaults)
- [ ] HubSpot Portal ID and Form GUID are correct
- [ ] `/api/hubspot-token.js` endpoint is deployed
- [ ] All files created:
  - [ ] `data/formFields.json`
  - [ ] `js/dynamicFormHandler.js`
  - [ ] `api/hubspot-token.js`
  - [ ] `css/dynamicForm.css`
  - [ ] `index.html` updated with script/CSS links

## Form Loading & Rendering

### Desktop View (1920x1080)
- [ ] Form loads without errors
- [ ] Form fields render dynamically from JSON
- [ ] 2 fields per row layout (pairs)
- [ ] Checkbox group displays full width
- [ ] All placeholder text is visible
- [ ] Form styling matches design
- [ ] reCAPTCHA container is visible

### Mobile View (375x667)
- [ ] Form loads without errors
- [ ] 1 field per row layout
- [ ] Checkbox group displays full width
- [ ] All text is readable without horizontal scroll
- [ ] Buttons are tap-friendly (min 44x44px)
- [ ] Touch interactions work smoothly

### Tablet View (768x1024)
- [ ] Form renders correctly
- [ ] 2 fields per row layout
- [ ] All text and fields are properly sized
- [ ] No horizontal scrolling

## Field Rendering & Types

### Text Fields
- [ ] Full name field renders as text input
- [ ] Email field renders as email input
- [ ] LinkedIn URL field renders as text input
- [ ] Placeholder text displays correctly
- [ ] Focus states work (blue border)
- [ ] Typing works correctly

### Select Fields
- [ ] Career Level dropdown has all 8 options
- [ ] Specialization dropdown has all 11 options
- [ ] Industry dropdown has all 7 options
- [ ] Years of Experience dropdown has all 4 options
- [ ] Dropdown arrow is visible
- [ ] Options are selectable
- [ ] Selected value is retained

### Phone Field
- [ ] Phone field renders as tel input
- [ ] Country format suggestions work (if integrated)
- [ ] Input accepts numbers and +
- [ ] Placeholder shows formatting hint

### Checkbox Group
- [ ] "How do you see yourself contributing..." label displays
- [ ] All 5 checkbox options are visible
- [ ] Checkboxes are clickable
- [ ] Multiple selections are allowed
- [ ] Selections are retained
- [ ] Unchecking works

## Form Validation

### Required Field Validation
- [ ] Submitting empty form shows validation error
- [ ] Each required field is validated individually
- [ ] Validation errors are descriptive

### Email Validation
- [ ] Valid emails are accepted (test@example.com)
- [ ] Invalid emails are rejected (test@, test.com)
- [ ] Error message is clear

### Text Field Validation
- [ ] Fields accept text input
- [ ] No character limit issues
- [ ] Special characters are handled

### Checkbox Validation
- [ ] At least one checkbox must be selected
- [ ] Error shows if none selected
- [ ] Multiple selections work

### Phone Validation
- [ ] Phone numbers are accepted
- [ ] Format validation works (if configured)
- [ ] International numbers work

## CAPTCHA Integration

### reCAPTCHA Display
- [ ] reCAPTCHA container is visible
- [ ] "This site is protected by reCAPTCHA" text shows
- [ ] reCAPTCHA badge is visible (bottom right)

### reCAPTCHA Validation
- [ ] CAPTCHA token is generated on load
- [ ] Token is refreshed on form interaction
- [ ] Token is passed with form submission
- [ ] Form submission fails if CAPTCHA not verified
- [ ] Error message shows for CAPTCHA failure

## Form Submission

### Successful Submission
1. [ ] Fill all required fields with valid data
2. [ ] Select options from dropdowns
3. [ ] Check checkbox(es)
4. [ ] Complete CAPTCHA
5. [ ] Click "Apply to Join the Circle"
6. [ ] Loading preloader appears with spinner
7. [ ] "Submitting your request..." message shows
8. [ ] API request is sent to HubSpot
9. [ ] Success message displays
10. [ ] Form resets (fields become empty)

### Submission Data Verification
- [ ] Check HubSpot for received submission
- [ ] All field values are correct in HubSpot
- [ ] `pageUri` contains current URL
- [ ] `pageName` is "PaidHR Circle"
- [ ] Timestamp is current

### Failed Submission
- [ ] Clear error message displays
- [ ] "Sorry could not submit your request try again later.." appears
- [ ] User can retry submission
- [ ] Form data is retained after error

## Error Handling

### Validation Errors
- [ ] Missing required fields show error
- [ ] Invalid email format shows error
- [ ] No checkboxes selected shows error
- [ ] Error messages are user-friendly

### API Errors
- [ ] Network error handled gracefully
- [ ] 401 error (invalid token) handled
- [ ] 404 error (endpoint not found) handled
- [ ] Timeout errors show clear message
- [ ] Error page allows retry

### reCAPTCHA Errors
- [ ] CAPTCHA failure shows message
- [ ] User can retry CAPTCHA
- [ ] Provides clear instructions

## Browser Compatibility

### Chrome/Edge
- [ ] Form loads correctly
- [ ] All features work
- [ ] Submission successful
- [ ] No console errors

### Firefox
- [ ] Form loads correctly
- [ ] All features work
- [ ] Submission successful
- [ ] No console errors

### Safari
- [ ] Form loads correctly
- [ ] All features work
- [ ] Submission successful
- [ ] No console errors

### Mobile Browsers (iOS Safari, Chrome Mobile)
- [ ] Form loads correctly
- [ ] Touch interactions work
- [ ] Keyboard appears for text input
- [ ] Submission successful

## Performance Tests

### Form Load Time
- [ ] Initial load under 3 seconds
- [ ] Form fields visible within 2 seconds
- [ ] No layout shift after load (CLS)

### Submission Speed
- [ ] Submission completes within 5 seconds
- [ ] Preloader shows throughout
- [ ] Success message appears promptly

### Network Requests
- [ ] formFields.json loads efficiently
- [ ] API endpoint responds quickly
- [ ] HubSpot API responds within timeout

### Browser Console
- [ ] No JavaScript errors
- [ ] No console warnings
- [ ] Debug logs are present (look for `[v0]`)

## Responsive Design Tests

### Viewport Changes
- [ ] Resizing window updates layout correctly
- [ ] No layout breaks at any size
- [ ] Fields stay aligned and readable

### Orientation Change (Mobile)
- [ ] Portrait to landscape works
- [ ] Form adjusts properly
- [ ] No content is cut off

### Zoom/Scale
- [ ] 110% zoom works correctly
- [ ] 150% zoom shows scrollbar, not broken
- [ ] Touch targets remain accurate

## Data Privacy & Security

### Token Security
- [ ] Access token not visible in frontend code
- [ ] Token not logged to console
- [ ] Token retrieved from backend only
- [ ] Token never exposed in network requests

### Data Privacy
- [ ] Form data sent securely (HTTPS)
- [ ] No sensitive data logged
- [ ] Form data cleared after submission
- [ ] No data stored in localStorage

### CORS
- [ ] Requests only sent to HubSpot API
- [ ] Cross-origin requests handled properly
- [ ] No browser CORS errors

## Accessibility Tests

### Keyboard Navigation
- [ ] Tab key navigates through fields
- [ ] Shift+Tab navigates backwards
- [ ] Enter submits form
- [ ] Can interact with all form elements

### Screen Reader
- [ ] Labels are associated with inputs
- [ ] Form sections are properly labeled
- [ ] Error messages are announced
- [ ] Success messages are announced

### Color Contrast
- [ ] Text is readable on all backgrounds
- [ ] Focus states are visible
- [ ] Error messages are readable

### Semantic HTML
- [ ] Form uses proper `<form>` element
- [ ] Labels use `<label>` tags
- [ ] Buttons are `<button>` elements
- [ ] Headings use proper hierarchy

## Adding New Fields Test

1. [ ] Add new field to `data/formFields.json`
2. [ ] Save and refresh page
3. [ ] New field appears in form
4. [ ] New field is in correct position
5. [ ] New field displays correct type
6. [ ] New field accepts input
7. [ ] New field validates (if required)
8. [ ] New field is included in submission
9. [ ] New field appears in HubSpot

## Regression Tests

### After Any Changes
- [ ] Form still loads correctly
- [ ] Existing fields still work
- [ ] Submission still works
- [ ] No new console errors
- [ ] Styling is intact

### After Environment Variable Change
- [ ] Form loads and submits
- [ ] New credentials work
- [ ] Old submissions still in HubSpot

## Cross-Device Tests

### Desktop Computer
- [ ] Windows (Chrome, Edge, Firefox)
- [ ] Mac (Chrome, Safari, Firefox)
- [ ] Linux (Chrome, Firefox)

### Tablet
- [ ] iPad (Safari, Chrome)
- [ ] Android Tablet (Chrome, Firefox)

### Mobile Phone
- [ ] iPhone (Safari, Chrome)
- [ ] Android Phone (Chrome, Firefox)

## User Acceptance Tests

### Happy Path
1. [ ] User sees form with all fields
2. [ ] User fills form with valid data
3. [ ] User completes CAPTCHA
4. [ ] User clicks submit button
5. [ ] Loading state appears
6. [ ] Success message appears
7. [ ] Form is cleared
8. [ ] User can submit again

### Error Recovery
1. [ ] User doesn't fill required fields
2. [ ] User clicks submit
3. [ ] Error message appears
4. [ ] User fixes errors
5. [ ] User submits again
6. [ ] Submission succeeds

### Network Issues
1. [ ] Disconnect internet
2. [ ] Try to submit form
3. [ ] Error message appears
4. [ ] Reconnect internet
5. [ ] Retry submission
6. [ ] Submission succeeds

## Production Checklist

- [ ] All environment variables are set correctly
- [ ] SSL certificate is valid (HTTPS)
- [ ] Domain is configured correctly
- [ ] reCAPTCHA keys are valid for domain
- [ ] HubSpot settings are correct
- [ ] API endpoint is deployed
- [ ] Form has been tested in production
- [ ] Error monitoring is set up
- [ ] Analytics tracking is in place
- [ ] Backup/rollback plan is ready

## Performance Monitoring

- [ ] Set up error tracking (e.g., Sentry)
- [ ] Monitor form submission success rate
- [ ] Track average submission time
- [ ] Monitor API response times
- [ ] Track validation error rates
- [ ] Monitor reCAPTCHA failure rates

## Documentation Checklist

- [ ] DYNAMIC_FORM_README.md is complete
- [ ] ENV_SETUP.md is complete and accurate
- [ ] TESTING_CHECKLIST.md is complete
- [ ] Code comments are clear
- [ ] Error messages are helpful
- [ ] Deployment instructions are provided

---

## Sign-Off

- **Tested By**: ___________________
- **Date**: ___________________
- **Notes**: 
  ```
  
  
  ```

- **Approved for Production**: [ ] Yes [ ] No

---

**Last Updated**: February 2025
**Version**: 1.0
