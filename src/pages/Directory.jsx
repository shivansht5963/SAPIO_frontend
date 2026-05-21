import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';
import { getUsers } from '../services/userService';
import { ROLE_LABELS } from '../utils/constants';
import './Directory.css';

const roleOptions = [
  { value: '', label: 'All Roles' },
  { value: 'field_agent', label: 'Field Agent' },
  { value: 'team_lead', label: 'Team Lead' },
  { value: 'regional_manager', label: 'Regional Manager' },
  { value: 'admin', label: 'Admin' },
  { value: 'auditor', label: 'Auditor' },
];

export default function Directory() {
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    getUsers(page)
      .then(data => {
        setUsers(data.results || []);
        setTotalCount(data.count || 0);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => {
        setUsers([]);
        setTotalCount(0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  // Client-side filtering on the current page results
  const filtered = users.filter(user => {
    if (roleFilter && user.role !== roleFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const match = (user.fullName || '').toLowerCase().includes(term)
        || (user.username || '').toLowerCase().includes(term)
        || (user.employeeId || '').toLowerCase().includes(term);
      if (!match) return false;
    }
    return true;
  });

  const columns = [
    {
      key: 'fullName',
      label: 'User',
      width: '25%',
      render: (val, row) => (
        <div className="directory__agent">
          <Avatar name={val || row.username} size="md" />
          <div className="directory__agent-info">
            <span className="directory__agent-name">{val || row.username}</span>
            <span className="directory__agent-id">{row.employeeId || `@${row.username}`}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      width: '15%',
      render: (val) => (
        <Badge
          color={val === 'admin' ? 'red' : val === 'field_agent' ? 'green' : val === 'team_lead' ? 'blue' : 'gray'}
          size="sm"
        >
          {ROLE_LABELS[val] || val}
        </Badge>
      ),
    },
    { key: 'team', label: 'Team', width: '15%', render: (val) => val || '—' },
    { key: 'region', label: 'Region', width: '15%', render: (val) => val || '—' },
    {
      key: 'username',
      label: 'Username',
      width: '15%',
      render: (val) => <code className="directory__username">@{val}</code>,
    },
  ];

  return (
    <div className="directory">
      <PageHeader
        title="Team Directory"
        subtitle="Manage and monitor team members across all regions."
        actions={
          <div className="directory__header-filters">
            <Select
              options={roleOptions}
              value={roleFilter}
              onChange={(v) => { setRoleFilter(v); }}
              placeholder="All Roles"
            />
          </div>
        }
      />

      {/* Search */}
      <div className="directory__search-bar">
        <Search size={16} className="directory__search-icon" />
        <input
          type="text"
          className="directory__search-input"
          placeholder="Search by name, username, or employee ID..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <Card noPadding>
        {loading ? (
          <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
            <Spinner size="md" />
          </div>
        ) : filtered.length > 0 ? (
          <>
            <Table columns={columns} data={filtered} />
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalCount}
              pageSize={10}
              onPageChange={setPage}
            />
          </>
        ) : (
          <p className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>
            {users.length === 0 ? 'No users found.' : 'No users match your filters.'}
          </p>
        )}
      </Card>
    </div>
  );
}
