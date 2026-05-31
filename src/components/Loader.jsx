import React from "react";
import { Spinner } from "react-bootstrap";

export default function Loader({ text = "Loading...", fullscreen = false }) {
  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center ${
        fullscreen ? "vh-100" : "my-5"
      }`}
      style={{ textAlign: "center" }}
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
