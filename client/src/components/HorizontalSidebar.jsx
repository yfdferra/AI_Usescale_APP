import "./HorizontalSidebar.css";

export default function HorizontalSidebar({ children, open, setOpen }) {
  return (
    <div className={open ? "horizontal-sidebar open" : "horizontal-sidebar"}>
      {/* Sidebar content split into fixed + scroll */}
  <div className="horizontal-sidebar-content">
        {/* Top (Search bar, fixed) */}
  <div className="horizontal-sidebar-top">
          {open ? children[0] : null}
        </div>

        {/* Scrollable middle (everything except search) */}
        <div className="horizontal-sidebar-middle" style={{ overflowY: open ? "scroll" : "hidden" }}>
          {open ? (<div style={{width: "100%"}}>{children.slice(1)}</div>) : null}
        </div>
      </div>

      {/* Toggle button (always fixed) */}
      <button
        className="horizontal-sidebar-toggle"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        tabIndex={0}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
      >
        <span className="horizontal-sidebar-toggle-icon">{open ? "<" : ">"}</span>
      </button>
    </div>
  );
}
