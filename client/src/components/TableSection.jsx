import { useState, useEffect } from "react";
import "./TableSection.css";
import MenuButton from "./MenuButton";
import TagInput from "./TagInput";
import DropdownTagInput from "./DropdownTagInput";
import Star from "./Star";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import HOST from "../GLOBALS/Globals";

const NOAI = "LEVEL N";

// Function to handle exporting the table to Excel
const handleExport = () => {
  const table = document.querySelector(".table-section-table");
  if (!table || !table.rows.length) return;

  const title =
    document.querySelector(".table-section-title")?.textContent || "table";

  // Create worksheet and workbook
  const ws = XLSX.utils.table_to_sheet(table);

  // Calculate autofit column widths
  const colCount = table.rows[0]?.cells.length || 8;
  const rowCount = table.rows.length;
  const colWidths = [];

  for (let c = 0; c < colCount; ++c) {
    let maxLen = 10; // minimum width
    for (let r = 0; r < rowCount; ++r) {
      const cell = table.rows[r].cells[c];
      if (cell) {
        const text = cell.innerText || cell.textContent || "";
        maxLen = Math.max(maxLen, text.length);
      }
    }
    colWidths.push({ wch: maxLen + 2 }); // padding
  }

  ws["!cols"] = colWidths;

  // row heights
  ws["!rows"] = [
    { hpt: 30 }, // header row
    ...Array(rowCount - 1).fill({ hpt: 20 }), // body rows
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([wbout], { type: "application/octet-stream" }),
    `${title}.xlsx`
  );
};

const LEVEL_COLORS = {
  "LEVEL N": "#ffb3b3",
  "LEVEL R-1": "#ffcfb3ff",
  "LEVEL R-2": "#ffffb3ff",
  "LEVEL G": "#d9b3ffff",
};

// Editable cell component
function EditableCell({ value, onChange, multiline = false, grayed = false }) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");

  useEffect(() => {
    setTempValue(value || "");
  }, [value]);

  useEffect(() => {
    if (grayed && editing) {
      setEditing(false);
    }
  }, [grayed, editing]);

  const handleBlur = () => {
    setEditing(false);
    onChange(tempValue);
  };

  // if grayed out, unclickable
  if (grayed) {
    return (
      <div
        className="editable-cell grayed"
        title="Uneditable for NO-AI rows"
      >
        {"Not Applicable"}
      </div>
    )
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
  tableData,
  subjectId,
  initialTitle,
  toHighlight,
  onChangeScale,
  onRowsChange,
  onSaveTemplate,
}) {
  const [title, setTitle] = useState(
    initialTitle || "Untitled student declaration"
  );

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
    if (initialTitle) setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    if (tableData) setRows(tableData);
  }, [tableData]);

  const editTitle = () => {
    let userInput = prompt("Please enter new Title", "Title");
    if (userInput !== null) {
      setTitle(userInput);
    } else {
      alert("You cancelled the input.");
    }
  };

  // empty row template
  const emptyRow = {
    task: "",
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

  return (
    <div className="table-section">
      <div className="table-section-header">
        <h2 className="table-section-title">{title}</h2>

        <Star onClick={() => console.log("Favourite clicked")} />

        <MenuButton
          inline
          items={[
            { label: "Edit Title", onClick: () => editTitle() },
            { label: "Make a Copy", onClick: () => console.log("Make a Copy") },
            {
              label: "Save",
              onClick: () => onSaveTemplate(),
            },
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
          <TagInput value={subjectName} />
          <TagInput value={subjectYear} />
          <DropdownTagInput
            placeholder={subjectSemester}
            options={["Semester 1", "Semester 2"]}
          />
        </div>

        <button className="table-section-export-btn" onClick={handleExport}>
          Export
        </button>
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

              return (
                <tr
                  key={`row-${rowIdx}`}
                  className={shouldHighlight ? "row-highlight" : ""}
                >
                  {/* Task column */}
                  <td className="table-section-td cell-with-menu">
                    <EditableCell
                      value={data.task}
                      onChange={(val) => handleCellChange(rowIdx, "task", val)}
                      multiline
                    />
                    <MenuButton
                      items={[
                        {
                          label: "Add Row Above",
                          onClick: () => addRowAbove(rowIdx),
                        },
                        {
                          label: "Add Row Below",
                          onClick: () => addRowBelow(rowIdx),
                        },
                        {
                          label: "Delete Row",
                          onClick: () => deleteRow(rowIdx),
                        },
                        {
                          label: "Duplicate Row",
                          onClick: () => duplicateRow(rowIdx),
                        },
                      ]}
                    />
                  </td>

                  {/* AI Scale Level */}
                  <td
                    className="table-section-td cell-with-menu"
                    style={{
                      backgroundColor: LEVEL_COLORS[data?.level] || undefined,
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      let newLevel = "";
                      let newLabel = "";
                      try {
                        const dropData = JSON.parse(
                          e.dataTransfer.getData("application/json")
                        );
                        newLevel = dropData.level;
                        newLabel = dropData.label;
                      } catch {
                        newLevel = e.dataTransfer.getData("text/plain");
                      }
                      if (!newLevel) return;

                      const nullify = newLevel === NOAI;  // if the chosen level is NO AI: all columns are stored as null

                      const updatedRows = rows.map((row, idx) =>
                        idx === rowIdx
                          ? { 
                              ...row, 
                              level: newLevel, 
                              label: newLabel,
                              ...(nullify && {
                                instruction: null,
                                example: null,
                                declaration: null,
                                version: null,
                                purpose: null,
                                key_prompts: null, 
                              }),
                            }
                          : row
                      );
                      setRows(updatedRows);
                      onRowsChange(updatedRows);
                    }}
                  >
                    <span>{data.label || "AI Scale Placeholder"}</span>
                    <MenuButton
                      items={[
                        {
                          label: "Change Scale",
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
                      grayed={noAI}
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
                      grayed={noAI}
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
                      grayed={noAI}
                    />
                  </td>

                  {/* Version */}
                  <td className="table-section-td">
                    <EditableCell
                      value={data.version}
                      onChange={(val) =>
                        handleCellChange(rowIdx, "version", val)
                      }
                      grayed={noAI}
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
                      grayed={noAI}
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
                      grayed={noAI}
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
