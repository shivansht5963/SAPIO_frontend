import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import './UserInfo.css';

export default function UserInfo({ name, role, size = 'md', showRole = false, subtitle, className = '' }) {
  return (
    <div className={`user-info user-info--${size} ${className}`}>
      <Avatar name={name} size={size} />
      <div className="user-info__text">
        <span className="user-info__name">{name}</span>
        {showRole && role && <Badge color="blue" size="sm">{role}</Badge>}
        {subtitle && <span className="user-info__subtitle">{subtitle}</span>}
      </div>
    </div>
  );
}
