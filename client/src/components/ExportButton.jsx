import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./ExportButton.css";
import exportIcon from "../assets/export.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportButton({ tableSelector = ".table-section-table", titleSelector = ".table-section-title" }) {
  const [showPopup, setShowPopup] = useState(false);
  const [exportStudentDeclaration, setExportStudentDeclaration] = useState(true);
  const [exportAIUsageScale, setExportAIUsageScale] = useState(false);

  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  const handleExport = () => {
  const title = document.querySelector(titleSelector)?.textContent || "table";

    // excell
    if (exportStudentDeclaration) {
      const table = document.querySelector(tableSelector);
      if (table && table.rows.length) {
        const ws = XLSX.utils.table_to_sheet(table);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${title}.xlsx`);
      }
    }

    // pdf
    if (exportAIUsageScale) {
      const table = document.querySelector(tableSelector);
      if (!table) {
        alert("No table found for PDF export");
        return;
      }
      
      const title = document.querySelector(titleSelector)?.innerText || "Export";
      const headers = ["AI Use Scale Level"];
      let values = Array.from(table.rows)
        .slice(1)
        .map(tr => tr.cells[1]?.innerText.trim() || "");
      const uniqueValues = [...new Set(values.filter(v => v))];

      if (uniqueValues.length === 0) {
        alert("No AI Use Scale data found");
      return;
    }
    const data = uniqueValues.map(v => [v]);

    const doc = new jsPDF();
    doc.text(title, 14, 16);
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 20,
      styles: { fontSize: 10 },
    });
    doc.save(`${title}_AI_Use_Scale.pdf`);
  }

    setShowPopup(false);
  };

  const canExport = exportStudentDeclaration || exportAIUsageScale;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);
  
  return (
    <div className="export-btn-container" style={{ position: "relative" }}>
      <button className="export-btn" ref={buttonRef} onClick={() => setShowPopup(!showPopup)}>
        <img src={exportIcon} alt="Export" className="export-icon" />
        <span className="export-text">Export</span>
      </button>

      {showPopup && (
        <div className="export-popup" ref={popupRef}>
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
            <img src={exportIcon} alt="Export" className="export-icon" />
            <span className="export-text">Download</span>
          </button>
        </div>
      )}
    </div>
  );
}
