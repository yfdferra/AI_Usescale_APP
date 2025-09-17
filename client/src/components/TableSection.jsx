import "./TableSection.css";
import MenuButton from "./MenuButton";
import TagInput from "./TagInput";
import DropdownTagInput from "./DropdownTagInput";
import Star from "./Star";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Function to handle exporting the table to Excel
//{can change the formatting of the exported excel file later to look nicer later}
const handleExport = () => {
  const table = document.querySelector(".table-section-table");
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
    ...Array(rowCount - 1).fill({ hpt: 20 }), // body rows, increased height
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([wbout], { type: "application/octet-stream" }),
    `${title}.xlsx`
  );
};

export default function TableSection({ open }) {
  const menuItems = [
    { label: "Edit", onClick: () => console.log("Edit clicked") },
    { label: "Delete", onClick: () => console.log("Delete clicked") },
    { label: "View", onClick: () => console.log("View clicked") },
  ];
  return (
    <div className="table-section">
      <div className="table-section-header">
        <h2 className="table-section-title">Untitled student declaration</h2>

        <Star onClick={() => console.log("Favourite clicked")} />

        <MenuButton
          inline
          items={[
            { label: "Edit Title", onClick: () => console.log("Edit Title") },
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
            {Array.from({ length: 30 }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                <td className="table-section-td cell-with-menu">
                  <span>Row {rowIdx + 1} - Col 1</span>
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
                  <span>Row {rowIdx + 1} - Col 2</span>
                  <MenuButton
                    items={[
                      {
                        label: "Change Scale",
                        onClick: () => console.log("Change Scale", rowIdx),
                      },
                    ]}
                  />
                </td>

                {Array.from({ length: 6 }).map((_, colIdx) => (
                  <td className="table-section-td" key={colIdx + 2}>
                    Row {rowIdx + 1} - Col {colIdx + 3}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
