import { Link } from 'react-router-dom';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getCompanyLetter = (company) => {
  return company ? company[0].toUpperCase() : 'J';
};

const JobCard = ({ job }) => {
  return (
    <Link to={`/jobs/${job._id}`} style={{ display: 'contents' }}>
      <div className="job-card">
        <div className="job-card-header">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div className="company-logo">{getCompanyLetter(job.company)}</div>
            <div>
              <div className="job-title">{job.title}</div>
              <div className="job-company">{job.company}</div>
            </div>
          </div>
          <span className="badge badge-type">{job.type}</span>
        </div>

        <div className="job-meta">
          <span className="job-meta-item">📍 {job.location}</span>
          {job.salary && job.salary !== 'Not disclosed' && (
            <span className="job-meta-item">💰 {job.salary}</span>
          )}
          {job.experience && job.experience !== 'Not specified' && (
            <span className="job-meta-item">🎯 {job.experience}</span>
          )}
        </div>

        {job.description && (
          <p className="job-description">{job.description}</p>
        )}

        {job.skills && job.skills.length > 0 && (
          <div className="job-skills">
            {job.skills.slice(0, 4).map((skill, i) => (
              <span key={i} className="skill-tag">{skill}</span>
            ))}
            {job.skills.length > 4 && (
              <span className="skill-tag">+{job.skills.length - 4}</span>
            )}
          </div>
        )}

        <div className="job-card-footer">
          <span className="job-date">Posted {formatDate(job.createdAt)}</span>
          <span className="btn btn-secondary btn-sm">View Details →</span>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
