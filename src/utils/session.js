// Session keys owned by the tenant app. Preferences such as "theme" are left alone.
const SESSION_KEYS = [
  "tenant_token",
  "tenant_user",
  "tenant_info",
  "tenant_design",
  "tenant_settings",
];

export function clearSession() {
  SESSION_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  });
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("tenant_user") || "null");
  } catch {
    return null;
  }
}

export function getStoredTenant() {
  try {
    return JSON.parse(localStorage.getItem("tenant_info") || "null");
  } catch {
    return null;
  }
}

export function initialsOf(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}
