import React, { use } from "react";
import Sidebar from "../components/Sidebar";
import BaseTemplatesSection from "../components/BaseTemplatesSection";
import CustomTemplatesSection from "../components/CustomTemplatesSection";
import Dashboard from "../components/Dashboard";
import { useState, useEffect } from "react";
import HOST from "../GLOBALS/Globals.jsx";

export default function MainTemplate({
  children,
  onTemplateClick,
  onWrittenAsseessmentClick,
  onLogout, 
}) {
  const [templates, setTemplates] = useState([]);
  useEffect(() => {
    fetch(HOST + "/get_use_scales")
      .then((res) => res.json())
      .then((data) => {
        setTemplates(
          data.map((item) => ({
            id: item.usescale_id,
            title: item.title,
          }))
        );
      })
      .catch((error) => console.log("Error usescales not found"));
  }, []);

  return (
    <div className="layout">
      <Sidebar onLogout={onLogout}/>
      <Dashboard>
        <BaseTemplatesSection
          onWrittenAssessmentClick={onWrittenAsseessmentClick}
        />
        <CustomTemplatesSection
          templates={templates}
          onTemplateClick={onTemplateClick}
        />
      </Dashboard>
    </div>
  );
}
