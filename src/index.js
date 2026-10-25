import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./tailwind.css";
import "./styles.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./ThemeContext";
import { AnalyticsProvider, initMixpanel } from "./analytics";

// Init before render so events fired from child mount effects aren't dropped.
initMixpanel("tenant_web");

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AnalyticsProvider platform="tenant_web">
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </AnalyticsProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
