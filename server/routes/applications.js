const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, requireRole } = require('../middleware/auth');

router.post('/:jobId/apply', protect, requireRole('seeker'), applyToJob);
router.get('/mine', protect, requireRole('seeker'), getMyApplications);
router.get('/job/:jobId', protect, requireRole('recruiter'), getJobApplicants);
router.put('/:id/status', protect, requireRole('recruiter'), updateApplicationStatus);

module.exports = router;
