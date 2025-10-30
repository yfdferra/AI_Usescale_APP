/***
 * MainTemplate Component
 * 
 * Acts as the primary layout and container for the template management interface
 * It renders the sidebar, dashboard, and both base and custom template sections
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.userId - ID of the current user
 * @param {string} props.userType - Type of current user (admin or coordinator)
 * @param {Function} props.onTemplateClick - Callback fired when a template is clicked
 * @param {Function} props.onBaseTemplateClick - Callback fired when a base template is clicked
 * @param {Function} props.onCreateFromScratchClick - Callback fired when the user clicks create from scratch square
 * @param {Function} props.onLogout - Callback triggered when user logs out
 * @returns {JSX.Element} The MainTemplate Component
 */

import React from "react";
import Sidebar from "../components/Sidebar";
import BaseTemplatesSection from "../components/BaseTemplatesSection";
import CustomTemplatesSection from "../components/CustomTemplatesSection";
import Dashboard from "../components/Dashboard";
import { useState, useEffect } from "react";
import HOST from "../GLOBALS/Globals.jsx";
import "./MainTemplate.css";

export default function MainTemplate({
  userId,
  userType,
  onTemplateClick,
  onBaseTemplateClick,
  onCreateFromScratchClick,
  onLogout,
}) {
  // Retrieves the users use scales from the database
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

  // Retrieves the current base templates from the database
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
