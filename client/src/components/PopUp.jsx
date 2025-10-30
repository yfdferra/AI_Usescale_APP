/**
 * PopUp Component
 *
 * A popup/dialog component that displays information or messages to users.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - The main title/heading of the popup
 * @param {string} props.message - The primary message content
 * @param {string} [props.subtitle] - additional information
 * @param {React.ReactNode} [props.icon] - Optional icon element to display
 * @param {Function} props.onClose - Callback function called when popup should close
 * @returns {JSX.Element} The PopUp component
 */

import "./PopUp.css";

export default function PopUp({ title, message, subtitle, icon, onClose }) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-block" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="popup-title">{title}</div>
        {icon && <div className="popup-icon">{icon}</div>}
        <div className="popup-message">{message}</div>
        {subtitle && <div className="popup-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
}
