import { TrendingUp, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import './StatCard.css';

const iconMap = {
  tasks: TrendingUp,
  technicians: Users,
  completion: CheckCircle,
  risk: AlertTriangle,
};

const colorMap = {
  tasks: 'blue',
  technicians: 'blue',
  completion: 'green',
  risk: 'red',
};

export default function StatCard({
  label,
  value,
  unit = '',
  subtitle,
  trend,
  trendLabel,
  type = 'tasks',
  progressBar = false,
  className = '',
}) {
  const Icon = iconMap[type] || TrendingUp;
  const color = colorMap[type] || 'blue';

  return (
    <div className={`stat-card stat-card--${color} ${className}`}>
      <div className="stat-card__header">
        <span className="stat-card__label">{label}</span>
        <Icon size={20} className="stat-card__icon" />
      </div>
      <div className="stat-card__value">
        {value}{unit && <span className="stat-card__unit">{unit}</span>}
      </div>
      {progressBar && (
        <div className="stat-card__progress">
          <div className="stat-card__progress-bar" style={{ width: `${value}%` }} />
        </div>
      )}
      {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
      {trend && (
        <p className="stat-card__trend">
          <TrendingUp size={14} />
          <span>{trend} {trendLabel}</span>
        </p>
      )}
    </div>
  );
}
