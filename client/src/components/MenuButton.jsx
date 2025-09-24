import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Menu from "./Menu";

export default function MenuButton({ items, inline = false }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX,
      });
    }
  }, [open]);

  const containerStyle = inline
    ? { position: "relative", display: "inline-block" }
    : { position: "absolute", top: "0rem", right: "0.4rem" };

  const wrappedItems = items.map((item) => ({
    ...item,
    onClick: () => {
      item.onClick && item.onClick(); // run original
      setOpen(false);              
    },
  }));

  return (
    <div ref={buttonRef} style={containerStyle}>
      <button className="menu-button" onClick={() => setOpen(!open)}>
        ⋯
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              transform: "translateX(-100%)",
              zIndex: 9999,
            }}
          >
            <Menu items={wrappedItems} onClose={() => setOpen(false)} />
          </div>,
          document.body
        )}
    </div>
  );
}
