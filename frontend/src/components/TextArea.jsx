import React from 'react';

const TextArea = ({ 
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  required = false,
  error = null,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${error ? 'border-red-500' : 'border-gray-300'}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default TextArea;
