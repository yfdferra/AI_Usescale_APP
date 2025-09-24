import React, { useState } from "react";
import "./VerticalDropdown.css";

export default function VerticalDropdown({ title, children }) {
  const [open, setOpen] = useState(false);

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
