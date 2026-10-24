import React from "react";

export default function Loader({ text = "Loading…", fullscreen = false, overlay = false }) {
  const mode = overlay ? "is-overlay" : fullscreen ? "is-page" : "";
  return (
    <div className={`app-loader ${mode}`} role="status" aria-live="polite">
      <span className="app-spinner" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}
