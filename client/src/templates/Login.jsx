import logo from "../assets/logo.png";
import HOST from "../GLOBALS/Globals";
import PopUp from "../components/PopUp";
import React, { useState } from "react";
import "../templates/Login.css";

import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  // export default function Login({ onNext }) {
  // pop up for forgot password
  const [showPopup, setShowPopup] = useState(false);
  // navigation (to main page on successful login)
  const navigate = useNavigate();
  //state to show and hide visibility
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    var formData = new FormData(e.target);
    var res = await fetch(HOST + "/login", {
      method: "POST",
      body: formData,
    });
    var data = await res.json();
    if (data.logged_in) {
      // onNext();
      onLogin(
        // modified this to pass user info to app.jsx
        data.user_id,
        data.user_type,
      );
      navigate("/main", { 
        replace: true
      }); // replace: true -> replaces /login from history stack as /main | wont be able to go back to login page
    } else {
      alert("Incorrect Username/Password");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <img src={logo} alt="Logo" className="login-logo" />

        <h2 className="login-title">Log in</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username" className="login-label">
            Username
          </label>
          <input
            id="username"
            name="username"
            className="login-input"
            type="text"
            placeholder="Enter your username"
          />
          <label
            htmlFor="password"
            className="login-label"
            style={{ marginTop: "1rem" }}
          >
            Password
          </label>
          
          <div style={{ position: "relative" }}>
            <div className="password-wrapper">
  <input
    id="password"
    name="password"
    className="login-input"
    type={showPassword ? "text" : "password"}
    placeholder="Enter your password"
    style={{ paddingRight: "3rem" }}
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "0.75rem",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "0.9rem",
      color: "#666",
    }}
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>
</div>
          <button
            className="login-button"
            type="submit"
            style={{ marginTop: "1.5rem" }}
          >
            Next
          </button>
          <div className="login-links">
            <a
              href="#"
              className="login-link"
              onClick={(e) => {
                e.preventDefault();
                setShowPopup(true);
              }}
            >
              Forgot Password ?
            </a>

            {/* Not sure if we need to be able to create accounts from here */}
            {/* <a href="#" className="login-link">
              Create Account
            </a> */}
          </div>
        </form>
        {showPopup && (
          <PopUp
            title="Forgot Password"
            message="Please contact the admin for this problem."
            subtitle="For security reasons, password reset is handled by the administrator."
            icon={
              <span role="img" aria-label="alert">
                🚨
              </span>
            }
            onClose={() => setShowPopup(false)}
          />
        )}
      </div>
    </div>
  );
}
