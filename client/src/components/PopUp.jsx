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
