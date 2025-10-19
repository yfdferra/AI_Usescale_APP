import React from "react";
import "./WindowsConfirm.css";

export default function ConfirmPopup({ show, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="confirm-popup-overlay">
      <div className="confirm-popup">
        <p className="confirm-popup-message">{message}</p>
        <div className="confirm-popup-buttons">
          <button
            className="confirm-popup-btn confirm"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="confirm-popup-btn cancel"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}