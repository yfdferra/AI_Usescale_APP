import { useState, useRef, useEffect } from "react";
import Menu from "./Menu";

export default function MenuButton({ items, inline = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

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

  const containerStyle = inline
    ? { position: "relative", display: "inline-block" }
    : { position: "absolute", top: "0rem", right: "0.4rem" };
    
  return (
    <div ref={ref} style={containerStyle}>
      <button className="menu-button" onClick={() => setOpen(!open)}>
        ⋯
      </button>
      {open && <Menu items={items} onClose={() => setOpen(false)} />}
    </div>
  );
}