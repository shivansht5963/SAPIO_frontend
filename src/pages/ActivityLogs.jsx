import { useState, useEffect } from 'react';
import { Download, Calendar, Search } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';
import { apiGet } from '../services/api';
import { formatTimestamp } from '../utils/formatDate';
import './ActivityLogs.css';

const eventTypeOptions = [
  { value: '', label: 'All Events' },
  { value: 'created', label: 'Created' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'started', label: 'Started' },
  { value: 'completed', label: 'Completed' },
  { value: 'status_changed', label: 'Status Changed' },
];

const PAGE_SIZE = 10;

export default function ActivityLogs() {
  const [eventType, setEventType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Build query params
    const params = new URLSearchParams();
    params.set('page', page);
    if (eventType) params.set('action', eventType);

    apiGet(`/logs/?${params.toString()}`)
      .then(({ data }) => {
        const results = data.results || data || [];
        setLogs(Array.isArray(results) ? results : []);
        setTotalCount(data.count || results.length || 0);
      })
      .catch(() => {
        setLogs([]);
        setTotalCount(0);
      })
      .finally(() => setLoading(false));
  }, [page, eventType]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Client-side search filter on top of server results
  const filtered = searchTerm
    ? logs.filter(log => {
        const actor = log.user_profile?.username || log.user_profile?.first_name || '';
        return actor.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : logs;

  // Normalize logs for table display
  const tableData = filtered.map(log => {
    const userProfile = log.user_profile || {};
    const actor = userProfile.username || userProfile.first_name || 'System';
    const actionLabels = {
      created: 'Created',
      assigned: 'Assigned',
      started: 'Started',
      completed: 'Completed',
      status_changed: 'Status Changed',
    };

    return {
      id: log.id,
      timestamp: log.timestamp,
      userName: actor,
      action: log.action,
      actionLabel: actionLabels[log.action] || log.action,
      entityLabel: `${log.entity_type || ''} #${log.entity_id || ''}`,
      entityType: log.entity_type,
      description: log.description || '',
      status: 'success',
    };
  });

  const statusColor = (s) => s === 'success' ? 'green' : s === 'denied' ? 'red' : 'gray';

  const columns = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      width: '20%',
      render: (val) => <span className="logs__timestamp">{formatTimestamp(val)}</span>,
    },
    {
      key: 'userName',
      label: 'Actor',
      width: '16%',
      render: (val) => (
        <div className="logs__actor">
          <Avatar name={val} size="sm" />
          <span>{val}</span>
        </div>
      ),
    },
    {
      key: 'actionLabel',
      label: 'Action Event',
      width: '16%',
      render: (val, row) => (
        <span className="logs__action">
          {val}
          {row.action === 'status_changed' && (
            <Badge color="blue" size="sm" className="logs__action-badge">STATUS</Badge>
          )}
        </span>
      ),
    },
    {
      key: 'entityLabel',
      label: 'Target Entity',
      width: '14%',
      render: (val) => <span className="logs__entity link">{val}</span>,
    },
    {
      key: 'description',
      label: 'Details',
      width: '22%',
      render: (val) => <span className="logs__description">{val}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: (val) => <Badge color={statusColor(val)} size="sm" dot>Success</Badge>,
    },
  ];

  return (
    <div className="logs">
      <PageHeader
        title="Activity & Audit Logs"
        subtitle="System-wide chronological tracking of administrative and field events."
        actions={
          <Button variant="secondary" icon={Download}>Export CSV</Button>
        }
      />

      {/* Filters */}
      <div className="logs__filters">
        <div className="logs__filter-search">
          <label className="logs__filter-label">Actor / User</label>
          <div className="logs__search-wrapper">
            <Search size={16} className="logs__search-icon" />
            <input
              type="text"
              className="logs__search-input"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Select
          label="Event Type"
          options={eventTypeOptions}
          value={eventType}
          onChange={(v) => { setEventType(v); setPage(1); }}
          className="logs__filter"
        />
      </div>

      {/* Table */}
      <Card noPadding>
        {loading ? (
          <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
            <Spinner size="md" />
          </div>
        ) : (
          <>
            <Table columns={columns} data={tableData} />
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalCount}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>
    </div>
  );
}
