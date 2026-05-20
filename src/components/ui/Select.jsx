import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './Select.css';

export default function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  icon: Icon,
  required = false,
  disabled = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`select-group ${className}`} ref={ref}>
      {label && (
        <label className="select-group__label">
          {label}
          {required && <span className="select-group__required">*</span>}
        </label>
      )}
      <button
        type="button"
        className={`select-group__trigger ${isOpen ? 'select-group__trigger--open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {Icon && <Icon size={16} className="select-group__icon" />}
        <span className={selected ? 'select-group__value' : 'select-group__placeholder'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} className={`select-group__arrow ${isOpen ? 'select-group__arrow--open' : ''}`} />
      </button>
      {isOpen && (
        <div className="select-group__dropdown">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              className={`select-group__option ${option.value === value ? 'select-group__option--selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
