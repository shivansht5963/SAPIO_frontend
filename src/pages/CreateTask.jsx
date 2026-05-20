import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import { getAgents } from '../data/mockUsers';
import './CreateTask.css';

export default function CreateTask() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const agents = getAgents();

  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assignTo: '',
  });
  const [errors, setErrors] = useState({});

  const assignOptions = [
    { value: '', label: 'Unassigned (Pool Queue)' },
    ...agents.map(a => ({ value: String(a.id), label: a.fullName })),
  ];

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Task title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.dueDate) errs.dueDate = 'Due date is required';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    showToast('Task created successfully!', 'success');
    navigate('/tasks');
  }

  return (
    <div className="create-task-page">
      <div className="create-task">
        <div className="create-task__header">
          <h2 className="create-task__title">Create New Task</h2>
          <p className="create-task__subtitle">Define the scope, priority, and assign personnel for this job.</p>
        </div>

        <form onSubmit={handleSubmit} className="create-task__form">
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
            </div>
          </div>

          <Select
            label="Assign To"
            options={assignOptions}
            value={form.assignTo}
            onChange={v => setForm({ ...form, assignTo: v })}
            placeholder="Unassigned (Pool Queue)"
          />
          <p className="create-task__helper">
            Leaving this blank adds the task to the general dispatch queue.
          </p>

          <div className="create-task__divider" />

          <div className="create-task__actions">
            <Button variant="ghost" onClick={() => navigate('/tasks')}>Cancel</Button>
            <Button variant="primary" icon={Check} type="submit">Create Task</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
