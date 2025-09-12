import "./TableSection.css";
import MenuButton from "./MenuButton";

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
        <MenuButton
          inline
          items={[
            { label: "Edit Title", onClick: () => console.log("Edit Title") },
            { label: "Make a Copy", onClick: () => console.log("Make a Copy") },
            { label: "Save", onClick: () => console.log("Save") },
            { label: "Download Scale", onClick: () => console.log("Download Scale") },
            { label: "Download Declaration", onClick: () => console.log("Download Declaration") },
          ]}
        />
      </div>
      <div className="table-section-container">
        <table className="table-section-table">
          <thead>
            <tr>
              <th className="table-section-th">General Learning or Assessment Tasks</th>
              <th className="table-section-th">AI Use Scale Level</th>
              <th className="table-section-th">Instructions to Students</th>
              <th className="table-section-th">Examples</th>
              <th className="table-section-th">AI Generated Content in Submission</th>
              <th className="table-section-th">AI Tools Used (version and link if available)</th>
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
                      { label: "Add Row Above", onClick: () => console.log("Add Row Above", rowIdx) },
                      { label: "Add Row Below", onClick: () => console.log("Add Row Below", rowIdx) },
                      { label: "Delete Row", onClick: () => console.log("Delete Row", rowIdx) },
                      { label: "Duplicate Row", onClick: () => console.log("Duplicate Row", rowIdx) },
                    ]}
                  />
                </td>

                <td className="table-section-td cell-with-menu">
                  <span>Row {rowIdx + 1} - Col 2</span>
                  <MenuButton
                    items={[
                      { label: "Change Scale", onClick: () => console.log("Change Scale", rowIdx) },
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
