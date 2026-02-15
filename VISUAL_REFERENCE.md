# Visual Reference Guide

## Form Layout Overview

### Desktop View (1920px+)
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ╔═══════════════════════════════════════════════════╗  │
│  ║         Join Circle by PaidHR                     ║  │
│  ║   Step into the Circle built for HR leaders       ║  │
│  ╚═══════════════════════════════════════════════════╝  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Full Name              │  Email Address        │   │
│  ├─────────────────────────┼─────────────────────┤   │
│  │  Phone Number           │  Job Title            │   │
│  ├─────────────────────────┼─────────────────────┤   │
│  │  Company/Organization   │  LinkedIn Profile     │   │
│  ├─────────────────────────┼─────────────────────┤   │
│  │  Career Level           │  Specialization       │   │
│  ├─────────────────────────┼─────────────────────┤   │
│  │  Industry               │  Years of Experience  │   │
│  ├─────────────────────────────────────────────┤   │
│  │  How do you see yourself contributing?       │   │
│  │  ☐ Sharing expertise                         │   │
│  │  ☐ Mentoring others                         │   │
│  │  ☐ Asking questions & learning              │   │
│  │  ☐ Networking & collaborations              │   │
│  │  ☐ Others                                    │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │ [reCAPTCHA Badge]                              │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│           [ Apply to Join the Circle ]               │
│                                                       │
└─────────────────────────────────────────────────────────┘
```

### Mobile View (375px)
```
┌────────────────────────────┐
│   Join Circle by PaidHR     │
│   Step into the Circle...   │
├────────────────────────────┤
│  Full Name                 │
│  [____________]            │
│                            │
│  Email Address             │
│  [____________]            │
│                            │
│  Phone Number              │
│  [____________]            │
│                            │
│  Job Title                 │
│  [____________]            │
│                            │
│  Company/Organization      │
│  [____________]            │
│                            │
│  LinkedIn Profile          │
│  [____________]            │
│                            │
│  Career Level              │
│  [Career Level...]         │
│                            │
│  Specialization            │
│  [Specialization...]       │
│                            │
│  Industry                  │
│  [Industry...]             │
│                            │
│  Years of Experience       │
│  [0-2...]                  │
│                            │
│  How do you contribute?    │
│  ☐ Sharing expertise       │
│  ☐ Mentoring others        │
│  ☐ Asking questions        │
│  ☐ Networking              │
│  ☐ Others                  │
│                            │
│ [reCAPTCHA]                │
│                            │
│ [ Apply to Join Circle ]   │
│                            │
└────────────────────────────┘
```

---

## Form Field Types

### 1. Text Input
```
Full Name
┌────────────────────────┐
│ Full name              │
└────────────────────────┘
```

### 2. Email Input
```
Email Address
┌────────────────────────┐
│ Email Address          │
└────────────────────────┘
```

### 3. Phone Input
```
Phone Number
┌────────────────────────┐
│ +1 (555) 123-4567     │
└────────────────────────┘
```

### 4. Select Dropdown
```
Career Level
┌──────────────────────────▼┐
│ Executive                  │
│ Vice President            │
│ Director                  │
│ Senior Manager            │
│ Manager                   │
│ Individual Contributor    │
│ Consultant                │
│ Student HR                │
└────────────────────────────┘
```

### 5. Checkbox Group
```
How do you see yourself contributing?
☐ Sharing expertise
☐ Mentoring others
☐ Asking questions & learning
☐ Networking & collaborations
☐ Others
```

---

## Loading States

### Form Ready State
```
✓ All form fields displayed
✓ All inputs empty/default
✓ Submit button enabled
✓ reCAPTCHA loaded
✓ Ready for user input
```

### Form Validating State
```
User fills form →
User clicks submit →
Form checks:
  ✓ All required fields filled?
  ✓ Email format valid?
  ✓ At least one checkbox selected?
  ✓ CAPTCHA completed?
```

### Form Submitting State
```
┌─────────────────────────────────┐
│                                 │
│      ╔═════════════════╗        │
│      ║                 ║        │
│      ║    ⟳ Loading   ║        │
│      ║                 ║        │
│      ║ Submitting your ║        │
│      ║   request...    ║        │
│      ║                 ║        │
│      ╚═════════════════╝        │
│                                 │
│   Background dimmed             │
│   User input disabled           │
│                                 │
└─────────────────────────────────┘
```

### Form Success State
```
┌────────────────────────────────┐
│  Hey there!                    │
│                                │
│  Your interest has been        │
│  registered. You can expect    │
│  an email from us anytime      │
│  from now. See you on the      │
│  other side!                   │
│                                │
│  Love,                         │
│  The Circle Team 💙            │
│                                │
│  [Background Image]            │
└────────────────────────────────┘
```

### Form Error State
```
┌────────────────────────────────┐
│  ⚠ Error                       │
│                                │
│  Sorry could not submit your   │
│  request try again later..     │
│                                │
│  [ Retry ]                     │
└────────────────────────────────┘
```

---

## Spinner Animation

```
Frame 1:        Frame 2:        Frame 3:        Frame 4:
  ▀▄  ▄         ▀ ░             ░ ░              ▄ ▄▀
  ████          ░ ░             ▄ ▄░             ░ ░
  ▄▀  ▀         ░ ░             ░ ░              ▀ ▀▄
  
  (Rotates 360° continuously)
```

---

## Color Scheme

### Primary Colors
```
Brand Blue:     #004AF5    (Form accents, focus states)
Success Green:  #10B981    (Validation success)
Error Red:      #F43F5E    (Validation errors)
```

### Neutral Colors
```
Dark Gray:      #333333    (Text)
Light Gray:     #B4B4B4    (Placeholder text)
Border Gray:    #E0E0E0    (Input borders)
Background:     #FFFFFF    (Form background)
Overlay:        rgba(0,0,0,0.5)  (Loading state)
```

---

## Focus States

### Text Input Focus
```
Before Focus:
┌────────────────────────┐
│ Enter value...         │
└────────────────────────┘

After Focus:
┌════════════════════════┐  ← Border turns blue
│ Enter value...         │     Box shadow blue
└════════════════════════┘     glow appears
```

### Button Hover
```
Normal:
  [ Apply to Join the Circle ]

Hover:
  [ Apply to Join the Circle ]  ← Color slightly darker
     (cursor changes to pointer)
```

---

## Responsive Breakpoints

```
Mobile:   0px - 640px      (1 field per row)
Tablet:   641px - 1024px   (2 fields per row)
Desktop:  1025px+          (2 fields per row)
```

### Width Changes Across Devices
```
Mobile (375px):
┌──────────────┐
│ Field Width  │
└──────────────┘

Tablet (768px):
┌─────────────┬─────────────┐
│ Field Width │ Field Width │
└─────────────┴─────────────┘

Desktop (1920px):
┌─────────────────────┬─────────────────────┐
│   Field Width       │   Field Width       │
└─────────────────────┴─────────────────────┘
```

---

## Form Submission Flow Chart

```
START
  │
  ├─→ Load formFields.json
  │     └─→ Parse JSON
  │     └─→ Store in formFields array
  │
  ├─→ Render form fields
  │     ├─→ Create HTML for each field
  │     ├─→ Apply responsive classes
  │     └─→ Add validation attributes
  │
  ├─→ Setup reCAPTCHA
  │     └─→ Load reCAPTCHA script
  │     └─→ Render CAPTCHA widget
  │
  ├─→ Wait for user interaction
  │
  ├─→ User clicks Submit
  │     ├─→ Validate form locally
  │     │   ├─→ Check required fields
  │     │   ├─→ Check email format
  │     │   ├─→ Check checkboxes
  │     │   └─→ Return validation result
  │     │
  │     ├─→ If validation fails
  │     │   └─→ Show error message
  │     │   └─→ Wait for user to fix
  │     │   └─→ LOOP back to user input
  │     │
  │     ├─→ If validation passes
  │     │   └─→ Check CAPTCHA token
  │     │   └─→ If no token → Show CAPTCHA error
  │     │   └─→ If token exists → Continue
  │     │
  │     ├─→ Show loading preloader
  │     │
  │     ├─→ Collect form data
  │     │   ├─→ Get field values
  │     │   ├─→ Get selected options
  │     │   └─→ Create payload object
  │     │
  │     ├─→ Fetch access token from backend
  │     │   └─→ GET /api/hubspot-token
  │     │   └─→ Return token from env var
  │     │
  │     ├─→ Submit to HubSpot API
  │     │   ├─→ POST to api.hsforms.com
  │     │   ├─→ Include Bearer token
  │     │   ├─→ Send payload
  │     │   └─→ Wait for response
  │     │
  │     ├─→ Handle response
  │     │   ├─→ If status 200
  │     │   │   ├─→ Hide preloader
  │     │   │   ├─→ Show success message
  │     │   │   ├─→ Reset form
  │     │   │   └─→ Allow new submission
  │     │   │
  │     │   └─→ If status not 200
  │     │       ├─→ Hide preloader
  │     │       ├─→ Show error message
  │     │       ├─→ Keep form data
  │     │       └─→ Allow retry
  │
  └─→ END
```

---

## Data Flow Diagram

```
┌─────────────┐
│   Browser   │
│   (Client)  │
└──────┬──────┘
       │ 1. Fetch
       ▼
┌─────────────────────────┐
│ data/formFields.json    │
│ (Form Configuration)    │
└──────┬──────────────────┘
       │
       │ 2. Parse & Render
       ▼
┌──────────────────────────┐
│ index.html (Form UI)     │
│ - Text inputs            │
│ - Select dropdowns       │
│ - Checkboxes             │
└──────┬───────────────────┘
       │
       │ 3. User fills & submits
       ▼
┌──────────────────────────┐
│ js/dynamicFormHandler.js │
│ - Validation             │
│ - Data collection        │
│ - CAPTCHA check          │
└──────┬───────────────────┘
       │
       │ 4. Get token
       ▼
┌──────────────────────────┐
│ /api/hubspot-token       │
│ (Backend - Node.js)      │
│ - Reads env var          │
│ - Returns token          │
└──────┬───────────────────┘
       │
       │ 5. POST with token
       ▼
┌──────────────────────────┐
│ HubSpot API              │
│ api.hsforms.com          │
│ - Receives submission    │
│ - Stores contact         │
│ - Returns response       │
└──────┬───────────────────┘
       │
       │ 6. Handle response
       ▼
┌──────────────────────────┐
│ Browser                  │
│ - Show success/error     │
│ - Reset form             │
└──────────────────────────┘
```

---

## Validation States

### Before Submit
```
Full Name: [Empty]           → Valid (optional)
Email: [Empty]               → Invalid (required)
Phone: [Empty]               → Invalid (required)
Career Level: [Selected]     → Valid (required)
Contributions: [1 checked]   → Valid (required)

Result: ❌ Form not ready (missing required fields)
```

### After Valid Submit
```
Full Name: [Hassan]          → Valid ✓
Email: [test@gmail.com]      → Valid ✓
Phone: [+1234567890]         → Valid ✓
Career Level: [Executive]    → Valid ✓
Contributions: [2 checked]   → Valid ✓

Result: ✅ Ready to submit
```

### After Invalid Email
```
Email: [invalid-email]       → Invalid ✗
         └─ Error: Invalid email format

Result: ⚠ Show error, allow correction
```

---

## Keyboard Navigation

```
Tab Key Flow:
1. Full Name field
2. Email field
3. Phone field
4. Job Title field
5. Company field
6. LinkedIn URL field
7. Career Level dropdown
8. Specialization dropdown
9. Industry dropdown
10. Years of Experience dropdown
11. First checkbox
12. Second checkbox
... (other checkboxes)
13. Final checkbox
14. Submit button
15. (Cycles back to Full Name)

Shift+Tab: Reverse navigation
Enter: On submit button = submit form
Space: On checkbox = toggle checkbox
```

---

## CSS Classes Used

```
.circle-form_fields           - Main form container
.form-field-wrappper          - Field row wrapper
.field-wrapper                - Individual field
.form-input-field             - Text/email/phone input
.form-input-field.is-circle   - Circle form input
.form-input-field.is-circle-select - Select input
.circle-form_option-wrap      - Checkbox group
.circle-checkbox              - Checkbox styling
.w-checkbox                   - Webflow checkbox
.form-preloader               - Loading overlay
.preloader-content            - Loading content
.spinner                      - Loading spinner
.circle_button                - Submit button
.circle_button.is-form-long   - Long button variant
.form-success-message         - Success message
.error-message_wrap           - Error message
.circle-form_close-icon       - Close button
```

---

## Accessibility Features

```
Keyboard:  ✓ Tab navigation
           ✓ Enter to submit
           ✓ Space to toggle checkbox
           ✓ Arrow keys for select

Screen Reader: ✓ Labels associated with inputs
               ✓ Form landmarks used
               ✓ Error messages announced
               ✓ Success messages announced

Focus:     ✓ Visible focus indicators
           ✓ High contrast borders
           ✓ Clear focus order

Color:     ✓ Not color-only indication
           ✓ Error icons in addition to color
           ✓ Sufficient contrast (WCAG AA)
```

---

## Animation Timeline

```
Page Load:
0s     - Page visible
0.1s   - formFields.json loaded
0.2s   - Form fields rendered (fade-in animation)
0.3s   - reCAPTCHA loaded
0.5s   - Ready for input

Form Submission:
0s     - User clicks submit
0.1s   - Form validation runs
0.2s   - Preloader appears (fade-in)
0.3s   - API request sent
2-3s   - API response received
3.1s   - Preloader disappears (fade-out)
3.2s   - Success message appears (slide-up)
```

---

**This visual reference helps developers and designers understand the form's layout, states, and interactions.**
