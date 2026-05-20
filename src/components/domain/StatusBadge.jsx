import Badge from '../ui/Badge';
import { TASK_STATUS, TASK_STATUS_LABELS } from '../../utils/constants';

const statusColorMap = {
  [TASK_STATUS.PENDING]: 'amber',
  [TASK_STATUS.ASSIGNED]: 'blue',
  [TASK_STATUS.IN_PROGRESS]: 'blue',
  [TASK_STATUS.COMPLETED]: 'green',
  [TASK_STATUS.CANCELLED]: 'red',
  'overdue': 'red',
};

export default function StatusBadge({ status, size = 'md' }) {
  const color = statusColorMap[status] || 'gray';
  const label = status === 'overdue' ? 'Overdue' : (TASK_STATUS_LABELS[status] || status);

  return (
    <Badge color={color} size={size} dot={status === TASK_STATUS.IN_PROGRESS || status === 'overdue'}>
      {label}
    </Badge>
  );
}
