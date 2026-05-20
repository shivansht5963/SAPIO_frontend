import { useAuth } from '../hooks/useAuth';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { ROLE_LABELS } from '../utils/constants';
import './Profile.css';

export default function Profile() {
  const { user, roleName } = useAuth();

  if (!user) return null;

  return (
    <div className="profile">
      <PageHeader title="Profile" subtitle="Your account details and preferences." />

      <Card className="profile__card">
        <div className="profile__header">
          <Avatar name={user.fullName} size="xl" />
          <div className="profile__info">
            <h2 className="profile__name">{user.fullName}</h2>
            <Badge color="blue" size="md">{roleName}</Badge>
            <p className="profile__id">Employee ID: {user.employeeId}</p>
          </div>
        </div>

        <div className="profile__details">
          <div className="profile__detail-row">
            <span className="profile__detail-label">Email</span>
            <span className="profile__detail-value">{user.email}</span>
          </div>
          <div className="profile__detail-row">
            <span className="profile__detail-label">Phone</span>
            <span className="profile__detail-value">{user.phone}</span>
          </div>
          <div className="profile__detail-row">
            <span className="profile__detail-label">Team</span>
            <span className="profile__detail-value">{user.teamName || 'N/A'}</span>
          </div>
          <div className="profile__detail-row">
            <span className="profile__detail-label">Region</span>
            <span className="profile__detail-value">{user.regionName || 'Global'}</span>
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
