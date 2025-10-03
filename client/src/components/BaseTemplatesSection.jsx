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
        alert("Failed to delete template: " + data.error);
      }
    } catch (err) {
      console.error("Error deleting template:", err);
      alert("Error deleting template");
    }
  };

  return (
    <section className="base-templates-section">
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
    </section>
  );
}
