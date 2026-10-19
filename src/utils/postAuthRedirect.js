// Remembers where a user was heading before being asked to sign in, so we can
// send them back there after a successful password or Google login.
//
// The value lives in sessionStorage (per-tab, cleared after use) and survives the
// full-page redirect to Google and back.

const KEY = "post_auth_redirect";

// Paths that require the tenant_admin role (kept in sync with App.js routes).
const ADMIN_ONLY_PREFIXES = [
  "/app/users",
  "/app/settings",
  "/app/email-settings",
  "/app/terms",
];

/** True for a same-origin relative path that is safe to navigate to internally. */
export function isSafeInternalPath(path) {
  if (!path || typeof path !== "string") return false;
  const p = path.trim();
  if (!p.startsWith("/")) return false;
  if (p.startsWith("//")) return false; // protocol-relative -> external
  if (p.includes("\\") || p.includes("://")) return false;
  return true;
}

export function isAdminOnlyPath(path) {
  return ADMIN_ONLY_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

export function setPostAuthRedirect(path) {
  try {
    if (isSafeInternalPath(path)) sessionStorage.setItem(KEY, path.trim());
  } catch {
    /* sessionStorage unavailable (private mode) - ignore */
  }
}

export function getPostAuthRedirect() {
  try {
    const v = sessionStorage.getItem(KEY);
    return isSafeInternalPath(v) ? v : "";
  } catch {
    return "";
  }
}

export function clearPostAuthRedirect() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Decide where to send the user after a successful auth.
 * Returns a validated internal path, or null to fall back to the role default.
 */
export function resolvePostAuthTarget({ intended, userRole, tenantStatus }) {
  if (tenantStatus === "pending_approval") return "/pending-approval";
  const path = isSafeInternalPath(intended) ? intended.trim() : "";
  if (!path) return null;
  if (isAdminOnlyPath(path) && userRole !== "tenant_admin") return null;
  return path;
}
