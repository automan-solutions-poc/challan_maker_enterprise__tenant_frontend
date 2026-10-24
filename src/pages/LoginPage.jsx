import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api";
import { Form, Button, Alert, Spinner, Modal } from "react-bootstrap";
import { Mail, ArrowRight, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import AuthShell from "../components/AuthShell";
import PasswordField from "../components/PasswordField";
import { identifyUser, trackEvent, Events } from "../analytics";
import { routeAfterTenantAuth } from "../utils/tenantStatus";

export default function LoginPage() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingTenantName, setPendingTenantName] = useState("");
  const navigate = useNavigate();
  const successMessage = location.state?.message;

  const goToPendingApproval = () => {
    setShowPendingModal(false);
    navigate("/pending-approval");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/login", { email, password }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: false,
      });
      const { token, tenant, user } = res.data;

      if (!token) throw new Error("Invalid server response");

      localStorage.setItem("tenant_token", token);
      localStorage.setItem("tenant_user", JSON.stringify(user));
      localStorage.setItem("tenant_info", JSON.stringify(tenant));

      identifyUser(user.email, {
        user_id: user.id,
        role: user.role,
        tenant_id: tenant?.id,
        tenant_name: tenant?.name,
      });
      trackEvent(Events.LOGIN_SUCCESS, { role: user.role, tenant_id: tenant?.id });

      const isPending =
        res.data.pending_approval || tenant?.status === "pending_approval";
      if (isPending) {
        setPendingTenantName(tenant?.name || "");
        setShowPendingModal(true);
        return;
      }

      routeAfterTenantAuth(tenant, user.role, navigate);
    } catch (err) {
      const data = err.response?.data || {};
      if (data.needs_verification) {
        navigate("/signup", { state: { email: data.email, needsVerification: true } });
        return;
      }
      setError(data.error || "Invalid email or password");
      trackEvent(Events.LOGIN_FAILED, { reason: data.error || "invalid_credentials" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your counter workspace."
      footer={
        <>
          New to infiChallan? <Link to="/signup">Create a free account</Link>
        </>
      }
    >
      {successMessage && (
        <Alert variant="success">
          <CheckCircle2 size={16} className="flex-shrink-0 mt-1" /> <span>{successMessage}</span>
        </Alert>
      )}
      {error && (
        <Alert variant="danger">
          <AlertCircle size={16} className="flex-shrink-0 mt-1" /> <span>{error}</span>
        </Alert>
      )}

      <Form onSubmit={handleSubmit} noValidate={false}>
        <Form.Group className="mb-3" controlId="login-email">
          <Form.Label>Email</Form.Label>
          <div className="input-with-icon">
            <Mail size={16} className="input-icon" />
            <Form.Control
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus={!email}
              required
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label htmlFor="login-password">Password</Form.Label>
          <PasswordField
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
          />
        </Form.Group>

        <Button type="submit" className="w-100 btn-lg" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Signing in…
            </>
          ) : (
            <>
              Sign in <ArrowRight size={16} />
            </>
          )}
        </Button>
      </Form>

      <Modal
        show={showPendingModal}
        onHide={goToPendingApproval}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body className="text-center p-4 p-md-5">
          <div className="icon-tile tone-warning mx-auto mb-3" style={{ width: 56, height: 56, borderRadius: 16 }}>
            <Clock size={26} />
          </div>
          <h2 className="font-display mb-2" style={{ fontSize: "1.9rem" }}>Approval pending</h2>
          <p className="text-muted mb-0">
            Your registration for <strong>{pendingTenantName || "your organization"}</strong> is
            still waiting for admin approval. You will get an email once your account is activated.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center pb-4 pt-0">
          <Button className="px-4" onClick={goToPendingApproval}>
            View status
          </Button>
        </Modal.Footer>
      </Modal>
    </AuthShell>
  );
}
