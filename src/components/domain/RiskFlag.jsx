import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import Badge from '../ui/Badge';
import { RISK_LEVELS, RISK_LABELS } from '../../utils/constants';
import './RiskFlag.css';

const riskConfig = {
  [RISK_LEVELS.LOW]: { color: 'green', icon: ShieldCheck },
  [RISK_LEVELS.MEDIUM]: { color: 'amber', icon: AlertTriangle },
  [RISK_LEVELS.HIGH]: { color: 'red', icon: ShieldAlert },
};

export default function RiskFlag({ level, size = 'md' }) {
  const config = riskConfig[level] || riskConfig[RISK_LEVELS.LOW];
  const Icon = config.icon;
  const isHigh = level === RISK_LEVELS.HIGH;

  return (
    <div className={`risk-flag ${isHigh ? 'risk-flag--pulse' : ''}`}>
      <Badge color={config.color} size={size}>
        <Icon size={size === 'sm' ? 12 : 14} />
        {RISK_LABELS[level] || level}
      </Badge>
    </div>
  );
}
