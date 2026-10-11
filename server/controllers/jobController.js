const { jobs, users } = require('../db');

// @desc  Get all jobs with search & filter
// @route GET /api/jobs
// @access Public
const getJobs = async (req, res) => {
  try {
    const { search, location, type, page = 1, limit = 10 } = req.query;

    let allJobs = await jobs.find({ isOpen: { $ne: false } });

    // In-memory / NeDB filtering
    if (search) {
      const s = search.toLowerCase();
      allJobs = allJobs.filter(
        (j) =>
          (j.title && j.title.toLowerCase().includes(s)) ||
          (j.company && j.company.toLowerCase().includes(s)) ||
          (j.description && j.description.toLowerCase().includes(s))
      );
    }

    if (location) {
      const loc = location.toLowerCase();
      allJobs = allJobs.filter((j) => j.location && j.location.toLowerCase().includes(loc));
    }

    if (type && type !== 'All') {
      allJobs = allJobs.filter((j) => j.type === type);
    }

    // Sort by createdAt descending
    allJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = allJobs.length;
    const skip = (Number(page) - 1) * Number(limit);
    const paginated = allJobs.slice(skip, skip + Number(limit));

    // Populate recruiter
    const populated = await Promise.all(
      paginated.map(async (job) => {
        const rec = await users.findOne({ _id: job.recruiter });
        return {
          ...job,
          recruiter: rec ? { _id: rec._id, name: rec.name, email: rec.email, company: rec.company } : null,
        };
      })
    );

    res.json({
      success: true,
      count: populated.length,
      total,
      pages: Math.ceil(total / Number(limit)) || 1,
      currentPage: Number(page),
      jobs: populated,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, message: 'Server error fetching jobs' });
  }
};

// @desc  Get single job
// @route GET /api/jobs/:id
// @access Public
const getJob = async (req, res) => {
  try {
    const job = await jobs.findOne({ _id: req.params.id });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const rec = await users.findOne({ _id: job.recruiter });
    const populatedJob = {
      ...job,
      recruiter: rec ? { _id: rec._id, name: rec.name, email: rec.email, company: rec.company, website: rec.website } : null,
    };

    res.json({ success: true, job: populatedJob });
  } catch (error) {
    console.error('Error fetching single job:', error);
    res.status(500).json({ success: false, message: 'Server error fetching job' });
  }
};

// @desc  Create a job
// @route POST /api/jobs
// @access Private (Recruiter)
const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, type, skills, experience } = req.body;

    if (!title || !description || !company || !location) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, company, and location are required',
      });
    }

    const newJob = {
      title,
      description,
      company,
      location,
      salary: salary || 'Not disclosed',
      type: type || 'Full-time',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map((s) => s.trim()) : []),
      experience: experience || 'Not specified',
      recruiter: req.user._id,
      isOpen: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = await jobs.insert(newJob);
    res.status(201).json({ success: true, job: created });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ success: false, message: 'Server error creating job' });
  }
};

// @desc  Update a job
// @route PUT /api/jobs/:id
// @access Private (Recruiter who owns the job)
const updateJob = async (req, res) => {
  try {
    const job = await jobs.findOne({ _id: req.params.id });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (String(job.recruiter) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
    }

    const updatedData = {
      ...job,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    await jobs.update({ _id: req.params.id }, { $set: updatedData });
    const updated = await jobs.findOne({ _id: req.params.id });

    res.json({ success: true, job: updated });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ success: false, message: 'Server error updating job' });
  }
};

// @desc  Delete a job
// @route DELETE /api/jobs/:id
// @access Private (Recruiter who owns the job)
const deleteJob = async (req, res) => {
  try {
    const job = await jobs.findOne({ _id: req.params.id });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (String(job.recruiter) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job',
      });
    }

    await jobs.remove({ _id: req.params.id }, {});
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ success: false, message: 'Server error deleting job' });
  }
};

// @desc  Get jobs posted by logged-in recruiter
// @route GET /api/jobs/my-jobs
// @access Private (Recruiter)
const getMyJobs = async (req, res) => {
  try {
    let recruiterJobs = await jobs.find({ recruiter: req.user._id });
    recruiterJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, count: recruiterJobs.length, jobs: recruiterJobs });
  } catch (error) {
    console.error('Error fetching recruiter jobs:', error);
    res.status(500).json({ success: false, message: 'Server error fetching your jobs' });
  }
};

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob, getMyJobs };
