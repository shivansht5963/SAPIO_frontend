import './Input.css';

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  icon: Icon,
  required = false,
  disabled = false,
  className = '',
  id,
  ...props
}) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-group__label">
          {label}
          {required && <span className="input-group__required">*</span>}
        </label>
      )}
      <div className="input-group__wrapper">
        {Icon && (
          <span className="input-group__icon">
            <Icon size={16} />
          </span>
        )}
        <input
          id={inputId}
          type={type}
          className={`input-group__input ${Icon ? 'input-group__input--with-icon' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...props}
        />
      </div>
      {error && <p className="input-group__error">{error}</p>}
      {helperText && !error && <p className="input-group__helper">{helperText}</p>}
    </div>
  );
}
