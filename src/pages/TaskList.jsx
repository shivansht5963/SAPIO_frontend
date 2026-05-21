import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ClipboardX, Search } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import StatusBadge from '../components/domain/StatusBadge';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../hooks/useAuth';
import { hasPermission } from '../utils/roleConfig';
import { TASK_STATUS_LABELS } from '../utils/constants';
import { getTasks, API_PAGE_SIZE } from '../services/taskService';
import { formatDate, isOverdue } from '../utils/formatDate';
import './TaskList.css';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  ...Object.entries(TASK_STATUS_LABELS).map(([val, label]) => ({ value: val, label })),
];

export default function TaskList() {
  const navigate = useNavigate();
  const { role, permissions } = useAuth();

  // Server-side pagination
  const [page, setPage] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Client-side filters (on current page only)
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch tasks when page changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getTasks(page)
      .then((data) => {
        if (cancelled) return;
        setTasks(data.results);
        setTotalCount(data.count);
        setTotalPages(data.totalPages);
      })
      .catch((err) => {
        if (cancelled) return;
        const detail = err.response?.data?.detail;
        setError(detail || 'Failed to load tasks. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [page]);

  // Client-side filtering on the current page
  const filtered = tasks.filter(task => {
    if (statusFilter && task.status !== statusFilter) return false;
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

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
          hasPermission(role, 'canCreateTask', permissions) && (
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
          onChange={(v) => { setStatusFilter(v); }}
          placeholder="All Statuses"
          className="tasklist__filter"
        />
        <div className="tasklist__search">
          <Input
            label="Search"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); }}
            icon={Search}
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card>
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-error, #ef4444)' }}>
            <p>{error}</p>
            <Button variant="secondary" onClick={() => { setPage(1); }} style={{ marginTop: '1rem' }}>
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {loading && !error && (
        <Card>
          <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
            <Spinner size="lg" />
          </div>
        </Card>
      )}

      {/* Table */}
      {!loading && !error && (
        <Card noPadding>
          <Table
            columns={columns}
            data={filtered}
            onRowClick={(row) => navigate(`/tasks/${row.id}`)}
            emptyState={
              <EmptyState
                icon={ClipboardX}
                title="No tasks found"
                description={tasks.length > 0 ? "Try adjusting your filters." : "No tasks available yet."}
                actionLabel={hasPermission(role, 'canCreateTask', permissions) ? '+ Create Task' : undefined}
                onAction={hasPermission(role, 'canCreateTask', permissions) ? () => navigate('/tasks/create') : undefined}
              />
            }
          />
          {totalCount > 0 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalCount}
              pageSize={API_PAGE_SIZE}
              onPageChange={setPage}
            />
          )}
        </Card>
      )}
    </div>
  );
}
