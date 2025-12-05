import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Provider from "@/provider";
import Router from "@/router";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <Router />
    </Provider>
  </StrictMode>
);
