import { useState } from "react";
import Login from "./templates/Login";
import MainTemplate from "./templates/MainTemplate";
import UseScalePage from "./templates/UseScalePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function UseScaleRoute( { onLogout } ) {  // extract usescale_id from the route path (i.e.: /usescale/1)
  const { id } = useParams();
  return <UseScalePage usescale_id={id} onLogout={onLogout} />
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUseScaleID, setCurrentUseScaleID] = useState(null);

  // const handleNext = () => {
  //   setLoggedIn(true);
  // };

  const navigate = useNavigate();

  const handleTemplateClick = (usescale_id) => {
    setCurrentUseScaleID(usescale_id);
    navigate(`/usescale/${usescale_id}`);
  };

  // if (!loggedIn) return <Login onNext={handleNext} />;
  // if (currentUseScaleID !== null) {
  //   return <UseScalePage usescale_id={currentUseScaleID} />;
  // }
  return (
    <Routes>
      {/* Default Page */}
      <Route index element={<Navigate to="/login" replace />} />

      {/* Login Page */}
      <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />

      {/* Upon Successful Log In: Inner Pages with Sidebar (widget control) */}
      <Route path="/main" element = {loggedIn ? (<MainTemplate onTemplateClick={handleTemplateClick} onWrittenAsseessmentClick={handleTemplateClick} onLogout={() => setLoggedIn(false)}/>) : <Navigate to="/login" replace /> } />

      {/* Might want to ADD USESCALE ID AS ROUTES TOO (backtrackable) */}
      <Route path="/usescale/:id" element={loggedIn ? (<UseScaleRoute onLogout={() => setLoggedIn(false)} />) : <Navigate to="/login" replace /> } />  
      {/* load in by usescale_id */}

      {/* Catch All Others */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
    
  ); // added BaseTemplatesClick handle for Written Assessment
}
