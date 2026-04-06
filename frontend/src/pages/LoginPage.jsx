import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskHiveBrand from '../components/TaskHiveBrand';
import AuthAntigravity from '../components/AuthAntigravity';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { role } = useParams();
  const selectedRole = role === 'admin' || role === 'employee' ? role : '';

  const navigate = useNavigate();
  const { login } = useAuth();

  if (!selectedRole) {
    return <Navigate to="/access" replace />;
  }

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      const data = await api.login(formData);

      if (data.user.role !== selectedRole) {
        setError(
          selectedRole === 'admin'
            ? 'Use Employee Login for employee account.'
            : 'Use Admin Login for admin account.'
        );
        return;
      }

      login({ token: data.token, user: data.user });
      navigate(selectedRole === 'admin' ? '/admin' : '/employee');
    } catch (err) {
      setError(api.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <AuthAntigravity variant={selectedRole} />
      <TaskHiveBrand />
      <section className="auth-card">
        <div className="auth-header">
          <h1>{selectedRole === 'admin' ? 'Admin Login' : 'Employee Login'}</h1>
          <p>
            {selectedRole === 'admin'
              ? 'Login with your admin account.'
              : 'Login with your approved employee account.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </label>

          {error ? <p className="error-message">{error}</p> : null}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          New employee? <Link to="/register">Create your account</Link>
        </p>

        <p className="auth-switch" style={{ marginTop: '8px' }}>
          Need other portal? <Link to="/access">Back to login type</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
