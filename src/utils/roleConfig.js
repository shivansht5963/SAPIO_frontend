import {
  LayoutDashboard,
  ClipboardList,
  MapPin,
  BarChart3,
  FileText,
  Users,
  UserCircle,
} from 'lucide-react';
import { ROLES } from './constants';

/* ── Sidebar navigation config per role ── */
export const SIDEBAR_LINKS = [
  {
    group: 'MAIN',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: '/dashboard',
        roles: [ROLES.ADMIN, ROLES.REGIONAL_MANAGER, ROLES.TEAM_LEAD, ROLES.FIELD_AGENT, ROLES.AUDITOR],
      },
    ],
  },
  {
    group: 'OPERATIONS',
    items: [
      {
        id: 'directory',
        label: 'Directory',
        icon: Users,
        path: '/directory',
        roles: [ROLES.ADMIN, ROLES.REGIONAL_MANAGER],
      },
      {
        id: 'tasks',
        label: 'Tasks',
        icon: ClipboardList,
        path: '/tasks',
        roles: [ROLES.ADMIN, ROLES.REGIONAL_MANAGER, ROLES.TEAM_LEAD, ROLES.FIELD_AGENT],
      },
      {
        id: 'logs',
        label: 'Logs',
        icon: FileText,
        path: '/logs',
        roles: [ROLES.ADMIN, ROLES.AUDITOR],
      },
    ],
  },
  {
    group: 'INSIGHTS',
    items: [
      {
        id: 'reports',
        label: 'Reports',
        icon: BarChart3,
        path: '/reports',
        roles: [ROLES.ADMIN, ROLES.REGIONAL_MANAGER, ROLES.AUDITOR],
      },
      {
        id: 'profile',
        label: 'Profile',
        icon: UserCircle,
        path: '/profile',
        roles: [ROLES.ADMIN, ROLES.REGIONAL_MANAGER, ROLES.TEAM_LEAD, ROLES.FIELD_AGENT, ROLES.AUDITOR],
      },
    ],
  },
];

/* ── Action permissions per role ── */
export const ACTION_PERMISSIONS = {
  canCreateTask: [ROLES.ADMIN, ROLES.REGIONAL_MANAGER, ROLES.TEAM_LEAD],
  canAssignTask: [ROLES.ADMIN, ROLES.REGIONAL_MANAGER, ROLES.TEAM_LEAD],
  canStartVisit: [ROLES.FIELD_AGENT],
  canCompleteVisit: [ROLES.FIELD_AGENT],
  canViewAiInsights: [ROLES.ADMIN, ROLES.REGIONAL_MANAGER, ROLES.TEAM_LEAD, ROLES.FIELD_AGENT, ROLES.AUDITOR],
  canViewLogs: [ROLES.ADMIN, ROLES.AUDITOR],
  canViewReports: [ROLES.ADMIN, ROLES.REGIONAL_MANAGER, ROLES.AUDITOR],
  canManageUsers: [ROLES.ADMIN],
  canExportData: [ROLES.ADMIN, ROLES.REGIONAL_MANAGER, ROLES.AUDITOR],
};

/**
 * Check if a role has permission for a specific action
 */
export function hasPermission(role, action) {
  const allowed = ACTION_PERMISSIONS[action];
  return allowed ? allowed.includes(role) : false;
}

/**
 * Get sidebar links filtered for a specific role
 */
export function getSidebarLinksForRole(role) {
  return SIDEBAR_LINKS.map(group => ({
    ...group,
    items: group.items.filter(item => item.roles.includes(role)),
  })).filter(group => group.items.length > 0);
}
