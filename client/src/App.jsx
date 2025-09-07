import { useState } from "react";
import Login from "./templates/Login";
import MainTemplate from "./templates/MainTemplate";
import UseScalePage from "./templates/UseScalePage";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showUseScale, setShowUseScale] = useState(false);

  const handleNext = () => {
    setLoggedIn(true);
  };

  const handleWrittenAssessmentClick = () => {
    setShowUseScale(true);
  };

  if (!loggedIn) return <Login onNext={handleNext} />;
  if (showUseScale) return <UseScalePage />;
  return (
    <MainTemplate onWrittenAssessmentClick={handleWrittenAssessmentClick} />
  );
}
