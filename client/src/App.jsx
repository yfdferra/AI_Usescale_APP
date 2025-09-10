import { useState } from "react";
import Login from "./templates/Login";
import MainTemplate from "./templates/MainTemplate";
import UseScalePage from "./templates/UseScalePage";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUseScaleID, setCurrentUseScaleID] = useState(null);

  const handleNext = () => {
    setLoggedIn(true);
  };

  const handleTemplateClick = (usescale_id) => {
    setCurrentUseScaleID(usescale_id);
  };

  if (!loggedIn) return <Login onNext={handleNext} />;
  if (currentUseScaleID !== null) {
    return <UseScalePage usescale_id={currentUseScaleID} />;
  }
  return <MainTemplate onTemplateClick={handleTemplateClick} onWrittenAsseessmentClick={handleTemplateClick} />;  // added BaseTemplatesClick handle for Written Assessment
}
