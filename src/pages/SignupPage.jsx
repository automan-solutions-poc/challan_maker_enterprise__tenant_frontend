import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import { Mail, Building2, User, ArrowRight, MailCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import AuthShell from "../components/AuthShell";
import PasswordField from "../components/PasswordField";

import { getPublicApiBase } from "../api";
import { identifyUser, trackEvent, Events } from "../analytics";
import { routeAfterTenantAuth } from "../utils/tenantStatus";

const MIN_PASSWORD = 12;

export default function SignupPage() {
  const [step, setStep] = useState("form");
  const [companyName, setCompanyName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const needsVerification = location.state?.needsVerification;
  const prefillEmail = location.state?.email;

  React.useEffect(() => {
    if (needsVerification && prefillEmail) {
      setEmail(prefillEmail);
      setStep("verify");
      setMessage("Please verify your email to activate your account.");
    }
  }, [needsVerification, prefillEmail]);

  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters with upper, lower, number, and symbol`);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${getPublicApiBase()}/signup`, {
        company_name: companyName,
        admin_name: adminName,
        admin_email: email,
        password,
      });
      setMessage(res.data.message);
      trackEvent(Events.SIGNUP_COMPLETED, { step: "otp_sent", email });
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
      trackEvent(Events.SIGNUP_FAILED, { reason: err.response?.data?.error });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${getPublicApiBase()}/verify-email`, {
        email,
        otp,
      });
      const { token, tenant, user } = res.data;

      localStorage.setItem("tenant_token", token);
      localStorage.setItem("tenant_user", JSON.stringify(user));
      localStorage.setItem("tenant_info", JSON.stringify(tenant));

      identifyUser(user.email, {
        user_id: user.id,
        role: user.role,
        tenant_id: tenant?.id,
        tenant_name: tenant?.name,
      });
      trackEvent(Events.LOGIN_SUCCESS, { source: "signup_verify", role: user.role });

      routeAfterTenantAuth(tenant, user.role, navigate);
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await axios.post(`${getPublicApiBase()}/resend-otp`, { email });
      setMessage("A new code is on its way. Please check your inbox.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const errorAlert = error && (
    <Alert variant="danger">
      <AlertCircle size={16} className="flex-shrink-0 mt-1" /> <span>{error}</span>
    </Alert>
  );

  if (step === "verify") {
    return (
      <AuthShell
        icon={<MailCheck size={24} />}
        iconTone="success"
        title="Check your inbox"
        subtitle={
          <>
            We sent a 6-digit code to <strong className="text-body">{email}</strong>. After
            verification, your request goes to the admin for approval.
          </>
        }
        footer={<Link to="/login">Back to sign in</Link>}
      >
        {errorAlert}
        {message && !error && (
          <Alert variant="success">
            <CheckCircle2 size={16} className="flex-shrink-0 mt-1" /> <span>{message}</span>
          </Alert>
        )}

        <Form onSubmit={handleVerify}>
          <Form.Group className="mb-4" controlId="signup-otp">
            <Form.Label>Verification code</Form.Label>
            <Form.Control
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              autoFocus
              required
              className="otp-input"
            />
          </Form.Group>

          <Button type="submit" className="w-100 btn-lg" disabled={loading || otp.length !== 6}>
            {loading ? <Spinner animation="border" size="sm" /> : "Verify and continue"}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Button variant="link" size="sm" onClick={handleResendOtp} disabled={loading}>
            Didn&apos;t get it? Resend code
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      wide
      title="Create your workspace"
      subtitle="Free to start. Your shop is reviewed before the workspace opens."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      {errorAlert}

      <Form onSubmit={handleSignup}>
        <Row className="g-3 mb-3">
          <Col sm={6}>
            <Form.Group controlId="signup-company">
              <Form.Label>Company name</Form.Label>
              <div className="input-with-icon">
                <Building2 size={16} className="input-icon" />
                <Form.Control
                  type="text"
                  placeholder="Your company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  autoComplete="organization"
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group controlId="signup-name">
              <Form.Label>Your name</Form.Label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <Form.Control
                  type="text"
                  placeholder="Full name"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="signup-email">
          <Form.Label>Work email</Form.Label>
          <div className="input-with-icon">
            <Mail size={16} className="input-icon" />
            <Form.Control
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="signup-password">Password</Form.Label>
          <PasswordField
            id="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={`At least ${MIN_PASSWORD} characters`}
            minLength={MIN_PASSWORD}
            autoComplete="new-password"
            visible={showPassword}
            onToggleVisible={() => setShowPassword((v) => !v)}
          />
          <Form.Text>Use upper and lower case letters, a number, and a symbol.</Form.Text>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label htmlFor="signup-confirm">Confirm password</Form.Label>
          <PasswordField
            id="signup-confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            minLength={MIN_PASSWORD}
            autoComplete="new-password"
            visible={showPassword}
            onToggleVisible={() => setShowPassword((v) => !v)}
          />
          {passwordsMismatch && <Form.Text className="text-danger">Passwords don&apos;t match yet.</Form.Text>}
        </Form.Group>

        <Button type="submit" className="w-100 btn-lg" disabled={loading}>
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <>
              Create account <ArrowRight size={16} />
            </>
          )}
        </Button>
      </Form>
    </AuthShell>
  );
}
