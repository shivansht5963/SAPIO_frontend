import { apiGet, apiPost, setTokens, clearTokens } from './api';

/**
 * Normalize user data from API response into our app's user shape.
 * Handles both login response (nested user/profile/permissions) and
 * the flatter /auth/me/ response.
 */
export function normalizeUser(data) {
  // Login response shape: { access, refresh, user: {...}, profile: {...}, permissions: [...] }
  // Me response shape: { user: {...}, profile: {...}, permissions: [...] }
  // Flat shape (API.md fallback): { id, username, role, team, region, ... }

  const user = data.user || data;
  const profile = data.profile || {};
  const permissions = data.permissions || [];

  // Role can be nested in profile or flat on user
  const role = profile.role?.name || profile.role || user.role || '';

  // Team/region can be strings OR objects like { id, name }
  const rawTeam = profile.team || user.team || null;
  const rawRegion = profile.region || user.region || null;
  const team = rawTeam && typeof rawTeam === 'object' ? rawTeam.name : rawTeam;
  const region = rawRegion && typeof rawRegion === 'object' ? rawRegion.name : rawRegion;

  return {
    id: user.id,
    username: user.username,
    email: user.email || profile.email || '',
    firstName: user.first_name || profile.first_name || user.username || '',
    fullName: user.first_name
      ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`
      : user.username || 'User',
    role,
    team,
    teamName: team, // backward compat for Profile/Directory pages
    region,
    regionName: region, // backward compat for Profile/Directory pages
    employeeId: profile.employee_id || user.employee_id || '',
    phone: profile.phone || user.phone || '',
    permissions,
  };
}

/**
 * Login with username/password → returns { user, permissions } and stores tokens.
 */
export async function login(username, password) {
  const { data } = await apiPost('/auth/login/', { username, password });

  // Store tokens
  setTokens(data.access, data.refresh);

  // Normalize and store user data
  const user = normalizeUser(data);
  localStorage.setItem('user_data', JSON.stringify(user));

  return user;
}

/**
 * Fetch current user profile (used to rehydrate auth on page reload).
 * Falls back to cached data if normalization fails.
 */
export async function fetchMe() {
  const { data } = await apiGet('/auth/me/');
  try {
    const user = normalizeUser(data);
    if (!user || !user.id) {
      console.warn('[authService] normalizeUser returned invalid data:', data);
      // Fall back to cached data
      const cached = getCachedUser();
      if (cached) return cached;
      throw new Error('Invalid user data from /auth/me/');
    }
    localStorage.setItem('user_data', JSON.stringify(user));
    return user;
  } catch (err) {
    console.warn('[authService] fetchMe normalization error:', err, 'Raw data:', data);
    const cached = getCachedUser();
    if (cached) return cached;
    throw err;
  }
}

/**
 * Logout — clear all stored auth data.
 */
export function logout() {
  clearTokens();
}

/**
 * Get cached user data from localStorage (for instant rehydration before API call).
 */
export function getCachedUser() {
  try {
    const raw = localStorage.getItem('user_data');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
