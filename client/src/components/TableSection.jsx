import "./TableSection.css";

export default function TableSection({ open }) {
  return (
    <div className="table-section">
      <h2 className="table-section-title">Untitled student declaration</h2>
      <div className="table-section-container">
        <table className="table-section-table">
          <thead>
            <tr>
              <th className="table-section-th">Header 1</th>
              <th className="table-section-th">Header 2</th>
              <th className="table-section-th">Header 3</th>
              <th className="table-section-th">Header 4</th>
              <th className="table-section-th">Header 5</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 30 }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                <td className="table-section-td">Row {rowIdx + 1} - Col 1</td>
                <td className="table-section-td">Row {rowIdx + 1} - Col 2</td>
                <td className="table-section-td">Row {rowIdx + 1} - Col 3</td>
                <td className="table-section-td">Row {rowIdx + 1} - Col 4</td>
                <td className="table-section-td">Row {rowIdx + 1} - Col 5</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
