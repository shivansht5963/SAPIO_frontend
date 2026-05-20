import { useState } from 'react';
import { Download, Calendar, Search } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import mockLogs, { TOTAL_LOG_COUNT } from '../data/mockLogs';
import { formatTimestamp } from '../utils/formatDate';
import './ActivityLogs.css';

const timeRangeOptions = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'all', label: 'All Time' },
];

const eventTypeOptions = [
  { value: '', label: 'All Events' },
  { value: 'created', label: 'Created' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'started', label: 'Started' },
  { value: 'completed', label: 'Completed' },
  { value: 'status_changed', label: 'Status Changed' },
  { value: 'updated', label: 'Updated' },
];

const PAGE_SIZE = 5;

export default function ActivityLogs() {
  const [timeRange, setTimeRange] = useState('7d');
  const [eventType, setEventType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const filtered = mockLogs.filter(log => {
    if (eventType && log.action !== eventType) return false;
    if (searchTerm && !log.userName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(TOTAL_LOG_COUNT / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusColor = (s) => s === 'success' ? 'green' : s === 'denied' ? 'red' : 'gray';

  const columns = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      width: '18%',
      render: (val) => <span className="logs__timestamp">{formatTimestamp(val)}</span>,
    },
    {
      key: 'userName',
      label: 'Actor',
      width: '15%',
      render: (val, row) => (
        <div className="logs__actor">
          <Avatar name={val} size="sm" />
          <span>{val}</span>
        </div>
      ),
    },
    {
      key: 'actionLabel',
      label: 'Action Event',
      width: '20%',
      render: (val, row) => (
        <span className="logs__action">
          {val}
          {row.action === 'status_changed' && (
            <Badge color="blue" size="sm" className="logs__action-badge">IN_PROGRESS</Badge>
          )}
        </span>
      ),
    },
    {
      key: 'entityLabel',
      label: 'Target Entity',
      width: '18%',
      render: (val) => <span className="logs__entity link">{val}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: (val) => <Badge color={statusColor(val)} size="sm" dot>{val.charAt(0).toUpperCase() + val.slice(1)}</Badge>,
    },
    {
      key: 'originIp',
      label: 'Origin IP',
      width: '17%',
      render: (val) => <code className="logs__ip">{val}</code>,
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
        <Select
          label="Time Range"
          options={timeRangeOptions}
          value={timeRange}
          onChange={setTimeRange}
          icon={Calendar}
          className="logs__filter"
        />
        <div className="logs__filter-search">
          <label className="logs__filter-label">Actor / User</label>
          <div className="logs__search-wrapper">
            <Search size={16} className="logs__search-icon" />
            <input
              type="text"
              className="logs__search-input"
              placeholder="Search by name or ID..."
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
        <Table columns={columns} data={paged} />
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={TOTAL_LOG_COUNT}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}
