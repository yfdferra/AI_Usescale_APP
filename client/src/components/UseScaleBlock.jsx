/**
 * UseScaleBlock Component
 *
 * Displays a draggable block with a vertical level indicator and a label. Supports custom label background and an optional edit icon for admin users.
 *
 * @component
 * @param {Object} props
 * @param {string} props.level - Text for the level indicator
 * @param {string} props.label - Label text
 * @param {string} props.labelBg - Background color for the label
 * @param {string|number} props.entry_type_id - Identifier for drag data
 * @param {function} props.onClick - Callback for block click
 * @param {boolean} [props.draggable=true] - Enable drag functionality
 * @param {boolean} [props.isAdmin=false] - Show edit icon if true
 * @param {function} props.onEditClick - Callback when edit icon is clicked
 * @returns {JSX.Element} The UseScaleBlock component
 */

import React from "react";
import "./UseScaleBlock.css";
import editIcon from "../assets/edit.png";

export default function UseScaleBlock({
  level = "LEVEL N",
  label = "NO AI",
  labelBg = "#f600f6ff",
  entry_type_id,
  onClick,
  draggable = true,
  isAdmin = false,
  onEditClick,
  ...rest
}) {
  // Handler for drag start
  const handleDragStart = (e) => {
    // Set both level and label in drag data
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ level, label, entry_type_id})
    );

    // Create a custom drag image
    const dragImage = document.createElement("div");
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    dragImage.style.left = "-1000px";
    dragImage.style.padding = "8px 16px";
    dragImage.style.background = labelBg;
    dragImage.style.borderRadius = "8px";
    dragImage.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    dragImage.style.color = "#222";
    dragImage.style.fontWeight = "bold";
    dragImage.style.fontSize = "16px";
    dragImage.style.display = "flex";
    dragImage.style.alignItems = "center";
    dragImage.style.zIndex = "9999";
    dragImage.innerText = level + (label ? ` - ${label}` : "");
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(
      dragImage,
      dragImage.offsetWidth / 2,
      dragImage.offsetHeight / 2
    );
    // Remove the drag image after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };
  return (
    <div className="use-scale-block" onClick={onClick} role="button" draggable={draggable} onDragStart={handleDragStart} {...rest} style={{ position: "relative" }}>
      <div className="use-scale-block-level">{level}</div>
      <div className="use-scale-block-label" style={{ background: labelBg }}>
        {label}
      </div>
      {isAdmin && (
    <img
      src={editIcon}
      alt="Edit"
      className="use-scale-block-edit-img"
      onClick={(e) => {
        e.stopPropagation(); // prevent parent click
        onEditClick();
      }}
    />
  )}
    </div>
  );
}
