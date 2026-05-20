import './Card.css';

export default function Card({
  children,
  title,
  subtitle,
  headerAction,
  hoverable = false,
  className = '',
  noPadding = false,
  ...props
}) {
  const classes = [
    'card',
    hoverable && 'card--hoverable',
    noPadding && 'card--no-padding',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {(title || headerAction) && (
        <div className="card__header">
          <div className="card__header-text">
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {headerAction && <div className="card__header-action">{headerAction}</div>}
        </div>
      )}
      <div className={`card__body${noPadding ? ' card__body--no-padding' : ''}`}>
        {children}
      </div>
    </div>
  );
}
