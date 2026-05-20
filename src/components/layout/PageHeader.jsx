import './PageHeader.css';

export default function PageHeader({ title, subtitle, actions, backLink, className = '' }) {
  return (
    <div className={`page-header ${className}`}>
      <div className="page-header__text">
        {backLink && (
          <a href={backLink.href} className="page-header__back" onClick={backLink.onClick}>
            ← {backLink.label}
          </a>
        )}
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </div>
  );
}
