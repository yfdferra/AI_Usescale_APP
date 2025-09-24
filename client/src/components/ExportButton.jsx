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
      
      const scaleConfig = {
  "NO AI": [255, 179, 179],      
  "SOME AI": [255, 207, 179],      
  "MORE AI": [255, 255, 179],     
  "GENERATIVE AI": [217, 179, 255]
};
      
      let values = Array.from(table.rows)
        .slice(1)
        .map(tr => {
          const aiCell = tr.cells[1];
          if (!aiCell) return "";
          const cleanText = aiCell.childNodes[0]?.textContent.trim() || "";
          return cleanText.replace(/\s+/g, " ").trim();
        });
      const uniqueValues = [...new Set(values.filter(v => v))];

      const orderedValues = Object.keys(scaleConfig).filter(v =>
        uniqueValues.includes(v)
      );

      if (orderedValues.length === 0) {
        alert("No AI Use Scale data found");
      return;
    }

    const doc = new jsPDF();
    doc.text(title, 14, 16);
    autoTable(doc, {
    head: [["AI Use Scale Level"]],
    body: orderedValues.map(v => [v]),
    startY: 20,
    styles: { fontSize: 12, halign: "center", textColor: [0, 0, 0], minCellHeight: 15, valign: "middle"},
    headStyles: {
    fillColor: [64, 64, 64], 
    textColor: [255, 255, 255],
    fontStyle: "bold",
    halign: "center",
    valign: "middle",
  },
  didParseCell: function (data) {
      if (data.section === "body") {
        const value = data.cell.raw;
        if (scaleConfig[value]) {
          data.cell.styles.fillColor = scaleConfig[value];
        }
      }
    },
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
