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
