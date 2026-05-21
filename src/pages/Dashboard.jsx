import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/domain/StatCard';
import StatusBadge from '../components/domain/StatusBadge';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { timeAgo } from '../utils/formatDate';
import { useAuth } from '../hooks/useAuth';
import { apiGet } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiGet('/reports/dashboard/')
      .then(({ data }) => setDashboard(data))
      .catch(() => setDashboard(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="dashboard">
        <PageHeader title="Overview" subtitle="Real-time status of field operations across all sectors." />
        <Card><p className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>Failed to load dashboard data.</p></Card>
      </div>
    );
  }

  const tasks = dashboard.tasks || {};
  const byStatus = tasks.by_status || {};
  const visits = dashboard.visits || {};
  const recentActivity = dashboard.recent_activity || [];

  const totalTasks = tasks.total || 0;
  const activeTasks = totalTasks - (byStatus.completed || 0) - (byStatus.cancelled || 0);
  const completedCount = byStatus.completed || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const highRiskVisits = visits.high_risk || 0;

  // Build critical tasks from recent activity (tasks that are in_progress or assigned)
  const taskActivity = recentActivity
    .filter(a => a.entity_type === 'task')
    .slice(0, 4)
    .map(a => ({
      id: a.entity_id,
      taskId: a.entity_id,
      title: a.description || '',
      assignee: a.user_profile?.username || 'Unknown',
      status: a.action === 'completed' ? 'completed' : a.action === 'created' ? 'pending' : 'in_progress',
    }));

  // Map recent activity for display
  const activityItems = recentActivity.slice(0, 6).map(a => ({
    id: a.id,
    user: a.user_profile?.username || a.user_profile?.first_name || 'System',
    action: a.description || `${a.action} ${a.entity_type} #${a.entity_id}`,
    timestamp: a.timestamp,
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
          value={activeTasks}
          trend={`${totalTasks} total`}
          trendLabel="in system"
          type="tasks"
        />
        <StatCard
          label="Visits Completed"
          value={visits.completed || 0}
          subtitle={`${visits.total || 0} total visits`}
          type="technicians"
        />
        <StatCard
          label="Completion Rate"
          value={completionRate}
          unit="%"
          progressBar
          type="completion"
        />
        <StatCard
          label="High-Risk Flags"
          value={highRiskVisits}
          subtitle="Requires attention"
          type="risk"
        />
      </div>

      {/* Content Grid */}
      <div className="dashboard__grid">
        {/* Critical Active Tasks */}
        <Card
          title="Recent Task Activity"
          headerAction={
            <button className="dashboard__view-all" onClick={() => navigate('/tasks')}>
              View All
            </button>
          }
          noPadding
          className="dashboard__tasks-card"
        >
          {taskActivity.length > 0 ? (
            <Table
              columns={taskColumns}
              data={taskActivity}
              onRowClick={(row) => navigate(`/tasks/${row.id}`)}
            />
          ) : (
            <p className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>No recent task activity.</p>
          )}
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
          {activityItems.length > 0 ? activityItems.map((item, idx) => (
            <div key={item.id} className="dashboard__activity-item">
              <div className="dashboard__activity-line">
                <div className="dashboard__activity-dot" />
                {idx < activityItems.length - 1 && <div className="dashboard__activity-connector" />}
              </div>
              <Avatar name={item.user} size="sm" />
              <div className="dashboard__activity-content">
                <p className="dashboard__activity-text">
                  <strong>{item.user}</strong> {item.action}
                </p>
                <span className="dashboard__activity-time">{timeAgo(item.timestamp)}</span>
              </div>
            </div>
          )) : (
            <p className="text-muted" style={{ textAlign: 'center', padding: '1rem' }}>No recent activity.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
