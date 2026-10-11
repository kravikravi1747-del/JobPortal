import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'badge-pending',
  reviewed: 'badge-reviewed',
  accepted: 'badge-accepted',
  rejected: 'badge-rejected',
};

const Applicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const [applicantsRes, jobRes] = await Promise.all([
          api.get(`/applications/job/${jobId}`),
          api.get(`/jobs/${jobId}`),
        ]);
        setApplications(applicantsRes.data.applications);
        setJobTitle(jobRes.data.job.title);
      } catch {
        toast.error('Failed to load applicants');
        navigate('/recruiter/my-jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId, navigate]);

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      const { data } = await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      setApplications((prev) =>
        prev.map((a) => (a._id === applicationId ? { ...a, status: data.application.status } : a))
      );
      toast.success(`Status updated to "${newStatus}"`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner" />
        <p>Loading applicants...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/recruiter/my-jobs')} style={{ marginBottom: '1.25rem' }}>
          ← Back to My Jobs
        </button>

        <div className="page-header">
          <h1 className="page-title">👥 Applicants</h1>
          <p className="page-subtitle">
            {applications.length} application{applications.length !== 1 ? 's' : ''} for <strong style={{ color: 'var(--primary-light)' }}>{jobTitle}</strong>
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-title">No applications yet</div>
            <p>Share your job posting to attract candidates</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {applications.map((app) => (
              <div key={app._id} className="applicant-card">
                <div className="user-avatar" style={{ width: 48, height: 48, fontSize: '1rem', flexShrink: 0 }}>
                  {getInitials(app.applicant?.name)}
                </div>

                <div className="applicant-info">
                  <div className="applicant-name">{app.applicant?.name || 'Unknown Applicant'}</div>
                  <div className="applicant-email">📧 {app.applicant?.email}</div>

                  {app.applicant?.skills && app.applicant.skills.length > 0 && (
                    <div className="job-skills" style={{ marginBottom: '0.5rem' }}>
                      {app.applicant.skills.map((skill, i) => (
                        <span key={i} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  )}

                  {app.coverLetter && (
                    <div style={{
                      background: 'rgba(15,23,42,0.5)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.6rem 0.85rem',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.5rem',
                      maxWidth: '600px',
                    }}>
                      💬 {app.coverLetter}
                    </div>
                  )}

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Applied {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div className="applicant-actions" style={{ flexShrink: 0 }}>
                  <span className={`badge ${statusColors[app.status]}`}>{app.status}</span>
                  <select
                    className="status-select"
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    disabled={updatingId === app._id}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;
