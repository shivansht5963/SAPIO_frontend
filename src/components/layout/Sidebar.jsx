import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getSidebarLinksForRole, hasPermission } from '../../utils/roleConfig';
import Button from '../ui/Button';
import './Sidebar.css';

function SapioLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sapio-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="sapio-inner" x1="10" y1="8" x2="30" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#sapio-grad)" />
      {/* Stylized S made of two arcs */}
      <path
        d="M24.5 14.5C24.5 14.5 23 11.5 19.5 11.5C16 11.5 14 13.5 14 16C14 21 26 18 26 24C26 26.5 24 28.5 20 28.5C16 28.5 14.5 25.5 14.5 25.5"
        stroke="url(#sapio-inner)"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* AI dot accent */}
      <circle cx="30" cy="10" r="3" fill="#a78bfa" opacity="0.7" />
    </svg>
  );
}

export default function Sidebar({ collapsed, onToggleCollapse }) {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const groups = getSidebarLinksForRole(role);

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar__logo">
        <SapioLogo size={36} />
        {!collapsed && (
          <div className="sidebar__logo-text">
            <span className="sidebar__logo-title">SAPIO</span>
            <span className="sidebar__logo-subtitle">Field Force Mgmt</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {groups.map(group => (
          <div key={group.group} className="sidebar__group">
            {!collapsed && <span className="sidebar__group-label">{group.group}</span>}
            <ul className="sidebar__list">
              {group.items.map(item => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon size={20} strokeWidth={1.5} className="sidebar__link-icon" />
                      {!collapsed && <span className="sidebar__link-label">{item.label}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* New Dispatch button */}
      {hasPermission(role, 'canCreateTask') && (
        <div className="sidebar__footer">
          <Button
            variant="primary"
            icon={Plus}
            fullWidth
            onClick={() => navigate('/tasks/create')}
            className="sidebar__new-btn"
          >
            {!collapsed && 'New Dispatch'}
          </Button>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        className="sidebar__toggle"
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
