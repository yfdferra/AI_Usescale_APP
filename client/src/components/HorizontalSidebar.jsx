import React, { useState } from "react";

export default function HorizontalSidebar({ children }) {
  const [open, setOpen] = useState(false);
  const sidebarWidth = "6vw";

  return (
    <div
      className={open ? "horizontal-sidebar open" : "horizontal-sidebar"}
      style={{
        position: "fixed",
        left: sidebarWidth,
        top: 0,
        height: "100vh",
        width: open ? "400px" : "32px",
        background: "#f1e6e6ff",
        color: "#222",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
        transition: "width 0.3s",
        zIndex: 101,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {/* Content area (takes all but the toggle button width) */}
      <div
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        {open ? <div style={{ width: "100%" }}>{children}</div> : null}
      </div>
      {/* Toggle button on the right edge */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        style={{
          height: "100%",
          width: "32px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          outline: "none",
        }}
        tabIndex={0}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
      >
        <span style={{ fontSize: 24 }}>{open ? "⟨" : "≡"}</span>
      </button>
    </div>
  );
}
