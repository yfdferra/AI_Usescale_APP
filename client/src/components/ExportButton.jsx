import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./ExportButton.css";

export default function ExportButton({ tableSelector = ".table-section-table", titleSelector = ".table-section-title" }) {

  const handleExport = () => {
    const table = document.querySelector(tableSelector);
    if (!table || !table.rows.length) return;

    const title =
      document.querySelector(titleSelector)?.textContent || "table";

    const ws = XLSX.utils.table_to_sheet(table);

    // Autofit column widths
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
  };

  return (
    <button className="table-section-export-btn" onClick={handleExport}>
      Export
    </button>
  );
}
