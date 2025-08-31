import React from "react";
import Square from "./Square";

export default function BaseTemplatesSection() {
  const baseTemplates = [
    "+ Written Assessment",
    "+ Coding Assessment",
    "+ Oral Assessment",
    "+ Presentation Assessment",
    "+ Create from scratch",
  ];

  return (
    <section className="base-templates-section">
      <h2 className="base-templates-title">Base Templates</h2>
      <div className="base-templates-row">
        {baseTemplates.map((title, idx) => (
          <Square key={idx} text={title} />
        ))}
      </div>
    </section>
  );
}
