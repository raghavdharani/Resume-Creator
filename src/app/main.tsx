import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ModernizationApp } from "./ModernizationApp";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ModernizationApp />
  </StrictMode>
);
