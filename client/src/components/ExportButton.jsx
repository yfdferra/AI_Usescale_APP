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
      
      let rows = Array.from(table.rows)
    .slice(1)
    .map(tr => {
      const aiCell = tr.cells[1];
    let aiScale = "";
    if (aiCell) {
      aiScale = aiCell.childNodes[0]?.textContent.trim() || "";
      aiScale = aiScale.replace(/\s+/g, " ").trim();
    }
      const instructions = tr.cells[2]?.innerText.trim() || "";
      const acknowledgement = tr.cells[4]?.innerText.trim() || "";
      return [aiScale, instructions, acknowledgement];
    })
    .filter(r => r.some(cell => cell !== ""));

    rows = Array.from(new Set(rows.map(r => JSON.stringify(r)))).map(r =>
      JSON.parse(r)
    );

    const order = ["NO AI", "SOME AI", "MORE AI", "GENERATIVE AI"];
    rows.sort((a, b) => {
      const indexA = order.indexOf(a[0]);
      const indexB = order.indexOf(b[0]);
      const rankA = indexA === -1 ? Infinity : indexA;
      const rankB = indexB === -1 ? Infinity : indexB;
      return rankA - rankB;
    });



    if (rows.length === 0) {
      alert("No AI Use Scale data found");
      return;
    }

    const mergeMap = {};
    for (let i = 0; i < rows.length; i++) {
      const value = rows[i][2];
      let span = 1;
  for (let j = i + 1; j < rows.length; j++) {
    if (rows[j][2] === value) {
      span++;
    } else break;
  }
  if (span > 1) mergeMap[i] = span;
  i += span - 1;
}

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, 16);
    doc.setFont("helvetica", "normal")
    autoTable(doc, {
    head: [["AI Assessment Scale", "Instructions to Students", "AI Acknowledgement"]],
    body: rows,
    startY: 20,
    styles: { fontSize: 12, halign: "center", textColor: [0, 0, 0], minCellHeight: 15, valign: "middle", lineWidth: 0.01, lineColor: [0, 0, 0], fillColor: [255, 255, 255],},
    headStyles: {
    fillColor: [218, 218, 218], 
    textColor: [0, 0, 0],
    fontStyle: "bold",
    halign: "center",
    valign: "middle",
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },
  didParseCell: function (data) {
    if (data.section === "body" && data.column.index === 0) {
      const value = data.cell.raw;
      if (scaleConfig[value]) data.cell.styles.fillColor = scaleConfig[value];
    }

    if (data.section === "body" && data.column.index === 2) {
      if (mergeMap[data.row.index]) {
        data.cell.rowSpan = mergeMap[data.row.index];
      } else {
        for (let start in mergeMap) {
          const span = mergeMap[start];
          const startIdx = parseInt(start, 10);
          if (data.row.index > startIdx && data.row.index < startIdx + span) {
            data.cell.text = "";
          }
        }
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
