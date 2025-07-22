import React from 'react';
import Input from '../ui/Input';
import ErrorMessage from '../ui/ErrorMessage';

interface FormFieldProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  disabled = false,
  autoComplete,
  className = ''
}) => {
  const fieldId = `field-${name}`;
  const errorId = `error-${name}`;

  return (
    <div className={`space-y-1 ${className}`}>
      <label 
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      
      <Input
        id={fieldId}
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        error={!!error}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
      />
      
      <ErrorMessage 
        message={error} 
        className="min-h-[1.25rem]"
      />
    </div>
  );
};

export default FormField;