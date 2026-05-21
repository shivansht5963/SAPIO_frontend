import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, HelpCircle, Settings, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS } from '../../utils/constants';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import './TopBar.css';

export default function TopBar({ onMenuClick }) {
  const { user, roleName, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
    setUserMenuOpen(false);
  }

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
          <Menu size={20} />
        </button>
        <div className="topbar__search">
          <Search size={16} className="topbar__search-icon" />
          <input
            type="text"
            className="topbar__search-input"
            placeholder="Search across FFMS..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="topbar__right">
        <button className="topbar__icon-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="topbar__notification-badge">3</span>
        </button>
        <button className="topbar__icon-btn" aria-label="Help">
          <HelpCircle size={20} />
        </button>
        <button className="topbar__icon-btn" aria-label="Settings">
          <Settings size={20} />
        </button>

        {/* User menu */}
        <div className="topbar__user" ref={menuRef}>
          <button
            className="topbar__user-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            aria-label="User menu"
          >
            <Avatar name={user?.fullName || 'User'} size="sm" />
          </button>

          {userMenuOpen && (
            <div className="topbar__dropdown">
              <div className="topbar__dropdown-header">
                <Avatar name={user?.fullName || 'User'} size="md" />
                <div>
                  <p className="topbar__dropdown-name">{user?.fullName}</p>
                  <Badge color="blue" size="sm">{roleName}</Badge>
                </div>
              </div>
              <div className="topbar__dropdown-divider" />

              <button
                className="topbar__dropdown-item"
                onClick={() => { navigate('/profile'); setUserMenuOpen(false); }}
              >
                <User size={14} />
                My Profile
              </button>

              <div className="topbar__dropdown-divider" />
              <button className="topbar__dropdown-item topbar__dropdown-item--danger" onClick={handleLogout}>
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
