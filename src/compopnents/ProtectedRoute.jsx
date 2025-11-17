import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isTokenExpired } from "../utils/tokenUtils";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("tenant_token");
  const user = JSON.parse(localStorage.getItem("tenant_user") || "{}");
  const location = useLocation();

  // ✅ Auto logout if token expired
  if (!token || isTokenExpired(token)) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // ✅ Check roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
}
