import "./Sidebar.css";
import settingsIcon from "../assets/settings.png";
import notificationIcon from "../assets/appointment-reminders.png";
import folderIcon from "../assets/folder-invoices--v2.png";
import profile_picture from "../assets/profile-pic.png";
import logoutIcon from "../assets/logout-icon.svg";
import PopUp from "./PopUp";
import React, { useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";

const widgetPopups = {
  profile: {
    title: "Profile",
    message: "View and edit your profile information here.",
    subtitle: "Profile features coming soon.",
    icon: (
      <span role="img" aria-label="profile">
        👤
      </span>
    ),
  },
  notifications: {
    title: "Notifications",
    message: "Check your latest notifications.",
    subtitle: "Notification center will be available soon.",
    icon: (
      <span role="img" aria-label="bell">
        🔔
      </span>
    ),
  },
  folder: {
    title: "Folders",
    message: "Access your folders and files.",
    subtitle: "Folder management is under development.",
    icon: (
      <span role="img" aria-label="folder">
        📁
      </span>
    ),
  },
  settings: {
    title: "Settings",
    message: "Change your application settings here.",
    subtitle: "Settings options will be added soon.",
    icon: (
      <span role="img" aria-label="settings">
        ⚙️
      </span>
    ),
  },
};

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const [popupType, setPopupType] = useState(null);

  const handleWidgetClick = (type) => {
    setPopupType(type);
  };
  const handleClosePopup = () => {
    setPopupType(null);
  };

  return (
    <aside className="sidebar">
      <div className="widgets">
        <button
          className="widget_button"
          onClick={() => handleWidgetClick("profile")}
        >
          <img
            src={profile_picture}
            alt="Profile"
            className="profile_picture"
          />
        </button>
        <button
          className="widget_button"
          onClick={() => handleWidgetClick("notifications")}
        >
          <img
            src={notificationIcon}
            alt="Notifications"
            className="widget_icon"
          />
        </button>
        <button
          className="widget_button"
          onClick={() => navigate("/main")} // redirect to main page
        >
          <img src={folderIcon} alt="Folder" className="widget_icon" />
        </button>
        <button
          className="widget_button"
          onClick={() => handleWidgetClick("settings")}
        >
          <img src={settingsIcon} alt="Settings" className="widget_icon" />
        </button>
        <button
          className="widget_button"
          onClick={() => {
            onLogout();
            navigate("/login", { replace: true });
          }} // treat as a log out button
        >
          <img src={logoutIcon} alt="LogOut" className="widget_icon" />
        </button>
      </div>
      {popupType && (
        <PopUp
          title={widgetPopups[popupType].title}
          message={widgetPopups[popupType].message}
          subtitle={widgetPopups[popupType].subtitle}
          icon={widgetPopups[popupType].icon}
          onClose={handleClosePopup}
        />
      )}
    </aside>
  );
}
