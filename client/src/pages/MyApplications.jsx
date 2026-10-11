import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const statusColors = {
  pending: 'badge-pending',
  reviewed: 'badge-reviewed',
  accepted: 'badge-accepted',
  rejected: 'badge-rejected',
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get('/applications/mine');
        setApplications(data.applications);
      } catch {
        setError('Failed to load your applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner" />
        <p>Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">📋 My Applications</h1>
          <p className="page-subtitle">
            {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {applications.length === 0 && !error ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <div className="empty-title">No applications yet</div>
            <p style={{ marginBottom: '1.5rem' }}>Start exploring jobs and apply to your first position</p>
            <Link to="/jobs" className="btn btn-primary">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {applications.map((app) => (
              <div
                key={app._id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.25rem',
                  transition: 'var(--transition)',
                }}
              >
                {/* Company logo */}
                <div className="company-logo">
                  {app.job?.company ? app.job.company[0].toUpperCase() : 'J'}
                </div>

                {/* Job info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>
                    {app.job?.title || 'Job no longer available'}
                  </div>
                  <div style={{ color: 'var(--primary-light)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    {app.job?.company}
                  </div>
                  <div className="job-meta">
                    {app.job?.location && <span className="job-meta-item">📍 {app.job.location}</span>}
                    {app.job?.type && <span className="job-meta-item">💼 {app.job.type}</span>}
                    <span className="job-meta-item">📅 Applied {formatDate(app.createdAt)}</span>
                  </div>

                  {app.coverLetter && (
                    <div style={{
                      marginTop: '0.75rem',
                      background: 'rgba(15,23,42,0.5)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.6rem 0.85rem',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                    }}>
                      💬 {app.coverLetter}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem', flexShrink: 0 }}>
                  <span className={`badge ${statusColors[app.status]}`}>
                    {app.status}
                  </span>
                  {app.job?._id && (
                    <Link to={`/jobs/${app.job._id}`} className="btn btn-secondary btn-sm">
                      View Job
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
