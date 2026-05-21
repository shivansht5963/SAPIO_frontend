import { apiGet, apiPost, apiPatch, apiDelete } from './api';
import { normalizeVisit } from './visitService';

const API_PAGE_SIZE = 10; // Backend returns 10 per page

/**
 * Normalize a task from API response to match our component field names.
 * Task detail now includes a nested visits[] array with full AI data.
 */
export function normalizeTask(task) {
  if (!task || typeof task !== 'object') return null;

  // assigned_to can be an object { id, username, employee_id } or a number or null
  const assignedTo = task.assigned_to;
  let assignedToName = null;
  if (assignedTo && typeof assignedTo === 'object') {
    assignedToName = assignedTo.username || assignedTo.first_name || `Agent #${assignedTo.id}`;
  } else if (assignedTo && typeof assignedTo === 'number') {
    assignedToName = `Agent #${assignedTo}`;
  }

  // team_scope / region_scope can be strings or objects like { id, name }
  const teamRaw = task.team_scope;
  const regionRaw = task.region_scope;
  const teamName = teamRaw && typeof teamRaw === 'object' ? (teamRaw.name || String(teamRaw)) : (teamRaw || null);
  const regionName = regionRaw && typeof regionRaw === 'object' ? (regionRaw.name || String(regionRaw)) : (regionRaw || null);

  // Normalize nested visits array (from task detail endpoint)
  const visits = Array.isArray(task.visits)
    ? task.visits.map(normalizeVisit).filter(Boolean)
    : [];

  return {
    id: task.id,
    taskId: task.id,
    title: task.title || '',
    description: task.description || '',
    status: task.status || 'pending',
    priority: task.priority || 'medium',
    dueDate: task.due_date || null,
    assignedTo: assignedTo || null,
    assignedToName,
    teamScope: teamName,
    teamName,
    regionScope: regionName,
    regionName,
    createdAt: task.created_at || null,
    updatedAt: task.updated_at || null,
    createdBy: task.created_by || null,
    visitCount: task.visit_count || visits.length || 0,
    visits,
    // Fields that don't exist in API — provide safe defaults
    location: task.location || '',
    requiredSkills: task.required_skills || [],
    estDuration: task.est_duration || 'N/A',
  };
}

/**
 * GET /tasks/?page=N — List tasks (paginated, auto-scoped by role)
 * Returns { results, count, totalPages }
 */
export async function getTasks(page = 1) {
  const { data } = await apiGet(`/tasks/?page=${page}`);
  return {
    results: (data.results || []).map(normalizeTask),
    count: data.count || 0,
    totalPages: Math.ceil((data.count || 0) / API_PAGE_SIZE),
    next: data.next,
    previous: data.previous,
  };
}

/**
 * GET /tasks/{id}/ — Get full task detail
 */
export async function getTask(id) {
  const { data } = await apiGet(`/tasks/${id}/`);
  return normalizeTask(data);
}

/**
 * POST /tasks/ — Create a new task
 */
export async function createTask({ title, description, priority, dueDate, assignedTo }) {
  const body = {
    title,
    description,
    priority,
    due_date: dueDate,
  };
  // Only include assigned_to if provided (otherwise task stays unassigned)
  if (assignedTo) {
    body.assigned_to = Number(assignedTo);
  }
  const { data } = await apiPost('/tasks/', body);
  return normalizeTask(data);
}

/**
 * PATCH /tasks/{id}/ — Update a task (partial)
 */
export async function updateTask(id, updates) {
  // Convert camelCase keys to snake_case for API
  const body = {};
  if (updates.status !== undefined) body.status = updates.status;
  if (updates.priority !== undefined) body.priority = updates.priority;
  if (updates.title !== undefined) body.title = updates.title;
  if (updates.description !== undefined) body.description = updates.description;
  if (updates.dueDate !== undefined) body.due_date = updates.dueDate;

  const { data } = await apiPatch(`/tasks/${id}/`, body);
  return normalizeTask(data);
}

/**
 * PATCH /tasks/{id}/assign/ — Assign/reassign task to an agent
 */
export async function assignTask(id, assignedTo) {
  const { data } = await apiPatch(`/tasks/${id}/assign/`, {
    assigned_to: Number(assignedTo),
  });
  return normalizeTask(data);
}

/**
 * DELETE /tasks/{id}/ — Delete a task (admin only)
 */
export async function deleteTask(id) {
  await apiDelete(`/tasks/${id}/`);
}

export { API_PAGE_SIZE };
