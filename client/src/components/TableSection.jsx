/***
 * This file contains both the Editable cell component and the TableSection component
 */

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import "./TableSection.css";
import MenuButton from "./MenuButton";
import TagInput from "./TagInput";
import DropdownTagInput from "./DropdownTagInput";
import Star from "./Star";
import HOST from "../GLOBALS/Globals";
import ExportButton from "./ExportButton";
import editIcon from "../assets/edit.png";
import copyIcon from "../assets/copy.png";
import deleteIcon from "../assets/delete.png";
import addIcon from "../assets/add.png";
import saveIcon from "../assets/save.png";
import notificationIcon from "../assets/notification.png";
import WindowsConfirm from "../components/WindowsConfirm";
import WindowsInput from "./WindowsInput";

const NOAI = "LEVEL N";

const LEVEL_COLORS = {
  "NO AI": "#ffb3b3",
  "SOME AI": "#ffcfb3ff",
  "MORE AI": "#ffffb3ff",
  "AI FOR LEARNING": "#d9b3ffff",
};

/***
 * Editable cell component
 * 
 * This component renders and sets capabilities of editable cells in the template editing page
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.value] - Initial input value
 * @param {Function} props.onChange - Callback when input value changes
 * @param {boolean} [props.multiline=false] - Whether the cell should support multiple lines
 * @param {boolean} [props.grayed=false] - Whether the cell should appear grayed out
 * @param {boolean} [props.readOnly=false] - Whether the cell should be non-editable
 * @returns {JSX.Element} The Editable Cell Component
 */
function EditableCell({
  value,
  onChange,
  multiline = false,
  grayed = false,
  readOnly = false,
}) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");
  const textareaRef = useRef(null);
  const handleBlur = () => {
    setEditing(false);
    onChange(tempValue);
  };

  useEffect(() => {
    setTempValue(value || "");
  }, [value]);

  useLayoutEffect(() => {
    if (multiline && textareaRef.current) {
      const ta = textareaRef.current;
      ta.style.height = "auto"; // reset
      ta.style.height = ta.scrollHeight + "px"; // fit content
    }
  }, [editing, tempValue, multiline]);

  useEffect(() => {
    if (grayed && editing) {
      setEditing(false);
    }
  }, [grayed, editing]);

  /***
   * Handles when the read only boolean is set to true
   */
  if (readOnly) {
    return (
      <div
        className="editable-cell readonly"
        style={{ cursor: "not-allowed", opacity: 0.7 }}
      >
        {value || <span className="editable-placeholder">Empty</span>}
      </div>
    );
  }

  /***
   * Ensures cell is unclickable when grayed boolean is true
   */
  if (grayed) {
    return (
      <div className="editable-cell grayed" title="Uneditable for NO-AI rows">
        {"Not Applicable"}
      </div>
    );
  }

  /***
   * Sets cell input to 'Click to edit' if it is empty and not being edited
   */
  if (!editing) {
    return (
      <div
        className="editable-cell"
        onClick={() => setEditing(true)}
        style={{ cursor: "text" }}
      >
        {value || <span className="editable-placeholder">Click to edit</span>}
      </div>
    );
  }

  /***
   * If cell needs to span multiple lines, ensure this is possible
   */
  if (multiline) {
    return (
      <textarea
        ref={textareaRef}
        autoFocus
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleBlur();
          }
        }}
        className="editable-input"
      />
    );
  }

  return (
    <input
      type="text"
      autoFocus
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleBlur();
      }}
      className="editable-input"
    />
  );
}

/***
 * TableSection Component
 * 
 * Renders the main editable table area within the template editing page
 * Supports both base templates and custom templates
 * Allows for dynamic updates to table data
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the table section is currently visible
 * @param {boolean} props.isBaseTemplate - Indicates if the template being displayed is a base template
 * @param {string} props.userId - ID of the current user
 * @param {string} props.userType - Type of the current user (admin or coordinator)
 * @param {Array<Object>} props.tableData - Data for the table rows
 * @param {string} props.subjectId - ID of the associated subject tag (if applicable)
 * @param {string} props.initialTitle - Initial title of the template 
 * @param {Function} props.openNotification - Callback to display user notification
 * @param {Function} props.onRowsChange - Callback triggered when table row data changes
 * @param {Function} props.onSaveTemplate - Callback to save the current template state
 * @param {Array<Object>} [props.levelsData] - Array of SRep use scale entries
 * @param {Function} props.onUpdateSubjectDetails - Callback for updated subject tag details
 * @returns {JSX.Element} The TableSection component
 */
export default function TableSection({
  open,
  isBaseTemplate,
  userId,
  userType,
  tableData,
  subjectId,
  initialTitle,
  openNotification,
  onRowsChange,
  onSaveTemplate,
  levelsData = [], // <-- pass levelsData from parent (UseScalePage)
  onUpdateSubjectDetails,
}) {
  const [title, setTitle] = useState(
    initialTitle || "Untitled student declaration"
  );

  // Constant for determining if user is admin
  const isAdmin = userType?.toLowerCase() === "admin";
  // Constant for determining if user can modify rows
  const canModifyRows = !(isBaseTemplate && !isAdmin);
  const [popup, setPopup] = useState({ show: false, message: "", type: "info" });
  // Local state for table rows
  const [rows, setRows] = useState(tableData || []);
  const [subjectName, setSubjectName] = useState("");
  const [subjectYear, setSubjectYear] = useState("");
  const [subjectSemester, setSubjectSemester] = useState("");
  // Constant for notifications
  const [rowsWithNotifications, setRowsWithNotifications] = useState([]);

  // For pop up
  const showPopup = (message, type = "info") => {
    setPopup({ show: true, message, type });
  };

  const [confirmPopup, setConfirmPopup] = useState({
    show: false,
    message: "",
    onConfirm: null,
  });

  const askConfirmation = (message, onConfirm) => {
    setConfirmPopup({ show: true, message, onConfirm });
  };

  const [titleModal, setTitleModal] = useState({
  show: false,
  oldTitle: "",
  });

  // Empty row template
  const emptyRow = {
    assessment_task: "",
    level: "",
    label: "",
    instruction: "",
    example: "",
    declaration: "",
    version: "",
    purpose: "",
    key_prompts: "",
  };

  // Calls back to check if rows have any notifications
  useEffect(() => {
    if (!rows.length) return;

    const rowIds = rows.map((r) => r.row_id).filter(Boolean);
    if (!rowIds.length) return;

    fetch(HOST + "/get_notifications_for_rows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ row_ids: rowIds }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRowsWithNotifications(data.rows_with_notifications);
        } else {
          console.error("Error fetching notifications:", data.error);
        }
      })
      .catch((err) => console.error("Network error:", err));
  }, [rows]);

  // Fetches subject tagging information
  useEffect(() => {
    fetch(HOST + `/get_subject_info?subject_id=${subjectId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setSubjectName(data.subject_name || "");
          setSubjectYear(data.subject_year || "");
          setSubjectSemester(data.subject_semester || "");
        } else {
          console.error("Error fetching subject info:", data.error);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [subjectId]);

  // Updates subject tagging information
  useEffect(() => {
    if (typeof onUpdateSubjectDetails === "function") {
      onUpdateSubjectDetails(subjectName, subjectYear, subjectSemester);
    }
  }, [subjectName, subjectYear, subjectSemester, onUpdateSubjectDetails]);

  // Renders template title with the intial title
  useEffect(() => {
    if (initialTitle) setTitle(initialTitle);
  }, [initialTitle]);

  // Maps tableData to rows
  useEffect(() => {
    if (tableData) {
      // Map tableData to mark NO AI rows as grayed to make sure they render properly
      const mappedRows = tableData.map((row) => ({
        ...row,
        grayed: row.ai_title === "NO AI",
      }));
      setRows(mappedRows);
    }
  }, [tableData]);

  // Logic for editing title
  const editTitle = () => {
  setTitleModal({ show: true, oldTitle: title });
  };

  const handleTitleSubmit = async (newTitle) => {
  if (!newTitle) {
    showPopup("You cancelled the input.", "error");
    setTitleModal({ show: false, oldTitle: "" });
    return;
  }

  setTitle(newTitle);
  setTitleModal({ show: false, oldTitle: "" });
  };

  /***
   * Handles making a copy of the selected template
   */
  const makeCopy = async () => {
    try {
      const res = await fetch(HOST + "/copy_template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usescale_id: rows[0].usescale_id,
          user_id: userId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        showPopup(`Template copy created: "${data.new_title}"`, "success");
        console.log("new template ID:", data.new_usescale_id);
      } else {
        showPopup("Failed to copy template: " + (data.error || "Unknown error"), "error");
      }
    } catch (err) {
      showPopup("Error copying template, please try again.", "error");
    }
  };

  /***
   * Handles saving as a base template if in admin view
   */
  const saveAsBaseTemplate = () => {
    askConfirmation("Are you sure you want to save as a global base template?", async () => {
      const templateId = rows?.[0]?.usescale_id || usescale_id;
      if (!templateId) {
        showPopup("Cannot determine template ID", "error");
        return;
      }

      try {
        const res = await fetch(HOST + "/save_as_base_template", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usescale_id: templateId }),
        });
        const data = await res.json();
        if (data.success) showPopup("Template saved as base template", "success");
        else showPopup("Error: " + (data.error || ""), "error");
      } catch (err) {
        showPopup("Network error while saving template", "error");
      }
    });
  };

  /***
   * Handles copying base template as a coordinator 
   */
  const copyBaseTemplate = async () => {
    try {
      const res = await fetch(HOST + "/copy_base_template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usescale_id: rows[0].usescale_id,
          user_id: userId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        showPopup(`Base template copy created: "${data.new_title}"`, "success");
        console.log("new template ID:", data.new_usescale_id);
      } else {
        showPopup("Failed to copy base template: " + (data.error || "Unknown error"), "error");
      }
    } catch (err) {
      showPopup("Error copying base template, please try again.", "error");

    }
  };

  /***
   * Handles adding a row above
   */
  const addRowAbove = (rowIdx) => {
    const newRows = [
      ...rows.slice(0, rowIdx),
      { ...emptyRow },
      ...rows.slice(rowIdx),
    ];
    setRows(newRows);
    onRowsChange(newRows);
  };

  /***
   * Handles adding a row below
   */
  const addRowBelow = (rowIdx) => {
    const newRows = [
      ...rows.slice(0, rowIdx + 1),
      { ...emptyRow },
      ...rows.slice(rowIdx + 1),
    ];
    setRows(newRows);
    onRowsChange(newRows);
  };

  /***
   * Handles deleting selected row
   */
  const deleteRow = (rowIdx) => {
    askConfirmation("Are you sure you want to delete this row?", () => {
      const newRows = rows.filter((_, idx) => idx !== rowIdx);
      setRows(newRows);
      onRowsChange?.(newRows);
    });
  };

  /***
   * Handles duplicating selected row
   */
  const duplicateRow = (rowIdx) => {
    const rowCopy = rows[rowIdx];
    const newRows = [
      ...rows.slice(0, rowIdx + 1),
      { ...rowCopy },
      ...rows.slice(rowIdx + 1),
    ];
    setRows(newRows);
    onRowsChange(newRows);
  };

  /***
   * Handles the updating of cell changes
   */
  const handleCellChange = (rowIdx, field, value) => {
    const updatedRows = rows.map((row, idx) =>
      idx === rowIdx ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
    onRowsChange(updatedRows);
  };

  /***
   * Menu button options logic
   * If admin logged in: we have - save as base template option for custom templates
   *                             
   * If coordinator logged in: we have - copy base template option for base templates
   */
  let menuItems = [];

  if (canModifyRows) {
    menuItems = [
      { label: "Edit Title", icon: editIcon, onClick: () => editTitle() },
      { label: "Make a Copy", icon: copyIcon, onClick: () => makeCopy() },
      {
        label: "Save",
        icon: saveIcon,
        onClick: () =>
          onSaveTemplate(title, subjectName, subjectYear, subjectSemester),
      },
      ...(isAdmin
        ? [
            {
              label: "Save as Base Template",
              icon: saveIcon,
              onClick: () => saveAsBaseTemplate(),
            },
          ]
        : []),
    ];
  } else {
    menuItems = [
      {
        label: "Copy Base Template",
        icon: copyIcon,
        onClick: () => copyBaseTemplate(),
      },
    ];
  }

  return (
    <div className="table-section">
      <div className="table-section-header">
        <h2 className="table-section-title">{title}</h2>

        <Star onClick={() => console.log("Favourite clicked")} />

        <MenuButton inline items={menuItems} />

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <TagInput
            value={subjectName}
            placeholder={subjectName || "Subject Code"}
            onChange={(val) => {
              setSubjectName(val);
              onUpdateSubjectDetails(val, subjectYear, subjectSemester);
            }}
          />
          <TagInput
            value={subjectYear}
            placeholder={subjectYear || "Year"}
            onChange={(val) => {
              setSubjectYear(val);
              onUpdateSubjectDetails(subjectName, val, subjectSemester);
            }}
          />
          <DropdownTagInput
            placeholder={subjectSemester || "Semester"}
            options={["Semester 1", "Semester 2"]}
            onChange={(val) => {
              setSubjectSemester(val);
              onUpdateSubjectDetails(subjectName, subjectYear, val);
            }}
          />
        </div>

        <ExportButton />
      </div>

      <div className="table-section-container">
        <table className="table-section-table">
          <thead>
            <tr>
              <th className="table-section-th">
                General Learning or Assessment Tasks
              </th>
              <th className="table-section-th">AI Use Scale Level</th>
              <th className="table-section-th">Instruction to Students</th>
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
            {rows.map((data, rowIdx) => {
              const noAI = data?.level === NOAI;
              const isGray = data.grayed;

              return (
                <tr
                  key={`row-${rowIdx}`}
                  className={shouldHighlight ? "row-highlight" : ""}
                >
                  {/* Task column */}
                  <td className="table-section-td cell-with-menu">
                    <EditableCell
                      value={data.assessment_task}
                      onChange={(val) =>
                        handleCellChange(rowIdx, "assessment_task", val)
                      }
                      multiline
                      // set new read only variable, if base template and coordinator
                      readOnly={isBaseTemplate && !isAdmin}
                    />
                    <MenuButton
                      items={[
                        {
                          label: "Add Row Above",
                          icon: addIcon,
                          onClick: canModifyRows
                            ? () => addRowAbove(rowIdx)
                            : undefined,
                        },
                        {
                          label: "Add Row Below",
                          icon: addIcon,
                          onClick: canModifyRows
                            ? () => addRowBelow(rowIdx)
                            : undefined,
                        },
                        {
                          label: "Delete Row",
                          icon: deleteIcon,
                          onClick: canModifyRows
                            ? () => deleteRow(rowIdx)
                            : undefined,
                        },
                        {
                          label: "Duplicate Row",
                          icon: copyIcon,
                          onClick: canModifyRows
                            ? () => duplicateRow(rowIdx)
                            : undefined,
                        },
                      ]}
                    />
                  </td>

                  {/* AI Scale Level */}
                  <td
                    className="table-section-td cell-with-menu"
                    style={{
                      backgroundColor: LEVEL_COLORS[data?.label] || undefined,
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                      e.preventDefault();
                      let newLevel = "";
                      let newLabel = "";
                      let entry_type_id = null;
                      try {
                        const dropData = JSON.parse(
                          e.dataTransfer.getData("application/json")
                        );
                        newLevel = dropData.level;
                        newLabel = dropData.label;
                        entry_type_id = dropData.entry_type_id;
                      } catch {
                        newLevel = e.dataTransfer.getData("text/plain");
                      }
                      if (!newLevel) return;

                      // Find the entry in levelsData matching the dropped level
                      let foundEntry = null;
                      for (const entryType of levelsData) {
                        if (entryType.entry_type_id !== entry_type_id) continue;
                        foundEntry = entryType.entries.find(
                          (e) => e.ai_level === newLevel
                        );
                        if (foundEntry) break;
                      }

                      const nullify = newLevel === NOAI;

                      const updatedRows = rows.map((row, idx) => {
                        if (idx !== rowIdx) return row;
                        // If foundEntry then update all fields from DB apart from general learning row, if not then use old logic
                        if (foundEntry) {
                          const keep = row.id ? { id: row.id } : {};
                          const FLAT = {
                            ...row,
                            ...foundEntry,
                            level: newLevel,
                            label: newLabel,
                            entry_id: foundEntry.entry_id,
                            ...keep,
                          };
                          if (nullify) {
                            [
                              //"instruction",
                              "example",
                              "declaration",
                              "version",
                              "purpose",
                              "key_prompts",
                            ].forEach((k) => {
                              FLAT[k] = null;
                            });
                          }
                          return { ...keep, ...FLAT };
                        }
                      });

                      if (!(isBaseTemplate && !isAdmin)) {
                        setRows(updatedRows);
                        onRowsChange(updatedRows);
                      }
                    }}
                  >
                    <span>{data.label || "AI Scale Placeholder"}</span>
                    {rowsWithNotifications.includes(data.row_id) &&
                      !isAdmin && (
                        <MenuButton
                          items={[
                            {
                              label: "View notifications",
                              icon: editIcon,
                              onClick: () => {
                                console.log(
                                  "Opening notification for row:",
                                  data.row_id
                                );
                                openNotification(data.row_id);
                              },
                            },
                          ]}
                        />
                      )}
                  </td>

                  {/* Instruction */}
                  <td className="table-section-td">
                    <EditableCell
                      value={data.instruction}
                      onChange={(val) =>
                        handleCellChange(rowIdx, "instruction", val)
                      }
                      multiline
                      // set new read only variable, if base template and coordinator
                      readOnly={isBaseTemplate && !isAdmin}
                      //grayed={noAI}
                    />
                  </td>

                  {/* Examples */}
                  <td className="table-section-td">
                    <EditableCell
                      value={data.example}
                      onChange={(val) =>
                        handleCellChange(rowIdx, "example", val)
                      }
                      multiline
                      // set new read only variable, if base template and coordinator
                      readOnly={isBaseTemplate && !isAdmin}
                      //grayed={noAI}
                      grayed={noAI || isGray}
                    />
                  </td>

                  {/* Declaration */}
                  <td className="table-section-td">
                    <EditableCell
                      value={data.declaration}
                      onChange={(val) =>
                        handleCellChange(rowIdx, "declaration", val)
                      }
                      multiline
                      // set new read only variable, if base template and coordinator
                      readOnly={isBaseTemplate && !isAdmin}
                      grayed={noAI || isGray}
                    />
                  </td>

                  {/* Version */}
                  <td className="table-section-td">
                    <EditableCell
                      value={data.version}
                      onChange={(val) =>
                        handleCellChange(rowIdx, "version", val)
                      }
                      // set new read only variable, if base template and coordinator
                      readOnly={isBaseTemplate && !isAdmin}
                      grayed={noAI || isGray}
                    />
                  </td>

                  {/* Purpose */}
                  <td className="table-section-td">
                    <EditableCell
                      value={data.purpose}
                      onChange={(val) =>
                        handleCellChange(rowIdx, "purpose", val)
                      }
                      multiline
                      // set new read only variable, if base template and coordinator
                      readOnly={isBaseTemplate && !isAdmin}
                      grayed={noAI || isGray}
                    />
                  </td>

                  {/* Key Prompts */}
                  <td className="table-section-td">
                    <EditableCell
                      value={data.key_prompts}
                      onChange={(val) =>
                        handleCellChange(rowIdx, "key_prompts", val)
                      }
                      multiline
                      // set new read only variable, if base template and coordinator
                      readOnly={isBaseTemplate && !isAdmin}
                      grayed={noAI || isGray}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    {popup.show && (
  <div className={`popup-box ${popup.type}`}>
    <p>{popup.message}</p>
    <button
      onClick={() => setPopup({ show: false, message: "", type: "info" })}
      className="popup-close"
    >
      ×
    </button>
  </div>
)}
<WindowsConfirm
  show={confirmPopup.show}
  message={confirmPopup.message}
  onConfirm={() => {
    confirmPopup.onConfirm?.();
    setConfirmPopup({ show: false, message: "", onConfirm: null });
  }}
  onCancel={() => setConfirmPopup({ show: false, message: "", onConfirm: null })}
/>
<WindowsInput
  show={titleModal.show}
  title="Edit Template Title"
  defaultValue={titleModal.oldTitle}
  placeholder="Enter new title"
  onSubmit={handleTitleSubmit}
  onCancel={() => setTitleModal({ show: false, id: null, oldTitle: "" })}
/>
    </div>
  );
}
