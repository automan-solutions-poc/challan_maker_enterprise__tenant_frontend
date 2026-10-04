export function isTenantPendingApproval() {
  try {
    const tenant = JSON.parse(localStorage.getItem("tenant_info") || "null");
    return tenant?.status === "pending_approval";
  } catch {
    return false;
  }
}

export function routeAfterTenantAuth(tenant, userRole, navigate) {
  if (tenant?.status === "pending_approval") {
    navigate("/pending-approval");
    return;
  }
  if (userRole === "tenant_admin") {
    navigate("/app/dashboard");
  } else {
    navigate("/app/challans");
  }
}
