import React from "react";

export default function Textbox({ text, onChange }) {
  return (
    <textarea
      value={text}
      onChange={onChange}
      style={{ width: "300px", height: "100px", padding: "0.5rem" }}
    />
  );
}
