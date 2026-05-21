import { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { apiGet } from '../services/api';
import './Reports.css';

export default function Reports() {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [recentVisits, setRecentVisits] = useState([]);
  const [completionTime, setCompletionTime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.allSettled([
      apiGet('/reports/pending-tasks/'),
      apiGet('/reports/task-distribution/'),
      apiGet('/reports/recent-visits/'),
      apiGet('/reports/completion-time/'),
    ]).then(([pending, dist, visits, completion]) => {
      if (pending.status === 'fulfilled') {
        const data = pending.value.data;
        setPendingTasks(Array.isArray(data) ? data : data.results || []);
      }
      if (dist.status === 'fulfilled') {
        const data = dist.value.data;
        setDistribution(Array.isArray(data) ? data : data.results || []);
      }
      if (visits.status === 'fulfilled') {
        const data = visits.value.data;
        setRecentVisits(Array.isArray(data) ? data : data.results || []);
      }
      if (completion.status === 'fulfilled') {
        const data = completion.value.data;
        setCompletionTime(Array.isArray(data) ? data : data.results || []);
      }
    }).finally(() => setLoading(false));
  }, []);

  // Group distribution data by region for the pivot table
  const distributionByRegion = {};
  distribution.forEach(row => {
    const region = row.region_name || 'Unknown';
    if (!distributionByRegion[region]) {
      distributionByRegion[region] = { pending: 0, assigned: 0, in_progress: 0, completed: 0, cancelled: 0 };
    }
    distributionByRegion[region][row.task_status] = (distributionByRegion[region][row.task_status] || 0) + row.count;
  });

  // Format minutes into human-readable duration
  function formatDuration(minutes) {
    if (!minutes && minutes !== 0) return '—';
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  }

  if (loading) {
    return (
      <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="reports">
      <PageHeader
        title="Reports"
        subtitle="Operational analytics and performance metrics."
      />

      <div className="reports__grid">
        {/* Pending Tasks Overview */}
        <Card title="Pending Tasks Overview">
          <table className="reports__table">
            <thead>
              <tr>
                <th>Region</th>
                <th>Team</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {pendingTasks.length > 0 ? pendingTasks.map((row, i) => (
                <tr key={i}>
                  <td>{row.region_name || '—'}</td>
                  <td>{row.team_name || '—'}</td>
                  <td className={`reports__count ${row.pending_count >= 10 ? 'reports__count--high' : ''}`}>
                    {row.pending_count}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="reports__empty">No pending tasks</td></tr>
              )}
            </tbody>
          </table>
        </Card>

        {/* Agent Performance (Completion Time) */}
        <Card title="Agent Performance">
          <table className="reports__table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Avg Duration</th>
                <th>Total Visits</th>
              </tr>
            </thead>
            <tbody>
              {completionTime.length > 0 ? completionTime.map((row, i) => {
                const avgMin = row.avg_completion_minutes || 0;
                const isFast = avgMin < 120;
                const isSlow = avgMin > 240;
                return (
                  <tr key={i}>
                    <td>{row.agent_username || '—'} <span className="reports__emp-id">({row.agent_employee_id || ''})</span></td>
                    <td className={isFast ? 'reports__fast' : isSlow ? 'reports__slow' : ''}>
                      {formatDuration(avgMin)}
                    </td>
                    <td>{row.visit_count || 0}</td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={3} className="reports__empty">No agent performance data</td></tr>
              )}
            </tbody>
          </table>
        </Card>

        {/* Visit Activity */}
        <Card title="Visit Activity (Last 7 Days)">
          <table className="reports__table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Visits Completed</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {recentVisits.length > 0 ? recentVisits.map((row, i, arr) => {
                const prev = arr[i + 1];
                let trend = '—';
                let trendClass = '';
                if (prev) {
                  if (row.completed_count > prev.completed_count) {
                    trend = '↑';
                    trendClass = 'reports__trend-up';
                  } else if (row.completed_count < prev.completed_count) {
                    trend = '↓';
                    trendClass = 'reports__trend-down';
                  }
                }
                return (
                  <tr key={i}>
                    <td>{row.date || '—'}</td>
                    <td>{row.completed_count || 0}</td>
                    <td className={trendClass}>{trend}</td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={3} className="reports__empty">No recent visit data</td></tr>
              )}
            </tbody>
          </table>
        </Card>

        {/* Task Distribution by Region */}
        <Card title="Task Distribution by Region">
          <div className="reports__table-wrapper">
            <table className="reports__table reports__table--distribution">
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Pending</th>
                  <th>Assigned</th>
                  <th>In Progress</th>
                  <th>Completed</th>
                  <th>Cancelled</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(distributionByRegion).length > 0 ? Object.entries(distributionByRegion).map(([region, counts]) => (
                  <tr key={region}>
                    <td>{region}</td>
                    <td className="reports__cell--pending">{counts.pending || 0}</td>
                    <td className="reports__cell--assigned">{counts.assigned || 0}</td>
                    <td className="reports__cell--progress">{counts.in_progress || 0}</td>
                    <td className="reports__cell--completed">{counts.completed || 0}</td>
                    <td className="reports__cell--cancelled">{counts.cancelled || 0}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="reports__empty">No distribution data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
