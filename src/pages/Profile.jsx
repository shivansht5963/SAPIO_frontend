import { useAuth } from '../hooks/useAuth';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { ROLE_LABELS } from '../utils/constants';
import './Profile.css';

export default function Profile() {
  const { user, roleName } = useAuth();

  if (!user) {
    return (
      <div className="profile">
        <PageHeader title="Profile" subtitle="Your account details and preferences." />
        <Card className="profile__card">
          <p className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>
            Unable to load profile data. Please try logging out and back in.
          </p>
        </Card>
      </div>
    );
  }

  const displayName = user.fullName || user.username || 'User';
  const displayRole = roleName || ROLE_LABELS[user.role] || user.role || 'Unknown Role';

  return (
    <div className="profile">
      <PageHeader title="Profile" subtitle="Your account details and preferences." />

      <Card className="profile__card">
        <div className="profile__header">
          <Avatar name={displayName} size="xl" />
          <div className="profile__info">
            <h2 className="profile__name">{displayName}</h2>
            <Badge color="blue" size="md">{displayRole}</Badge>
            {user.employeeId && (
              <p className="profile__id">Employee ID: {user.employeeId}</p>
            )}
          </div>
        </div>

        <div className="profile__details">
          <div className="profile__detail-row">
            <span className="profile__detail-label">Username</span>
            <span className="profile__detail-value">{user.username || '—'}</span>
          </div>
          <div className="profile__detail-row">
            <span className="profile__detail-label">Email</span>
            <span className="profile__detail-value">{user.email || '—'}</span>
          </div>
          <div className="profile__detail-row">
            <span className="profile__detail-label">Phone</span>
            <span className="profile__detail-value">{user.phone || '—'}</span>
          </div>
          <div className="profile__detail-row">
            <span className="profile__detail-label">Team</span>
            <span className="profile__detail-value">{user.teamName || '—'}</span>
          </div>
          <div className="profile__detail-row">
            <span className="profile__detail-label">Region</span>
            <span className="profile__detail-value">{user.regionName || '—'}</span>
          </div>
          <div className="profile__detail-row">
            <span className="profile__detail-label">Status</span>
            <Badge color="green" dot size="md">Active</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
