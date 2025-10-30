import { useState } from "react";
import Login from "./templates/Login";
import MainTemplate from "./templates/MainTemplate";
import UseScalePage from "./templates/UseScalePage";
import HOST from "./GLOBALS/Globals";
import { Routes, Route, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

/***
 * UseScaleRoute Component
 * 
 * Route handler that extracts the usescale ID from the URL and
 * renders the corresponding UseScalePage component
 * 
 * @component 
 * @param {Object} props - Component props
 * @param {Function} props.onLogout - Callback triggered when the user logs out
 * @param {string} props.template_title - title of the current template
 * @param {string} props.subject_id - ID of the subject associated with the template
 * @param {string} props.userId - ID of the current user
 * @param {string} props.userType - Type of the current user (admin or coordinator)
 * @param {boolean} props.isBaseTemplate - Whether the current template is base or custom
 * @returns {JSX.Element} The rendered UseScalePage component for the current route
 */

function UseScaleRoute({ onLogout, template_title, subject_id, userId, userType, isBaseTemplate }) {
  // extract usescale_id from the route path (i.e.: /usescale/1)
  const { id } = useParams();
  return (
    <UseScalePage
      isBaseTemplate={isBaseTemplate}
      userId={userId}
      userType={userType}
      usescale_id={id}
      template_title={template_title}
      subject_id={subject_id}
      onLogout={onLogout}
    />
  );
}

/***
 * App Component
 * 
 * The main application router and state container
 * Manages user authentication state, navifation, and routing between key views
 * - Login page
 * - Main Template page
 * - UseScale editing page
 * 
 * @component
 * @returns {JSX.Element} The App Component
 */

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUseScaleID, setCurrentUseScaleID] = useState(null);
  const [templateData, setTemplateData] = useState(null);
  const [subjectID, setSubjectID] = useState(null);
  // new states for userId and userType
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);

  const navigate = useNavigate();
  // create a new variable so systems knowns if it is editing a base template or not
  const [isBaseTemplate, setIsBaseTemplate] = useState(false);

  const handleTemplateClick = (usescale_id, template_data, subject_id) => {
    setCurrentUseScaleID(usescale_id);
    setTemplateData(template_data || null);
    setSubjectID(subject_id || null);
    setIsBaseTemplate(false);
    navigate(`/usescale/${usescale_id}`);
  };

  const handleBaseTemplateClick = (usescale_id, template_data, subject_id) => {
    setCurrentUseScaleID(usescale_id);
    setTemplateData(template_data || null);
    setSubjectID(subject_id || null);
    setIsBaseTemplate(true);
    navigate(`/usescale/${usescale_id}`);
  };

  const handleCreateFromScratch = () => {
    const payload = { 
      title: "Untitled Template",
      user_id: userId 
    };
  
    fetch(`${HOST}/create_template`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("Create template response:", data);
    

        if (data.success) {
          setCurrentUseScaleID(data.usescale_id);
          setTemplateData("Untitled Template")
          navigate(`/usescale/${data.usescale_id}`);

        } else {
          console.error("Failed to create template:", data.message);
          alert("Failed to create template");
        }
      })
      .catch((error) => {
        console.error("Network error while creating template:", error);
        alert("Network error while creating template");
      });
  };

  return (
    <Routes>
      {/* Default Page */}
      <Route index element={<Navigate to="/login" replace />} />

      {/* Login Page */}
      <Route
        path="/login"
        element={
          <Login 
            onLogin={(id, type) => {
            setLoggedIn(true);
            setUserId(id);
            setUserType(type);
            }} 
          />
        }
      />

      {/* Upon Successful Log In: Inner Pages with Sidebar (widget control) */}
      <Route 
        path="/main" 
        element = {
          loggedIn ? (
            <MainTemplate 
              userId={userId}
              userType={userType}
              onTemplateClick={handleTemplateClick} 
              onBaseTemplateClick={handleBaseTemplateClick}
              onCreateFromScratchClick={handleCreateFromScratch}
              onLogout={() => {
                setLoggedIn(false);
                // make sure to nullify user id and type upon log out
                setUserId(null);
                setUserType(null);
              }}
            />
          ) : (
            <Navigate to="/login" replace /> 
          ) 
        } 
      />

      {/* Might want to ADD USESCALE ID AS ROUTES TOO (backtrackable) */}
      <Route
        path="/usescale/:id"
        element={
          loggedIn ? (
            <UseScaleRoute
              isBaseTemplate={isBaseTemplate}
              userId={userId}
              userType={userType}
              onLogout={() => setLoggedIn(false)}
              template_title={templateData}
              subject_id={subjectID}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      {/* load in by usescale_id */}

      {/* Catch All Others */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  ); // added BaseTemplatesClick handle for Written Assessment
}
