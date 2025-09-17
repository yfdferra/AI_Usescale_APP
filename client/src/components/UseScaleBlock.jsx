import React from "react";
import "./UseScaleBlock.css";

export default function UseScaleBlock({
  level = "LEVEL N",
  label = "NO AI",
  labelBg = "#f600f6ff",
  onClick
}) {
  return (
    <div className="use-scale-block" onClick={onClick} role="button">
      <div className="use-scale-block-level">{level}</div>
      <div className="use-scale-block-label" style={{ background: labelBg }}>
        {label}
      </div>
    </div>
  );
}
