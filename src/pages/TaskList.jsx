import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ClipboardX, Calendar } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import StatusBadge from '../components/domain/StatusBadge';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../hooks/useAuth';
import { hasPermission } from '../utils/roleConfig';
import { TASK_STATUS, TASK_STATUS_LABELS } from '../utils/constants';
import mockTasks from '../data/mockTasks';
import { formatDate, isOverdue } from '../utils/formatDate';
import './TaskList.css';
import { Search } from 'lucide-react';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  ...Object.entries(TASK_STATUS_LABELS).map(([val, label]) => ({ value: val, label })),
];

const teamOptions = [
  { value: '', label: 'All Teams' },
  { value: 'Alpha Squad', label: 'Alpha Squad' },
  { value: 'Bravo Team', label: 'Bravo Team' },
  { value: 'Charlie Unit', label: 'Charlie Unit' },
];

const regionOptions = [
  { value: '', label: 'All Regions' },
  { value: 'North', label: 'North' },
  { value: 'South', label: 'South' },
  { value: 'West', label: 'West' },
  { value: 'Northwest', label: 'Northwest' },
  { value: 'Southeast', label: 'Southeast' },
];

const PAGE_SIZE = 5;

export default function TaskList() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [statusFilter, setStatusFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const filtered = mockTasks.filter(task => {
    if (statusFilter && task.status !== statusFilter) return false;
    if (teamFilter && task.teamName !== teamFilter) return false;
    if (regionFilter && task.regionName !== regionFilter) return false;
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    {
      key: 'taskId',
      label: 'Task ID',
      width: '12%',
      render: (val) => <span className="tasklist__task-id">{`#${val}`}</span>,
    },
    { key: 'title', label: 'Description', width: '35%' },
    {
      key: 'assignedToName',
      label: 'Assignee',
      width: '20%',
      render: (val) => val ? (
        <div className="tasklist__assignee">
          <Avatar name={val} size="sm" />
          <span>{val}</span>
        </div>
      ) : <span className="text-muted">Unassigned</span>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '15%',
      render: (val, row) => {
        const overdueStatus = isOverdue(row.dueDate) && val !== 'completed' && val !== 'cancelled';
        return <StatusBadge status={overdueStatus ? 'overdue' : val} />;
      },
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      width: '18%',
      render: (val, row) => {
        const overdue = isOverdue(val) && row.status !== 'completed' && row.status !== 'cancelled';
        return <span className={overdue ? 'text-error' : ''}>{formatDate(val)}</span>;
      },
    },
  ];

  return (
    <div className="tasklist">
      <PageHeader
        title="Tasks"
        subtitle="Manage and track all field operations tasks."
        actions={
          hasPermission(role, 'canCreateTask') && (
            <Button variant="primary" icon={Plus} onClick={() => navigate('/tasks/create')}>
              New Dispatch
            </Button>
          )
        }
      />

      {/* Filters */}
      <div className="tasklist__filters">
        <Select
          label="Status"
          options={statusOptions}
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1); }}
          placeholder="All Statuses"
          className="tasklist__filter"
        />
        <Select
          label="Team"
          options={teamOptions}
          value={teamFilter}
          onChange={(v) => { setTeamFilter(v); setPage(1); }}
          placeholder="All Teams"
          className="tasklist__filter"
        />
        <Select
          label="Region"
          options={regionOptions}
          value={regionFilter}
          onChange={(v) => { setRegionFilter(v); setPage(1); }}
          placeholder="All Regions"
          className="tasklist__filter"
        />
        <div className="tasklist__search">
          <Input
            label="Search"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            icon={Search}
          />
        </div>
      </div>

      {/* Table */}
      <Card noPadding>
        <Table
          columns={columns}
          data={paged}
          onRowClick={(row) => navigate(`/tasks/${row.id}`)}
          emptyState={
            <EmptyState
              icon={ClipboardX}
              title="No tasks found"
              description="Try adjusting your filters or create a new task."
              actionLabel={hasPermission(role, 'canCreateTask') ? '+ Create Task' : undefined}
              onAction={hasPermission(role, 'canCreateTask') ? () => navigate('/tasks/create') : undefined}
            />
          }
        />
        {filtered.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </Card>
    </div>
  );
}
