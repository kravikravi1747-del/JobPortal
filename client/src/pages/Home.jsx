import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: '🔍',
    title: 'Smart Job Search',
    desc: 'Search and filter thousands of jobs by title, location, and type to find your perfect match.',
  },
  {
    icon: '⚡',
    title: 'Quick Apply',
    desc: 'Apply to your dream job in seconds with a personalized cover letter.',
  },
  {
    icon: '📊',
    title: 'Track Applications',
    desc: 'Monitor the status of all your applications in one clean dashboard.',
  },
  {
    icon: '🏢',
    title: 'Recruiter Tools',
    desc: 'Post jobs, manage applicants, and update statuses effortlessly.',
  },
  {
    icon: '🔐',
    title: 'Secure & Private',
    desc: 'JWT-secured authentication ensures your data stays safe and private.',
  },
  {
    icon: '🌐',
    title: 'All Job Types',
    desc: 'Find full-time, part-time, remote, internship, and contract opportunities.',
  },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find Your <span className="highlight">Dream Job</span>
              <br />or Hire Top Talent
            </h1>
            <p className="hero-subtitle">
              The modern job portal connecting skilled professionals with great companies.
              Browse hundreds of opportunities or post your vacancy and find the right fit.
            </p>
            <div className="hero-actions">
              <Link to="/jobs" className="btn btn-primary btn-lg">
                🔍 Browse Jobs
              </Link>
              {!user && (
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Get Started Free →
                </Link>
              )}
              {user?.role === 'recruiter' && (
                <Link to="/recruiter/post-job" className="btn btn-success btn-lg">
                  📝 Post a Job
                </Link>
              )}
              {user?.role === 'seeker' && (
                <Link to="/seeker/applications" className="btn btn-secondary btn-lg">
                  📋 My Applications
                </Link>
              )}
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-value">500+</div>
                <div className="stat-label">Active Jobs</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">200+</div>
                <div className="stat-label">Companies</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">10K+</div>
                <div className="stat-label">Job Seekers</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">95%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: 'var(--bg-primary)', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className="page-title" style={{ fontSize: '2rem' }}>
              Why Choose <span style={{ color: 'var(--primary-light)' }}>JobPortal</span>?
            </h2>
            <p className="page-subtitle">Everything you need to land your next opportunity</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      {!user && (
        <section style={{
          background: 'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(6,182,212,0.1))',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '4rem 0',
          textAlign: 'center',
        }}>
          <div className="container">
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>
              Ready to Take the Next Step?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Join thousands of professionals already using JobPortal
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Sign Up as Job Seeker
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Register as Recruiter
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <p>© 2025 JobPortal · Built with MERN Stack · FSD College Project</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
