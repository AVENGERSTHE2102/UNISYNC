import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  id,
  error,
  className = '',
  wrapperClassName = '',
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`form-group ${wrapperClassName}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`form-input ${error ? 'border-red-500' : ''} ${className}`.trim()}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
