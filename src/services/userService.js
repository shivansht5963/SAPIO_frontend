import { apiGet } from './api';

const API_PAGE_SIZE = 10;

/**
 * Normalize a user from API response.
 */
export function normalizeUser(user) {
  if (!user || typeof user !== 'object') return null;
  return {
    id: user.id,
    username: user.username || '',
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    fullName: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || '',
    role: user.role || '',
    employeeId: user.employee_id || '',
    team: user.team || null,
    region: user.region || null,
  };
}

/**
 * GET /users/?role=field_agent — Fetch field agents for task assignment.
 * Fetches all pages to build a complete dropdown list.
 */
export async function getFieldAgents() {
  const allAgents = [];
  let page = 1;

  while (page <= 10) {
    try {
      const { data } = await apiGet(`/users/?role=field_agent&page=${page}`);
      const results = (data.results || []).map(normalizeUser).filter(Boolean);
      allAgents.push(...results);
      if (!data.next) break;
      page++;
    } catch {
      break;
    }
  }

  return allAgents;
}

/**
 * GET /users/ — Fetch all users (paginated).
 */
export async function getUsers(page = 1) {
  const { data } = await apiGet(`/users/?page=${page}`);
  return {
    results: (data.results || []).map(normalizeUser).filter(Boolean),
    count: data.count || 0,
    totalPages: Math.ceil((data.count || 0) / API_PAGE_SIZE),
  };
}
