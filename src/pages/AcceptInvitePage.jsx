import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Zap, User, Lock, Eye, EyeOff, Building2 } from "lucide-react";
import { getPublicApiBase } from "../api";
import "./LoginPage.css";
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

  return (
    <div className="login-page">
      <Container fluid className="h-100 d-flex justify-content-center align-items-center">
        <Row className="justify-content-center w-100">
          <Col md={5} sm={10}>
            <Card className="login-card shadow-lg border-0">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="login-logo mx-auto mb-3 d-flex align-items-center justify-content-center">
                    <Zap size={32} fill="currentColor" />
                  </div>
                  <h2 className="fw-bold brand-text mb-1">Set up your account</h2>
                  <p className="text-muted small">Create your admin login for InfiChallan</p>
                </div>

                {loading && (
                  <div className="text-center py-4">
                    <Spinner animation="border" />
                  </div>
                )}

                {!loading && error && !tenantName && (
                  <Alert variant="danger">{error}</Alert>
                )}

                {!loading && tenantName && (
                  <>
                    <Alert variant="info" className="small">
                      <Building2 size={16} className="me-2" />
                      Organization: <strong>{tenantName}</strong>
                    </Alert>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold small">Email</Form.Label>
                        <Form.Control type="email" value={email} readOnly disabled />
                      </Form.Group>

                      <Form.Group className="mb-3 position-relative">
                        <Form.Label className="fw-semibold small">Your name</Form.Label>
                        <div className="input-icon">
                          <User size={18} className="input-icon-left" />
                          <Form.Control
                            type="text"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            minLength={6}
                          />
                          <button
                            type="button"
                            className="input-icon-right btn btn-link p-0"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle password"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-4 position-relative">
                        <Form.Label className="fw-semibold small">Confirm password</Form.Label>
                        <div className="input-icon">
                          <Lock size={18} className="input-icon-left" />
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                          />
                        </div>
                      </Form.Group>

                      <Button
                        type="submit"
                        className="w-100 py-2 fw-semibold"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Spinner size="sm" animation="border" className="me-2" />
                            Creating account...
                          </>
                        ) : (
                          "Create account"
                        )}
                      </Button>
                    </Form>
                  </>
                )}

                <div className="text-center mt-4">
                  <Link to="/login" className="small text-muted text-decoration-none">
                    Already have an account? Sign in
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
