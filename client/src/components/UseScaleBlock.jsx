import React from "react";

export default function UseScaleBlock({
  level = "LEVEL N",
  label = "NO AI",
  labelBg = "#ff00ffff", // <-- set a default color here
}) {
  return (
    <div
      style={{
        display: "flex",
        border: "1px solid #cfd0d1ff",
        borderRadius: "6px",
        overflow: "hidden",
        width: "240px",
        height: "48px",
        background: "#fff",
        margin: "0.5rem",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#222",
          fontSize: "1rem",
          background: "#f8fafc",
        }}
      >
        {level}
      </div>
      <div
        style={{
          flex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: labelBg,
          borderLeft: "1px solid #cfd0d1ff",
          color: "#222",
          fontSize: "1rem",
        }}
      >
        {label}
      </div>
    </div>
  );
}
