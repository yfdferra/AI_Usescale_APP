/**
 * Textbox Component
 *
 * A simple ediyble textarea component.
 *
 * @component
 * @param {Object} props
 * @param {string} props.text - Current textarea value
 * @param {function} props.onChange - Callback when textarea value changes
 * @returns {JSX.Element} The Textbox component
 */

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
