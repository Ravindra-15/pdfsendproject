import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
// global tailwind styles
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* wrap app in browser router for navigation */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);