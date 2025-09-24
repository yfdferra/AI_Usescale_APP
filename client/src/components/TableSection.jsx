import React from "react";

export default function TableSection({open}) {
    return (
        
        <div style={{ padding: "0.5rem"}}>
            <h2 style={{ marginBottom: "1rem" }}>Untitled student declaration</h2>
            <div
                style={{
                    overflow: "auto",
                    maxHeight: "88vh",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                }}
            >     
                <table style={{ borderCollapse: "collapse", minWidth: "1000px" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Header 1</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Header 2</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Header 3</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Header 4</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Header 5</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 30 }).map((_, rowIdx) => (
                            <tr key={rowIdx}>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>Row {rowIdx + 1} - Col 1</td>
                               <td style={{ border: "1px solid #ccc", padding: "8px" }}>Row {rowIdx + 1} - Col 2</td>
                               <td style={{ border: "1px solid #ccc", padding: "8px" }}>Row {rowIdx + 1} - Col 3</td>
                               <td style={{ border: "1px solid #ccc", padding: "8px" }}>Row {rowIdx + 1} - Col 4</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>Row {rowIdx + 1} - Col 5</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}