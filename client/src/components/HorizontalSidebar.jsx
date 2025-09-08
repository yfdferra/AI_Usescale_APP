import React, { useState } from "react";

export default function HorizontalSidebar({ children, open, setOpen }) {

  return (
    <div
      className={open ? "horizontal-sidebar open" : "horizontal-sidebar"}
      style={{
        height: "100%",
        width: "100%",
        background: "#ffffffff",
        color: "#222",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
        transition: "width 0.3s",
        zIndex: 101,
        display: "flex",
        flexDirection: "row",
        position: "relative",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      {/* Content area (takes all but the toggle button width) */}
      <div style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-start", background: "#f7f9fc", overflowY: "auto",}}>
        {open ? <div style={{ width: "100%" }}>{children}</div> : null}
      </div>

      {/* Toggle button on the right edge */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        style={{
          position: "absolute",
          top: "17px",
          right: "0.5px",
          width: "32px",
          height: "32px",
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
        <span style={{ fontSize: 22 }}>{open ? "<" : ">"}</span>
      </button>
    </div>
  );
}
