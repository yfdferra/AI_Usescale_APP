<<<<<<< HEAD
import React from "react";
=======
import "./UseScaleBlock.css";
>>>>>>> Frontend

export default function UseScaleBlock({
  level = "LEVEL N",
  label = "NO AI",
<<<<<<< HEAD
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
=======
  labelBg = "#f600f6ff",
}) {
  return (
    <div className="use-scale-block">
      <div className="use-scale-block-level">{level}</div>
      <div className="use-scale-block-label" style={{ background: labelBg }}>
>>>>>>> Frontend
        {label}
      </div>
    </div>
  );
}
