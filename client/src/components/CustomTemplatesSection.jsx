import Square from "./Square";
import "./CustomTemplatesSection.css";
import FilterSearchBar from "./FilterSearchBar";
import StarToggle from "./Star";
import React, { useState, useEffect } from "react";
import MenuButton from "./MenuButton";
import HOST from "../GLOBALS/Globals";
import { useNavigate } from "react-router-dom";
import editIcon from "../assets/edit.png";
import copyIcon from "../assets/copy.png";
import deleteIcon from "../assets/delete.png";


// Helper to split array into chunks of 5
//function chunkArray(array, size = 5) {
//  const result = [];
//  for (let i = 0; i < array.length; i += size) {
//    result.push(array.slice(i, i + size));
//  }
//  return result;
//}

export default function CustomTemplatesSection({ templates, onTemplateClick }) {
  // Example usage: pass templates as a prop or fetch from state/api
  // const templates = ["Template 1", "Template 2", ...];

  //const rows = chunkArray(templates, 5);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [localTemplates, setLocalTemplates] = useState(templates || []);
  useEffect(() => {
    setLocalTemplates(templates || []);
  }, [templates]);

  // edit title handler
  const editTitle = async (id, oldTitle) => {
    const newTitle = prompt("Please enter new Title", oldTitle || "Untitled Template");
    if (!newTitle) return;

    try {
      const res = await fetch(`${HOST}/update_title`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usescale_id: id,
          title: newTitle,
        }),
      });
      const data = await res.json();

      if (data.success) {
        // update local UI immediately
        setLocalTemplates((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, title: newTitle } : t
          )
        );
      } else {
        alert("Failed to update title: " + data.error);
      }
    } catch (err) {
      console.error("Error updating title:", err);
      alert("Error updating title");
    }
  };

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

  // make copy handler
  const makeCopy = async (id) => {
    try {
      const res = await fetch(`${HOST}/copy_template`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ usescale_id: id}),
      });
      const data = await res.json();

      if (data.success) {
        setLocalTemplates(prev => [
          ...prev,
          {id: data.new_usescale_id, title: data.new_title}
        ]);

        //navigate(`/usescale/${data.new_usescale_id}`);
      } else {
        alert("failed to copy template:" + data.error);
      }
    } catch (err) {
      console.error("error copying template:", err);
      alert("error copying template")
    }
  };

  // Filter templates by search text
  const filteredTemplates = localTemplates.filter(({ title }) =>
    title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="custom-templates-section">
      <div className="custom-templates-header">
        <h2 className="custom-templates-title">Custom Templates</h2>
        <FilterSearchBar
          filterOptions={["Default", "Recent", "Favorites"]}
          onFilterChange={() => {}}
          onSearch={(value) => {
            setSearch(value);
          }}
        />
      </div>
      <div className="custom-templates-row">
  {filteredTemplates.map(({ id, title, subject_id }) => (
    <div key={id} className="custom-square-wrapper">
      <Square
        text={title}
        usescale_id={id}
        onClick={() => {
          onTemplateClick(id, title, subject_id);
        }}
      />
      <div className="custom-square-overlay">
        <StarToggle />
        <MenuButton
          items={[
            { label: "Edit Title", icon: editIcon, onClick: () => editTitle(id, title) },
            { label: "Make a Copy", icon: copyIcon, onClick: () => makeCopy(id) },
            { label: "Delete Template", icon: deleteIcon, onClick: () => deleteTemplate(id) },
          ]}
        />

        
      </div>
    </div>
  ))}
</div>
    </section>
  );
}
