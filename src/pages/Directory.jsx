import { useState } from 'react';
import { MoreVertical, Search } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import mockUsers from '../data/mockUsers';
import { ROLES } from '../utils/constants';
import './Directory.css';

const regionOptions = [
  { value: '', label: 'All Regions' },
  { value: 'North', label: 'North' },
  { value: 'Northwest', label: 'Northwest' },
  { value: 'South', label: 'South' },
  { value: 'Southeast', label: 'Southeast' },
  { value: 'West', label: 'West' },
];

const teamOptions = [
  { value: '', label: 'All Teams' },
  { value: 'Alpha Squad', label: 'Alpha Squad' },
  { value: 'Bravo Team', label: 'Bravo Team' },
];

export default function Directory() {
  const [regionFilter, setRegionFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const agents = mockUsers.filter(u =>
    u.role === ROLES.FIELD_AGENT || u.role === ROLES.TEAM_LEAD
  );

  const filtered = agents.filter(user => {
    if (regionFilter && user.regionName !== regionFilter) return false;
    if (teamFilter && user.teamName !== teamFilter) return false;
    if (searchTerm && !user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const columns = [
    {
      key: 'fullName',
      label: 'Agent',
      width: '25%',
      render: (val, row) => (
        <div className="directory__agent">
          <Avatar name={val} size="md" />
          <div className="directory__agent-info">
            <span className="directory__agent-name">{val}</span>
            <span className="directory__agent-id">ID: {row.employeeId}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      width: '12%',
      render: (val, row) => (
        <Badge color="green" dot size="md">
          {val ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    { key: 'regionName', label: 'Region', width: '15%' },
    { key: 'teamName', label: 'Team', width: '15%' },
    {
      key: 'email',
      label: 'Contact',
      width: '25%',
      render: (val, row) => (
        <div className="directory__contact">
          <span className="directory__email">{val}</span>
          <span className="directory__phone">{row.phone}</span>
        </div>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      width: '8%',
      render: () => (
        <button className="directory__actions-btn" aria-label="More actions">
          <MoreVertical size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="directory">
      <PageHeader
        title="Team Directory"
        subtitle="Manage and monitor field agents across all regions."
        actions={
          <div className="directory__header-filters">
            <Select
              options={regionOptions}
              value={regionFilter}
              onChange={setRegionFilter}
              placeholder="All Regions"
            />
            <Select
              options={teamOptions}
              value={teamFilter}
              onChange={setTeamFilter}
              placeholder="All Teams"
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
          placeholder="Search agents..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <Card noPadding>
        <Table columns={columns} data={filtered} />
      </Card>
    </div>
  );
}
