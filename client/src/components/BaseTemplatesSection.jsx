import Square from "./Square";
import "./BaseTemplatesSection.css";

export default function BaseTemplatesSection({ onWrittenAssessmentClick }) {
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
        {baseTemplates.map((title, idx) =>
          idx === 0 ? (
            <Square key={idx} text={title} onClick={onWrittenAssessmentClick} />
          ) : (
            <Square key={idx} text={title} />
          )
        )}
      </div>
    </section>
  );
}
