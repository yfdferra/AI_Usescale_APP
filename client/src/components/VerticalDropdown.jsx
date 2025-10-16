import React, { useState, useEffect } from "react";
import "./VerticalDropdown.css";

export default function VerticalDropdown({ title, children, expanded = false }) {
  const [open, setOpen] = useState(expanded);

 useEffect(() => {
  setOpen(expanded);
}, [expanded]);

  return (
    <div className="vertical-dropdown">
      <div className="vertical-dropdown-header" onClick={() => setOpen(!open)}>
        <span className="vertical-dropdown-header-icon">
          {open ? "▲" : "▼"}
        </span>
        {title}
      </div>
      {open && <div className="vertical-dropdown-content">{children}</div>}
    </div>
  );
}
