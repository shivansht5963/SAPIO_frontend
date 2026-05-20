import './Badge.css';

const colorMap = {
  green: 'badge--green',
  amber: 'badge--amber',
  red: 'badge--red',
  blue: 'badge--blue',
  purple: 'badge--purple',
  gray: 'badge--gray',
  cyan: 'badge--cyan',
};

export default function Badge({ children, color = 'gray', size = 'md', dot = false, pulse = false, className = '' }) {
  const classes = [
    'badge',
    colorMap[color] || 'badge--gray',
    `badge--${size}`,
    dot && 'badge--dot',
    pulse && 'badge--pulse',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {dot && <span className="badge__dot" />}
      {children}
    </span>
  );
}
