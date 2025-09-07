import React from "react";
import Sidebar from "../components/Sidebar";
import BaseTemplatesSection from "../components/BaseTemplatesSection";
import CustomTemplatesSection from "../components/CustomTemplatesSection";
import Dashboard from "../components/Dashboard";

export default function MainTemplate({ children, onWrittenAssessmentClick }) {
  return (
    <div className="layout">
      <Sidebar />
      <Dashboard>
        <BaseTemplatesSection
          onWrittenAssessmentClick={onWrittenAssessmentClick}
        />
        <CustomTemplatesSection
          templates={[
            "INFO30006 written",
            "INFO30006 presentation",
            "Another",
            "More",
            "More",
            "More",
            "More",
            "Overflow Row",
          ]}
        />
      </Dashboard>
    </div>
  );
}
