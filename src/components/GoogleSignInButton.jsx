import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { isGoogleAuthEnabled, startGoogleAuth, googleErrorMessage } from "../utils/googleAuth";
import { setPostAuthRedirect } from "../utils/postAuthRedirect";
import { trackEvent, Events } from "../analytics";

/**
 * "Continue with Google" button.
 *
 * Renders nothing until the backend confirms Google sign-in is configured, so
 * the control never appears on deployments that have not set it up.
 *
 * Props:
 *  - mode: "login" | "signup" (default "login")
 *  - company: optional company name to seed a brand-new tenant on sign-up
 *  - returnTo: optional internal path to return to after a successful login
 *  - onError: (message: string) => void
 */
export default function GoogleSignInButton({
  mode = "login",
  company = "",
  returnTo = "",
  onError,
  disabled = false,
}) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    let active = true;
    isGoogleAuthEnabled().then((ok) => {
      if (active) setEnabled(ok);
    });
    return () => {
      active = false;
      mounted.current = false;
    };
  }, []);

  if (!enabled) return null;

  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);
    onError?.("");
    try {
      if (returnTo) setPostAuthRedirect(returnTo);
      const url = await startGoogleAuth({ mode, company });
      trackEvent(Events.LOGIN_SUCCESS, { source: "google_redirect", mode });
      window.location.assign(url);
    } catch (err) {
      setLoading(false);
      onError?.(googleErrorMessage(err?.response?.data?.error));
      trackEvent(Events.LOGIN_FAILED, { source: "google", mode });
    }
  };

  const label = mode === "signup" ? "Sign up with Google" : "Sign in with Google";

  return (
    <>
      <button
        type="button"
        className="google-signin-btn"
        onClick={handleClick}
        disabled={loading || disabled}
        aria-label={label}
      >
        {loading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <>
            <GoogleGlyph />
            <span>{label}</span>
          </>
        )}
      </button>
      <div className="auth-divider">
        <span>or</span>
      </div>
    </>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
