import React from 'react';

const FilterControls = ({ setFilterStatus, setSortBy }) => {
  return (
    <div>
      <div>
        <label htmlFor="filterStatus">Filter by Status: </label>
        <select id="filterStatus" onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer Received">Offer Received</option>
          <option value="Rejected">Rejected</option>
          <option value="Wishlist">Wishlist</option>
        </select>
      </div>
      <div>
        <label htmlFor="sortBy">Sort by: </label>
        <select id="sortBy" onChange={(e) => setSortBy(e.target.value)}>
          <option value="applicationDateDesc">Application Date (Newest First)</option>
          <option value="applicationDateAsc">Application Date (Oldest First)</option>
          <option value="companyNameAsc">Company Name (A-Z)</option>
          <option value="companyNameDesc">Company Name (Z-A)</option>
        </select>
      </div>
    </div>
  );
};

export default FilterControls;
