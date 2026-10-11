import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('seeker');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (role === 'recruiter' && !form.company) {
      setError('Company name is required for recruiters');
      return;
    }

    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, password: form.password, role };
      if (role === 'recruiter') payload.company = form.company;

      const { data } = await api.post('/auth/register', payload);
      login(data.user, data.token);

      if (data.user.role === 'recruiter') {
        navigate('/recruiter/post-job');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create Account ✨</h1>
        <p className="auth-subtitle">Join JobPortal today — it's free!</p>

        {/* Role Tabs */}
        <div className="role-tabs">
          <button
            type="button"
            className={`role-tab ${role === 'seeker' ? 'active' : ''}`}
            onClick={() => setRole('seeker')}
            id="tab-seeker"
          >
            🎯 Job Seeker
          </button>
          <button
            type="button"
            className={`role-tab ${role === 'recruiter' ? 'active' : ''}`}
            onClick={() => setRole('recruiter')}
            id="tab-recruiter"
          >
            🏢 Recruiter
          </button>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              id="reg-name"
              type="text"
              name="name"
              className="form-control"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {role === 'recruiter' && (
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                id="reg-company"
                type="text"
                name="company"
                className="form-control"
                placeholder="Your Company Ltd."
                value={form.company}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="two-col">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                id="reg-password"
                type="password"
                name="password"
                className="form-control"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                id="reg-confirm-password"
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            id="reg-submit"
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Creating Account...' : `Register as ${role === 'seeker' ? 'Job Seeker' : 'Recruiter'}`}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
