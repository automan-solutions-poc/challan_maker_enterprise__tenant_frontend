import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Modal,
} from "react-bootstrap";
import { Zap, Mail, LogIn, Lock, Eye, EyeOff, Sun, Moon, Clock } from "lucide-react";
import { useTheme } from "../ThemeContext";
import "./LoginPage.css";
import { identifyUser, trackEvent, Events } from "../analytics";
import { routeAfterTenantAuth } from "../utils/tenantStatus";

export default function LoginPage() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="login-page">
      <Button
        variant="link"
        className="login-theme-toggle"
        onClick={toggleTheme}
      >
        {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
      </Button>
      <Container fluid className="h-100 d-flex justify-content-center align-items-center">
        <Row className="justify-content-center w-100">
          <Col md={4} sm={8}>
            <Card className="login-card shadow-lg border-0">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-2">
                  <Link to="/" className="text-decoration-none small text-muted">
                    ← Back to Home
                  </Link>
                </div>
                <div className="text-center mb-5">
                  <div className="login-logo mx-auto mb-3 d-flex align-items-center justify-content-center">
                    <Zap size={32} fill="currentColor" />
                  </div>
                  <h2 className="fw-bold brand-text mb-1">InfiChallan</h2>
                  <p className="text-muted small text-uppercase tracking-wider">
                    Enterprise Edition
                  </p>
                </div>

                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3 position-relative">
                    <Form.Label className="fw-semibold small">Email</Form.Label>
                    <div className="input-icon">
                      <Mail size={18} className="input-icon-left" />
                      <Form.Control
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3 position-relative">
                    <Form.Label className="fw-semibold small">Password</Form.Label>
                    <div className="input-icon">
                      <Lock size={18} className="input-icon-left" />
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 login-btn py-2 fw-bold mt-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <>
                        <LogIn size={16} className="me-2" />
                        Login
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4 text-muted small">
                  Don't have an account?{" "}
                  <Link to="/signup" className="fw-bold text-decoration-none">
                    Get Started Free
                  </Link>
                </div>
                <div className="text-center mt-2 text-muted small">
                  © {new Date().getFullYear()} InfiChallan. All rights reserved.
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal
        show={showPendingModal}
        onHide={goToPendingApproval}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body className="text-center p-4 p-md-5">
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
            style={{ width: 64, height: 64, background: "rgba(245, 158, 11, 0.15)" }}
          >
            <Clock size={32} style={{ color: "#f59e0b" }} />
          </div>
          <h4 className="fw-bold mb-2">Approval pending</h4>
          <p className="text-muted mb-0">
            Your registration for <strong>{pendingTenantName || "your organization"}</strong> is
            still waiting for admin approval. You will get an email once your account is activated.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center pb-4">
          <Button className="login-btn px-4" onClick={goToPendingApproval}>
            OK, view status
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
