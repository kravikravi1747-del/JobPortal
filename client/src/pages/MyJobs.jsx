import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import JobForm from '../components/JobForm';
import toast from 'react-hot-toast';

const MyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/jobs/my-jobs');
      setJobs(data.jobs);
    } catch {
      toast.error('Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    setDeletingId(jobId);
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      toast.success('Job deleted successfully');
    } catch {
      toast.error('Failed to delete job');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSuccess = (updatedJob) => {
    setJobs((prev) => prev.map((j) => (j._id === updatedJob._id ? updatedJob : j)));
    setEditingJob(null);
    toast.success('Job updated successfully! ✅');
  };

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner" />
        <p>Loading your jobs...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">🏢 My Posted Jobs</h1>
            <p className="page-subtitle">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
          </div>
          <Link to="/recruiter/post-job" className="btn btn-primary">
            + Post New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">No jobs posted yet</div>
            <p style={{ marginBottom: '1.5rem' }}>Start by posting your first job listing</p>
            <Link to="/recruiter/post-job" className="btn btn-primary">
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {jobs.map((job) => (
              <div key={job._id} className="my-job-card">
                <div className="company-logo">{job.company[0].toUpperCase()}</div>
                <div className="my-job-info">
                  <div className="my-job-title">{job.title}</div>
                  <div className="my-job-meta">
                    {job.company} · {job.location} · <span className="badge badge-type" style={{ padding: '0.1rem 0.5rem', fontSize: '0.72rem' }}>{job.type}</span>
                  </div>
                </div>
                <div className="my-job-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(`/recruiter/applicants/${job._id}`)}
                    title="View Applicants"
                  >
                    👥 Applicants
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditingJob(job)}
                    title="Edit Job"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(job._id)}
                    disabled={deletingId === job._id}
                    title="Delete Job"
                  >
                    {deletingId === job._id ? '...' : '🗑️'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingJob && (
        <div className="modal-overlay" onClick={() => setEditingJob(null)}>
          <div className="modal-content" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Job</h2>
              <button className="modal-close" onClick={() => setEditingJob(null)}>✕</button>
            </div>
            <JobForm
              initial={editingJob}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingJob(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyJobs;
