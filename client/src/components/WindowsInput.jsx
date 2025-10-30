/**
 * WindowsInputComponent
 *
 * A modal input dialog similar to Windows-style prompts. 
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.show - Whether the modal is visible
 * @param {string} props.title - Modal title
 * @param {string} props.placeholder - Input placeholder text
 * @param {string} props.defaultValue - Initial input value
 * @param {function} props.onSubmit - Callback when user confirms
 * @param {function} props.onCancel - Callback when user cancels
 * @returns {JSX.Element|null} The modal or null if hidden
 */

import { useState, useEffect } from "react";
import "./WindowsInput.css";

export default function WindowsInputModal({
  show = false,
  title = "Enter value",
  placeholder = "",
  defaultValue = "",
  onSubmit,
  onCancel,
}) {
  const [inputValue, setInputValue] = useState(defaultValue);

  // Reset input when modal opens
  useEffect(() => {
    if (show) setInputValue(defaultValue);
  }, [show, defaultValue]);

  if (!show) return null;

  return (
    <div className="windows-confirm-backdrop">
      <div className="windows-confirm-box">
        <h3 className="windows-confirm-title">{title}</h3>
        <input
          type="text"
          className="windows-confirm-input"
          placeholder={placeholder}
          value={inputValue}
          autoFocus
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit?.(inputValue);
            if (e.key === "Escape") onCancel?.();
          }}
        />
        <div className="windows-confirm-buttons">
          <button
            className="windows-confirm-btn confirm"
            onClick={() => onSubmit?.(inputValue)}
          >
            OK
          </button>
          <button className="windows-confirm-btn cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
