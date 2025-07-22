import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error = false, fullWidth = true, ...props }, ref) => {
    const baseClasses = `
      px-4 py-3 border rounded-lg transition-all duration-200 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
      placeholder:text-gray-400
    `;
    
    const errorClasses = error 
      ? 'border-red-500 focus:ring-red-500' 
      : 'border-gray-300 hover:border-gray-400';
    
    const widthClasses = fullWidth ? 'w-full' : '';
    
    return (
      <input
        ref={ref}
        className={`${baseClasses} ${errorClasses} ${widthClasses} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;