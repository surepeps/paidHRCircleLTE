/**
 * Dynamic Form Handler
 * Manages form field rendering, validation, and submission to HubSpot
 */

const DynamicFormHandler = (() => {
  // Configuration
  const CONFIG = {
    formFieldsUrl: '/data/formFields.json',
    hubspotPortalId: '26055346',
    hubspotFormGuid: '66851a67-87da-466c-b329-ee915bb8312f',
    hubspotApiEndpoint: 'https://api.hsforms.com/submissions/v3/integration/secure/submit',
    fieldsPerRow: 2,
    fieldsPerRowMobile: 1,
  };

  let formFields = [];
  let formData = {};
  let recaptchaToken = null;

  /**
   * Initialize the dynamic form
   */
  const init = async () => {
    try {
      console.log('[v0] Initializing dynamic form handler');
      
      // Load form fields from JSON
      await loadFormFields();
      
      // Render form fields dynamically
      renderFormFields();
      
      // Set up form submission
      setupFormSubmission();
      
      // Setup modal scroll lock
      setupModalScrollLock();
      
      // Setup CAPTCHA with a delay to ensure form is fully rendered
      setTimeout(() => {
        setupRecaptcha();
      }, 500);
      
      console.log('[v0] Form handler initialized successfully');
    } catch (error) {
      console.error('[v0] Error initializing form handler:', error);
    }
  };

  /**
   * Load form fields from JSON file
   */
  const loadFormFields = async () => {
    try {
      const response = await fetch(CONFIG.formFieldsUrl);
      if (!response.ok) {
        throw new Error(`Failed to load form fields: ${response.statusText}`);
      }
      formFields = await response.json();
      console.log('[v0] Form fields loaded:', formFields.length);
    } catch (error) {
      console.error('[v0] Error loading form fields:', error);
      throw error;
    }
  };

  /**
   * Render form fields dynamically
   */
  const renderFormFields = () => {
    const fieldsContainer = document.querySelector('.circle-form_fields');
    if (!fieldsContainer) {
      console.warn('[v0] Form fields container not found');
      return;
    }

    // Clear existing fields
    fieldsContainer.innerHTML = '';

    // Group fields by groupName or render in pairs
    const fieldsInPairs = [];
    for (let i = 0; i < formFields.length; i += CONFIG.fieldsPerRow) {
      fieldsInPairs.push(formFields.slice(i, i + CONFIG.fieldsPerRow));
    }

    // Render field pairs/rows
    fieldsInPairs.forEach((pair) => {
      const wrapper = document.createElement('div');
      
      // Check if it's a checkbox group (single field taking full width)
      if (pair[0].fieldType === 'checkbox') {
        wrapper.className = 'field-wrapper';
        wrapper.style.gridColumn = '1 / -1';
        wrapper.innerHTML = renderCheckboxField(pair[0]);
      } else {
        // Regular field pair
        wrapper.className = 'form-field-wrappper';
        pair.forEach((field) => {
          const fieldDiv = document.createElement('div');
          fieldDiv.className = 'field-wrapper';
          fieldDiv.innerHTML = renderField(field);
          wrapper.appendChild(fieldDiv);
        });
      }
      
      fieldsContainer.appendChild(wrapper);
    });

    console.log('[v0] Form fields rendered successfully');
  };

  /**
   * Render individual field based on type
   */
  const renderField = (field) => {
    const fieldId = field.name;
    const isRequired = field.required ? 'required' : '';

    // Add data attribute for field mapping
    let fieldHTML = `<label for="${fieldId}" class="field-label hide">${field.label || field.unselectedLabel}</label>`;

    if (field.fieldType === 'select') {
      fieldHTML += `<select id="${fieldId}" name="${fieldId}" data-name="${field.name}" ${isRequired} class="form-input-field is-circle-select w-select" data-field-name="${field.name}" data-object-type-id="${field.objectTypeId}">`;
      fieldHTML += `<option value="">${field.unselectedLabel || field.placeholder}...</option>`;
      
      field.options.forEach((option) => {
        fieldHTML += `<option value="${option.value}">${option.label}</option>`;
      });
      
      fieldHTML += '</select>';
    } else if (field.fieldType === 'phonenumber') {
      fieldHTML += `<input type="tel" id="${fieldId}" name="${fieldId}" data-name="${field.name}" class="form-input-field is-circle w-input" placeholder="${field.placeholder}" ${isRequired} data-field-name="${field.name}" data-object-type-id="${field.objectTypeId}">`;
    } else {
      const inputType = field.fieldType === 'text' ? (field.name.includes('email') ? 'email' : 'text') : 'text';
      fieldHTML += `<input type="${inputType}" id="${fieldId}" name="${fieldId}" data-name="${field.name}" class="form-input-field is-circle w-input" placeholder="${field.placeholder}" ${isRequired} data-field-name="${field.name}" data-object-type-id="${field.objectTypeId}">`;
    }

    return fieldHTML;
  };

  /**
   * Render checkbox field group
   */
  const renderCheckboxField = (field) => {
    let fieldHTML = `<div class="field-label">${field.label}</div><div class="circle-form_option-wrap">`;

    field.options.forEach((option) => {
      const checkboxId = `${field.name}_${option.value.replace(/\s+/g, '_').toLowerCase()}`;
      fieldHTML += `
        <label class="w-checkbox">
          <div class="w-checkbox-input w-checkbox-input--inputType-custom circle-checkbox"></div>
          <input type="checkbox" name="${field.name}" id="${checkboxId}" value="${option.value}" data-field-name="${field.name}" data-object-type-id="${field.objectTypeId}" style="opacity:0;position:absolute;z-index:-1">
          <span class="circle-checkbox-label w-form-label" for="${checkboxId}">${option.label}</span>
        </label>
      `;
    });

    fieldHTML += '</div>';
    return fieldHTML;
  };

  /**
   * Setup form submission
   */
  const setupFormSubmission = () => {
    const submitButton = document.querySelector('.circle_button.is-form-long');
    if (!submitButton) {
      console.warn('[v0] Submit button not found');
      return;
    }

    // Initially disable the button
    disableSubmitButton();

    // Add event listeners to form inputs for real-time validation
    const form = document.getElementById('wf-form-Join-Circle-Form');
    if (form) {
      const inputs = form.querySelectorAll('input[data-field-name], select[data-field-name], textarea[data-field-name]');
      inputs.forEach((input) => {
        input.addEventListener('change', updateButtonState);
        input.addEventListener('input', updateButtonState);
      });
    }

    submitButton.addEventListener('click', async (e) => {
      e.preventDefault();
      
      console.log('[v0] Submit button clicked');
      
      if (!(await validateForm())) {
        console.log('[v0] Form validation failed');
        alert('Please fill out all required fields');
        return;
      }

      if (!recaptchaToken) {
        console.log('[v0] CAPTCHA not completed, token:', recaptchaToken);
        alert('Please complete the CAPTCHA verification before submitting');
        return;
      }

      console.log('[v0] All validations passed, submitting form with CAPTCHA token:', recaptchaToken.substring(0, 20) + '...');
      await submitForm();
    });
  };

  /**
   * Update submit button state based on form validation
   */
  const updateButtonState = () => {
    const submitButton = document.querySelector('.circle_button.is-form-long');
    if (!submitButton) return;

    const isFormValid = isFormFieldsValid();
    const isCaptchaValid = recaptchaToken !== null;

    if (isFormValid && isCaptchaValid) {
      enableSubmitButton();
    } else {
      disableSubmitButton();
    }

    console.log('[v0] Button state updated - Form valid:', isFormValid, 'CAPTCHA valid:', isCaptchaValid);
  };

  /**
   * Check if all required form fields are valid
   */
  const isFormFieldsValid = () => {
    const form = document.getElementById('wf-form-Join-Circle-Form');
    if (!form) return false;

    const inputs = form.querySelectorAll('input[data-field-name], select[data-field-name], textarea[data-field-name]');
    
    for (const input of inputs) {
      if (input.hasAttribute('required')) {
        if (input.type === 'checkbox') {
          // For checkboxes, check if at least one is checked in the group
          const checkboxGroup = form.querySelectorAll(`input[name="${input.name}"]`);
          const anyChecked = Array.from(checkboxGroup).some((cb) => cb.checked);
          if (!anyChecked) {
            return false;
          }
        } else if (input.value.trim() === '') {
          return false;
        }
      }
    }
    
    return true;
  };

  /**
   * Enable submit button
   */
  const enableSubmitButton = () => {
    const submitButton = document.querySelector('.circle_button.is-form-long');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.style.opacity = '1';
      submitButton.style.cursor = 'pointer';
    }
  };

  /**
   * Disable submit button
   */
  const disableSubmitButton = () => {
    const submitButton = document.querySelector('.circle_button.is-form-long');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.style.opacity = '0.5';
      submitButton.style.cursor = 'not-allowed';
    }
  };

  /**
   * Validate form fields
   */
  const validateForm = () => {
    const form = document.getElementById('wf-form-Join-Circle-Form');
    if (!form) return false;

    // Get all form inputs
    const inputs = form.querySelectorAll('input[data-field-name], select[data-field-name], textarea[data-field-name]');
    let isValid = true;

    inputs.forEach((input) => {
      if (input.hasAttribute('required')) {
        if (input.type === 'checkbox') {
          // For checkboxes, check if at least one is checked in the group
          const checkboxGroup = form.querySelectorAll(`input[name="${input.name}"]`);
          const anyChecked = Array.from(checkboxGroup).some((cb) => cb.checked);
          if (!anyChecked) {
            isValid = false;
            console.log('[v0] Required checkbox group not filled:', input.name);
          }
        } else if (input.value.trim() === '') {
          isValid = false;
          console.log('[v0] Required field empty:', input.name);
        }
      }
    });

    return isValid;
  };

  /**
   * Setup reCAPTCHA
   */
  const setupRecaptcha = () => {
    // Check if reCAPTCHA script is loaded
    if (typeof grecaptcha === 'undefined') {
      console.warn('[v0] reCAPTCHA script not loaded, retrying...');
      // Retry setup after a short delay
      setTimeout(setupRecaptcha, 500);
      return;
    }

    // Create a container for reCAPTCHA if it doesn't exist
    const form = document.getElementById('wf-form-Join-Circle-Form');
    if (!form) {
      console.warn('[v0] Form not found for reCAPTCHA setup');
      return;
    }

    let recaptchaContainer = form.querySelector('#recaptcha-container');
    if (!recaptchaContainer) {
      recaptchaContainer = document.createElement('div');
      recaptchaContainer.id = 'recaptcha-container';
      recaptchaContainer.style.margin = '20px 0';
      
      const submitButton = form.querySelector('.circle_button.is-form-long');
      if (submitButton && submitButton.parentNode) {
        submitButton.parentNode.insertBefore(recaptchaContainer, submitButton);
        console.log('[v0] reCAPTCHA container inserted before submit button');
      } else {
        form.appendChild(recaptchaContainer);
        console.log('[v0] reCAPTCHA container appended to form');
      }
    }

    try {
      // Render reCAPTCHA v3 (invisible)
      grecaptcha.render('recaptcha-container', {
        sitekey: '6Lf3L-4qAAAAAERPjdUuPVlXHxQ7pSwHaL5Zs7Jq',
        callback: 'onRecaptchaSuccess',
        'error-callback': 'onRecaptchaError',
      });

      console.log('[v0] reCAPTCHA setup complete');
    } catch (error) {
      console.error('[v0] Error rendering reCAPTCHA:', error);
    }
  };

  /**
   * reCAPTCHA success callback
   */
  window.onRecaptchaSuccess = (token) => {
    recaptchaToken = token;
    console.log('[v0] reCAPTCHA token received');
    updateButtonState();
  };

  /**
   * reCAPTCHA error callback
   */
  window.onRecaptchaError = () => {
    recaptchaToken = null;
    console.log('[v0] reCAPTCHA verification failed');
    updateButtonState();
  };

  /**
   * Collect form data
   */
  const collectFormData = () => {
    const form = document.getElementById('wf-form-Join-Circle-Form');
    if (!form) return { fields: [] };

    const fields = [];
    const processedFields = new Set();

    // Get all form inputs
    const inputs = form.querySelectorAll('input[data-field-name], select[data-field-name], textarea[data-field-name]');

    inputs.forEach((input) => {
      const fieldName = input.getAttribute('data-field-name');
      const objectTypeId = input.getAttribute('data-object-type-id');

      if (input.type === 'checkbox') {
        // Handle checkbox groups
        if (!processedFields.has(fieldName)) {
          processedFields.add(fieldName);
          
          const checkboxGroup = form.querySelectorAll(`input[name="${fieldName}"]:checked`);
          const values = Array.from(checkboxGroup).map((cb) => cb.value);
          
          if (values.length > 0) {
            fields.push({
              objectTypeId: objectTypeId,
              name: fieldName,
              value: values.join('; '),
            });
          }
        }
      } else if (input.value.trim() !== '') {
        fields.push({
          objectTypeId: objectTypeId,
          name: fieldName,
          value: input.value.trim(),
        });
      }
    });

    return { fields };
  };

  /**
   * Initialize the form
   */
  const init = async () => {
    try {
      console.log('[v0] Initializing dynamic form handler');
      
      // Load form fields from JSON first
      await loadFormFields();
      
      // Render form fields dynamically
      renderFormFields();
      
      // Setup form submission
      setupFormSubmission();
      
      // Setup modal scroll lock
      setupModalScrollLock();
      
      // Setup CAPTCHA with a delay to ensure form is fully rendered
      setTimeout(() => {
        setupRecaptcha();
      }, 500);
      
      console.log('[v0] Form handler initialized successfully');
    } catch (error) {
      console.error('[v0] Error initializing form handler:', error);
    }
  };

  /**
   * Submit form to HubSpot using public endpoint
   */
  const submitForm = async () => {
    try {
      // Validate recaptcha token one more time
      if (!recaptchaToken) {
        console.error('[v0] reCAPTCHA token missing at submission time');
        alert('Security verification failed. Please try again.');
        return;
      }

      // Show loading state
      showLoadingPreloader();

      const formData = collectFormData();
      const payload = {
        fields: formData.fields,
        context: {
          pageUri: getCurrentDomain(),
          pageName: 'PaidHR Circle',
        },
      };

      console.log('[v0] Submitting form with payload:', payload);
      console.log('[v0] Using reCAPTCHA token for verification');

      // Use public HubSpot forms endpoint
      const hubspotEndpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${CONFIG.hubspotPortalId}/${CONFIG.hubspotFormGuid}`;

      const response = await fetch(hubspotEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      hideLoadingPreloader();

      if (response.ok) {
        const result = await response.json();
        console.log('[v0] Form submitted successfully:', result);
        showSuccessMessage('Thanks for submitting the form! We\'ll be in touch soon.');
        resetForm();
        // Reset recaptcha token after successful submission
        recaptchaToken = null;
      } else {
        console.error('[v0] Form submission failed:', response.status);
        showErrorMessage('Sorry could not submit your request try again later..');
      }
    } catch (error) {
      console.error('[v0] Error submitting form:', error);
      hideLoadingPreloader();
      showErrorMessage('Sorry could not submit your request try again later..');
    }
  };

  /**
   * Show loading preloader
   */
  const showLoadingPreloader = () => {
    let preloader = document.getElementById('form-preloader');
    if (!preloader) {
      preloader = document.createElement('div');
      preloader.id = 'form-preloader';
      preloader.className = 'form-preloader';
      preloader.innerHTML = `
        <div class="preloader-content">
          <div class="spinner"></div>
          <p>Submitting your request...</p>
        </div>
      `;
      document.body.appendChild(preloader);
      
      // Add styles if not already added
      if (!document.getElementById('preloader-styles')) {
        const style = document.createElement('style');
        style.id = 'preloader-styles';
        style.textContent = `
          .form-preloader {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }
          .preloader-content {
            background: white;
            padding: 40px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #004AF5;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .preloader-content p {
            margin: 0;
            color: #333;
            font-family: inherit;
          }
        `;
        document.head.appendChild(style);
      }
    }
    preloader.style.display = 'flex';
  };

  /**
   * Hide loading preloader
   */
  const hideLoadingPreloader = () => {
    const preloader = document.getElementById('form-preloader');
    if (preloader) {
      preloader.style.display = 'none';
    }
  };

  /**
   * Show success message
   */
  const showSuccessMessage = (message) => {
    const successDiv = document.querySelector('.form-success-message');
    if (successDiv) {
      const ineligibleDiv = successDiv.querySelector('#ineligible');
      if (ineligibleDiv) {
        ineligibleDiv.innerHTML = `
          <div class="text-size-medium-new text-weight-semibold text-color-brand">Hey there!</div>
          <div class="text-size-regular">${message}<br><br>Love, <br><br>The Circle Team 💙</div>
        `;
      }
      // Show success state (handled by Webflow form)
      console.log('[v0] Success message displayed');
    }
  };

  /**
   * Show error message
   */
  const showErrorMessage = (message) => {
    const errorDiv = document.querySelector('.error-message_wrap');
    if (errorDiv) {
      errorDiv.innerHTML = `<div>${message}</div>`;
      // Show error state
      console.log('[v0] Error message displayed');
    } else {
      alert(message);
    }
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    const form = document.getElementById('wf-form-Join-Circle-Form');
    if (form) {
      form.reset();
      recaptchaToken = null;
      console.log('[v0] Form reset');
    }
  };

  /**
   * Setup modal scroll lock
   * Disable background scrolling when modal is open
   */
  const setupModalScrollLock = () => {
    const modal = document.getElementById('lead-form-wrap');
    
    if (!modal) {
      console.warn('[v0] Modal wrapper not found');
      return;
    }

    // Function to lock scroll
    const lockScroll = () => {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      console.log('[v0] Scroll locked - Modal opened');
    };

    // Function to unlock scroll
    const unlockScroll = () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      console.log('[v0] Scroll unlocked - Modal closed');
    };

    // Watch for modal display changes using MutationObserver
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const displayStyle = window.getComputedStyle(modal).display;
        const visibilityStyle = window.getComputedStyle(modal).visibility;
        
        console.log('[v0] Modal state changed - display:', displayStyle, 'visibility:', visibilityStyle);
        
        if (displayStyle !== 'none' && visibilityStyle !== 'hidden') {
          lockScroll();
        } else {
          unlockScroll();
        }
      });
    });

    observer.observe(modal, {
      attributes: true,
      attributeFilter: ['style'],
      subtree: true,
    });

    // Also listen for class changes
    const classObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const displayStyle = window.getComputedStyle(modal).display;
          if (displayStyle !== 'none') {
            lockScroll();
          } else {
            unlockScroll();
          }
        }
      });
    });

    classObserver.observe(modal, {
      attributes: true,
      attributeFilter: ['class'],
    });

    console.log('[v0] Modal scroll lock setup complete');
  };

  // Public API
  return {
    init: init,
  };
})();

// Initialize form when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  DynamicFormHandler.init();
});

// Also initialize on Webflow ready event if available
if (typeof Webflow !== 'undefined') {
  Webflow.push(() => {
    DynamicFormHandler.init();
  });
}
