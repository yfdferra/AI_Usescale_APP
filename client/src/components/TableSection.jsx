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

const NOAI = "LEVEL N";

const LEVEL_COLORS = {
  "NO AI": "#ffb3b3",
  "SOME AI": "#ffcfb3ff",
  "MORE AI": "#ffffb3ff",
  "AI FOR LEARNING": "#d9b3ffff",
};

// Editable cell component
// add a readonly mode for coordinators viewing base templates
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

  const handleBlur = () => {
    setEditing(false);
    onChange(tempValue);
  };

  // handle read only
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

  // if grayed out, unclickable
  if (grayed) {
    return (
      <div className="editable-cell grayed" title="Uneditable for NO-AI rows">
        {"Not Applicable"}
      </div>
    );
  }
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

export default function TableSection({
  open,
  isBaseTemplate,
  userId,
  userType,
  tableData,
  subjectId,
  initialTitle,
  toHighlight,
  onChangeScale,
  onRowsChange,
  onSaveTemplate,
  levelsData = [], // <-- pass levelsData from parent (UseScalePage)
  onUpdateSubjectDetails,
}) {
  const [title, setTitle] = useState(
    initialTitle || "Untitled student declaration"
  );

  // constant for determining if user is admin
  const isAdmin = userType?.toLowerCase() === "admin";
  // constant for determining if user can modify rows
  const canModifyRows = !(isBaseTemplate && !isAdmin);

  // local state for table rows
  const [rows, setRows] = useState(tableData || []);
  const [subjectName, setSubjectName] = useState("");
  const [subjectYear, setSubjectYear] = useState("");
  const [subjectSemester, setSubjectSemester] = useState("");

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

  useEffect(() => {
    if (typeof onUpdateSubjectDetails === "function") {
      onUpdateSubjectDetails(subjectName, subjectYear, subjectSemester);
    }
  }, [subjectName, subjectYear, subjectSemester, onUpdateSubjectDetails]);

  useEffect(() => {
    if (initialTitle) setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    if (tableData) {
      // map tableData to mark NO AI rows as grayed to make sure they render properly
      const mappedRows = tableData.map((row) => ({
        ...row,
        grayed: row.ai_title === "NO AI",
      }));
      setRows(mappedRows);
    }
  }, [tableData]);

  const editTitle = () => {
    let userInput = prompt("Please enter new Title", "Title");
    if (userInput !== null) {
      setTitle(userInput);
    } else {
      alert("You cancelled the input.");
    }
  };

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
        alert(`Template copy created: "${data.new_title}"`);
        console.log("new template ID:", data.new_usescale_id);
      } else {
        alert("Failed to copy template:" + (data.error || "Uknown error"));
      }
    } catch (err) {
      console.error("Error copying template:", err);
      alert("Error copying template, please try again.");
    }
  };

  // function for saving as base template for admin
  const saveAsBaseTemplate = async () => {
    if (
      !window.confirm(
        "Are you sure you want to save as a global base template?"
      )
    ) {
      return;
    }

    const templateId = rows?.[0]?.usescale_id || usescale_id; // fallback to prop
    if (!templateId) {
      alert("Cannot determine template ID to save as base template");
      return;
    }

    try {
      const res = await fetch(HOST + "/save_as_base_template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usescale_id: templateId }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Template has been successfully saved as a base template");
      } else {
        alert("Error saving as base template: " + (data.error || ""));
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error while saving as base template");
    }
  };

  // function for copying a base template as a coordinator
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
        alert(`Base template copy created: "${data.new_title}"`);
        console.log("new template ID:", data.new_usescale_id);
      } else {
        alert("Failed to copy base template:" + (data.error || "Uknown error"));
      }
    } catch (err) {
      console.error("Error copying base template:", err);
      alert("Error copying base template, please try again.");
    }
  };

  // empty row template
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

  // update cell and notify parent
  const updateCell = (rowIdx, key, value) => {
    const next = rows.slice();
    const keep = next[rowIdx]?.id ? { id: next[rowIdx].id } : {}; // keep id if available
    next[rowIdx] = { ...keep, ...next[rowIdx], [key]: value }; // new row object, starting with id, and all other row cells, and overwrite old value with new value
    setRows(next); // update local row state
    onRowsChange && onRowsChange(next); // if it was changed, call it so the parent will stay in sync too
  };

  // add row above
  const addRowAbove = (rowIdx) => {
    const newRows = [
      ...rows.slice(0, rowIdx),
      { ...emptyRow },
      ...rows.slice(rowIdx),
    ];
    setRows(newRows);
    onRowsChange(newRows);
  };

  // add row below
  const addRowBelow = (rowIdx) => {
    const newRows = [
      ...rows.slice(0, rowIdx + 1),
      { ...emptyRow },
      ...rows.slice(rowIdx + 1),
    ];
    setRows(newRows);
    onRowsChange(newRows);
  };

  // delete row
  const deleteRow = (rowIdx) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this row?"
    );
    if (!confirmed) return;

    const newRows = rows.filter((_, idx) => idx !== rowIdx);
    setRows(newRows);
    onRowsChange(newRows);
  };

  // duplicate row
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

  const handleCellChange = (rowIdx, field, value) => {
    const updatedRows = rows.map((row, idx) =>
      idx === rowIdx ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
    onRowsChange(updatedRows);
  };

  // define the menu items outside the jsx based on user type
  // render extra button if admin is logged in
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
  //onUpdateSubjectDetails(subjectName, subjectYear, subjectSemester);

  return (
    <div className="table-section">
      <div className="table-section-header">
        <h2 className="table-section-title">{title}</h2>

        <Star onClick={() => console.log("Favourite clicked")} />

        <MenuButton inline items={menuItems} />

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <TagInput
            value={subjectName}
            placeholder={subjectName}
            onChange={(val) => {
              setSubjectName(val);
              onUpdateSubjectDetails(val, subjectYear, subjectSemester);
            }}
          />
          <TagInput
            value={subjectYear}
            placeholder={subjectYear}
            onChange={(val) => {
              setSubjectYear(val);
              onUpdateSubjectDetails(subjectName, val, subjectSemester);
            }}
          />
          <DropdownTagInput
            placeholder={subjectSemester}
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
              const shouldHighlight = toHighlight === rowIdx;
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
                    <MenuButton
                      items={[
                        {
                          label: "Change Scale",
                          icon: editIcon,
                          onClick: () => onChangeScale(rowIdx),
                        },
                      ]}
                    />
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
    </div>
  );
}
