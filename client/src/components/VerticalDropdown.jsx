/**
 * VerticalDropdown Component
 *
 * A collapsible vertical dropdown section that shows or hides its content when the header is clicked.
 *
 * @component
 * @param {Object} props
 * @param {string} props.title - Title displayed in the dropdown header
 * @param {React.ReactNode} props.children - Content inside the dropdown
 * @param {boolean} [props.expanded=false] - Initial expanded state
 * @returns {JSX.Element} The VerticalDropdown component
 */

import React, { useState, useEffect } from "react";
import "./VerticalDropdown.css";

export default function VerticalDropdown({
  title,
  children,
  expanded = false,
}) {
  const [open, setOpen] = useState(expanded);

  useEffect(() => { 
    setOpen(expanded);  // Sync open state when prop changes
  }, [expanded]);

  // console.log("Children of dropdown", children);

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
