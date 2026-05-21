import { useAuth } from '../hooks/useAuth';
import { User, Mail, Phone, Users, MapPin, Activity, BadgeCheck } from 'lucide-react';
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
      <div className="profile profile--centered">
        <div className="profile__container">
          <Card className="profile__card">
            <p className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>
              Unable to load profile data. Please try logging out and back in.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const displayName = user.fullName || user.username || 'User';
  const displayRole = roleName || ROLE_LABELS[user.role] || user.role || 'Unknown Role';

  return (
    <div className="profile profile--centered">
      <div className="profile__container">
        <Card className="profile__card">
          <div className="profile__header">
            <Avatar name={displayName} size="xl" />
            <div className="profile__info">
              <h2 className="profile__name">{displayName}</h2>
              <Badge color="blue" size="md">
                <BadgeCheck size={14} style={{ marginRight: '6px' }} />
                {displayRole}
              </Badge>
              {user.employeeId && (
                <p className="profile__id">Employee ID: {user.employeeId}</p>
              )}
            </div>
          </div>

          <div className="profile__details">
            <div className="profile__detail-row">
              <div className="profile__detail-label-group">
                <User size={18} className="profile__detail-icon" />
                <span className="profile__detail-label">Username</span>
              </div>
              <span className="profile__detail-value">{user.username || '—'}</span>
            </div>
            
            <div className="profile__detail-row">
              <div className="profile__detail-label-group">
                <Mail size={18} className="profile__detail-icon" />
                <span className="profile__detail-label">Email</span>
              </div>
              <span className="profile__detail-value">{user.email || '—'}</span>
            </div>
            
            <div className="profile__detail-row">
              <div className="profile__detail-label-group">
                <Phone size={18} className="profile__detail-icon" />
                <span className="profile__detail-label">Phone</span>
              </div>
              <span className="profile__detail-value">{user.phone || '—'}</span>
            </div>
            
            <div className="profile__detail-row">
              <div className="profile__detail-label-group">
                <Users size={18} className="profile__detail-icon" />
                <span className="profile__detail-label">Team</span>
              </div>
              <span className="profile__detail-value">{user.teamName || '—'}</span>
            </div>
            
            <div className="profile__detail-row">
              <div className="profile__detail-label-group">
                <MapPin size={18} className="profile__detail-icon" />
                <span className="profile__detail-label">Region</span>
              </div>
              <span className="profile__detail-value">{user.regionName || '—'}</span>
            </div>
            
            <div className="profile__detail-row">
              <div className="profile__detail-label-group">
                <Activity size={18} className="profile__detail-icon" />
                <span className="profile__detail-label">Status</span>
              </div>
              <Badge color="green" dot size="md">Active</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
