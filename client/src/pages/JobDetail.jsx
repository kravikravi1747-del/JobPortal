import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data.job);
      } catch {
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  // Check if already applied
  useEffect(() => {
    const checkApplied = async () => {
      if (!user || user.role !== 'seeker') return;
      try {
        const { data } = await api.get('/applications/mine');
        const applied = data.applications.some((a) => a.job?._id === id);
        setAlreadyApplied(applied);
      } catch {
        // ignore
      }
    };
    checkApplied();
  }, [user, id]);

  const handleApply = async () => {
    setApplyLoading(true);
    try {
      await api.post(`/applications/${id}/apply`, { coverLetter });
      setAlreadyApplied(true);
      setShowApplyModal(false);
      toast.success('Application submitted successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner" />
        <p>Loading job details...</p>
      </div>
    );
  }

  if (!job) return null;

  const isRecruiterOwner = user?.role === 'recruiter' && job.recruiter?._id === user._id;

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Back */}
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1.25rem' }}>
          ← Back to Jobs
        </button>

        {/* Header */}
        <div className="job-detail-header">
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className="company-logo" style={{ width: 64, height: 64, fontSize: '1.5rem' }}>
              {job.company[0].toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.35rem' }}>{job.title}</h1>
              <div style={{ color: 'var(--primary-light)', fontWeight: 600, marginBottom: '0.75rem' }}>
                {job.company}
              </div>
              <div className="job-meta" style={{ flexWrap: 'wrap' }}>
                <span className="job-meta-item">📍 {job.location}</span>
                <span className="job-meta-item">💼 {job.type}</span>
                {job.salary && job.salary !== 'Not disclosed' && (
                  <span className="job-meta-item">💰 {job.salary}</span>
                )}
                {job.experience && job.experience !== 'Not specified' && (
                  <span className="job-meta-item">🎯 {job.experience}</span>
                )}
                <span className="job-meta-item">📅 Posted {formatDate(job.createdAt)}</span>
              </div>
            </div>
            <span className={`badge badge-type`}>{job.type}</span>
          </div>
        </div>

        <div className="job-detail-main">
          {/* Main Content */}
          <div>
            <div className="job-detail-section">
              <div className="section-title">Job Description</div>
              <p className="detail-text">{job.description}</p>
            </div>

            {job.skills && job.skills.length > 0 && (
              <div className="job-detail-section">
                <div className="section-title">Required Skills</div>
                <div className="job-skills" style={{ gap: '0.5rem' }}>
                  {job.skills.map((skill, i) => (
                    <span key={i} className="skill-tag" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="job-detail-section">
              <div className="section-title">Company Info</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Posted by:</strong> {job.recruiter?.name}
                {job.recruiter?.company && ` · ${job.recruiter.company}`}
              </p>
            </div>
          </div>

          {/* Sidebar Apply Card */}
          <div className="apply-card">
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Apply for this Job
            </div>

            {!job.isOpen && (
              <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                This job is no longer accepting applications.
              </div>
            )}

            {user?.role === 'seeker' ? (
              <>
                {alreadyApplied ? (
                  <div className="alert alert-success">✅ You've already applied to this job!</div>
                ) : (
                  <button
                    id="apply-btn"
                    className="btn btn-primary btn-full"
                    onClick={() => setShowApplyModal(true)}
                    disabled={!job.isOpen}
                  >
                    Apply Now →
                  </button>
                )}
              </>
            ) : user?.role === 'recruiter' ? (
              isRecruiterOwner ? (
                <button
                  className="btn btn-secondary btn-full"
                  onClick={() => navigate('/recruiter/my-jobs')}
                >
                  Manage This Job
                </button>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Recruiters cannot apply to jobs.
                </p>
              )
            ) : (
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Sign in to apply for this position.
                </p>
                <button className="btn btn-primary btn-full" onClick={() => navigate('/login')}>
                  Sign In to Apply
                </button>
              </div>
            )}

            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span>📍 {job.location}</span>
                <span>💼 {job.type}</span>
                {job.salary && <span>💰 {job.salary}</span>}
                {job.experience && <span>🎯 {job.experience}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Apply for {job.title}</h2>
              <button className="modal-close" onClick={() => setShowApplyModal(false)}>✕</button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Applying to <strong style={{ color: 'var(--primary-light)' }}>{job.company}</strong> for <strong>{job.title}</strong>
            </p>

            <div className="form-group">
              <label className="form-label">Cover Letter (optional)</label>
              <textarea
                className="form-control"
                rows={5}
                placeholder="Tell the recruiter why you're a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                maxLength={1000}
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                {coverLetter.length}/1000 characters
              </small>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowApplyModal(false)}>
                Cancel
              </button>
              <button
                id="submit-application"
                className="btn btn-primary"
                onClick={handleApply}
                disabled={applyLoading}
              >
                {applyLoading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
