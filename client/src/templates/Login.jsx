import logo from "../assets/logo.png";
export default function Login({ onNext }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNext) onNext();
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
