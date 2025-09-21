import React, { useState } from "react";
import Square from "./Square";
import "./CustomTemplatesSection.css";
import FilterSearchBar from "./FilterSearchBar";

// Helper to split array into chunks of 5
//function chunkArray(array, size = 5) {
//  const result = [];
//  for (let i = 0; i < array.length; i += size) {
//    result.push(array.slice(i, i + size));
//  }
//  return result;
//}

export default function CustomTemplatesSection({ templates, onTemplateClick }) {
  // Example usage: pass templates as a prop or fetch from state/api
  // const templates = ["Template 1", "Template 2", ...];

  //const rows = chunkArray(templates, 5);

  const [search, setSearch] = useState("");

  // Filter templates by search text
  const filteredTemplates = templates.filter(({ title }) =>
    title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="custom-templates-section">
      <div className="custom-templates-header">
        <h2 className="custom-templates-title">Custom Templates</h2>
        <FilterSearchBar
          filterOptions={["Default", "Most Used", "Recent", "Favorites"]}
          onFilterChange={() => {}}
          onSearch={(value) => {
            setSearch(value);
          }}
        />
      </div>
      <div className="custom-templates-row">
  {filteredTemplates.map(({ id, title, subject_id }) => (
    <div key={id} className="custom-square-wrapper">
      <Square
        text={title}
        usescale_id={id}
        onClick={() => {
          onTemplateClick(id, title, subject_id);
        }}
      />
      <div className="custom-square-overlay">
        <span className="star">⭐</span>
        <span className="dots">⋯</span>
      </div>
    </div>
  ))}
</div>
    </section>
  );
}
