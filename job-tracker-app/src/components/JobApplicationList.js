import React from 'react';

const JobApplicationList = ({ applications, deleteApplication, editApplication }) => {
  if (applications.length === 0) {
    return <p>No applications tracked yet.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Company Name</th>
          <th>Position</th>
          <th>Status</th>
          <th>Application Date</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((app) => (
          <tr key={app.id}>
            <td>{app.companyName}</td>
            <td>{app.position}</td>
            <td>{app.status}</td>
            <td>{app.applicationDate}</td>
            <td>{app.notes}</td>
            <td>
              <button onClick={() => editApplication(app.id)}>Edit</button>
              <button onClick={() => deleteApplication(app.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default JobApplicationList;
