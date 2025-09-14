import { useState } from "react";
import Login from "./templates/Login";
import MainTemplate from "./templates/MainTemplate";
import UseScalePage from "./templates/UseScalePage";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUseScaleID, setCurrentUseScaleID] = useState(null);
  const [templateData, setTemplateData] = useState(null);

  const handleNext = () => {
    setLoggedIn(true);
  };

  const handleTemplateClick = (usescale_id, templateData) => {
    setCurrentUseScaleID(usescale_id);
    setTemplateData(templateData || null);
  };

  if (!loggedIn) return <Login onNext={handleNext} />;
  if (currentUseScaleID !== null) {
    return (
      <UseScalePage
        usescale_id={currentUseScaleID}
        template_title={templateData}
      />
    );
  }
  return (
    <MainTemplate
      onTemplateClick={handleTemplateClick}
      onWrittenAsseessmentClick={handleTemplateClick}
    />
  ); // added BaseTemplatesClick handle for Written Assessment
}
