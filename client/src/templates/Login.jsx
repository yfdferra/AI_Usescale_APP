import logo from "../assets/logo.png";
import HOST from "../GLOBALS/Globals";
import "../templates/Login.css";

export default function Login({ onNext }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    var formData = new FormData(e.target);
    var res = await fetch(HOST + "/login", {
      method: "POST",
      body: formData,
    });
    var data = await res.json();
    if (data.logged_in) {
      onNext();
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
          <input
            id="password"
            name="password"
            className="login-input"
            type="password"
            placeholder="Enter your password"
          />
          <button
            className="login-button"
            type="submit"
            style={{ marginTop: "1.5rem" }}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}
