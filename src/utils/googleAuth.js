// Google Sign-In client helpers.
//
// The browser never sees the Google client secret or any token in a URL: the
// backend performs the OAuth code exchange and hands the SPA a single-use
// ticket which is exchanged here for the normal tenant session token.

import axios from "axios";
import { getPublicApiBase } from "../api";

const GOOGLE_BASE = `${getPublicApiBase()}/auth/google`;

/** Backend-provided, non-sensitive error codes mapped to safe UI copy. */
const ERROR_MESSAGES = {
  access_denied: "Google sign-in was cancelled.",
  google_error: "Google sign-in could not be completed. Please try again.",
  invalid_state: "Your sign-in session expired. Please try again.",
  state_expired: "Your sign-in session expired. Please try again.",
  missing_code: "Google sign-in could not be completed. Please try again.",
  invalid_id_token: "Google could not verify your identity. Please try again.",
  nonce_mismatch: "Google could not verify your identity. Please try again.",
  email_not_verified:
    "Your Google email address is not verified. Verify it with Google and try again.",
  missing_email: "Your Google account did not provide an email address.",
  missing_subject: "Your Google account could not be identified.",
  account_exists_use_password:
    "An account already exists for this email. Sign in with your email and password, then link Google from settings.",
  email_in_use:
    "This email is already linked to a different Google account. Contact support for help.",
  identity_already_linked: "Google is already linked to your account.",
  user_inactive: "This account is inactive. Contact your administrator.",
  tenant_inactive: "This organization's account is inactive.",
  tenant_pending_setup: "Your organization still needs to finish account setup.",
  google_not_configured: "Google sign-in is not available right now.",
  invalid_ticket: "Your sign-in session expired. Please try again.",
  expired_ticket: "Your sign-in session expired. Please try again.",
  conflict: "We could not complete your sign-in. Please try again.",
};

export function googleErrorMessage(code) {
  if (!code) return "Google sign-in failed. Please try again.";
  return ERROR_MESSAGES[code] || "Google sign-in failed. Please try again.";
}

/**
 * Local UI preview: render the Google button even when the backend reports the
 * feature disabled. Never active in production builds, and it does not bypass
 * any server check — clicking still fails until real credentials are configured.
 */
function isGoogleDevForceShow() {
  return (
    process.env.NODE_ENV !== "production" &&
    String(process.env.REACT_APP_GOOGLE_DEV_FORCE_SHOW).toLowerCase() === "true"
  );
}

/** Whether Google sign-in is configured on the backend (or forced for local preview). */
export async function isGoogleAuthEnabled() {
  if (isGoogleDevForceShow()) return true;
  try {
    const res = await axios.get(`${GOOGLE_BASE}/status`, { timeout: 10000 });
    return Boolean(res.data?.enabled);
  } catch {
    return false;
  }
}

/**
 * Begin the Google authorization redirect.
 * @returns {Promise<string>} the Google authorization URL to navigate to.
 */
export async function startGoogleAuth({ mode = "login", company = "", redirect = "" } = {}) {
  const params = { mode };
  if (company) params.company = company;
  if (redirect) params.redirect = redirect;
  const res = await axios.get(`${GOOGLE_BASE}/start`, { params, timeout: 15000 });
  const url = res.data?.authorization_url;
  if (!url) throw new Error("google_unavailable");
  return url;
}

/** Exchange the one-time callback ticket for a tenant session. */
export async function exchangeGoogleTicket(ticket) {
  const res = await axios.post(`${GOOGLE_BASE}/exchange`, { ticket }, { timeout: 15000 });
  return res.data;
}
