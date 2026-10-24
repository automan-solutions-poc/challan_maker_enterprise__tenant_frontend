import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isTokenExpired } from "../utils/tokenUtils";
import { isTenantPendingApproval } from "../utils/tenantStatus";
import { clearSession, getStoredUser } from "../utils/session";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("tenant_token");
  const user = getStoredUser() || {};
  const location = useLocation();

  // ✅ Auto logout if token expired (keeps preferences like the theme)
  if (!token || isTokenExpired(token)) {
    clearSession();
    return <Navigate to="/login" replace />;
  }

  if (isTenantPendingApproval()) {
    return <Navigate to="/pending-approval" replace />;
  }

  // ✅ Check roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
}
