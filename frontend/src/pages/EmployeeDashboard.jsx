import { useEffect, useMemo, useRef, useState } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import TaskStatusBadge from '../components/TaskStatusBadge';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'];

function EmployeeDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');

  const dashboardRef = useRef(null);
  const tasksRef = useRef(null);

  const taskBuckets = useMemo(() => {
    return {
      pending: tasks.filter((task) => task.status === 'Pending'),
      progress: tasks.filter((task) => task.status === 'In Progress'),
      completed: tasks.filter((task) => task.status === 'Completed')
    };
  }, [tasks]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'In Progress').length;
  const progressPercent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', active: activeSection === 'dashboard' },
    { key: 'tasks', label: 'My Tasks', active: activeSection === 'tasks' },
    { key: 'status', label: 'Status Overview', active: activeSection === 'status' }
  ];

  const scrollToSection = (section) => {
    setActiveSection(section);
    const map = {
      dashboard: dashboardRef,
      tasks: tasksRef,
      status: tasksRef
    };

    map[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const loadTasks = async () => {
    try {
      setError('');
      setLoading(true);
      const data = await api.getMyTasks();
      setTasks(data);
    } catch (err) {
      setError(api.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatusChange = async (taskId, status) => {
    try {
      setError('');
      setSuccess('');
      await api.updateMyTaskStatus(taskId, status);
      setTasks((prev) => prev.map((task) => (task._id === taskId ? { ...task, status } : task)));
      setSuccess(`Task status updated to ${status} and saved to MongoDB.`);
    } catch (err) {
      setError(api.getErrorMessage(err));
    }
  };

  return (
    <main className="admin-shell employee-shell" ref={dashboardRef}>
      <DashboardNavbar
        brandTitle="Employee Dashboard"
        title="TaskHive Employee Portal"
        profileLabel="Employee"
        profileRole="Employee"
        navItems={navItems}
        onNavClick={scrollToSection}
      />

      <section className="stats-grid">
        <article className="stats-card glass-card">
          <p>Total Tasks</p>
          <h3>{totalTasks}</h3>
          <span className="stats-subtext">All assigned work</span>
        </article>
        <article className="stats-card glass-card">
          <p>In Progress</p>
          <h3>{inProgressTasks}</h3>
          <span className="stats-subtext highlight">Currently active</span>
        </article>
        <article className="stats-card glass-card">
          <p>Completed</p>
          <h3>{completedTasks}</h3>
          <span className="stats-subtext">Tasks finished</span>
        </article>
        <article className="stats-card glass-card">
          <p>Progress</p>
          <h3>{progressPercent}%</h3>
          <span className="stats-subtext">Completed vs total tasks</span>
        </article>
      </section>

      {error ? <p className="feedback feedback-error">{error}</p> : null}
      {success ? <p className="feedback feedback-success">{success}</p> : null}

      <section className="glass-card panel-section kanban-section" ref={tasksRef}>
        <div className="section-heading">
          <div>
            <h2>My Tasks</h2>
            <p>View your assignments and update their status directly from the board.</p>
          </div>
          <span className="section-pill">{progressPercent}% complete</span>
        </div>

        {loading ? <p className="empty-state">Loading tasks...</p> : null}

        <div className="kanban-grid">
          {[
            { key: 'pending', label: 'Pending' },
            { key: 'progress', label: 'In Progress' },
            { key: 'completed', label: 'Completed' }
          ].map((column) => (
            <div key={column.key} className="kanban-column">
              <div className="kanban-column-header">
                <h3>{column.label}</h3>
                <span>{taskBuckets[column.key].length}</span>
              </div>

              <div className="kanban-card-list">
                {taskBuckets[column.key].length === 0 ? (
                  <div className="empty-state kanban-empty">No tasks in this column.</div>
                ) : null}

                {taskBuckets[column.key].map((task) => (
                  <article key={task._id} className="task-card">
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
                        <span className="task-assignee-avatar">{getInitials(user?.name || 'You')}</span>
                        <div>
                          <small>Assigned To</small>
                          <strong>{user?.name || 'You'}</strong>
                        </div>
                      </div>

                      <div className="task-deadline">
                        <small>Deadline</small>
                        <strong>{new Date(task.deadline).toLocaleDateString()}</strong>
                      </div>
                    </div>

                    <label className="field-group task-inline-status">
                      <span>Update Status</span>
                      <select
                        value={task.status}
                        onChange={(event) => handleStatusChange(task._id, event.target.value)}
                        aria-label={`Update ${task.title} status`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>
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

export default EmployeeDashboard;
