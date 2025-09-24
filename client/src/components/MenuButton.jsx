import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Menu from "./Menu";

export default function MenuButton({ items, inline = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [open]);

  const containerStyle = inline
    ? { position: "relative", display: "inline-block" }
    : { position: "absolute", top: "0rem", right: "0.4rem" };
    
  return (
    <div ref={ref} style={containerStyle}>
      <button className="menu-button" onClick={() => setOpen(!open)}>
        ⋯
      </button>
      {open &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              zIndex: 9999,
            }}
          >
            <Menu items={items} onClose={() => setOpen(false)} />
          </div>,
          document.body
        )}
    </div>
  );
}