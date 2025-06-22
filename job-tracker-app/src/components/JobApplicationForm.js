import React, { useState, useEffect } from 'react';

const JobApplicationForm = ({ addApplication, editingApplication, updateApplication, setEditingApplication }) => {
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('Applied');
  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    if (editingApplication) {
      setCompanyName(editingApplication.companyName);
      setPosition(editingApplication.position);
      setStatus(editingApplication.status);
      setApplicationDate(editingApplication.applicationDate);
      setNotes(editingApplication.notes);
      setCurrentId(editingApplication.id);
    } else {
      // Reset form when not editing
      setCompanyName('');
      setPosition('');
      setStatus('Applied');
      setApplicationDate(new Date().toISOString().slice(0, 10));
      setNotes('');
      setCurrentId(null);
    }
  }, [editingApplication]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName || !position) {
      alert('Company Name and Position are required.');
      return;
    }
    const applicationData = { companyName, position, status, applicationDate, notes };

    if (currentId) { // If there's an ID, it's an update
      updateApplication({ ...applicationData, id: currentId });
    } else { // Otherwise, it's a new application
      addApplication(applicationData);
    }

    // Reset form and editing state
    setCompanyName('');
    setPosition('');
    setStatus('Applied');
    setApplicationDate(new Date().toISOString().slice(0, 10));
    setNotes('');
    setCurrentId(null);
    if (setEditingApplication) setEditingApplication(null); // Clear editing state in App.js
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{currentId ? 'Edit Application' : 'Add New Application'}</h3>
      <div>
        <label htmlFor="companyName">Company Name:</label>
        <input
          type="text"
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="position">Position:</label>
        <input
          type="text"
          id="position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer Received">Offer Received</option>
          <option value="Rejected">Rejected</option>
          <option value="Wishlist">Wishlist</option>
        </select>
      </div>
      <div>
        <label htmlFor="applicationDate">Application Date:</label>
        <input
          type="date"
          id="applicationDate"
          value={applicationDate}
          onChange={(e) => setApplicationDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="notes">Notes:</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <button type="submit">{currentId ? 'Update Application' : 'Add Application'}</button>
    </form>
  );
};

export default JobApplicationForm;
