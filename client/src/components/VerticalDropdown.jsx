import React, { useState } from "react";

export default function VerticalDropdown({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="vertical-dropdown"
      style={{
        margin: "1rem",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        background: "#fff",
      }}
    >
      <div
        className="vertical-dropdown-header"
        style={{
          padding: "0.75rem 1rem",
          cursor: "pointer",
          fontWeight: "bold",
          borderBottom: open ? "1px solid #e5e7eb" : "none",
        }}
        onClick={() => setOpen(!open)}
      >
        {title}
        <span style={{ float: "right" }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className="vertical-dropdown-content" style={{ padding: "1rem" }}>
          {children}
        </div>
      )}
    </div>
  );
}
