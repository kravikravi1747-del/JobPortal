import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ total: 0, pages: 1, currentPage: 1 });
  const [filters, setFilters] = useState({ search: '', location: '', type: 'All' });

  const fetchJobs = useCallback(async (page = 1, searchFilters = filters) => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 12 };
      if (searchFilters.search) params.search = searchFilters.search;
      if (searchFilters.location) params.location = searchFilters.location;
      if (searchFilters.type && searchFilters.type !== 'All') params.type = searchFilters.type;

      const { data } = await api.get('/jobs', { params });
      setJobs(data.jobs);
      setPagination({
        total: data.total,
        pages: data.pages,
        currentPage: data.currentPage,
      });
    } catch {
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(1, { search: '', location: '', type: 'All' });
  }, [fetchJobs]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    fetchJobs(1, newFilters);
  };

  const handlePageChange = (page) => {
    fetchJobs(page, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Find Your Next Opportunity</h1>
          <p className="page-subtitle">
            {pagination.total > 0
              ? `${pagination.total} job${pagination.total !== 1 ? 's' : ''} available`
              : 'Explore all open positions'}
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading ? (
          <div className="spinner-wrapper">
            <div className="spinner"></div>
            <p>Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No jobs found</div>
            <p>Try adjusting your search or clearing the filters.</p>
          </div>
        ) : (
          <>
            <div className="jobs-grid">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  ← Prev
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`page-btn${page === pagination.currentPage ? ' active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.pages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;
