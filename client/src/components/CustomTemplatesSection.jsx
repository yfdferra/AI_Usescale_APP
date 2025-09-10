import React from "react";
import Square from "./Square";
import "./CustomTemplatesSection.css";

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

  return (
    <section className="custom-templates-section">
      <h2 className="custom-templates-title">Custom Templates</h2>
      <div className="custom-templates-row">
        {templates.map(({ id, title }) => (
          <Square
            key={id}
            text={title}
            usescale_id={id}
            onClick={() => {
              onTemplateClick(id);
            }}
          />
        ))}
      </div>
    </section>
  );
}
