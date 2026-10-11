import { useState } from 'react';
import api from '../api/axios';

const JobForm = ({ initial = {}, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    company: initial.company || '',
    location: initial.location || '',
    salary: initial.salary || '',
    type: initial.type || 'Full-time',
    experience: initial.experience || '',
    skills: initial.skills ? initial.skills.join(', ') : '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.description || !form.company || !form.location) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };

      if (initial._id) {
        const { data } = await api.put(`/jobs/${initial._id}`, payload);
        onSuccess(data.job);
      } else {
        const { data } = await api.post('/jobs', payload);
        onSuccess(data.job);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="two-col">
        <div className="form-group">
          <label className="form-label">Job Title *</label>
          <input
            type="text"
            name="title"
            className="form-control"
            placeholder="e.g. Senior React Developer"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Company Name *</label>
          <input
            type="text"
            name="company"
            className="form-control"
            placeholder="e.g. TechCorp Inc."
            value={form.company}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="two-col">
        <div className="form-group">
          <label className="form-label">Location *</label>
          <input
            type="text"
            name="location"
            className="form-control"
            placeholder="e.g. Mumbai, India"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Job Type</label>
          <select name="type" className="form-control" value={form.type} onChange={handleChange}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Remote</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>
        </div>
      </div>

      <div className="two-col">
        <div className="form-group">
          <label className="form-label">Salary (optional)</label>
          <input
            type="text"
            name="salary"
            className="form-control"
            placeholder="e.g. ₹8–12 LPA or $80,000"
            value={form.salary}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Experience Required</label>
          <input
            type="text"
            name="experience"
            className="form-control"
            placeholder="e.g. 2–4 years"
            value={form.experience}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Skills (comma-separated)</label>
        <input
          type="text"
          name="skills"
          className="form-control"
          placeholder="e.g. React, Node.js, MongoDB"
          value={form.skills}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Job Description *</label>
        <textarea
          name="description"
          className="form-control"
          placeholder="Describe the role, responsibilities, and requirements..."
          rows={6}
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : initial._id ? 'Update Job' : 'Post Job'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
