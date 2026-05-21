import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, UserCheck, Play, CheckCircle, MapPin, Info, MessageSquarePlus, X, RefreshCw } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';
import StatusBadge from '../components/domain/StatusBadge';
import AiInsightsCard from '../components/domain/AiInsightsCard';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getTask, updateTask, assignTask } from '../services/taskService';
import { getFieldAgents } from '../services/userService';
import { startVisit, completeVisit } from '../services/visitService';
import { formatDeadline, isOverdue, timeAgo } from '../utils/formatDate';
import { TASK_PRIORITY, ROLES, TASK_STATUS_LABELS } from '../utils/constants';
import './TaskDetail.css';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { showToast } = useToast();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visitLoading, setVisitLoading] = useState(false);

  // Complete visit modal
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [visitNotes, setVisitNotes] = useState('');
  const [completingVisit, setCompletingVisit] = useState(false);

  // Status change (Admin / RM / TL)
  const [newStatus, setNewStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Reassign modal
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [agents, setAgents] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [reassigning, setReassigning] = useState(false);

  // Load task (visits are now nested in the task response)
  // `showSpinner` controls whether to flash the loading state (only for initial load)
  async function loadTask(showSpinner = true) {
    if (showSpinner) setLoading(true);
    setError(null);
    try {
      const taskData = await getTask(id);
      if (!taskData) {
        setError('not_found');
      } else {
        setTask(taskData);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('not_found');
      } else {
        setError(err.response?.data?.detail || 'Failed to load task details.');
      }
    } finally {
      if (showSpinner) setLoading(false);
    }
  }

  useEffect(() => {
    loadTask(true); // Initial load with spinner
  }, [id]);

  // Derive visit state from task.visits (no separate fetch needed!)
  const visits = task?.visits || [];

  // An "active" visit is anything that is NOT completed and NOT cancelled
  // The backend may use 'started', 'in_progress', 'ongoing', etc.
  const activeVisit = visits.find(v =>
    v.status && v.status !== 'completed' && v.status !== 'cancelled'
  ) || null;

  const completedVisits = visits.filter(v => v.status === 'completed');
  const latestCompletedVisit = completedVisits.length > 0 ? completedVisits[0] : null;

  // Role checks
  const isFieldAgent = role === ROLES.FIELD_AGENT;
  const canChangeStatus = [ROLES.ADMIN, ROLES.REGIONAL_MANAGER, ROLES.TEAM_LEAD].includes(role);
  const taskIsActive = task && task.status !== 'completed' && task.status !== 'cancelled';

  // Status change handler (Admin / RM / TL)
  async function handleStatusChange() {
    if (!newStatus || !task) return;
    setUpdatingStatus(true);
    try {
      const updatedTask = await updateTask(task.id, { status: newStatus });
      if (updatedTask) setTask(updatedTask);
      showToast(`Task status updated to "${TASK_STATUS_LABELS[newStatus] || newStatus}"`, 'success');
      setNewStatus('');
    } catch (err) {
      const detail = err.response?.data?.detail
        || err.response?.data?.status?.[0]
        || 'Failed to update task status.';
      showToast(detail, 'error');
    } finally {
      setUpdatingStatus(false);
    }
  }

  // Start visit handler
  async function handleStartVisit() {
    if (!task) return;
    setVisitLoading(true);
    try {
      await startVisit(task.id);
      showToast('Visit started! You can now complete it with notes.', 'success');
      // Re-fetch task silently to get updated visits array
      await loadTask(false);
    } catch (err) {
      const errData = err.response?.data;
      const msg = errData?.detail
        || errData?.non_field_errors?.[0]
        || errData?.task_id?.[0]
        || (typeof errData === 'string' ? errData : 'Failed to start visit.');
      showToast(msg, 'error');
    } finally {
      setVisitLoading(false);
    }
  }

  // Complete visit handler
  async function handleCompleteVisit() {
    if (!activeVisit) return;
    setCompletingVisit(true);
    try {
      await completeVisit(activeVisit.id, visitNotes);
      showToast('Visit completed! AI analysis generated.', 'success');
      setShowCompleteModal(false);
      setVisitNotes('');
      // Re-fetch task silently to get updated visits with AI data
      await loadTask(false);
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to complete visit.';
      showToast(detail, 'error');
    } finally {
      setCompletingVisit(false);
    }
  }

  // Share handler — Web Share API on mobile, clipboard on desktop
  async function handleShare() {
    if (!task) return;
    const url = window.location.href;
    const text = [
      `📋 Task #${task.id}: ${task.title}`,
      `Status: ${TASK_STATUS_LABELS[task.status] || task.status}`,
      `Priority: ${task.priority}`,
      task.assignedToName ? `Assigned to: ${task.assignedToName}` : 'Unassigned',
      task.dueDate ? `Due: ${formatDeadline(task.dueDate)}` : '',
      task.teamName ? `Team: ${task.teamName}` : '',
      task.regionName ? `Region: ${task.regionName}` : '',
      '',
      url,
    ].filter(Boolean).join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ title: `Task #${task.id}: ${task.title}`, text, url });
      } catch (err) {
        if (err.name !== 'AbortError') showToast('Share cancelled.', 'error');
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        showToast('Task details copied to clipboard!', 'success');
      } catch {
        showToast('Failed to copy to clipboard.', 'error');
      }
    }
  }

  // Reassign handler
  function openReassignModal() {
    setShowReassignModal(true);
    setSelectedAgent('');
    if (agents.length === 0) {
      setAgentsLoading(true);
      getFieldAgents()
        .then(setAgents)
        .catch(() => setAgents([]))
        .finally(() => setAgentsLoading(false));
    }
  }

  async function handleReassign() {
    if (!selectedAgent || !task) return;
    setReassigning(true);
    try {
      const updatedTask = await assignTask(task.id, selectedAgent);
      if (updatedTask) setTask(updatedTask);
      showToast('Task reassigned successfully!', 'success');
      setShowReassignModal(false);
      setSelectedAgent('');
    } catch (err) {
      const detail = err.response?.data?.detail
        || err.response?.data?.assigned_to?.[0]
        || 'Failed to reassign task.';
      showToast(detail, 'error');
    } finally {
      setReassigning(false);
    }
  }

  // --- Render ---

  if (loading) {
    return (
      <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error === 'not_found' || !task) {
    return (
      <div className="task-detail__not-found">
        <h2>Task not found</h2>
        <Button variant="secondary" onClick={() => navigate('/tasks')}>Back to Tasks</Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-detail__not-found">
        <h2>Error loading task</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{error}</p>
        <Button variant="secondary" onClick={() => navigate('/tasks')}>Back to Tasks</Button>
      </div>
    );
  }

  const overdueDate = task.dueDate
    ? isOverdue(task.dueDate) && task.status !== 'completed' && task.status !== 'cancelled'
    : false;

  const priorityLabel = task.priority
    ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
    : 'Medium';

  return (
    <div className="task-detail">
      {/* Top navigation bar */}
      <div className="task-detail__topnav">
        <button className="task-detail__back" onClick={() => navigate('/tasks')}>
          <ArrowLeft size={16} />
          Back to Dispatch Queue
        </button>
        <div className="task-detail__topnav-right">
          <span className="task-detail__task-id">Task ID: #{task.taskId || task.id}</span>
          <Button variant="secondary" icon={Share2} size="sm" onClick={handleShare}>Share</Button>
        </div>
      </div>

      {/* Status badges + title */}
      <div className="task-detail__header">
        <div className="task-detail__badges">
          {task.priority === TASK_PRIORITY.HIGH && (
            <Badge color="red" size="sm">⚠ HIGH PRIORITY</Badge>
          )}
          <StatusBadge status={overdueDate ? 'overdue' : task.status} />
          {activeVisit && (
            <Badge color="blue" size="sm">🔄 Visit In Progress</Badge>
          )}
        </div>
        <div className="task-detail__title-row">
          <div>
            <h1 className="task-detail__title">{task.title || 'Untitled Task'}</h1>
            {task.location && (
              <p className="task-detail__location">
                <MapPin size={14} />
                {task.location}
              </p>
            )}
            {(task.teamName || task.regionName) && (
              <p className="task-detail__location" style={{ marginTop: '0.25rem' }}>
                {[task.teamName, task.regionName].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>
          <div className="task-detail__actions">
            {canChangeStatus && (
              <Button variant="secondary" icon={UserCheck} onClick={openReassignModal}>Reassign</Button>
            )}

            {/* FIELD AGENT: Start Visit OR Complete Visit */}
            {isFieldAgent && taskIsActive && !activeVisit && (
              <Button
                variant="primary"
                icon={Play}
                onClick={handleStartVisit}
                loading={visitLoading}
              >
                Start Visit
              </Button>
            )}
            {isFieldAgent && activeVisit && (
              <Button
                variant="primary"
                icon={CheckCircle}
                onClick={() => setShowCompleteModal(true)}
              >
                Complete Visit
              </Button>
            )}

            {/* ADMIN / RM / TL: Status change dropdown */}
            {canChangeStatus && (
              <div className="task-detail__status-change">
                <select
                  className="task-detail__status-select"
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                >
                  <option value="">Change Status...</option>
                  {Object.entries(TASK_STATUS_LABELS)
                    .filter(([val]) => val !== task.status)
                    .map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                </select>
                {newStatus && (
                  <Button
                    variant="primary"
                    icon={RefreshCw}
                    size="sm"
                    onClick={handleStatusChange}
                    loading={updatingStatus}
                  >
                    Update
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="task-detail__grid">
        {/* Left Column */}
        <div className="task-detail__left">
          {/* Assignment Details */}
          <Card>
            <div className="task-detail__card-header">
              <Info size={18} />
              <h3>Assignment Details</h3>
            </div>
            <div className="task-detail__info-grid">
              <div className="task-detail__info-item">
                <span className="task-detail__info-label">Priority</span>
                <span className="task-detail__info-value">
                  <Badge color={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'blue' : 'gray'} size="sm">
                    {priorityLabel}
                  </Badge>
                </span>
              </div>
              <div className="task-detail__info-item">
                <span className="task-detail__info-label">Status</span>
                <span className="task-detail__info-value">
                  <StatusBadge status={task.status || 'pending'} />
                </span>
              </div>
              <div className="task-detail__info-item">
                <span className="task-detail__info-label">Deadline</span>
                <span className={`task-detail__info-value ${overdueDate ? 'task-detail__info-value--overdue' : ''}`}>
                  {task.dueDate ? formatDeadline(task.dueDate) : 'No deadline set'}
                </span>
              </div>
              <div className="task-detail__info-item">
                <span className="task-detail__info-label">Assigned To</span>
                <span className="task-detail__info-value">
                  {task.assignedToName ? (
                    <div className="task-detail__assignee">
                      <Avatar name={task.assignedToName} size="sm" />
                      {task.assignedToName}
                    </div>
                  ) : 'Unassigned'}
                </span>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card>
            <h3 className="task-detail__section-title">Description</h3>
            <p className="task-detail__description">{task.description || 'No description provided.'}</p>
          </Card>

          {/* Visit History & Agent Notes */}
          <Card title="Visit History & Agent Notes">
            {visits.length > 0 ? (
              <div className="task-detail__notes-timeline">
                {visits.map((visit) => {
                  const isActive = visit.status !== 'completed' && visit.status !== 'cancelled';
                  return (
                  <div key={visit.id} className="task-detail__note">
                    <div className="task-detail__note-meta">
                      <div className={`task-detail__note-dot ${isActive ? 'task-detail__note-dot--active' : ''}`} />
                      <span className="task-detail__note-time">
                        {isActive ? '🔄 In progress' : '✅ Completed'}
                        {' — '}
                        {visit.startedByName || 'Agent'}
                        {visit.startTime ? ` · ${timeAgo(visit.startTime)}` : ''}
                      </span>
                    </div>
                    {visit.visitNotes ? (
                      <blockquote className="task-detail__note-text">
                        {visit.visitNotes}
                      </blockquote>
                    ) : isActive ? (
                      <p className="text-muted" style={{ marginLeft: '1.5rem', fontSize: '0.85rem' }}>
                        Visit in progress — notes will appear after completion.
                      </p>
                    ) : null}
                    {visit.aiRiskFlag && visit.status === 'completed' && (
                      <div style={{ marginLeft: '1.5rem', marginTop: '0.25rem' }}>
                        <Badge
                          color={visit.aiRiskFlag === 'high' ? 'red' : visit.aiRiskFlag === 'medium' ? 'blue' : 'green'}
                          size="sm"
                        >
                          AI Risk: {visit.aiRiskFlag}
                        </Badge>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted">No visits recorded yet.</p>
            )}
          </Card>
        </div>

        {/* Right Column — AI Insights */}
        <div className="task-detail__right">
          {latestCompletedVisit && latestCompletedVisit.aiSummary ? (
            <AiInsightsCard
              summary={latestCompletedVisit.aiSummary}
              recommendation={latestCompletedVisit.aiRecommendation}
              riskFlag={latestCompletedVisit.aiRiskFlag}
            />
          ) : (
            <Card>
              <div className="task-detail__no-insights">
                <p className="text-muted">
                  {activeVisit
                    ? 'Complete the active visit to generate AI insights.'
                    : 'AI insights will appear after a visit is completed.'}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Complete Visit Modal */}
      {showCompleteModal && (
        <div className="task-detail__modal-overlay" onClick={() => setShowCompleteModal(false)}>
          <div className="task-detail__modal" onClick={e => e.stopPropagation()}>
            <div className="task-detail__modal-header">
              <h3>Complete Visit</h3>
              <button
                className="task-detail__modal-close"
                onClick={() => setShowCompleteModal(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="task-detail__modal-body">
              <p className="task-detail__modal-desc">
                Enter your visit notes below. The AI will analyze them to generate a risk assessment, summary, and recommendations.
              </p>
              <label className="task-detail__modal-label">Visit Notes *</label>
              <textarea
                className="task-detail__modal-textarea"
                placeholder="Describe what you observed, actions taken, customer feedback, any issues..."
                rows={6}
                value={visitNotes}
                onChange={e => setVisitNotes(e.target.value)}
                autoFocus
              />
              <p className="task-detail__modal-hint">
                <strong>Tip:</strong> Detailed notes produce better AI analysis.
              </p>
            </div>
            <div className="task-detail__modal-actions">
              <Button variant="ghost" onClick={() => setShowCompleteModal(false)}>Cancel</Button>
              <Button
                variant="primary"
                icon={CheckCircle}
                onClick={handleCompleteVisit}
                loading={completingVisit}
                disabled={!visitNotes.trim()}
              >
                Complete & Analyze
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Modal */}
      {showReassignModal && (
        <div className="task-detail__modal-overlay" onClick={() => setShowReassignModal(false)}>
          <div className="task-detail__modal" onClick={e => e.stopPropagation()}>
            <div className="task-detail__modal-header">
              <h3>Reassign Task</h3>
              <button
                className="task-detail__modal-close"
                onClick={() => setShowReassignModal(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="task-detail__modal-body">
              <p className="task-detail__modal-desc">
                Select a field agent to reassign this task to. The task's team and region scope will automatically update.
              </p>
              {task.assignedToName && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Currently assigned to: <strong>{task.assignedToName}</strong>
                </p>
              )}
              <label className="task-detail__modal-label">Assign To *</label>
              <select
                className="task-detail__modal-select"
                value={selectedAgent}
                onChange={e => setSelectedAgent(e.target.value)}
              >
                <option value="">Select an agent...</option>
                {agentsLoading ? (
                  <option disabled>Loading agents...</option>
                ) : agents.length === 0 ? (
                  <option disabled>No agents available</option>
                ) : (
                  agents.map(agent => (
                    <option key={agent.id} value={agent.id}>
                      {agent.fullName} ({agent.employeeId}) — {agent.team || 'No team'}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="task-detail__modal-actions">
              <Button variant="ghost" onClick={() => setShowReassignModal(false)}>Cancel</Button>
              <Button
                variant="primary"
                icon={UserCheck}
                onClick={handleReassign}
                loading={reassigning}
                disabled={!selectedAgent}
              >
                Reassign
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
