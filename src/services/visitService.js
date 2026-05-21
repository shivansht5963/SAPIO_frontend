import { apiGet, apiPost } from './api';

const API_PAGE_SIZE = 10;

/**
 * Normalize a visit from API response.
 * API returns: { id, task: {id, title, status}, started_by: {id, username, employee_id},
 *                status, start_time, end_time, ai_risk_flag, visit_notes, ai_summary, ai_recommendation }
 */
export function normalizeVisit(visit) {
  if (!visit || typeof visit !== 'object') return null;

  const task = visit.task || {};
  const startedBy = visit.started_by || {};

  return {
    id: visit.id,
    taskId: typeof task === 'object' ? task.id : task,
    taskTitle: typeof task === 'object' ? (task.title || '') : '',
    taskStatus: typeof task === 'object' ? (task.status || '') : '',
    startedBy: startedBy.id || null,
    startedByName: typeof startedBy === 'object'
      ? (startedBy.username || startedBy.first_name || `Agent #${startedBy.id}`)
      : null,
    startedByEmployeeId: typeof startedBy === 'object' ? (startedBy.employee_id || '') : '',
    status: visit.status || 'started',
    startTime: visit.start_time || null,
    endTime: visit.end_time || null,
    visitNotes: visit.visit_notes || '',
    aiSummary: visit.ai_summary || '',
    aiRecommendation: visit.ai_recommendation || '',
    aiRiskFlag: visit.ai_risk_flag || 'low',
    createdAt: visit.created_at || null,
  };
}

/**
 * GET /visits/?page=N — List visits (paginated, auto-scoped by role)
 */
export async function getVisits(page = 1) {
  const { data } = await apiGet(`/visits/?page=${page}`);
  return {
    results: (data.results || []).map(normalizeVisit).filter(Boolean),
    count: data.count || 0,
    totalPages: Math.ceil((data.count || 0) / API_PAGE_SIZE),
  };
}

/**
 * GET /visits/{id}/ — Get full visit detail including AI outputs
 */
export async function getVisit(id) {
  const { data } = await apiGet(`/visits/${id}/`);
  return normalizeVisit(data);
}

/**
 * Fetch visits for a specific task.
 *
 * Strategy:
 *  1. Try GET /visits/?task={id} (DRF filter support)
 *  2. Try GET /visits/?task_id={id} (alternative filter name)
 *  3. Fallback: scan ALL pages of /visits/ and filter client-side
 *
 * The first strategy that returns matching results is used.
 */
export async function getVisitsForTask(taskId) {
  const numericTaskId = Number(taskId);

  // ── Strategy 1 & 2: Try server-side filter params ──
  const filterParams = [`task=${numericTaskId}`, `task_id=${numericTaskId}`];

  for (const param of filterParams) {
    try {
      const { data } = await apiGet(`/visits/?${param}`);
      const results = Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []);

      if (results.length > 0) {
        const normalized = results.map(normalizeVisit).filter(Boolean);
        // Verify the results actually belong to our task (filter may be ignored)
        const matching = normalized.filter(v => v.taskId === numericTaskId);
        if (matching.length > 0) {
          return matching;
        }
      }
    } catch {
      // Filter param not supported or error — try next strategy
    }
  }

  // ── Strategy 3: Scan all pages and filter client-side ──
  const allVisits = [];
  let page = 1;
  const MAX_PAGES = 20; // Safety limit: 200 visits max

  while (page <= MAX_PAGES) {
    try {
      const { data } = await apiGet(`/visits/?page=${page}`);
      const results = data.results || [];
      if (results.length === 0) break;

      const normalized = results.map(normalizeVisit).filter(Boolean);
      const matching = normalized.filter(v => v.taskId === numericTaskId);
      allVisits.push(...matching);

      // Stop if no more pages
      if (!data.next) break;
      page++;
    } catch {
      break;
    }
  }

  return allVisits;
}

/**
 * POST /visits/start/ — Start a new visit for a task
 */
export async function startVisit(taskId) {
  const { data } = await apiPost('/visits/start/', { task_id: Number(taskId) });
  return normalizeVisit(data);
}

/**
 * POST /visits/{id}/complete/ — Complete an ongoing visit with notes
 * Triggers AI analysis on the backend.
 */
export async function completeVisit(visitId, visitNotes) {
  const { data } = await apiPost(`/visits/${visitId}/complete/`, {
    visit_notes: visitNotes,
  });
  return normalizeVisit(data);
}

export { API_PAGE_SIZE as VISIT_PAGE_SIZE };
