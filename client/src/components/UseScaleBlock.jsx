import React from "react";

export default function UseScaleBlock({
  level = "LEVEL N",
  label = "NO AI",
  labelBg = "#f600f6ff",
}) {
  return (
    <div
      style={{
        display: "flex",
        border: "2px solid #cfd0d1ff",
        overflow: "hidden",
        width: "20rem",
        height: "7rem",
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
          background: "#ecf2f7ff",
        }}
      >
        {level}
      </div>
      <div
        style={{
          flex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: labelBg,
          border: "1px solid #cfd0d1ff",
          borderLeft: "2px solid #cfd0d1ff",
          color: "#222",
          fontSize: "1rem",
        }}
      >
        {label}
      </div>
    </div>
  );
}
