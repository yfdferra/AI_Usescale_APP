/**
 * FilterSearchBar Component
 *
 * A combined filter and search input component that provides dual functionality
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array<string>} [props.filterOptions=[]] - Array of filter options for the dropdown
 * @param {Function} props.onFilterChange - Callback function called when filter selection changes
 * @param {Function} props.onSearch - Callback function called when search input changes
 * @returns {JSX.Element} The FilterSearchBar component
 */

import React from "react";
import "./FilterSearchBar.css";

export default function FilterSearchBar({
  filterOptions = [],
  onFilterChange,
  onSearch,
}) {
  return (
    <div className="filter-search-bar">
      {/*allows users to filter by predefined categories */}
      <select className="filter-select" onChange={onFilterChange}>
        {filterOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {/* allows users to search by text */}
      <input
        type="text"
        className="filter-input"
        placeholder="Search"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
