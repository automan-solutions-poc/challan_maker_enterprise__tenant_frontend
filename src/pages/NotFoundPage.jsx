import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
      <h1 className="display-4 fw-bold">404</h1>
      <p className="text-muted mb-4">This page does not exist.</p>
      <Link to="/" className="btn btn-primary">Back to home</Link>
    </div>
  );
}
