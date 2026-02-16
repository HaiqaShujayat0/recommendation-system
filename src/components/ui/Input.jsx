import React from 'react';

/**
 * Reusable Input component for forms.
 * Works with react-hook-form or standalone.
 * 
 * @param {string} label - Field label
 * @param {string} type - Input type (text, number, date, etc.)
 * @param {string} value - Current value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {boolean} required - Is field required
 * @param {string} error - Error message to display
 * @param {object} register - react-hook-form register function (optional)
 */
export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  error,
  register,
  name,
  ...rest
}) {
  // If using react-hook-form, use register; otherwise use controlled input
  const inputProps = register
    ? register(name, { required: required && `${label} is required` })
    : {
        value,
        onChange: (e) => onChange(e.target.value),
      };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        {...inputProps}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none text-sm transition-colors ${
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-slate-200 focus:border-primary-500'
        }`}
        placeholder={placeholder}
        {...rest}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
