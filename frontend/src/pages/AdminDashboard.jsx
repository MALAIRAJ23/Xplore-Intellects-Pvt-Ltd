import { useEffect, useMemo, useRef, useState } from 'react';
import TaskStatusBadge from '../components/TaskStatusBadge';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', className: 'priority-low' },
  { value: 'medium', label: 'Medium', className: 'priority-medium' },
  { value: 'high', label: 'High', className: 'priority-high' }
];

function AdminDashboard() {
  const { logout } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [profileOpen, setProfileOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    deadline: '',
    priority: 'medium'
  });

  const dashboardRef = useRef(null);
  const employeeRef = useRef(null);
  const taskBoardRef = useRef(null);
  const profileRef = useRef(null);

  const approvedEmployees = useMemo(
    () => employees.filter((employee) => employee.status === 'approved'),
    [employees]
  );

  const tasksByStatus = useMemo(() => {
    return {
      pending: tasks.filter((task) => task.status === 'Pending'),
      progress: tasks.filter((task) => task.status === 'In Progress'),
      completed: tasks.filter((task) => task.status === 'Completed')
    };
  }, [tasks]);

  const totalEmployees = employees.length;
  const pendingApprovals = employees.filter((employee) => employee.status === 'pending').length;
  const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
  const taskProgress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    const map = {
      dashboard: dashboardRef,
      employees: employeeRef,
      tasks: taskBoardRef
    };

    map[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const loadDashboard = async () => {
    try {
      setError('');
      setLoading(true);
      const [employeeData, taskData] = await Promise.all([api.getEmployees(), api.getAdminTasks()]);
      setEmployees(employeeData);
      setTasks(taskData);
    } catch (err) {
      setError(api.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateStatus = async (employeeId, status) => {
    try {
      setError('');
      setSuccess('');
      await api.updateEmployeeStatus(employeeId, status);
      setSuccess(`Employee ${status} successfully.`);
      await loadDashboard();
    } catch (err) {
      setError(api.getErrorMessage(err));
    }
  };

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleAssignTask = async (event) => {
    event.preventDefault();

    if (!formData.title || !formData.description || !formData.assignedTo || !formData.deadline) {
      setError('All task fields are required.');
      setSuccess('');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setAssigning(true);
      await api.assignTask(formData);
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        deadline: '',
        priority: 'medium'
      });
      setSuccess('Task assigned and saved to MongoDB.');
      await loadDashboard();
    } catch (err) {
      setError(api.getErrorMessage(err));
    } finally {
      setAssigning(false);
    }
  };

  return (
    <main className="admin-shell" ref={dashboardRef}>
      <header className="admin-navbar glass-card">
        <div className="admin-brand-block">
          <div className="brand-mark">TH</div>
          <div>
            <p className="eyebrow">Admin Dashboard</p>
            <h1 className="admin-title">TaskHive Admin Portal</h1>
          </div>
        </div>

        <nav className="admin-nav-links" aria-label="Admin dashboard navigation">
          <button
            type="button"
            className={activeSection === 'dashboard' ? 'nav-link active' : 'nav-link'}
            onClick={() => scrollToSection('dashboard')}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={activeSection === 'employees' ? 'nav-link active' : 'nav-link'}
            onClick={() => scrollToSection('employees')}
          >
            Employee Management
          </button>
          <button
            type="button"
            className={activeSection === 'tasks' ? 'nav-link active' : 'nav-link'}
            onClick={() => scrollToSection('tasks')}
          >
            Task Overview
          </button>
        </nav>

        <div className="admin-profile-wrap" ref={profileRef}>
          <button
            type="button"
            className="profile-trigger"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((value) => !value)}
          >
            <span className="profile-avatar">A</span>
            <span className="profile-meta">
              <strong>Admin</strong>
              <small>Administrator</small>
            </span>
            <span className="profile-chevron">⌄</span>
          </button>

          {profileOpen ? (
            <div className="profile-dropdown glass-card" role="menu">
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <section className="stats-grid">
        <article className="stats-card glass-card">
          <p>Total Employees</p>
          <h3>{totalEmployees}</h3>
          <span className="stats-subtext">Registered users in the system</span>
        </article>
        <article className="stats-card glass-card">
          <p>Pending Approvals</p>
          <h3>{pendingApprovals}</h3>
          <span className="stats-subtext highlight">Needs access review</span>
        </article>
        <article className="stats-card glass-card">
          <p>Completed Tasks</p>
          <h3>{completedTasks}</h3>
          <span className="stats-subtext">Finished assignments</span>
        </article>
        <article className="stats-card glass-card">
          <p>Task Progress</p>
          <h3>{taskProgress}%</h3>
          <span className="stats-subtext">Completed vs total tasks</span>
        </article>
      </section>

      {error ? <p className="feedback feedback-error">{error}</p> : null}
      {success ? <p className="feedback feedback-success">{success}</p> : null}

      <section className="admin-main-grid">
        <article className="glass-card panel-section" ref={employeeRef}>
          <div className="section-heading">
            <div>
              <h2>Employee Management</h2>
              <p>Approve registrations and review employee access in a clean list view.</p>
            </div>
            <span className="section-pill">{pendingApprovals} pending</span>
          </div>

          <div className="employee-list">
            {loading ? <p className="empty-state">Loading employees...</p> : null}

            {!loading && employees.length === 0 ? (
              <p className="empty-state">No employee registrations found.</p>
            ) : null}

            {employees.map((employee) => (
              <div key={employee._id} className="employee-row">
                <div className="employee-meta">
                  <div className="employee-avatar">{getInitials(employee.name)}</div>
                  <div>
                    <strong>{employee.name}</strong>
                    <p>{employee.email}</p>
                  </div>
                </div>

                <div className="employee-actions">
                  <span
                    className={
                      employee.status === 'pending'
                        ? 'status-badge status-pending pulse'
                        : employee.status === 'approved'
                          ? 'status-badge status-approved'
                          : 'status-badge status-rejected'
                    }
                  >
                    {employee.status}
                  </span>

                  <button
                    type="button"
                    className="icon-btn approve"
                    onClick={() => updateStatus(employee._id, 'approved')}
                    disabled={employee.status === 'approved'}
                    aria-label="Approve employee"
                    title="Approve"
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    className="icon-btn reject"
                    onClick={() => updateStatus(employee._id, 'rejected')}
                    disabled={employee.status === 'rejected'}
                    aria-label="Reject employee"
                    title="Reject"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside className="glass-card panel-section compact-form-card">
          <div className="section-heading">
            <div>
              <h2>Assign New Task</h2>
              <p>Compact, polished task assignment with priority controls.</p>
            </div>
          </div>

          <form onSubmit={handleAssignTask} className="compact-form">
            <label className="field-group">
              <span>Task Title</span>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Prepare monthly report"
              />
            </label>

            <label className="field-group">
              <span>Description</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Include KPIs and blockers"
                rows="4"
              />
            </label>

            <div className="field-group">
              <span>Priority</span>
              <div className="priority-toggle" role="group" aria-label="Task priority">
                {PRIORITY_OPTIONS.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    className={
                      formData.priority === priority.value
                        ? `priority-chip ${priority.className} active`
                        : `priority-chip ${priority.className}`
                    }
                    onClick={() => setFormData((prev) => ({ ...prev, priority: priority.value }))}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-grid-two">
              <label className="field-group">
                <span>Assign To</span>
                <select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
                  <option value="">Select approved employee</option>
                  {approvedEmployees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name} ({employee.email})
                    </option>
                  ))}
                </select>
              </label>

              <label className="field-group">
                <span>Deadline</span>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </label>
            </div>

            <button className="btn btn-primary submit-task-btn" type="submit" disabled={assigning}>
              {assigning ? 'Assigning...' : 'Assign Task'}
            </button>
          </form>
        </aside>
      </section>

      <section className="glass-card panel-section kanban-section" ref={taskBoardRef}>
        <div className="section-heading">
          <div>
            <h2>Task Overview</h2>
            <p>Kanban-style monitoring for all assigned tasks with clean, draggable-looking cards.</p>
          </div>
          <span className="section-pill">{tasks.length} total tasks</span>
        </div>

        <div className="kanban-grid">
          {[
            { key: 'pending', label: 'Pending', count: tasksByStatus.pending.length },
            { key: 'progress', label: 'In Progress', count: tasksByStatus.progress.length },
            { key: 'completed', label: 'Completed', count: tasksByStatus.completed.length }
          ].map((column) => (
            <div key={column.key} className="kanban-column">
              <div className="kanban-column-header">
                <h3>{column.label}</h3>
                <span>{column.count}</span>
              </div>

              <div className="kanban-card-list">
                {tasksByStatus[column.key].length === 0 ? (
                  <div className="empty-state kanban-empty">No tasks in this column.</div>
                ) : null}

                {tasksByStatus[column.key].map((task) => (
                  <article key={task._id} className={`task-card task-${column.key}`}>
                    <div className="task-card-top">
                      <div>
                        <h4>{task.title}</h4>
                        <TaskStatusBadge status={task.status} />
                      </div>
                      <div className="task-grip" aria-hidden="true">
                        ⋮⋮
                      </div>
                    </div>

                    <p className="task-description">{task.description}</p>

                    <div className="task-card-footer">
                      <div className="task-assignee">
                        <span className="task-assignee-avatar">
                          {getInitials(task.assignedTo?.name || 'N/A')}
                        </span>
                        <div>
                          <small>Assigned To</small>
                          <strong>{task.assignedTo?.name || 'N/A'}</strong>
                        </div>
                      </div>

                      <div className="task-deadline">
                        <small>Deadline</small>
                        <strong>{new Date(task.deadline).toLocaleDateString()}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
