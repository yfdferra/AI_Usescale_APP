import React, { useState, useEffect } from "react";
import Square from "./Square";
import MenuButton from "./MenuButton";
import StarToggle from "./Star";
import deleteIcon from "../assets/delete.png";
import HOST from "../GLOBALS/Globals";
import "./BaseTemplatesSection.css";

export default function BaseTemplatesSection({ 
  userId,
  userType,
  templates, 
  onBaseTemplateClick,
  onCreateFromScratchClick 
}) {

  const [localTemplates, setLocalTemplates] = useState(templates || []);
    useEffect(() => {
      setLocalTemplates(templates || []);
    }, [templates]);
  const [showModal, setShowModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [popup, setPopup] = useState({ show: false, message: "", type: "info" });


  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
      setLocalTemplates(templates || []);
  }, [templates]);

  const showPopup = (message, type = "info") => {
    setPopup({ show: true, message, type });
  };

  // change label based on user type
  const createButtonLabel = 
    userType?.toLowerCase() === "admin"
     ? "+ Create new base template draft"
     : "+ Create from scratch";

  // helper to add + for coordinators and not for admin
  const getTemplateLabel = (title) => {
    if (userType?.toLowerCase() === "coordinator") {
      return `+ ${title}`;
    }
    return title;
  };

  // bool for whether admin is logged in
  const isAdmin = userType?.toLowerCase() === "admin";

  // delete template handler
  const deleteTemplate = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this template?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${HOST}/delete_template`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({usescale_id: id}),
      });
      const data = await res.json();

      if (data.success) {
        // remove from local UI immediately
        setLocalTemplates((prev) => prev.filter((t) => t.id !== id));
      } else {
        showPopup("Failed to delete. Please try again.", "error");
      }
    } catch (err) {
      showPopup("Error creating subject space. Please try again.", "error");
      showPopup("Error deleting template. Please try again.", "error");
    }
  };

  const handleCreateSubject = async () => {
    if (!newUsername || !newPassword) {
        showPopup("Please fill in username and password.", "error");

      return;
    }

    try {
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
      showPopup("Subject space created successfully!", "success");
      showPopup("Error creating subject space", "error");
    }
  };

  const toggleTemplateSelection = (id) => {
    setSelectedTemplates((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  return (
    <section className="base-templates-section">
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

            
            
            {/*Function to show and hide a password */}
            {/* I've just commented this part out for now, but can be added back in 
            
            
            <div className="template-selector">
              <p>Select base templates accessible to this coordinator:</p>
              <div className="template-list">
                {localTemplates.map((t) => (
                  <label key={t.id} className="template-option">
                    <input
                      type="checkbox"
                      checked={selectedTemplates.includes(t.id)}
                      onChange={() => toggleTemplateSelection(t.id)}
                    />
                    <span>{t.title}</span>
                  </label>
                ))}
              </div>
            </div>*/}

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

    </section>
  );
}
