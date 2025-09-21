import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./ExportButton.css";

export default function ExportButton({ tableSelector = ".table-section-table", titleSelector = ".table-section-title" }) {
  const [showPopup, setShowPopup] = useState(false);
  const [exportStudentDeclaration, setExportStudentDeclaration] = useState(true);
  const [exportAIUsageScale, setExportAIUsageScale] = useState(false);

  const handleExport = () => {
    if (!exportStudentDeclaration) return;

    const table = document.querySelector(tableSelector);
    if (!table || !table.rows.length) return;

    const title = document.querySelector(titleSelector)?.textContent || "table";
    const ws = XLSX.utils.table_to_sheet(table);

    const colCount = table.rows[0]?.cells.length || 8;
    const rowCount = table.rows.length;
    const colWidths = [];

    for (let c = 0; c < colCount; ++c) {
      let maxLen = 10;
      for (let r = 0; r < rowCount; ++r) {
        const cell = table.rows[r].cells[c];
        if (cell) {
          const text = cell.innerText || cell.textContent || "";
          maxLen = Math.max(maxLen, text.length);
        }
      }
      colWidths.push({ wch: maxLen + 2 });
    }

    ws["!cols"] = colWidths;
    ws["!rows"] = [{ hpt: 30 }, ...Array(rowCount - 1).fill({ hpt: 20 })];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${title}.xlsx`);

    setShowPopup(false);
  };

  const canExport = exportStudentDeclaration || exportAIUsageScale;

  return (
    <div className="export-btn-container" style={{ position: "relative" }}>
      <button className="export-btn" onClick={() => setShowPopup(!showPopup)}>
        Export
      </button>

      {showPopup && (
        <div className="export-popup">
          <h4>Select export options:</h4>
          <div className="export-option">
            <input
              type="checkbox"
              id="student-declaration"
              checked={exportStudentDeclaration}
              onChange={() => setExportStudentDeclaration(!exportStudentDeclaration)}
            />
            <label htmlFor="student-declaration">Export Student Declaration</label>
          </div>

          <div className="export-option">
            <input
              type="checkbox"
              id="ai-usage-scale"
              checked={exportAIUsageScale}
              onChange={() => setExportAIUsageScale(!exportAIUsageScale)}
            />
            <label htmlFor="ai-usage-scale">Export AI Usage Scale</label>
          </div>

          <button
            className="export-btn"
            disabled={!canExport}
            onClick={handleExport}
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
}
