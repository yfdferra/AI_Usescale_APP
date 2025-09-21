import React from "react";
import Square from "./Square";
import "./BaseTemplatesSection.css";

export default function BaseTemplatesSection({ onWrittenAssessmentClick, onCreateFromScratchClick }) {
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
        {baseTemplates.map((title, idx) => {
          if (idx === 0) {
            // written assessment
            return (
              <Square
                key={idx}
                text={title}
                onClick={() =>
                  onWrittenAssessmentClick(idx, title.startsWith("+ ") ? title.slice(2) : title)
                }
              />
            );
          } else if (idx === 4) {
            // create from scratch
            return (
              <Square
                key={idx}
                text={title}
                onClick={() =>
                  onCreateFromScratchClick(idx, title.startsWith("+ ") ? title.slice(2) : title)
                }
              />
            );
          } else {
            // Other buttons (inactive for now)
            return <Square key={idx} text={title} />;
          }
        })} 
      </div>
    </section>
  );
}
