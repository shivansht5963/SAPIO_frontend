import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getSidebarLinksForRole, hasPermission } from '../../utils/roleConfig';
import Button from '../ui/Button';
import './Sidebar.css';

export default function Sidebar({ collapsed, onToggleCollapse }) {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const groups = getSidebarLinksForRole(role);

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-text">
          <span className="sidebar__logo-title">{collapsed ? 'F' : 'FFMS'}</span>
        </div>
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
