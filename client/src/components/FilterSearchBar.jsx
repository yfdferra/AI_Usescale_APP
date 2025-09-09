// FilterSearchBar.jsx
import React from "react";

export default function FilterSearchBar({
  filterOptions = [],
  onFilterChange,
  onSearch,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        margin: "1rem",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        height: "40px",
        width:"340px"
      }}
    >
      <select
        onChange={onFilterChange}
        style={{
          padding: "0.5rem 1rem",
          border: "none",
          outline: "none",
          height: "100%",
          borderTopLeftRadius: "8px",
          borderBottomLeftRadius: "8px",
          background: "#f8fafc",
        }}
      >
        {filterOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Search"
        onChange={onSearch}
        style={{
          padding: "0.5rem 1rem",
          border: "none",
          outline: "none",
          flex: 1,
          height: "100%",
          background: "#fff",
          borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      />
      {/* Add filter/search icons as needed */}
    </div>
  );
}
