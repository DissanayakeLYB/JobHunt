import React, { useState, useEffect } from 'react';
import './App.css';
import JobApplicationForm from './components/JobApplicationForm';
import JobApplicationList from './components/JobApplicationList';
import FilterControls from './components/FilterControls';

function App() {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('applicationDateDesc');
  // Add state for managing the application being edited
  const [editingApplication, setEditingApplication] = useState(null);


  // Load applications from localStorage on initial render
  useEffect(() => {
    const storedApplications = localStorage.getItem('jobApplications');
    if (storedApplications) {
      setApplications(JSON.parse(storedApplications));
    }
  }, []);

  // Save applications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('jobApplications', JSON.stringify(applications));
  }, [applications]);


  const addApplication = (app) => {
    setApplications([...applications, { ...app, id: Date.now() }]);
  };

  const deleteApplication = (id) => {
    setApplications(applications.filter(app => app.id !== id));
  };

  const editApplication = (id) => {
    const appToEdit = applications.find(app => app.id === id);
    setEditingApplication(appToEdit);
  };

  const updateApplication = (updatedApp) => {
    setApplications(applications.map(app => app.id === updatedApp.id ? updatedApp : app));
    setEditingApplication(null); // Clear editing state
  };


  // --- Filtering and Sorting ---
  const getFilteredAndSortedApplications = () => {
    let filteredApps = applications;

    // Filter by status
    if (filterStatus !== 'All') {
      filteredApps = filteredApps.filter(app => app.status === filterStatus);
    }

    // Sort
    const sortedApps = [...filteredApps].sort((a, b) => {
      if (sortBy === 'applicationDateDesc') {
        return new Date(b.applicationDate) - new Date(a.applicationDate);
      }
      if (sortBy === 'applicationDateAsc') {
        return new Date(a.applicationDate) - new Date(b.applicationDate);
      }
      if (sortBy === 'companyNameAsc') {
        return a.companyName.localeCompare(b.companyName);
      }
      if (sortBy === 'companyNameDesc') {
        return b.companyName.localeCompare(a.companyName);
      }
      return 0;
    });

    return sortedApps;
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Job Application Tracker</h1>
      </header>
      <main>
        {/* Pass editingApplication and updateApplication to the form */}
        {/* Also, the form needs to know if it's in "edit mode" */}
        <JobApplicationForm
          addApplication={addApplication}
          editingApplication={editingApplication}
          updateApplication={updateApplication}
          setEditingApplication={setEditingApplication}
        />
        <FilterControls
          setFilterStatus={setFilterStatus}
          setSortBy={setSortBy}
        />
        <JobApplicationList
          applications={getFilteredAndSortedApplications()}
          deleteApplication={deleteApplication}
          editApplication={editApplication}
        />
      </main>
    </div>
  );
}

export default App;
