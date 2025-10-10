import React from "react";
import Sidebar from "../components/Sidebar";
import BaseTemplatesSection from "../components/BaseTemplatesSection";
import CustomTemplatesSection from "../components/CustomTemplatesSection";
import Dashboard from "../components/Dashboard";
import { useState, useEffect } from "react";
import HOST from "../GLOBALS/Globals.jsx";
import "./MainTemplate.css";

export default function MainTemplate({
  children,
  userId,
  userType,
  onTemplateClick,
  onBaseTemplateClick,
  onCreateFromScratchClick,
  onLogout,
}) {
  // retrieves the users use scales from db
  const [templates, setTemplates] = useState([]);
  useEffect(() => {
    fetch(`${HOST}/get_custom_scales?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setTemplates(
          data.map((item) => ({
            id: item.usescale_id,
            title: item.title,
            subject_id: item.subject_id,
          }))
        );
      })
      .catch((error) => console.log("Error usescales not found"));
  }, [userId]);

  // retrieves the current base templates from db
  const [baseTemplates, setBaseTemplates] = useState([]);
  useEffect(() => {
    fetch(`${HOST}/get_base_scales`)
      .then((res) => res.json())
      .then((data) => {
        setBaseTemplates(
          data.map((item) => ({
            id: item.usescale_id,
            title: item.title,
            subject_id: item.subject_id,
          }))
        );
      })
      .catch((error) => console.log("Error fetching base templates"));
  }, []);

  return (
    <div className="layout">
      <Sidebar onLogout={onLogout} />
      <Dashboard>
        <BaseTemplatesSection
          userId={userId}
          userType={userType}
          templates={baseTemplates}
          onBaseTemplateClick={onBaseTemplateClick}
          onCreateFromScratchClick={onCreateFromScratchClick}
        />
        <CustomTemplatesSection
          userId={userId}
          userType={userType}
          templates={templates}
          onTemplateClick={onTemplateClick}
        />
      </Dashboard>
    </div>
  );
}
