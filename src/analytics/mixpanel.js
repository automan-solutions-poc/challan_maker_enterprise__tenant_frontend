import mixpanel from "mixpanel-browser";
import { Events } from "./events";

const TOKEN =
  process.env.REACT_APP_MIXPANEL_TOKEN ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_MIXPANEL_TOKEN) ||
  "";

let initialized = false;
let currentPlatform = "unknown";

function canTrack() {
  return initialized && Boolean(TOKEN);
}

export function initMixpanel(platform) {
  currentPlatform = platform;
  if (!TOKEN || initialized) return;
  mixpanel.init(TOKEN, {
    debug: process.env.NODE_ENV === "development",
    track_pageview: false,
    persistence: "localStorage",
  });
  mixpanel.register({
    platform,
    product: "InfiChallan",
    environment: process.env.NODE_ENV,
  });
  initialized = true;
}

export function syncIdentityFromStorage(platform) {
  if (!canTrack()) return;

  if (platform === "admin") {
    const admin = safeJson(localStorage.getItem("admin_user"));
    if (admin?.email) {
      identifyUser(admin.email, {
        user_id: admin.id,
        role: admin.role || "admin",
        name: admin.full_name || admin.name,
        platform,
      });
    }
    return;
  }

  const user = safeJson(localStorage.getItem("tenant_user"));
  const tenant = safeJson(localStorage.getItem("tenant_info"));
  if (user?.email) {
    identifyUser(user.email, {
      user_id: user.id,
      role: user.role,
      tenant_id: tenant?.id,
      tenant_name: tenant?.name,
      platform,
      is_desktop: platform === "tenant_desktop",
    });
  }
}

function safeJson(raw) {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function identifyUser(distinctId, traits = {}) {
  if (!canTrack() || !distinctId) return;
  mixpanel.identify(String(distinctId));
  mixpanel.people.set({
    $email: distinctId,
    ...traits,
    last_seen: new Date().toISOString(),
  });
}

export function resetAnalytics() {
  if (!canTrack()) return;
  mixpanel.reset();
}

export function trackEvent(eventName, properties = {}) {
  if (!canTrack()) return;
  mixpanel.track(eventName, {
    platform: currentPlatform,
    ...properties,
  });
}

export function trackPageView(path, extra = {}) {
  trackEvent(Events.PAGE_VIEW, { path, ...extra });
}

export function trackApiError(error, context = {}) {
  const response = error?.response;
  trackEvent(Events.API_ERROR, {
    url: error?.config?.url,
    method: (error?.config?.method || "").toUpperCase(),
    status: response?.status,
    message: response?.data?.error || error?.message,
    ...context,
  });
}

export { Events };
