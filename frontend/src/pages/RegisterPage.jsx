import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TaskHiveBrand from '../components/TaskHiveBrand';
import AuthAntigravity from '../components/AuthAntigravity';

function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const data = await api.registerEmployee(formData);
      setSuccess(data.message || 'Registration successful. Await admin approval.');
      setFormData({ name: '', email: '', password: '' });
      setTimeout(() => {
        navigate('/login/employee');
      }, 1500);
    } catch (err) {
      setError(api.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <AuthAntigravity variant="register" />
      <TaskHiveBrand />
      <section className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Employee Onboarding</p>
          <h1>Create Account</h1>
          <p>Your account will require admin approval before login.</p>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Full Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@company.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
            />
          </label>

          {error ? <p className="error-message">{error}</p> : null}
          {success ? <p className="success-message">{success}</p> : null}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          Already have access? <Link to="/access">Go to Login</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
