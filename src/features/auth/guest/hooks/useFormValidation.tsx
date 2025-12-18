import { useState, useCallback } from 'react';

interface ValidationRules {
  [key: string]: (value: string) => string | undefined;
}

interface FormData {
  [key: string]: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const useFormValidation = (initialData: FormData, validationRules: ValidationRules) => {
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = useCallback((name: string, value: string): string | undefined => {
    const rule = validationRules[name];
    return rule ? rule(value) : undefined;
  }, [validationRules]);

  const validateAllFields = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, data[fieldName] || '');
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [data, validateField, validationRules]);

  const handleChange = useCallback((name: string, value: string) => {
    setData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, data[name] || '');
    setErrors(prev => ({ ...prev, [name]: error || '' }));
  }, [data, validateField]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAllFields,
    reset,
    isValid: Object.keys(errors).length === 0 || Object.values(errors).every(error => !error)
  };
};

// Validation rule helpers
export const validationRules = {
  email: (value: string): string | undefined => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return undefined;
  },

  password: (value: string): string | undefined => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters long';
    return undefined;
  },

  username: (value: string): string | undefined => {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters long';
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(value)) return 'Username can only contain letters, numbers, and underscores';
    return undefined;
  }
};

export default useFormValidation;