import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import Applicants from './pages/Applicants';
import MyApplications from './pages/MyApplications';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* Recruiter Routes */}
          <Route
            path="/recruiter/post-job"
            element={
              <ProtectedRoute role="recruiter">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/my-jobs"
            element={
              <ProtectedRoute role="recruiter">
                <MyJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/applicants/:jobId"
            element={
              <ProtectedRoute role="recruiter">
                <Applicants />
              </ProtectedRoute>
            }
          />

          {/* Seeker Routes */}
          <Route
            path="/seeker/applications"
            element={
              <ProtectedRoute role="seeker">
                <MyApplications />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
                <div style={{ fontSize: '4rem' }}>🔍</div>
                <h1 style={{ margin: '1rem 0 0.5rem', fontSize: '2rem' }}>404 — Page Not Found</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  The page you're looking for doesn't exist.
                </p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            }
          />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '12px',
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
