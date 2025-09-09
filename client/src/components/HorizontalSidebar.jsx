export default function HorizontalSidebar({ children, open, setOpen }) {
  const sidebarWidth = 400;
  return (
    <div
      className={open ? "horizontal-sidebar open" : "horizontal-sidebar"}
      style={{
        height: "100vh",
        width: open ? sidebarWidth : 32,
        minWidth: open ? sidebarWidth : 32,
        maxWidth: open ? sidebarWidth : 32,
        background: "#ffffffff",
        color: "#222",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
        transition: "width 0.3s",
        zIndex: 101,
        display: "flex",
        flexDirection: "row",
        position: "relative",
      }}
    >
      {/* Sidebar content split into fixed + scroll */}
      <div
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f7f9fc",
        }}
      >
        {/* Top (Search bar, fixed) */}
        <div style={{ padding: "0.5rem", borderBottom: "1px solid #ddd" }}>
          {open ? children[0] : null}
        </div>

        {/* Scrollable middle (everything except search) */}
        <div
          style={{
            flex: 1,
            overflowY: open ? "scroll" : "hidden",
            padding: "0.5rem",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {open ? (<div style={{width: "100%"}}>{children.slice(1)}</div>) : null}
        </div>
      </div>

      {/* Toggle button (always fixed) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        style={{
          position: "absolute",
          top: "17px",
          right: "0.5px",
          width: "32px",
          height: "46px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          outline: "none",
        }}
        tabIndex={0}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
      >
        <span style={{ fontSize: 22 }}>{open ? "<" : ">"}</span>
      </button>
    </div>
  );
}
