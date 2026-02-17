import React from 'react';

/**
 * Reusable Input component — clean medical-portal styling.
 * Purple focus ring, clear error states.
 */
const Input = React.forwardRef(
  (
    {
      label,
      type = 'text',
      value,
      onChange,
      placeholder,
      required,
      error,
      name,
      className = '',
      ...rest
    },
    ref
  ) => {
    const hasError = Boolean(error);
    const fieldId = name || label?.toLowerCase().replace(/\s+/g, '-');
    const errorId = hasError ? `${fieldId}-error` : undefined;

    return (
      <div className={className}>
        {label && (
          <label
            className="block text-sm font-semibold text-slate-700 mb-1.5"
            htmlFor={fieldId}
          >
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          name={name}
          id={fieldId}
          aria-invalid={hasError || undefined}
          aria-describedby={errorId}
          className={`w-full px-3.5 py-2.5 border-2 rounded-xl focus:outline-none text-sm transition-all duration-200 placeholder:text-slate-400 bg-white ${hasError
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/40'
            : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 hover:border-slate-300'
            }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...rest}
        />
        {hasError && (
          <p
            className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5 animate-fade-in font-medium"
            id={errorId}
          >
            <svg
              className="w-3.5 h-3.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
