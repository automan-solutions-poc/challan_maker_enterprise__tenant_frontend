import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { User, Building2, AlertCircle, Link2Off } from "lucide-react";
import { getPublicApiBase } from "../api";
import AuthShell from "../components/AuthShell";
import PasswordField from "../components/PasswordField";
import { trackEvent, Events } from "../analytics";

export default function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [tenantName, setTenantName] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid invite link. Missing token.");
      setLoading(false);
      return;
    }

    const loadInvite = async () => {
      try {
        const res = await axios.get(`${getPublicApiBase()}/invite`, { params: { token } });
        setTenantName(res.data.tenant_name || "");
        setEmail(res.data.email || "");
      } catch (err) {
        setError(err.response?.data?.error || "This invite link is invalid or has expired.");
      } finally {
        setLoading(false);
      }
    };

    loadInvite();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${getPublicApiBase()}/accept-invite`, {
        token,
        name,
        password,
      });
      trackEvent(Events.INVITE_ACCEPTED, { tenant_name: tenantName, email });
      navigate("/login", {
        replace: true,
        state: {
          message: "Account created successfully. Please sign in with your email and password.",
          email,
        },
      });
    } catch (err) {
      setError(err.response?.data?.error || "Could not create account. Please try again.");
      trackEvent(Events.INVITE_FAILED, { reason: err.response?.data?.error });
    } finally {
      setSubmitting(false);
    }
  };

  const footer = (
    <>
      Already have an account? <Link to="/login">Sign in</Link>
    </>
  );

  if (loading) {
    return (
      <AuthShell footer={footer}>
        <div className="app-loader">
          <span className="app-spinner" aria-hidden="true" />
          <span>Checking your invite…</span>
        </div>
      </AuthShell>
    );
  }

  if (!tenantName) {
    return (
      <AuthShell
        icon={<Link2Off size={24} />}
        iconTone="danger"
        title="Invite unavailable"
        subtitle={error || "This invite link is invalid or has expired."}
        footer={footer}
      >
        <p className="text-muted small text-center mb-0">
          Ask your shop admin to send a fresh invite from the Team page.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Set up your account"
      subtitle="You've been invited to an infiChallan workspace."
      footer={footer}
    >
      <div className="usage-card d-flex align-items-center gap-3 mb-4">
        <div className="icon-tile" style={{ width: 36, height: 36, borderRadius: 10 }}>
          <Building2 size={17} />
        </div>
        <div className="min-w-0">
          <div className="small text-muted">Organization</div>
          <div className="fw-semibold text-truncate" style={{ color: "var(--text-main)" }}>{tenantName}</div>
        </div>
      </div>

      {error && (
        <Alert variant="danger">
          <AlertCircle size={16} className="flex-shrink-0 mt-1" /> <span>{error}</span>
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="invite-email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} readOnly disabled />
        </Form.Group>

        <Form.Group className="mb-3" controlId="invite-name">
          <Form.Label>Your name</Form.Label>
          <div className="input-with-icon">
            <User size={16} className="input-icon" />
            <Form.Control
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              autoFocus
              required
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="invite-password">Password</Form.Label>
          <PasswordField
            id="invite-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            minLength={6}
            autoComplete="new-password"
            visible={showPassword}
            onToggleVisible={() => setShowPassword((v) => !v)}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label htmlFor="invite-confirm">Confirm password</Form.Label>
          <PasswordField
            id="invite-confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            minLength={6}
            autoComplete="new-password"
            visible={showPassword}
            onToggleVisible={() => setShowPassword((v) => !v)}
          />
        </Form.Group>

        <Button type="submit" className="w-100 btn-lg" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner size="sm" animation="border" /> Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </Form>
    </AuthShell>
  );
}
