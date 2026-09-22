import React from "react";
import { Spinner } from "react-bootstrap";

export default function Loader({ text = "Loading...", fullscreen = false, overlay = false }) {
  const containerClass = fullscreen
    ? "vh-100"
    : overlay
      ? "position-absolute top-0 start-0 w-100 h-100 bg-opacity-75 z-index-10"
      : "my-5";

  const containerStyle = overlay
    ? {
        backgroundColor: "var(--bg-main)",
        zIndex: 1050,
        backdropFilter: "blur(4px)",
        borderRadius: "16px"
      }
    : {};

  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center ${containerClass}`}
      style={{ textAlign: "center", ...containerStyle }}
    >
      <Spinner
        animation="border"
        variant="primary"
        role="status"
        style={{ width: "3rem", height: "3rem" }}
      />
      <div className="mt-3 fw-semibold text-muted">{text}</div>
    </div>
  );
}
