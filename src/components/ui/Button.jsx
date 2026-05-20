import './Button.css';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
  onClick,
  ...props
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full',
    loading && 'btn--loading',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 className="btn__spinner" size={size === 'sm' ? 14 : 16} />
      ) : (
        <>
          {Icon && !iconRight && <Icon className="btn__icon" size={size === 'sm' ? 14 : 16} />}
          {children && <span className="btn__label">{children}</span>}
          {Icon && iconRight && <Icon className="btn__icon" size={size === 'sm' ? 14 : 16} />}
        </>
      )}
    </button>
  );
}
