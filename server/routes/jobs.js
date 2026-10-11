const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} = require('../controllers/jobController');
const { protect, requireRole } = require('../middleware/auth');

// Public routes
router.get('/', getJobs);
router.get('/my-jobs', protect, requireRole('recruiter'), getMyJobs);
router.get('/:id', getJob);

// Protected routes
router.post('/', protect, requireRole('recruiter'), createJob);
router.put('/:id', protect, requireRole('recruiter'), updateJob);
router.delete('/:id', protect, requireRole('recruiter'), deleteJob);

module.exports = router;
