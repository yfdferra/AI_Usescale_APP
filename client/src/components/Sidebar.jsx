import "./Sidebar.css";
import settingsIcon from "../assets/settings-icon.svg";
import notificationIcon from "../assets/notification-icon.png";
import folderIcon from "../assets/folder-icon.png";
import profile_picture from "../assets/profile-pic.png";
import logoutIcon from "../assets/logout-icon.svg";

import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar( { onLogout } ) {  // export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="sidebar">
      <div className="widgets">
        <button className="widget_button">
          <img
            src={profile_picture}
            alt="Profile"
            className="profile_picture"
          />
        </button>
        <button className="widget_button">
          <img
            src={notificationIcon}
            alt="Notifications"
            className="widget_icon"
          />
        </button>
        <button
          className="widget_button"
          onClick={() => navigate("/main")}   // redirect to main page
        >
          <img src={folderIcon} alt="Folder" className="widget_icon" />
        </button>
        <button className="widget_button">
          <img src={settingsIcon} alt="Settings" className="widget_icon" />
        </button>
        <button
          className="widget_button"
          onClick={() => {
            onLogout();
            navigate("/login", { replace: true });
          }}  // treat as a log out button
        >
          <img src={logoutIcon} alt="LogOut" className="widget_icon" />
        </button>
      </div>
    </aside>
  );
}
