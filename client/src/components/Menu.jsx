/**
 * Menu Component
 *
 * A reusable dropdown menu component that renders a list of clickable menu items.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.items - Array of menu item objects
 * @param {string} props.items[].label - Display text for the menu item
 * @param {string} [props.items[].icon] - Optional icon image source
 * @param {Function} props.items[].onClick - Click handler function for the menu item
 * @param {Function} [props.onClose] - Optional callback function called when menu should close
 * @returns {JSX.Element} The Menu component
 */

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
          {/* Conditionally render icon if provided */}
          {item.icon && <img src={item.icon} alt="" className="menu-icon" />}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}