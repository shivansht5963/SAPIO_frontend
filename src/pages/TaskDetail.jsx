import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, UserCheck, Play, MapPin, Info, Clock, Calendar, User, MessageSquarePlus } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import StatusBadge from '../components/domain/StatusBadge';
import AiInsightsCard from '../components/domain/AiInsightsCard';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getTaskById } from '../data/mockTasks';
import { getVisitsByTaskId } from '../data/mockVisits';
import { formatDate, formatDeadline, isOverdue } from '../utils/formatDate';
import { TASK_PRIORITY } from '../utils/constants';
import './TaskDetail.css';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const { showToast } = useToast();

  const task = getTaskById(Number(id));
  const visits = task ? getVisitsByTaskId(task.id) : [];
  const latestVisit = visits.length > 0 ? visits[0] : null;

  if (!task) {
    return (
      <div className="task-detail__not-found">
        <h2>Task not found</h2>
        <Button variant="secondary" onClick={() => navigate('/tasks')}>Back to Tasks</Button>
      </div>
    );
  }

  const overdueDate = isOverdue(task.dueDate) && task.status !== 'completed' && task.status !== 'cancelled';
  const priorityColor = task.priority === TASK_PRIORITY.HIGH ? 'red' : task.priority === TASK_PRIORITY.MEDIUM ? 'blue' : 'gray';

  return (
    <div className="task-detail">
      {/* Top navigation bar */}
      <div className="task-detail__topnav">
        <button className="task-detail__back" onClick={() => navigate('/tasks')}>
          <ArrowLeft size={16} />
          Back to Dispatch Queue
        </button>
        <div className="task-detail__topnav-right">
          <span className="task-detail__task-id">Task ID: #{task.taskId}</span>
          <Button variant="secondary" icon={Share2} size="sm">Share</Button>
        </div>
      </div>

      {/* Status badges + title */}
      <div className="task-detail__header">
        <div className="task-detail__badges">
          {task.priority === TASK_PRIORITY.HIGH && (
            <Badge color="red" size="sm">⚠ HIGH PRIORITY</Badge>
          )}
          <StatusBadge status={overdueDate ? 'overdue' : task.status} />
        </div>
        <div className="task-detail__title-row">
          <div>
            <h1 className="task-detail__title">{task.title}</h1>
            <p className="task-detail__location">
              <MapPin size={14} />
              {task.location}
            </p>
          </div>
          <div className="task-detail__actions">
            <Button variant="secondary" icon={UserCheck}>Reassign</Button>
            <Button
              variant="primary"
              icon={Play}
              onClick={() => showToast('Activity logged successfully', 'success')}
            >
              Log Activity
            </Button>
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
                <span className="task-detail__info-label">Required Skills</span>
                <span className="task-detail__info-value">
                  {task.requiredSkills?.join(', ') || 'General'}
                </span>
              </div>
              <div className="task-detail__info-item">
                <span className="task-detail__info-label">Est. Duration</span>
                <span className="task-detail__info-value">{task.estDuration}</span>
              </div>
              <div className="task-detail__info-item">
                <span className="task-detail__info-label">Deadline</span>
                <span className={`task-detail__info-value ${overdueDate ? 'task-detail__info-value--overdue' : ''}`}>
                  {formatDeadline(task.dueDate)}
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
            <p className="task-detail__description">{task.description}</p>
          </Card>

          {/* Previous Agent Notes */}
          <Card
            title="Previous Agent Notes"
            headerAction={
              <button className="task-detail__add-note-btn">
                <MessageSquarePlus size={14} />
                Add Note
              </button>
            }
          >
            {latestVisit && latestVisit.visitNotes ? (
              <div className="task-detail__notes-timeline">
                <div className="task-detail__note">
                  <div className="task-detail__note-meta">
                    <div className="task-detail__note-dot" />
                    <span className="task-detail__note-time">Yesterday, 18:45 – {latestVisit.startedByName}</span>
                  </div>
                  <blockquote className="task-detail__note-text">
                    {latestVisit.visitNotes}
                  </blockquote>
                </div>
                <div className="task-detail__note">
                  <div className="task-detail__note-meta">
                    <div className="task-detail__note-dot task-detail__note-dot--system" />
                    <span className="task-detail__note-time">Oct 12, 09:00 – System Auto-Log</span>
                  </div>
                  <p className="task-detail__note-system-text">
                    Firmware updated on primary logic controllers. Reboot successful.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted">No notes recorded yet.</p>
            )}
          </Card>
        </div>

        {/* Right Column — AI Insights */}
        <div className="task-detail__right">
          {latestVisit && latestVisit.aiSummary ? (
            <AiInsightsCard
              summary={latestVisit.aiSummary}
              recommendation={latestVisit.aiRecommendation}
              riskFlag={latestVisit.aiRiskFlag}
              actionLabel="Request Bypass Authorization"
              onAction={() => showToast('Bypass authorization requested', 'success')}
            />
          ) : (
            <Card>
              <div className="task-detail__no-insights">
                <p className="text-muted">AI insights will appear after a visit is completed.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
