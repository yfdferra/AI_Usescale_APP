import { useState } from "react";
import Login from "./templates/Login";
import MainTemplate from "./templates/MainTemplate";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleNext = () => {
    setLoggedIn(true);
  };

  return loggedIn ? <MainTemplate /> : <Login onNext={handleNext} />;
}
