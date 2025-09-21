import { useState, useEffect, useRef, useLayoutEffect } from "react";
import "./TableSection.css";
import MenuButton from "./MenuButton";
import TagInput from "./TagInput";
import DropdownTagInput from "./DropdownTagInput";
import Star from "./Star";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
function EditableCell({ value, onChange, multiline = false }) {
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

  const handleBlur = () => {
    setEditing(false);
    onChange(tempValue);
  };

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
  tableData,
  initialTitle,
  toHighlight,
  onChangeScale,
  onRowsChange,
}) {
  const [title, setTitle] = useState(
    initialTitle || "Untitled student declaration"
  );

  // local state for table rows
  const [rows, setRows] = useState(tableData || []);

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
    const confirmed = window.confirm("Are you sure you want to delete this row?");
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
            { label: "Save", onClick: () => console.log("Save") },
          ]}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <TagInput placeholder="*Subject" />
          <TagInput placeholder="*Year" />
          <DropdownTagInput placeholder="*Semester" options={["Sem 1", "Sem 2"]} />
        </div>

        <button className="table-section-export-btn" onClick={handleExport}>
          Export
        </button>
      </div>

      <div className="table-section-container">
        <table className="table-section-table">
          <thead>
            <tr>
              <th className="table-section-th">General Learning or Assessment Tasks</th>
              <th className="table-section-th">AI Use Scale Level</th>
              <th className="table-section-th">Instruction to Students</th>
              <th className="table-section-th">Examples</th>
              <th className="table-section-th">AI Generated Content in Submission</th>
              <th className="table-section-th">AI Tools Used (version and link if available)</th>
              <th className="table-section-th">Purpose and Usage</th>
              <th className="table-section-th">Key Prompts Used (if any)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((data, rowIdx) => {
              const shouldHighlight = toHighlight === rowIdx;

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
                        { label: "Add Row Above", onClick: () => addRowAbove(rowIdx) },
                        { label: "Add Row Below", onClick: () => addRowBelow(rowIdx) },
                        { label: "Delete Row", onClick: () => deleteRow(rowIdx) },
                        { label: "Duplicate Row", onClick: () => duplicateRow(rowIdx) },
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
                      const updatedRows = rows.map((row, idx) =>
                        idx === rowIdx
                          ? { ...row, level: newLevel, label: newLabel }
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
                      onChange={(val) => handleCellChange(rowIdx, "instruction", val)}
                      multiline
                    />
                  </td>

                  {/* Examples */}
                  <td className="table-section-td">
                    <EditableCell
                      value={data.example}
                      onChange={(val) => handleCellChange(rowIdx, "example", val)}
                      multiline
                    />
                  </td>

                  {/* Declaration */}
                  <td className="table-section-td">
                    <EditableCell
                      value={data.declaration}
                      onChange={(val) => handleCellChange(rowIdx, "declaration", val)}
                      multiline
                    />
                  </td>

                  {/* Version */}
                  <td className="table-section-td">
                    <EditableCell
                      value={data.version}
                      onChange={(val) => handleCellChange(rowIdx, "version", val)}
                    />
                  </td>

                  {/* Purpose */}
                  <td className="table-section-td">
                    <EditableCell
                      value={data.purpose}
                      onChange={(val) => handleCellChange(rowIdx, "purpose", val)}
                      multiline
                    />
                  </td>

                  {/* Key Prompts */}
                  <td className="table-section-td">
                    <EditableCell
                      value={data.key_prompts}
                      onChange={(val) => handleCellChange(rowIdx, "key_prompts", val)}
                      multiline
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
