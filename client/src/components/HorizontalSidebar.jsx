/**
 * HorizontalSidebar Component
 *
 * A collapsible horizontal sidebar component that provides additional elements.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render in the sidebar
 * @param {boolean} props.open - Whether the sidebar is currently open
 * @param {Function} props.setOpen - Function to toggle the sidebar open/closed state
 * @returns {JSX.Element} The HorizontalSidebar component
 */

import React, { useState } from "react";
import "./HorizontalSidebar.css";

export default function HorizontalSidebar({ children, open, setOpen }) {
  // fixed the sidebar blank page issue by making sure children is an array
  const childArray = React.Children.toArray(children);
  
  
  return (
    <div className={open ? "horizontal-sidebar open" : "horizontal-sidebar"}>
      {/* Sidebar content split into fixed + scroll */}
  <div className="horizontal-sidebar-content">
        {/* Top (Search bar, fixed) */}
  <div className="horizontal-sidebar-top">
          {open ? childArray[0] : null}
        </div>

        {/* Scrollable middle (everything except search) */}
        <div className="horizontal-sidebar-middle" style={{ overflowY: open ? "scroll" : "hidden" }}>
          {open ? (<div style={{width: "100%"}}>{childArray.slice(1)}</div>) : null}
        </div>
      </div>

      {/* Toggle button (always fixed) */}
      <button
        className="horizontal-sidebar-toggle"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        tabIndex={0}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
      >
        {/* Toggle icon changes based on sidebar state */}
        <span className="horizontal-sidebar-toggle-icon">{open ? "<" : ">"}</span>
      </button>
    </div>
  );
}
