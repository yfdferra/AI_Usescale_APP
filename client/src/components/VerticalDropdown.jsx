import React, { useState } from "react";
<<<<<<< HEAD
=======
import "./VerticalDropdown.css";
>>>>>>> Frontend

export default function VerticalDropdown({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
<<<<<<< HEAD
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
=======
    <div className="vertical-dropdown">
      <div className="vertical-dropdown-header" onClick={() => setOpen(!open)}>
        <span className="vertical-dropdown-header-icon">
          {open ? "▲" : "▼"}
        </span>
        {title}
      </div>
      {open && <div className="vertical-dropdown-content">{children}</div>}
>>>>>>> Frontend
    </div>
  );
}
