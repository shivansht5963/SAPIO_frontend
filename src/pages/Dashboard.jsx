import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/domain/StatCard';
import StatusBadge from '../components/domain/StatusBadge';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { timeAgo } from '../utils/formatDate';
import { useAuth } from '../hooks/useAuth';
import mockTasks from '../data/mockTasks';
import mockLogs from '../data/mockLogs';
import mockUsers from '../data/mockUsers';
import { ROLES, TASK_STATUS, TASK_PRIORITY } from '../utils/constants';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  // Dynamically filter data based on user role
  let visibleTasks = mockTasks;
  let visibleLogs = mockLogs;

  if (role === ROLES.FIELD_AGENT) {
    visibleTasks = mockTasks.filter(t => t.assignedTo === user.id);
    visibleLogs = mockLogs.filter(l => l.userId === user.id);
  } else if (role === ROLES.TEAM_LEAD) {
    visibleTasks = mockTasks.filter(t => t.teamScope === user.team);
    visibleLogs = mockLogs.filter(l => {
      const actor = mockUsers.find(u => u.id === l.userId);
      return actor && actor.team === user.team;
    });
  } else if (role === ROLES.REGIONAL_MANAGER) {
    visibleTasks = mockTasks.filter(t => t.regionScope === user.region);
    visibleLogs = mockLogs.filter(l => {
      const actor = mockUsers.find(u => u.id === l.userId);
      return actor && actor.region === user.region;
    });
  }

  const activeTasks = visibleTasks.filter(t => t.status !== TASK_STATUS.COMPLETED && t.status !== TASK_STATUS.CANCELLED);
  const completedTasks = visibleTasks.filter(t => t.status === TASK_STATUS.COMPLETED);
  const highRiskFlags = visibleTasks.filter(t => t.priority === TASK_PRIORITY.HIGH);
  
  const completionRate = visibleTasks.length > 0 
    ? Math.round((completedTasks.length / visibleTasks.length) * 100) 
    : 0;

  const stats = {
    activeTasks: {
      value: activeTasks.length,
      trend: '+5%',
      trendLabel: 'from last week',
    },
    techniciansAvailable: {
      value: role === ROLES.FIELD_AGENT ? 1 : mockUsers.filter(u => u.role === ROLES.FIELD_AGENT).length,
      subtitle: role === ROLES.FIELD_AGENT ? 'You are active' : 'Out of total agents',
    },
    completionRate: {
      value: completionRate,
      unit: '%',
    },
    highRiskFlags: {
      value: highRiskFlags.length,
      subtitle: 'Requires attention',
    },
  };

  const criticalTasks = activeTasks
    .filter(t => t.priority === TASK_PRIORITY.HIGH)
    .slice(0, 4);

  const recentActivity = visibleLogs.slice(0, 5).map(l => ({
    id: l.id,
    user: l.userName,
    action: l.description,
    timestamp: l.timestamp,
  }));

  const taskColumns = [
    { key: 'taskId', label: 'Task ID', render: (val) => <span className="dashboard__task-id">{`#${val}`}</span> },
    { key: 'title', label: 'Description' },
    { key: 'assignee', label: 'Assignee', render: (val) => (
      <div className="dashboard__assignee">
        <Avatar name={val} size="sm" />
        <span>{val}</span>
      </div>
    )},
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
  ];

  return (
    <div className="dashboard">
      <PageHeader
        title="Overview"
        subtitle="Real-time status of field operations across all sectors."
        actions={
          <Button variant="secondary" icon={Download}>Export Report</Button>
        }
      />

      {/* Stat Cards */}
      <div className="dashboard__stats">
        <StatCard
          label="Active Tasks"
          value={stats.activeTasks.value}
          trend={stats.activeTasks.trend}
          trendLabel={stats.activeTasks.trendLabel}
          type="tasks"
        />
        <StatCard
          label="Technicians Available"
          value={stats.techniciansAvailable.value}
          subtitle={stats.techniciansAvailable.subtitle}
          type="technicians"
        />
        <StatCard
          label="Completion Rate"
          value={stats.completionRate.value}
          unit="%"
          progressBar
          type="completion"
        />
        <StatCard
          label="High-Risk Flags"
          value={stats.highRiskFlags.value}
          subtitle={stats.highRiskFlags.subtitle}
          type="risk"
        />
      </div>

      {/* Content Grid */}
      <div className="dashboard__grid">
        {/* Critical Active Tasks */}
        <Card
          title="Critical Active Tasks"
          headerAction={
            <button className="dashboard__view-all" onClick={() => navigate('/tasks')}>
              View All
            </button>
          }
          noPadding
          className="dashboard__tasks-card"
        >
          <Table
            columns={taskColumns}
            data={criticalTasks}
            onRowClick={(row) => navigate(`/tasks/${row.id}`)}
          />
        </Card>

        {/* Fleet Locations (placeholder) */}
        <Card title="Fleet Locations" className="dashboard__map-card">
          <div className="dashboard__map-placeholder">
            <div className="dashboard__map-bg">
              <div className="dashboard__map-dot" style={{ top: '30%', left: '25%' }} />
              <div className="dashboard__map-dot" style={{ top: '45%', left: '55%' }} />
              <div className="dashboard__map-dot" style={{ top: '60%', left: '40%' }} />
              <div className="dashboard__map-dot" style={{ top: '35%', left: '70%' }} />
              <div className="dashboard__map-dot" style={{ top: '50%', left: '30%' }} />
              <div className="dashboard__map-dot" style={{ top: '70%', left: '65%' }} />
              <p className="dashboard__map-text">Fleet tracking map integration</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity" className="dashboard__activity-card">
        <div className="dashboard__activity-list">
          {recentActivity.map((item, idx) => (
            <div key={item.id} className="dashboard__activity-item">
              <div className="dashboard__activity-line">
                <div className="dashboard__activity-dot" />
                {idx < recentActivity.length - 1 && <div className="dashboard__activity-connector" />}
              </div>
              <Avatar name={item.user} size="sm" />
              <div className="dashboard__activity-content">
                <p className="dashboard__activity-text">
                  <strong>{item.user}</strong> {item.action}
                </p>
                <span className="dashboard__activity-time">{timeAgo(item.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
