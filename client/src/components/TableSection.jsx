import { useState, useEffect } from "react";
import "./TableSection.css";
import MenuButton from "./MenuButton";
import TagInput from "./TagInput";
import DropdownTagInput from "./DropdownTagInput";

export default function TableSection({ open, tableData, initialTitle }) {
  const [title, setTitle] = useState(
    initialTitle || "Untitled student declaration"
  );

  useEffect(() => {
    if (initialTitle) {
      setTitle(initialTitle);
    }
  }, [initialTitle]);

  const editTitle = () => {
    let userInput = prompt("Please enter new Title", "Title");

    if (userInput !== null) {
      setTitle(userInput);
    } else {
      alert("You cancelled the input.");
    }
  };

  console.log("TableSection data:", tableData);
  const menuItems = [
    { label: "Edit", onClick: () => console.log("Edit clicked") },
    { label: "Delete", onClick: () => console.log("Delete clicked") },
    { label: "View", onClick: () => console.log("View clicked") },
  ];
  return (
    <div className="table-section">
      <div className="table-section-header">
        <h2 className="table-section-title">{title}</h2>

        <MenuButton
          inline
          items={[
            { label: "Edit Title", onClick: () => editTitle() },
            { label: "Make a Copy", onClick: () => console.log("Make a Copy") },
            { label: "Save", onClick: () => console.log("Save") },
            {
              label: "Download Scale",
              onClick: () => console.log("Download Scale"),
            },
            {
              label: "Download Declaration",
              onClick: () => console.log("Download Declaration"),
            },
          ]}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <TagInput placeholder="*Subject" />
          <TagInput placeholder="*Year" />
          <DropdownTagInput
            placeholder="*Semester"
            options={["Sem 1", "Sem 2"]}
          />
        </div>
      </div>
      <div className="table-section-container">
        <table className="table-section-table">
          <thead>
            <tr>
              <th className="table-section-th">
                General Learning or Assessment Tasks
              </th>
              <th className="table-section-th">AI Use Scale Level</th>
              <th className="table-section-th">Instructions to Students</th>
              <th className="table-section-th">Examples</th>
              <th className="table-section-th">
                AI Generated Content in Submission
              </th>
              <th className="table-section-th">
                AI Tools Used (version and link if available)
              </th>
              <th className="table-section-th">Purpose and Usage</th>
              <th className="table-section-th">Key Prompts Used (if any)</th>
            </tr>
          </thead>
          <tbody>
            {tableData &&
              tableData.map((data, rowIdx) => (
                <tr key={`row-${rowIdx}`}>
                  <td className="table-section-td cell-with-menu">
                    <span>{data.instruction}</span>
                    <MenuButton
                      items={[
                        {
                          label: "Add Row Above",
                          onClick: () => console.log("Add Row Above", rowIdx),
                        },
                        {
                          label: "Add Row Below",
                          onClick: () => console.log("Add Row Below", rowIdx),
                        },
                        {
                          label: "Delete Row",
                          onClick: () => console.log("Delete Row", rowIdx),
                        },
                        {
                          label: "Duplicate Row",
                          onClick: () => console.log("Duplicate Row", rowIdx),
                        },
                      ]}
                    />
                  </td>

                  <td className="table-section-td cell-with-menu">
                    <span>AI Scale Placeholder</span>
                    <MenuButton
                      items={[
                        {
                          label: "Change Scale",
                          onClick: () => console.log("Change Scale", rowIdx),
                        },
                      ]}
                    />
                  </td>

                  <td className="table-section-td">{data.instruction}</td>
                  <td className="table-section-td">{data.example}</td>
                  <td className="table-section-td">{data.declaration}</td>
                  <td className="table-section-td">{data.version}</td>
                  <td className="table-section-td">{data.purpose}</td>
                  <td className="table-section-td">{data.key_prompts}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
