import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import toast from 'react-hot-toast';

const PostJob = () => {
  const navigate = useNavigate();

  const handleSuccess = (job) => {
    toast.success('Job posted successfully! 🎉');
    navigate('/recruiter/my-jobs');
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <div className="page-header">
            <h1 className="page-title">📝 Post a New Job</h1>
            <p className="page-subtitle">Fill in the details below to reach thousands of job seekers</p>
          </div>

          <div className="card">
            <JobForm onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
