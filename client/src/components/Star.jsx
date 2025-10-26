/**
 * Star Component
 *
 * A clickable star icon that toggles between "filled" and "empty".
 *
 * @component
 * @returns {JSX.Element} The Star component
 */

import React, { useState } from "react";
import starClosed from "../assets/starFilled.png";
import starOpen from "../assets/starEmpty.png";

export default function StarToggle() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
  style={{
    width: "24px",
    height: "24px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <img
    src={isOpen ? starOpen : starClosed}
    onClick={handleClick}
    style={{ width: "100%", height: "100%", cursor: "pointer" }}
  />
</div>
  );
}