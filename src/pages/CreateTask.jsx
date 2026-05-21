import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import { createTask } from '../services/taskService';
import { getFieldAgents } from '../services/userService';
import './CreateTask.css';

export default function CreateTask() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assignTo: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Field agents for assignment dropdown
  const [agents, setAgents] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(true);

  useEffect(() => {
    setAgentsLoading(true);
    getFieldAgents()
      .then(setAgents)
      .catch(() => setAgents([]))
      .finally(() => setAgentsLoading(false));
  }, []);

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Task title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.dueDate) errs.dueDate = 'Due date is required';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const newTask = await createTask({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        dueDate: form.dueDate,
        assignedTo: form.assignTo || null,
      });
      showToast('Task created successfully!', 'success');
      navigate(`/tasks/${newTask.id}`);
    } catch (err) {
      const data = err.response?.data;

      if (err.response?.status === 400 && data) {
        const fieldErrors = {};
        if (data.title) fieldErrors.title = Array.isArray(data.title) ? data.title[0] : data.title;
        if (data.description) fieldErrors.description = Array.isArray(data.description) ? data.description[0] : data.description;
        if (data.due_date) fieldErrors.dueDate = Array.isArray(data.due_date) ? data.due_date[0] : data.due_date;
        if (data.priority) fieldErrors.priority = Array.isArray(data.priority) ? data.priority[0] : data.priority;
        if (data.assigned_to) fieldErrors.assignTo = Array.isArray(data.assigned_to) ? data.assigned_to[0] : data.assigned_to;
        if (data.detail) fieldErrors._general = data.detail;
        if (data.non_field_errors) fieldErrors._general = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;

        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
        } else {
          showToast('Validation error. Please check your inputs.', 'error');
        }
      } else if (err.response?.status === 403) {
        showToast('You do not have permission to create tasks.', 'error');
      } else {
        showToast('Failed to create task. Please try again.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="create-task-page">
      <div className="create-task">
        <div className="create-task__header">
          <h2 className="create-task__title">Create New Task</h2>
          <p className="create-task__subtitle">Define the scope, priority, and assign personnel for this job.</p>
        </div>

        <form onSubmit={handleSubmit} className="create-task__form">
          {errors._general && (
            <div className="create-task__error-banner" style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              marginBottom: '1rem',
              fontSize: '0.875rem',
            }}>
              {errors._general}
            </div>
          )}

          <Input
            label="Task Title"
            placeholder="e.g., Routine Maintenance - Sector 7G"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            error={errors.title}
            required
          />

          <div className="create-task__field">
            <label className="create-task__label">
              Description <span className="create-task__required">*</span>
            </label>
            <span className="create-task__hint">Supports rich text formats</span>
            <textarea
              className={`create-task__textarea ${errors.description ? 'create-task__textarea--error' : ''}`}
              placeholder="Provide comprehensive details, safety protocols, or specific client requests..."
              rows={5}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            {errors.description && <p className="create-task__error">{errors.description}</p>}
          </div>

          <div className="create-task__row">
            <Input
              label="Target Due Date"
              type="date"
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
              error={errors.dueDate}
              required
            />
            <div className="create-task__field">
              <label className="create-task__label">
                Priority Level <span className="create-task__required">*</span>
              </label>
              <div className="create-task__priority-group">
                {['low', 'medium', 'high'].map(p => (
                  <button
                    key={p}
                    type="button"
                    className={`create-task__priority-btn ${form.priority === p ? 'create-task__priority-btn--active' : ''}`}
                    onClick={() => setForm({ ...form, priority: p })}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
              {errors.priority && <p className="create-task__error">{errors.priority}</p>}
            </div>
          </div>

          {/* Agent Assignment Dropdown */}
          <div className="create-task__field">
            <label className="create-task__label">Assign To</label>
            <select
              className={`create-task__select ${errors.assignTo ? 'create-task__select--error' : ''}`}
              value={form.assignTo}
              onChange={e => setForm({ ...form, assignTo: e.target.value })}
            >
              <option value="">Unassigned — goes to dispatch queue</option>
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
            {errors.assignTo && <p className="create-task__error">{errors.assignTo}</p>}
            <p className="create-task__helper">
              Select a field agent to assign, or leave as unassigned for the general dispatch queue.
            </p>
          </div>

          <div className="create-task__divider" />

          <div className="create-task__actions">
            <Button variant="ghost" onClick={() => navigate('/tasks')}>Cancel</Button>
            <Button variant="primary" icon={Check} type="submit" loading={submitting}>
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
