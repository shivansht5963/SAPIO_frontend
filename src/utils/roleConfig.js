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

/* ── Action permissions per role (hardcoded fallback) ── */
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

/* ── Map our action keys to API module + CRUD operation ── */
const ACTION_TO_MODULE = {
  canCreateTask: { module: 'tasks', op: 'can_create' },
  canAssignTask: { module: 'tasks', op: 'can_update' },
  canStartVisit: { module: 'visits', op: 'can_create' },
  canCompleteVisit: { module: 'visits', op: 'can_update' },
  canViewAiInsights: { module: 'reports', op: 'can_read' },
  canViewLogs: { module: 'logs', op: 'can_read' },
  canViewReports: { module: 'reports', op: 'can_read' },
  canManageUsers: { module: 'users', op: 'can_update' },
  canExportData: { module: 'reports', op: 'can_read' },
};

/**
 * Check if a role has permission for a specific action.
 * If API permissions are provided, uses those first.
 * Falls back to hardcoded ACTION_PERMISSIONS.
 */
export function hasPermission(role, action, apiPermissions) {
  // Try API permissions first if available
  if (apiPermissions && apiPermissions.length > 0) {
    const mapping = ACTION_TO_MODULE[action];
    if (mapping) {
      const modulePerm = apiPermissions.find(
        (p) => p.module_name === mapping.module
      );
      if (modulePerm) {
        return !!modulePerm[mapping.op];
      }
    }
  }

  // Fallback to hardcoded permissions
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
