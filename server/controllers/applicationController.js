const { applications, jobs, users } = require('../db');

// @desc  Apply to a job
// @route POST /api/applications/:jobId/apply
// @access Private (Seeker)
const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const job = await jobs.findOne({ _id: jobId });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.isOpen === false) {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });
    }

    const existingApplication = await applications.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job',
      });
    }

    const newApp = {
      job: jobId,
      applicant: req.user._id,
      coverLetter: coverLetter || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = await applications.insert(newApp);

    const populatedApp = {
      ...created,
      job: { _id: job._id, title: job.title, company: job.company, location: job.location },
      applicant: { _id: req.user._id, name: req.user.name, email: req.user.email },
    };

    res.status(201).json({ success: true, application: populatedApp });
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({ success: false, message: 'Server error applying to job' });
  }
};

// @desc  Get current seeker's applications
// @route GET /api/applications/mine
// @access Private (Seeker)
const getMyApplications = async (req, res) => {
  try {
    let myApps = await applications.find({ applicant: req.user._id });
    myApps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const populated = await Promise.all(
      myApps.map(async (app) => {
        const job = await jobs.findOne({ _id: app.job });
        return {
          ...app,
          job: job ? { _id: job._id, title: job.title, company: job.company, location: job.location, type: job.type, salary: job.salary, isOpen: job.isOpen } : null,
        };
      })
    );

    res.json({ success: true, count: populated.length, applications: populated });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Server error fetching your applications' });
  }
};

// @desc  Get all applicants for a specific job (Recruiter)
// @route GET /api/applications/job/:jobId
// @access Private (Recruiter)
const getJobApplicants = async (req, res) => {
  try {
    const job = await jobs.findOne({ _id: req.params.jobId });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (String(job.recruiter) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applicants for this job',
      });
    }

    let jobApps = await applications.find({ job: req.params.jobId });
    jobApps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const populated = await Promise.all(
      jobApps.map(async (app) => {
        const applicant = await users.findOne({ _id: app.applicant });
        return {
          ...app,
          applicant: applicant ? { _id: applicant._id, name: applicant.name, email: applicant.email, skills: applicant.skills, bio: applicant.bio, resume: applicant.resume } : null,
        };
      })
    );

    res.json({ success: true, count: populated.length, applications: populated });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ success: false, message: 'Server error fetching applicants' });
  }
};

// @desc  Update application status (Recruiter)
// @route PUT /api/applications/:id/status
// @access Private (Recruiter)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const application = await applications.findOne({ _id: req.params.id });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const job = await jobs.findOne({ _id: application.job });
    if (!job || String(job.recruiter) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    await applications.update({ _id: req.params.id }, { $set: { status, updatedAt: new Date().toISOString() } });
    const updated = await applications.findOne({ _id: req.params.id });

    res.json({ success: true, application: updated });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Server error updating status' });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
};
