/* ── Constants matching Django backend choices ── */

export const ROLES = {
  ADMIN: 'admin',
  REGIONAL_MANAGER: 'regional_manager',
  TEAM_LEAD: 'team_lead',
  FIELD_AGENT: 'field_agent',
  AUDITOR: 'auditor',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.REGIONAL_MANAGER]: 'Regional Manager',
  [ROLES.TEAM_LEAD]: 'Team Lead',
  [ROLES.FIELD_AGENT]: 'Field Agent',
  [ROLES.AUDITOR]: 'Auditor',
};

export const TASK_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.PENDING]: 'Pending',
  [TASK_STATUS.ASSIGNED]: 'Assigned',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.COMPLETED]: 'Completed',
  [TASK_STATUS.CANCELLED]: 'Cancelled',
};

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: 'Low',
  [TASK_PRIORITY.MEDIUM]: 'Medium',
  [TASK_PRIORITY.HIGH]: 'High',
};

export const VISIT_STATUS = {
  STARTED: 'started',
  COMPLETED: 'completed',
};

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const RISK_LABELS = {
  [RISK_LEVELS.LOW]: 'Low Risk',
  [RISK_LEVELS.MEDIUM]: 'Medium Risk',
  [RISK_LEVELS.HIGH]: 'High Risk',
};

export const ACTION_TYPES = {
  CREATED: 'created',
  ASSIGNED: 'assigned',
  STARTED: 'started',
  COMPLETED: 'completed',
  STATUS_CHANGED: 'status_changed',
  UPDATED: 'updated',
};

export const ENTITY_TYPES = {
  TASK: 'task',
  VISIT: 'visit',
};

export const REGIONS = ['North', 'South', 'West', 'Northwest', 'Southeast'];
export const TEAMS = ['Alpha Squad', 'Bravo Team', 'Charlie Unit', 'Delta Force', 'Echo Group'];
