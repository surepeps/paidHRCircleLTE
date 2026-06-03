/**
 * Dynamic Form Handler - FULLY JSON-CONTROLLED
 * All form fields, reCAPTCHA, and submit button rendered from formFields.json
 * Features: Error modal, working preloader, empty state placeholder
 */

const DynamicFormHandler = (() => {
  // Configuration
  const CONFIG = {
    formFieldsUrl: '../data/formFields.json',
    hubspotPortalId: '26055346',
    hubspotFormGuid: '66851a67-87da-466c-b329-ee915bb8312f',
    hubspotApiEndpoint: 'https://api.hsforms.com/submissions/v3/integration/secure/submit',
  };

  let formFields = [];
  let formData = {};
  let recaptchaToken = null;
  let recaptchaConfig = null;
  let submitButtonConfig = null;

  /**
   * Initialize the dynamic form
   */
  const init = async () => {
    try {
      console.log('[DynamicForm] Initializing...');
      
      // Load form fields from JSON
      await loadFormFields();
      
      // Extract reCAPTCHA and submit button configurations
      extractSpecialFields();
      
      // Render form fields dynamically
      renderFormFields();
      
      // Render reCAPTCHA if configured
      if (recaptchaConfig && recaptchaConfig.enabled) {
        setTimeout(() => {
          setupRecaptcha();
        }, 500);
      }
      
      // Set up form submission
      setupFormSubmission();
      
      // Setup modal scroll lock
      setupModalScrollLock();
      
      console.log('[DynamicForm] Initialization complete');
    } catch (error) {
      console.error('[DynamicForm] Initialization error:', error);
      showErrorModal('Unable to load form. Please refresh the page and try again.');
    }
  };

  /**
   * Load form fields from JSON file
   */
  const loadFormFields = async () => {
    try {
      console.log('[DynamicForm] Loading form fields from:', CONFIG.formFieldsUrl);
      
      const response = await fetch(CONFIG.formFieldsUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to load form fields: HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Form configuration is empty or invalid');
      }
      
      formFields = data;
      console.log('[DynamicForm] ✓ Loaded', formFields.length, 'form items');
      
    } catch (error) {
      console.error('[DynamicForm] Error loading form fields:', error);
      throw error;
    }
  };

  /**
   * Extract special field types (recaptcha, submit button) from form fields
   */
  const extractSpecialFields = () => {
    // Find and extract reCAPTCHA config
    const recaptchaIndex = formFields.findIndex(field => field.fieldType === 'recaptcha');
    if (recaptchaIndex !== -1) {
      recaptchaConfig = formFields[recaptchaIndex];
      console.log('[DynamicForm] ✓ reCAPTCHA config found');
    }

    // Find and extract submit button config
    const submitIndex = formFields.findIndex(field => field.fieldType === 'submit');
    if (submitIndex !== -1) {
      submitButtonConfig = formFields[submitIndex];
      console.log('[DynamicForm] ✓ Submit button config found');
    }

    // Remove special fields from formFields array (they'll be rendered separately)
    formFields = formFields.filter(field => 
      field.fieldType !== 'recaptcha' && field.fieldType !== 'submit'
    );
    
    console.log('[DynamicForm] Regular form fields count:', formFields.length);
  };

  /**
   * Render form fields dynamically
   */
  const renderFormFields = () => {
    console.log('[DynamicForm] Starting renderFormFields...');
    
    const fieldsContainer = document.querySelector('.circle-form_fields');
    
    if (!fieldsContainer) {
      console.error('[DynamicForm] ❌ Form fields container not found!');
      showErrorModal('Form container not found. Please refresh the page.');
      return;
    }

    // Clear existing content
    fieldsContainer.innerHTML = '';

    // Check if we have any fields to render
    if (formFields.length === 0) {
      renderEmptyState(fieldsContainer);
      return;
    }

    // Render regular form fields
    let i = 0;
    while (i < formFields.length) {
      const currentField = formFields[i];

      if (currentField.fieldType === 'checkbox') {
        const wrapper = document.createElement('div');
        wrapper.className = 'field-wrapper';
        wrapper.style.gridColumn = '1 / -1';
        wrapper.innerHTML = renderCheckboxField(currentField);
        fieldsContainer.appendChild(wrapper);
        i++;
      } else if (currentField.fieldType === 'radio' || currentField.fieldType === 'booleancheckbox') {
        const wrapper = document.createElement('div');
        wrapper.className = 'field-wrapper';
        wrapper.style.gridColumn = '1 / -1';
        wrapper.innerHTML = renderRadioField(currentField);
        fieldsContainer.appendChild(wrapper);
        i++;
      } else {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-field-wrappper';
        
        const fieldDiv1 = document.createElement('div');
        fieldDiv1.className = 'field-wrapper';
        fieldDiv1.innerHTML = renderField(currentField);
        wrapper.appendChild(fieldDiv1);
        
        if (i + 1 < formFields.length && formFields[i + 1].fieldType !== 'checkbox') {
          const fieldDiv2 = document.createElement('div');
          fieldDiv2.className = 'field-wrapper';
          fieldDiv2.innerHTML = renderField(formFields[i + 1]);
          wrapper.appendChild(fieldDiv2);
          i += 2;
        } else {
          i++;
        }
        
        fieldsContainer.appendChild(wrapper);
      }
    }

    console.log('[DynamicForm] ✓ Regular form fields rendered');
    
    // Now render reCAPTCHA and submit button from JSON config
    const form = document.getElementById('wf-form-Join-Circle-Form');
    if (form) {
      // Render reCAPTCHA container
      if (recaptchaConfig && recaptchaConfig.enabled) {
        renderRecaptchaContainer(form);
      }
      
      // Render submit button
      if (submitButtonConfig && submitButtonConfig.enabled !== false) {
        renderSubmitButton(form);
      }
    }
    
    // Add validation listeners after fields are rendered
    setTimeout(() => {
      addValidationListeners();
    }, 100);
  };

  /**
   * Render empty state when no fields are available
   */
  const renderEmptyState = (container) => {
    const emptyStateHTML = `
      <div class="form-empty-state" style="
        padding: 60px 20px;
        text-align: center;
        color: #666;
        font-size: 16px;
      ">
        <div style="
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          border: 3px solid #e0e0e0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: #ccc;
        ">📋</div>
        <h3 style="margin: 0 0 10px; color: #333; font-size: 20px;">Form Configuration Required</h3>
        <p style="margin: 0; max-width: 400px; margin: 0 auto;">
          No form fields have been configured yet. Please check the formFields.json file.
        </p>
      </div>
    `;
    container.innerHTML = emptyStateHTML;
  };

  /**
   * Render individual field based on type
   */
  const renderField = (field) => {
    const fieldId = field.name;
    const isRequired = field.required ? 'required' : '';
    const placeholder = field.placeholder || field.unselectedLabel || field.label || '';

    let fieldHTML = `<label for="${fieldId}" class="field-label hide">${field.label || placeholder}</label>`;

    if (field.fieldType === 'select') {
      fieldHTML += `<select id="${fieldId}" name="${fieldId}" data-name="${field.name}" ${isRequired} class="form-input-field is-circle-select w-select" data-field-name="${field.name}" data-object-type-id="${field.objectTypeId}">`;
      fieldHTML += `<option value="">${placeholder}...</option>`;
      
      if (field.options && field.options.length > 0) {
        field.options.forEach((option) => {
          fieldHTML += `<option value="${option.value}">${option.label}</option>`;
        });
      }
      
      fieldHTML += '</select>';
    } else if (field.fieldType === 'phonenumber') {
      fieldHTML += `<input type="tel" id="${fieldId}" name="${fieldId}" data-name="${field.name}" class="form-input-field is-circle w-input" placeholder="${placeholder}" ${isRequired} data-field-name="${field.name}" data-object-type-id="${field.objectTypeId}">`;
    } else {
      const inputType = field.fieldType === 'text' ? (field.name.includes('email') ? 'email' : 'text') : 'text';
      fieldHTML += `<input type="${inputType}" id="${fieldId}" name="${fieldId}" data-name="${field.name}" class="form-input-field is-circle w-input" placeholder="${placeholder}" ${isRequired} data-field-name="${field.name}" data-object-type-id="${field.objectTypeId}">`;
    }

    return fieldHTML;
  };

  /**
   * Render checkbox field group
   */
  const renderCheckboxField = (field) => {
    let fieldHTML = `<div class="field-label">${field.label}</div><div class="circle-form_option-wrap">`;

    if (field.options && field.options.length > 0) {
      field.options.forEach((option) => {
        const checkboxId = `${field.name}_${option.value.replace(/\s+/g, '_').toLowerCase()}`;
        fieldHTML += `
          <label class="w-checkbox">
            <div class="w-checkbox-input w-checkbox-input--inputType-custom circle-checkbox"></div>
            <input type="checkbox" name="${field.name}" id="${checkboxId}" value="${option.value}" data-field-name="${field.name}" data-object-type-id="${field.objectTypeId}" style="opacity:0;position:absolute;z-index:-1" ${field.required ? 'required' : ''}>
            <span class="circle-checkbox-label w-form-label" for="${checkboxId}">${option.label}</span>
          </label>
        `;
      });
    }

    fieldHTML += '</div>';
    return fieldHTML;
  };

  /**
   * Render radio / booleancheckbox field group
   */
  const renderRadioField = (field) => {
    let fieldHTML = `<div class="field-label">${field.label}</div><div class="circle-form_option-wrap">`;

    if (field.options && field.options.length > 0) {
      field.options.forEach((option) => {
        const radioId = `${field.name}_${option.value.replace(/\s+/g, '_').toLowerCase()}`;
        fieldHTML += `
          <label class="w-checkbox">
            <div class="w-checkbox-input w-checkbox-input--inputType-custom circle-checkbox"></div>
            <input type="radio" name="${field.name}" id="${radioId}" value="${option.value}" data-field-name="${field.name}" data-object-type-id="${field.objectTypeId}" style="opacity:0;position:absolute;z-index:-1" ${field.required ? 'required' : ''}>
            <span class="circle-checkbox-label w-form-label" for="${radioId}">${option.label}</span>
          </label>
        `;
      });
    }

    fieldHTML += '</div>';
    return fieldHTML;
  };

  /**
   * Render reCAPTCHA container from JSON config
   */
  const renderRecaptchaContainer = (form) => {
    let recaptchaContainer = form.querySelector('#recaptcha-container');
    
    if (!recaptchaContainer) {
      recaptchaContainer = document.createElement('div');
      recaptchaContainer.id = 'recaptcha-container';
      recaptchaContainer.style.margin = '20px 0';
      
      // Control visibility based on JSON config
      if (recaptchaConfig.showOnlyWhenFormValid) {
        recaptchaContainer.style.display = 'none';
      }
      
      recaptchaContainer.style.transition = 'opacity 0.3s ease';
      
      form.appendChild(recaptchaContainer);
      console.log('[DynamicForm] ✓ reCAPTCHA container created');
    }
  };

  /**
   * Render submit button from JSON config
   */
  const renderSubmitButton = (form) => {
    // Remove any existing submit buttons from HTML
    const existingButtons = form.querySelectorAll('.circle_button.is-form-long, button[type="submit"], input[type="submit"]');
    existingButtons.forEach(btn => btn.remove());

    // Create button from JSON config
    const submitButton = document.createElement('a');
    submitButton.href = '#';
    submitButton.className = submitButtonConfig.buttonClasses || 'circle_button is-form-long w-inline-block';
    
    const buttonBg = document.createElement('div');
    buttonBg.className = 'circle_btn-bg';
    
    const buttonText = document.createElement('div');
    buttonText.textContent = submitButtonConfig.buttonText || submitButtonConfig.text || 'Submit';
    buttonBg.appendChild(buttonText);
    
    if (submitButtonConfig.buttonIcon) {
      const iconDiv = document.createElement('div');
      iconDiv.className = 'icon-size-20px w-embed';
      iconDiv.innerHTML = submitButtonConfig.buttonIcon;
      buttonBg.appendChild(iconDiv);
    }
    
    const buttonBlBg = document.createElement('div');
    buttonBlBg.className = 'circle_btn-bl-bg';
    
    submitButton.appendChild(buttonBg);
    submitButton.appendChild(buttonBlBg);
    
    form.appendChild(submitButton);
    console.log('[DynamicForm] ✓ Submit button created from JSON');
    
    // Apply initial disabled state
    if (submitButtonConfig.disabledState) {
      applyButtonState(submitButton, submitButtonConfig.disabledState);
    }
  };

  /**
   * Apply button state (enabled or disabled)
   */
  const applyButtonState = (button, stateConfig) => {
    const buttonBg = button.querySelector('.circle_btn-bg');
    const buttonText = button.querySelector('.circle_btn-bg > div:first-child');
    
    if (stateConfig.opacity) button.style.opacity = stateConfig.opacity;
    if (stateConfig.cursor) button.style.cursor = stateConfig.cursor;
    if (stateConfig.pointerEvents !== undefined) {
      button.style.pointerEvents = stateConfig.pointerEvents === false ? 'none' : 'auto';
    }
    
    if (buttonBg && stateConfig.backgroundColor !== undefined) {
      buttonBg.style.backgroundColor = stateConfig.backgroundColor;
    }
    
    if (buttonText && stateConfig.color !== undefined) {
      buttonText.style.color = stateConfig.color;
    }
  };

  /**
   * Enable submit button
   */
  const enableSubmitButton = () => {
    const submitButton = document.querySelector('.circle_button.is-form-long');
    if (!submitButton || !submitButtonConfig) return;
    
    submitButton.disabled = false;
    applyButtonState(submitButton, submitButtonConfig.enabledState);
    console.log('[DynamicForm] Submit button ENABLED');
  };

  /**
   * Disable submit button
   */
  const disableSubmitButton = () => {
    const submitButton = document.querySelector('.circle_button.is-form-long');
    if (!submitButton || !submitButtonConfig) return;
    
    submitButton.disabled = true;
    applyButtonState(submitButton, submitButtonConfig.disabledState);
    console.log('[DynamicForm] Submit button DISABLED');
  };

  /**
   * Setup form submission
   */
  const setupFormSubmission = () => {
    const submitButton = document.querySelector('.circle_button.is-form-long');
    if (!submitButton) {
      console.warn('[DynamicForm] Submit button not found');
      return;
    }

    // Initially disable the button
    disableSubmitButton();

    // Add event listeners for real-time validation
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
      
      console.log('[DynamicForm] Submit button clicked');
      
      if (!(await validateForm())) {
        console.log('[DynamicForm] Form validation failed');
        showErrorModal('Please fill out all required fields correctly.');
        return;
      }

      // Check reCAPTCHA if enabled
      if (recaptchaConfig && recaptchaConfig.enabled && !recaptchaToken) {
        console.log('[DynamicForm] reCAPTCHA not completed');
        showErrorModal('Please complete the reCAPTCHA verification before submitting.');
        return;
      }

      console.log('[DynamicForm] All validations passed, submitting form');
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
    const isCaptchaValid = recaptchaConfig && recaptchaConfig.enabled ? recaptchaToken !== null : true;

    // Update reCAPTCHA visibility if configured
    if (recaptchaConfig && recaptchaConfig.enabled && recaptchaConfig.showOnlyWhenFormValid) {
      updateRecaptchaVisibility();
    }

    if (isFormValid && isCaptchaValid) {
      enableSubmitButton();
    } else {
      disableSubmitButton();
    }
  };

  /**
   * Check if all required form fields are valid
   */
  const isFormFieldsValid = () => {
    const form = document.getElementById('wf-form-Join-Circle-Form');
    if (!form) return false;

    const inputs = form.querySelectorAll('input[data-field-name], select[data-field-name], textarea[data-field-name]');
    
    const processedRadioGroups = new Set();
    for (const input of inputs) {
      if (input.hasAttribute('required')) {
        if (input.type === 'checkbox') {
          const checkboxGroup = form.querySelectorAll(`input[name="${input.name}"]`);
          const anyChecked = Array.from(checkboxGroup).some((cb) => cb.checked);
          if (!anyChecked) {
            return false;
          }
        } else if (input.type === 'radio') {
          if (!processedRadioGroups.has(input.name)) {
            processedRadioGroups.add(input.name);
            const radioGroup = form.querySelectorAll(`input[name="${input.name}"]`);
            const anyChecked = Array.from(radioGroup).some((r) => r.checked);
            if (!anyChecked) {
              return false;
            }
          }
        } else if (input.value.trim() === '') {
          return false;
        }
      }
    }
    
    return true;
  };

  /**
   * Validate form fields
   */
  const validateForm = () => {
    const form = document.getElementById('wf-form-Join-Circle-Form');
    if (!form) return false;

    const inputs = form.querySelectorAll('input[data-field-name], select[data-field-name], textarea[data-field-name]');
    let isValid = true;
    let firstInvalidField = null;

    const processedRadioGroups = new Set();
    inputs.forEach((input) => {
      input.style.borderColor = '';
      input.style.borderWidth = '';

      if (input.hasAttribute('required')) {
        let fieldValid = true;

        if (input.type === 'checkbox') {
          const checkboxGroup = form.querySelectorAll(`input[name="${input.name}"]`);
          const anyChecked = Array.from(checkboxGroup).some((cb) => cb.checked);
          if (!anyChecked) {
            fieldValid = false;
            isValid = false;

            const checkboxWrapper = input.closest('.circle-form_option-wrap');
            if (checkboxWrapper) {
              checkboxWrapper.style.border = '2px solid #ff0000';
              checkboxWrapper.style.borderRadius = '4px';
              checkboxWrapper.style.padding = '8px';
            }

            if (!firstInvalidField) firstInvalidField = input;
          } else {
            const checkboxWrapper = input.closest('.circle-form_option-wrap');
            if (checkboxWrapper) {
              checkboxWrapper.style.border = '';
              checkboxWrapper.style.padding = '';
            }
          }
        } else if (input.type === 'radio') {
          if (!processedRadioGroups.has(input.name)) {
            processedRadioGroups.add(input.name);
            const radioGroup = form.querySelectorAll(`input[name="${input.name}"]`);
            const anyChecked = Array.from(radioGroup).some((r) => r.checked);
            if (!anyChecked) {
              fieldValid = false;
              isValid = false;
              const radioWrapper = input.closest('.circle-form_option-wrap');
              if (radioWrapper) {
                radioWrapper.style.border = '2px solid #ff0000';
                radioWrapper.style.borderRadius = '4px';
                radioWrapper.style.padding = '8px';
              }
              if (!firstInvalidField) firstInvalidField = input;
            } else {
              const radioWrapper = input.closest('.circle-form_option-wrap');
              if (radioWrapper) {
                radioWrapper.style.border = '';
                radioWrapper.style.padding = '';
              }
            }
          }
        } else if (input.value.trim() === '') {
          fieldValid = false;
          isValid = false;

          input.style.borderColor = '#ff0000';
          input.style.borderWidth = '2px';

          if (!firstInvalidField) firstInvalidField = input;
        }
      }
    });

    if (firstInvalidField && firstInvalidField.type !== 'checkbox') {
      firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => firstInvalidField.focus(), 500);
    }

    return isValid;
  };

  /**
   * Add real-time validation styling
   */
  const addValidationListeners = () => {
    const form = document.getElementById('wf-form-Join-Circle-Form');
    if (!form) return;

    const inputs = form.querySelectorAll('input[data-field-name], select[data-field-name], textarea[data-field-name]');
    
    inputs.forEach((input) => {
      if (input.hasAttribute('required')) {
        
        const validateInput = () => {
          if (input.type === 'checkbox') {
            const checkboxGroup = form.querySelectorAll(`input[name="${input.name}"]`);
            const anyChecked = Array.from(checkboxGroup).some((cb) => cb.checked);
            const checkboxWrapper = input.closest('.circle-form_option-wrap');

            if (checkboxWrapper) {
              if (anyChecked) {
                checkboxWrapper.style.border = '';
                checkboxWrapper.style.padding = '';
              } else {
                checkboxWrapper.style.border = '2px solid #ff0000';
                checkboxWrapper.style.borderRadius = '4px';
                checkboxWrapper.style.padding = '8px';
              }
            }
          } else if (input.type === 'radio') {
            const radioGroup = form.querySelectorAll(`input[name="${input.name}"]`);
            const anyChecked = Array.from(radioGroup).some((r) => r.checked);
            const radioWrapper = input.closest('.circle-form_option-wrap');

            if (radioWrapper) {
              if (anyChecked) {
                radioWrapper.style.border = '';
                radioWrapper.style.padding = '';
              } else {
                radioWrapper.style.border = '2px solid #ff0000';
                radioWrapper.style.borderRadius = '4px';
                radioWrapper.style.padding = '8px';
              }
            }
          } else {
            if (input.value.trim() === '') {
              input.style.borderColor = '#ff0000';
              input.style.borderWidth = '2px';
            } else {
              input.style.borderColor = '';
              input.style.borderWidth = '';
            }
          }

          updateButtonState();
        };
        
        input.addEventListener('blur', validateInput);
        input.addEventListener('change', validateInput);
        input.addEventListener('input', validateInput);
      }
    });

    // Visual toggle for radio buttons: update the custom .w-checkbox-input div
    const allRadioInputs = form.querySelectorAll('input[type="radio"][data-field-name]');
    allRadioInputs.forEach((radio) => {
      radio.addEventListener('change', () => {
        // Clear checked state on every option in this radio group
        form.querySelectorAll(`input[name="${radio.name}"]`).forEach((r) => {
          const visualDiv = r.previousElementSibling;
          if (visualDiv && visualDiv.classList.contains('w-checkbox-input')) {
            visualDiv.classList.remove('w--redirected-checked');
          }
        });
        // Apply checked state to the selected option
        const visualDiv = radio.previousElementSibling;
        if (visualDiv && visualDiv.classList.contains('w-checkbox-input')) {
          visualDiv.classList.add('w--redirected-checked');
        }
        updateButtonState();
      });
    });

    // Visual toggle for checkboxes (Webflow doesn't wire dynamically added inputs)
    const allCheckboxInputs = form.querySelectorAll('input[type="checkbox"][data-field-name]');
    allCheckboxInputs.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        const visualDiv = checkbox.previousElementSibling;
        if (visualDiv && visualDiv.classList.contains('w-checkbox-input')) {
          visualDiv.classList.toggle('w--redirected-checked', checkbox.checked);
        }
        updateButtonState();
      });
    });
  };

  
  /**
   * Setup reCAPTCHA v2
  */
  const setupRecaptcha = () => {
    if (!recaptchaConfig || !recaptchaConfig.enabled) {
        console.log('[DynamicForm] reCAPTCHA disabled');
        return;
    }

    if (typeof grecaptcha === 'undefined') {
        console.warn('[DynamicForm] reCAPTCHA script not loaded, retrying...');
        setTimeout(setupRecaptcha, 500);
        return;
    }

    const recaptchaContainer = document.querySelector('#recaptcha-container');
    if (!recaptchaContainer) {
        console.warn('[DynamicForm] reCAPTCHA container not found');
        return;
    }

    try {
        // Render reCAPTCHA v2 checkbox
        grecaptcha.enterprise.render('recaptcha-container', {
        sitekey: recaptchaConfig.siteKey,
        action: 'LOGIN',
        callback: (token) => {
            recaptchaToken = token;
            console.log('[DynamicForm] reCAPTCHA v2 verified successfully');
            updateButtonState();
        },
        'expired-callback': () => {
            recaptchaToken = null;
            console.log('[DynamicForm] reCAPTCHA v2 expired');
            updateButtonState();
        },
        'error-callback': () => {
            recaptchaToken = null;
            console.log('[DynamicForm] reCAPTCHA v2 error');
            updateButtonState();
        }
        });

        console.log('[DynamicForm] ✓ reCAPTCHA v2 setup complete');
        
        // Set initial visibility based on config
        if (recaptchaConfig.showOnlyWhenFormValid) {
        updateRecaptchaVisibility();
        } else {
        recaptchaContainer.style.display = recaptchaConfig.visible !== false ? 'block' : 'none';
        }
        
    } catch (error) {
        console.error('[DynamicForm] Error rendering reCAPTCHA v2:', error);
    }
  };

  /**
   * Update reCAPTCHA visibility based on form validity
   */
  const updateRecaptchaVisibility = () => {
    if (!recaptchaConfig || !recaptchaConfig.showOnlyWhenFormValid) return;
    
    const recaptchaContainer = document.querySelector('#recaptcha-container');
    if (!recaptchaContainer) return;

    const isFormValid = isFormFieldsValid();
    
    if (isFormValid) {
      recaptchaContainer.style.display = 'block';
      recaptchaContainer.style.opacity = '1';
    } else {
      recaptchaContainer.style.display = 'none';
      recaptchaContainer.style.opacity = '0';
    }
  };

  /**
   * reCAPTCHA callbacks
   */
  window.onRecaptchaSuccess = (token) => {
    recaptchaToken = token;
    console.log('[DynamicForm] reCAPTCHA verified');
    updateButtonState();
  };

  window.onRecaptchaError = () => {
    recaptchaToken = null;
    console.log('[DynamicForm] reCAPTCHA error');
    updateButtonState();
  };

  window.onRecaptchaExpired = () => {
    recaptchaToken = null;
    console.log('[DynamicForm] reCAPTCHA expired');
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

    const inputs = form.querySelectorAll('input[data-field-name], select[data-field-name], textarea[data-field-name]');

    inputs.forEach((input) => {
      const fieldName = input.getAttribute('data-field-name');
      const objectTypeId = input.getAttribute('data-object-type-id');

      if (input.type === 'checkbox') {
        if (!processedFields.has(fieldName)) {
          processedFields.add(fieldName);

          const checkboxGroup = form.querySelectorAll(`input[name="${input.name}"]:checked`);
          const values = Array.from(checkboxGroup).map((cb) => cb.value);

          if (values.length > 0) {
            fields.push({
              objectTypeId: objectTypeId,
              name: fieldName,
              value: values.join('; '),
            });
          }
        }
      } else if (input.type === 'radio') {
        if (!processedFields.has(fieldName)) {
          processedFields.add(fieldName);

          const checkedRadio = form.querySelector(`input[name="${input.name}"]:checked`);
          if (checkedRadio) {
            fields.push({
              objectTypeId: objectTypeId,
              name: fieldName,
              value: checkedRadio.value,
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
   * Submit form to HubSpot
   */
  const submitForm = async () => {
    try {
      if (recaptchaConfig && recaptchaConfig.enabled && !recaptchaToken) {
        console.error('[DynamicForm] reCAPTCHA token missing');
        showErrorModal('Security verification failed. Please complete the reCAPTCHA and try again.');
        return;
      }

      showLoadingPreloader();

      const formData = collectFormData();
      const payload = {
        fields: formData.fields,
        context: {
          pageUri: window.location.href,
          pageName: 'PaidHR Circle',
        },
      };

      console.log('[DynamicForm] Submitting form...');

      const hubspotEndpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${CONFIG.hubspotPortalId}/${CONFIG.hubspotFormGuid}`;

      const response = await fetch(hubspotEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      hideLoadingPreloader();

      console.log(response.ok, response, "all response");

      if (response.ok) {
        const result = await response.json();
        console.log('[DynamicForm] Form submitted successfully:', result);
        showSuccessMessage('Thanks for submitting the form! We\'ll be in touch soon.');
        resetForm();
        recaptchaToken = null;
      } else {
        const errorText = await response.text();
        console.error('[DynamicForm] Form submission failed:', response.status, errorText);
        showErrorModal('Sorry, we could not submit your request. Please try again later.');
      }
    } catch (error) {
      console.error('[DynamicForm] Error submitting form:', error);
      hideLoadingPreloader();
      showErrorModal('An unexpected error occurred. Please check your connection and try again.');
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
        <div class="preloader-overlay"></div>
        <div class="preloader-content">
          <div class="preloader-spinner"></div>
          <p class="preloader-text">Submitting your request...</p>
        </div>
      `;
      document.body.appendChild(preloader);
      
      // Add styles if not already present
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
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .preloader-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
          }
          
          .preloader-content {
            position: relative;
            background: white;
            padding: 48px 40px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 90%;
            animation: preloaderFadeIn 0.3s ease;
          }
          
          @keyframes preloaderFadeIn {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          
          .preloader-spinner {
            width: 56px;
            height: 56px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #004AF5;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 24px;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .preloader-text {
            margin: 0;
            color: #333;
            font-size: 16px;
            font-weight: 500;
            font-family: inherit;
          }
        `;
        document.head.appendChild(style);
      }
    }
    
    preloader.style.display = 'flex';
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  };

  /**
   * Hide loading preloader
   */
  const hideLoadingPreloader = () => {
    const preloader = document.getElementById('form-preloader');
    if (preloader) {
      preloader.style.display = 'none';
    }
    // Restore body scroll
    document.body.style.overflow = '';
  };

  /**
   * Show error modal
   */
  const showErrorModal = (message) => {
    // Remove existing error modal if any
    const existingModal = document.getElementById('error-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'error-modal';
    modal.className = 'error-modal';
    modal.innerHTML = `
      <div class="error-modal-overlay"></div>
      <div class="error-modal-content">
        <div class="error-modal-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#FF4757" stroke-width="2"/>
            <path d="M12 8V12" stroke="#FF4757" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="16" r="1" fill="#FF4757"/>
          </svg>
        </div>
        <h3 class="error-modal-title">Oops!</h3>
        <p class="error-modal-message">${message}</p>
        <button class="error-modal-button" onclick="document.getElementById('error-modal').remove()">
          Got it
        </button>
      </div>
    `;

    // Add styles if not already present
    if (!document.getElementById('error-modal-styles')) {
      const style = document.createElement('style');
      style.id = 'error-modal-styles';
      style.textContent = `
        .error-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10001;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: errorModalFadeIn 0.3s ease;
        }
        
        @keyframes errorModalFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .error-modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
        }
        
        .error-modal-content {
          position: relative;
          background: white;
          padding: 40px 32px 32px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
          max-width: 440px;
          width: 90%;
          animation: errorModalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        @keyframes errorModalSlideUp {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(40px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .error-modal-icon {
          margin: 0 auto 20px;
          animation: errorIconPulse 0.6s ease;
        }
        
        @keyframes errorIconPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        .error-modal-title {
          margin: 0 0 12px;
          color: #FF4757;
          font-size: 24px;
          font-weight: 600;
          font-family: inherit;
        }
        
        .error-modal-message {
          margin: 0 0 28px;
          color: #555;
          font-size: 15px;
          line-height: 1.6;
          font-family: inherit;
        }
        
        .error-modal-button {
          background: #004AF5;
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          min-width: 120px;
        }
        
        .error-modal-button:hover {
          background: #0039C4;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 74, 245, 0.3);
        }
        
        .error-modal-button:active {
          transform: translateY(0);
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(modal);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Auto-remove on overlay click
    modal.querySelector('.error-modal-overlay').addEventListener('click', () => {
      modal.remove();
      document.body.style.overflow = '';
    });
  };

  /**
   * Show success message
   */
  const showSuccessMessage = (message) => {
    const successDiv = document.querySelector('.form-success-message');
    const formInner = document.querySelector('.circle-form_inner');
    
    if (successDiv && formInner) {
      formInner.style.display = 'none';
      successDiv.style.display = 'block';
      
      const ineligibleDiv = successDiv.querySelector('#ineligible');
      if (ineligibleDiv) {
        ineligibleDiv.innerHTML = `
          <div class="text-size-medium-new text-weight-semibold text-color-brand">Hey there!</div>
          <div class="text-size-regular">${message}<br><br>Love, <br><br>The Circle Team 💙</div>
        `;
      }
      console.log('[DynamicForm] Success message displayed');
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
      
      if (typeof grecaptcha !== 'undefined') {
        grecaptcha.enterprise.reset();
      }
      
      disableSubmitButton();
      console.log('[DynamicForm] Form reset');
    }
  };

  /**
   * Setup modal scroll lock
   */
  const setupModalScrollLock = () => {
    const modal = document.getElementById('lead-form-wrap');
    
    if (!modal) {
      console.warn('[DynamicForm] Modal wrapper not found');
      return;
    }

    const lockScroll = () => {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    };

    const unlockScroll = () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const displayStyle = window.getComputedStyle(modal).display;
        const visibilityStyle = window.getComputedStyle(modal).visibility;
        
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

    console.log('[DynamicForm] Modal scroll lock setup complete');
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