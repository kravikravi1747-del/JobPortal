import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">💼</span>
          JobPortal
        </Link>

        <ul className="navbar-links">
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/jobs" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Find Jobs
            </NavLink>
          </li>

          {user?.role === 'recruiter' && (
            <>
              <li>
                <NavLink to="/recruiter/post-job" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  Post a Job
                </NavLink>
              </li>
              <li>
                <NavLink to="/recruiter/my-jobs" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  My Jobs
                </NavLink>
              </li>
            </>
          )}

          {user?.role === 'seeker' && (
            <li>
              <NavLink to="/seeker/applications" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                My Applications
              </NavLink>
            </li>
          )}
        </ul>

        <div className="navbar-user">
          {user ? (
            <>
              <div className="user-avatar" title={user.name}>
                {getInitials(user.name)}
              </div>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
