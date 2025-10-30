/**
 * BaseTemplatesSection Component
 *
 * This component renders a section displaying base templates for different user types.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.userId - The current user's ID
 * @param {string} props.userType - The type of user ("admin" or "coordinator")
 * @param {Array} props.templates - Array of template objects with id, title, and subject_id
 * @param {Function} props.onBaseTemplateClick - Callback when a base template is clicked
 * @param {Function} props.onCreateFromScratchClick - Callback when "create from scratch" is clicked
 * @returns {JSX.Element} The BaseTemplatesSection component
 */

import React, { useState, useEffect } from "react";
import Square from "./Square";
import MenuButton from "./MenuButton";
import StarToggle from "./Star";
import deleteIcon from "../assets/delete.png";
import HOST from "../GLOBALS/Globals";
import "./BaseTemplatesSection.css";
import WindowsConfirm from "../components/WindowsConfirm";


export default function BaseTemplatesSection({ 
  userId,
  userType,
  templates, 
  onBaseTemplateClick,
  onCreateFromScratchClick 
}) {
  // State management for local templates, synced with props
  const [localTemplates, setLocalTemplates] = useState(templates || []);
    useEffect(() => {
      setLocalTemplates(templates || []);
    }, [templates]);

  // State for the subject space creation modal
  const [showModal, setShowModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [popup, setPopup] = useState({ show: false, message: "", type: "info" });
  const [showPassword, setShowPassword] = useState(false);
  // Bool for whether admin is logged in
  const isAdmin = userType?.toLowerCase() === "admin";
  const showPopup = (message, type = "info") => {
    setPopup({ show: true, message, type });
  };

  // Sync local templates state with incoming templates prop
  useEffect(() => {
      setLocalTemplates(templates || []);
  }, [templates]);

  /***
   * Handles confirming popup 
   */
  const [confirmPopup, setConfirmPopup] = useState({
      show: false,
      message: "",
      onConfirm: null,
    });
    const askConfirmation = (message, onConfirm) => {
      setConfirmPopup({ show: true, message, onConfirm });
    };

  // change label based on user type
  const createButtonLabel = 
    userType?.toLowerCase() === "admin"
     ? "+ Create new base template draft"
     : "+ Create from scratch";

  /***
   * Helper to add + in base template title display for coordinators and not for admin
   * Checks user type and adds + accordingly
   */
  const getTemplateLabel = (title) => {
    if (userType?.toLowerCase() === "coordinator") {
      return `+ ${title}`;
    }
    return title;
  };


  /***
   * Handles deletion of template in the admin homepage
   * Confirms with user that they are sure they want to delete
   * Makes API call to remove tempalte from database
   */
  const deleteTemplate = async (id) => {
  return new Promise((resolve) => {
    // Show our confirmation popup
    setConfirmPopup({
      show: true,
      message: "Are you sure you want to delete this template?",
      onConfirm: async () => {
        setConfirmPopup({ ...confirmPopup, show: false }); // close popup
        try {
          const res = await fetch(`${HOST}/delete_template`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usescale_id: id }),
          });
          const data = await res.json();

          if (data.success) {
            setLocalTemplates((prev) => prev.filter((t) => t.id !== id));
          } else {
            showPopup("Failed to delete. Please try again.", "error");
          }
        } catch (err) {
          showPopup("Error deleting template. Please try again.", "error");
        } finally {
          resolve(); // finish promise
        }
      },
    });
  });
};

/**
   * Handles creation of a new subject space
   * Validates input fields and makes API call to create subject coordinator account
   * Resets form state and closes modal on success
   */
  const handleCreateSubject = async () => {
    if (!newUsername || !newPassword) {
        showPopup("Please fill in username and password.", "error");

      return;
    }

    try {
      // API call to create subject space
      const res = await fetch(`${HOST}/create_subject_space`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          allowed_templates: selectedTemplates,
        }),
      });
      const data = await res.json();

      if (data.success) {
        showPopup("Subject space created successfully!", "success");
        setNewUsername("");
        setNewPassword("");
        setSelectedTemplates([]);
        setShowModal(false);
      } else {
        showPopup("Failed to create subject space: " + data.error, "error");
      }
    } catch (err) {
      showPopup("Error creating subject space", "error");
    }
  };


  return (
    <section className="base-templates-section">
      {/* Admin-only: Button to create new subject space */}
      {isAdmin && (
        <div className="create-subject-space-header">
          <button
            className="create-subject-button"
            onClick={() => setShowModal(true)}
          >
            + Create New Subject Space
          </button>
        </div>
      )}
      {/* Section title changes based on user type */}
      <h2 className="base-templates-title">
      {isAdmin ? "Global Base Templates" : "Base Templates"}
      </h2>
      <div className="base-templates-row">
        {localTemplates.map(({id, title, subject_id}) => (
          <div key = {id} className="base-square-wrapper">
            <Square
              key={id || idx}
              text={getTemplateLabel(title)}
              onClick={() =>
                onBaseTemplateClick(id, title, subject_id)
              }
            />
            {/* add menu overlay for each base template*/}
            {isAdmin && (
              <div className="base-square-overlay">
                <StarToggle />
                <MenuButton
                  items={[
                    { label: "Delete Base Template", icon: deleteIcon, onClick: () => deleteTemplate(id)},
                  ]}
                />
              </div>
            )}
          </div>
        ))}
        {/* "Create from scratch" option - always last item */}
        <Square
          key="create-new-template"
          text={createButtonLabel}
          onClick={() => onCreateFromScratchClick()}
        />
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create New Subject Space</h3>
              <p className="popup-description">
  You’re creating a login for a subject coordinator. 
  The username and password you set below will be their credentials 
  to access and manage this subject’s workspace.
</p>
            <input
              type="text"
              placeholder="Enter username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <div style={{ position: "relative" }}>
  <input
    type={showPassword ? "text" : "password"} // section to make it that you can show a password
    placeholder="Enter password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    style={{ paddingRight: "3rem" }}
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "0.5rem",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#666",
      fontSize: "0.9rem",
    }}
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>

            <div className="modal-buttons">
              <button className="confirm" onClick={handleCreateSubject}>
                Create
              </button>
              <button className="cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    {popup.show && (
  <div className={`popup-box ${popup.type}`}>
    <p>{popup.message}</p>
    <button onClick={() => setPopup({ show: false, message: "", type: "info" })}>
      ×
    </button>
  </div>
)}
<WindowsConfirm
  show={confirmPopup.show}
  message={confirmPopup.message}
  onConfirm={() => {
    confirmPopup.onConfirm?.();
  }}
  onCancel={() => setConfirmPopup({ ...confirmPopup, show: false })}
/>
    </section>
  );
}
