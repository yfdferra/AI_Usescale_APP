import "./styles.css";
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

/* renders app inside of root */
ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter> 
      <App />
    </BrowserRouter>w
  </StrictMode>
);
