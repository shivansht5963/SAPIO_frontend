import './Avatar.css';

const AVATAR_COLORS = [
  '#1A56DB', '#7C3AED', '#0891B2', '#059669',
  '#D97706', '#DC2626', '#4F46E5', '#0D9488',
  '#9333EA', '#2563EB', '#DB2777', '#EA580C',
];

function getColorFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function Avatar({ name = '', size = 'md', src = null, className = '' }) {
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  const classes = ['avatar', `avatar--${size}`, className].filter(Boolean).join(' ');

  if (src) {
    return (
      <div className={classes}>
        <img src={src} alt={name} className="avatar__img" />
      </div>
    );
  }

  return (
    <div
      className={classes}
      style={{ backgroundColor: bgColor }}
      title={name}
    >
      <span className="avatar__initials">{initials}</span>
    </div>
  );
}
