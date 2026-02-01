
/**
 * Validate required field
 * @param {string} value - Field value
 * @returns {boolean} Is valid
 */
export function validateRequired(value) {
    return value !== null && value !== undefined && value.toString().trim() !== '';
}

/**
 * Validate number field
 * @param {string|number} value - Field value
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} Is valid
 */
export function validateNumber(value, min = null, max = null) {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    return true;
}

/**
 * Validate date field
 * @param {string} value - Date string
 * @returns {boolean} Is valid
 */
export function validateDate(value) {
    if (!value) return false;
    const date = new Date(value);
    return date instanceof Date && !isNaN(date);
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} Is valid
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number
 * @returns {boolean} Is valid
 */
export function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phone.length >= 10 && phoneRegex.test(phone);
}

/**
 * Show validation error on a field
 * @param {HTMLElement} field - Input field element
 * @param {string} message - Error message
 */
export function showError(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    // Find or create error message element
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('invalid-feedback')) {
        errorElement = document.createElement('div');
        errorElement.className = 'invalid-feedback';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

/**
 * Show validation success on a field
 * @param {HTMLElement} field - Input field element
 */
export function showSuccess(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
}

/**
 * Clear validation state from a field
 * @param {HTMLElement} field - Input field element
 */
export function clearValidation(field) {
    field.classList.remove('is-invalid', 'is-valid');
}

/**
 * Validate crop form
 * @param {Object} formData - Form data object
 * @returns {Object} Validation result with isValid and errors
 */
export function validateCropForm(formData) {
    const errors = {};
    let isValid = true;
    
    // Validate crop name
    if (!validateRequired(formData.name)) {
        errors.name = 'Crop name is required';
        isValid = false;
    }
    
    // Validate crop type
    if (!validateRequired(formData.type)) {
        errors.type = 'Crop type is required';
        isValid = false;
    }
    
    // Validate area
    if (!validateRequired(formData.area)) {
        errors.area = 'Area is required';
        isValid = false;
    } else if (!validateNumber(formData.area, 0)) {
        errors.area = 'Area must be a positive number';
        isValid = false;
    }
    
    // Validate status
    if (!validateRequired(formData.status)) {
        errors.status = 'Status is required';
        isValid = false;
    }
    
    // Validate yield (optional but must be valid if provided)
    if (formData.yield !== '' && !validateNumber(formData.yield, 0)) {
        errors.yield = 'Yield must be a positive number';
        isValid = false;
    }
    
    // Validate farmer name
    if (!validateRequired(formData.farmer)) {
        errors.farmer = 'Farmer name is required';
        isValid = false;
    }
    
    // Validate plant date
    if (!validateRequired(formData.plantDate)) {
        errors.plantDate = 'Plant date is required';
        isValid = false;
    } else if (!validateDate(formData.plantDate)) {
        errors.plantDate = 'Invalid date format';
        isValid = false;
    }
    
    // Validate harvest date (optional but must be valid if provided)
    if (formData.harvestDate && !validateDate(formData.harvestDate)) {
        errors.harvestDate = 'Invalid date format';
        isValid = false;
    }
    
    // Validate that harvest date is after plant date
    if (formData.plantDate && formData.harvestDate) {
        const plantDate = new Date(formData.plantDate);
        const harvestDate = new Date(formData.harvestDate);
        if (harvestDate <= plantDate) {
            errors.harvestDate = 'Harvest date must be after plant date';
            isValid = false;
        }
    }
    
    return { isValid, errors };
}

/**
 * Setup real-time validation for a form
 * @param {HTMLFormElement} form - Form element
 * @param {Function} validateFunc - Validation function
 */
export function setupFormValidation(form, validateFunc) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', () => {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            const { errors } = validateFunc(data);
            
            const fieldName = input.id.replace('crop', '').toLowerCase();
            if (errors[fieldName]) {
                showError(input, errors[fieldName]);
            } else if (input.value) {
                showSuccess(input);
            }
        });
        
        // Clear validation on focus
        input.addEventListener('focus', () => {
            clearValidation(input);
        });
    });
}