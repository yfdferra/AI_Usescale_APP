<<<<<<< HEAD
import React, { use } from "react";
=======
import React from "react";
>>>>>>> Frontend
import Sidebar from "../components/Sidebar";
import BaseTemplatesSection from "../components/BaseTemplatesSection";
import CustomTemplatesSection from "../components/CustomTemplatesSection";
import Dashboard from "../components/Dashboard";
<<<<<<< HEAD
import { useState, useEffect } from "react";
import HOST from "../GLOBALS/Globals.jsx";

// [
//             "INFO30006 written",
//             "INFO30006 presentation",
//             "Another",
//             "More",
//             "More",
//             "More",
//             "More",
//             "Overflow Row",
//           ]
export default function MainTemplate({ children }) {
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

=======

export default function MainTemplate({ children, onWrittenAssessmentClick }) {
>>>>>>> Frontend
  return (
    <div className="layout">
      <Sidebar />
      <Dashboard>
<<<<<<< HEAD
        <BaseTemplatesSection />
        <CustomTemplatesSection templates={templates} />
=======
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
>>>>>>> Frontend
      </Dashboard>
    </div>
  );
}
