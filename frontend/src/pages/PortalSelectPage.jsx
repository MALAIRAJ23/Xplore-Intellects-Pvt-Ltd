import { useNavigate } from 'react-router-dom';
import TaskHiveBrand from '../components/TaskHiveBrand';
import AuthAntigravity from '../components/AuthAntigravity';

function PortalSelectPage() {
  const navigate = useNavigate();

  return (
    <main className="auth-shell">
      <AuthAntigravity variant="access" />
      <TaskHiveBrand />
      <section className="auth-card">
        <div className="auth-header">
          <h1>Choose Login Type</h1>
          <p>Select your portal to continue.</p>
        </div>

        <div className="role-grid">
          <button
            type="button"
            className="btn btn-primary role-btn"
            onClick={() => navigate('/login/admin')}
          >
            Admin Login
          </button>

          <button
            type="button"
            className="btn btn-secondary role-btn"
            onClick={() => navigate('/login/employee')}
          >
            Employee Login
          </button>
        </div>

        <p className="auth-switch">
          New employee? <button className="link-btn" onClick={() => navigate('/register')}>Create your account</button>
        </p>
      </section>
    </main>
  );
}

export default PortalSelectPage;
