import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Container, Row, Col, Card, Form, Button, Alert, Spinner,
} from "react-bootstrap";
import { Zap, Mail, Lock, Eye, EyeOff, Building2, User, ArrowRight, CheckCircle } from "lucide-react";
import "./LoginPage.css";

import API from "../api";

const API_BASE = API.defaults.baseURL.replace("/api/tenant", "/api/public");

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

  const handleSignup = async (e) => {
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

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/signup`, {
        company_name: companyName,
        admin_name: adminName,
        admin_email: email,
        password,
      });
      setMessage(res.data.message);
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/verify-email`, {
        email,
        otp,
      });
      const { token, tenant, user } = res.data;

      localStorage.setItem("tenant_token", token);
      localStorage.setItem("tenant_user", JSON.stringify(user));
      localStorage.setItem("tenant_info", JSON.stringify(tenant));

      if (user.role === "tenant_admin") {
        navigate("/app/dashboard");
      } else {
        navigate("/app/challans");
      }
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
      await axios.post(`${API_BASE}/resend-otp`, { email });
      setMessage("OTP resent successfully. Please check your inbox.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "verify") {
    return (
      <div className="login-page">
        <Container fluid className="h-100 d-flex justify-content-center align-items-center">
          <Row className="justify-content-center w-100">
            <Col md={4} sm={8}>
              <Card className="login-card shadow-lg border-0">
                <Card.Body className="p-4 p-md-5">
                  <div className="text-center mb-4">
                    <div className="login-logo mx-auto mb-3 d-flex align-items-center justify-content-center">
                      <CheckCircle size={32} style={{ color: "#10b981" }} />
                    </div>
                    <h3 className="fw-bold brand-text mb-2">Verify Your Email</h3>
                    <p className="text-muted small">
                      We sent a verification code to <strong>{email}</strong>
                    </p>
                  </div>

                  {error && <Alert variant="danger">{error}</Alert>}
                  {message && <Alert variant="success">{message}</Alert>}

                  <Form onSubmit={handleVerify}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold small">OTP Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        maxLength={6}
                        required
                        className="text-center fs-4 fw-bold"
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      className="w-100 login-btn py-2 fw-bold mt-3"
                      disabled={loading || otp.length !== 6}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <>Verify & Activate Account</>
                      )}
                    </Button>
                  </Form>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none small"
                      onClick={handleResendOtp}
                      disabled={loading}
                    >
                      Resend OTP
                    </button>
                  </div>

                  <div className="text-center mt-4 text-muted small">
                    <Link to="/login" className="text-decoration-none">
                      ← Back to Login
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="login-page">
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
                  <h2 className="fw-bold brand-text mb-1">Create Account</h2>
                  <p className="text-muted small text-uppercase tracking-wider">
                    Start your free trial
                  </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSignup}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">
                      <Building2 size={14} className="me-1" /> Company Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Your Company"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">
                      <User size={14} className="me-1" /> Your Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="John Doe"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">
                      <Mail size={14} className="me-1" /> Email
                    </Form.Label>
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

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">
                      <Lock size={14} className="me-1" /> Password
                    </Form.Label>
                    <div className="input-icon">
                      <Lock size={18} className="input-icon-left" />
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">
                      <Lock size={14} className="me-1" /> Confirm Password
                    </Form.Label>
                    <div className="input-icon">
                      <Lock size={18} className="input-icon-left" />
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                      />
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
                        Create Account <ArrowRight size={16} className="ms-2" />
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <span className="text-muted small">
                    Already have an account?{" "}
                    <Link to="/login" className="fw-bold text-decoration-none">
                      Sign In
                    </Link>
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
