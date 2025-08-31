import React from "react";
import Sidebar from "../components/Sidebar";
import BaseTemplatesSection from "../components/BaseTemplatesSection";
import CustomTemplatesSection from "../components/CustomTemplatesSection";
import Dashboard from "../components/Dashboard";

export default function MainTemplate({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <Dashboard>
        <BaseTemplatesSection />
        <CustomTemplatesSection
          templates={[
            "INFO30006 written",
            "INFO30006 presentation",
            "Another",
            "More",
            "Even More",
            "Overflow Row",
          ]}
        />
      </Dashboard>
    </div>
  );
}
