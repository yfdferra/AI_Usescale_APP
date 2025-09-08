import React, { useState } from "react";

export default function VerticalDropdown({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="vertical-dropdown"
      style={{
        border: "1px solid #e2e3e4da",
        background: "#f7f9fcd8",
      }}
    >
      <div
        className="vertical-dropdown-header"
        style={{
          padding: "0.5rem 1rem",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: ".9rem",
          display: "flex",
          alignItems: "center",
        }}
        onClick={() => setOpen(!open)}
      >
        <span style={{ fontSize: "0.9rem", marginRight: "0.5rem" }}>
          {open ? "▲" : "▼"}
        </span>
        {title}
      </div>
      {open && (
        <div className="vertical-dropdown-content" style={{ padding: "1rem" }}>
          {children}
        </div>
      )}
    </div>
  );
}
