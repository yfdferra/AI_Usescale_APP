/**
 * WindowsConfirm Component
 *
 * A modal popup that asks the user to confirm an action with "Yes" or "No" buttons.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.show - Whether the popup is visible
 * @param {string} props.message - Message displayed in the popup
 * @param {function} props.onConfirm - Callback when user clicks "Yes"
 * @param {function} props.onCancel - Callback when user clicks "No"
 * @returns {JSX.Element|null} The WindowsConfirm component or null if hidden
 */

import React from "react";
import "./WindowsConfirm.css";

export default function ConfirmPopup({ show, message, onConfirm, onCancel }) {
  if (!show) return null; // Don't render if not visible

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