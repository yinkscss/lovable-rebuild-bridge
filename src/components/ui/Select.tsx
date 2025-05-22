
import React, { forwardRef } from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | React.ReactNode;
  fullWidth?: boolean;
  onChange?: (value: string | React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  fullWidth = true,
  id,
  className = '',
  required,
  onChange,
  placeholder,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      // This will handle both react-hook-form onChange and regular onChange
      onChange(e);
    }
  };
  
  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          onChange={handleChange}
          className={`
            block w-full appearance-none rounded-md border border-gray-300 shadow-sm
            focus:border-blue-500 focus:ring-blue-500 px-4 py-2 pr-8
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{typeof error === 'object' && error !== null && 'message' in error ? String(error.message) : String(error)}</p>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
