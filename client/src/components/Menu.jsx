import "./Menu.css";

export default function DropdownMenu({ items, onClose }) {
  return (
    <div className="menu-dropdown">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="menu-item"
          onClick={() => {
            item.onClick();
            onClose?.();
          }}
        >
          {item.icon && <img src={item.icon} alt="" className="menu-icon" />}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}