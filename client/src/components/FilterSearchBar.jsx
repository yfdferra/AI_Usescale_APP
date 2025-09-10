import React from "react";
import "./FilterSearchBar.css";

export default function FilterSearchBar({
  filterOptions = [],
  onFilterChange,
  onSearch,
}) {
  return (
    <div className="filter-search-bar">
      <select className="filter-select" onChange={onFilterChange}>
        {filterOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <input
        type="text"
        className="filter-input"
        placeholder="Search"
        onChange={onSearch}
      />
      {/* Add filter/search icons as needed */}
    </div>
  );
}
