import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-bootstrap";
import { Lock, Mail, LogIn } from "lucide-react";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/login", { email, password });
      const { token, tenant, user } = res.data;

      if (!token) throw new Error("Invalid server response");

      localStorage.setItem("tenant_token", token);
      localStorage.setItem("tenant_user", JSON.stringify(user));
      localStorage.setItem("tenant_info", JSON.stringify(tenant));

      if (user.role === "tenant_admin") navigate("/app/dashboard");
      else navigate("/app/challans");
    } catch (err) {
      console.error("Login error", err);
      setError(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container fluid className="h-100 d-flex justify-content-center align-items-center">
        <Row className="justify-content-center w-100">
          <Col md={4} sm={8}>
            <Card className="login-card shadow-lg border-0">
              <Card.Body>
                <div className="text-center mb-4">
                  <div className="login-logo mx-auto mb-3">
                    <Lock size={28} />
                  </div>
                  <h3 className="fw-semibold">Tenant Login</h3>
                  <p className="text-muted small mb-0">
                    Sign in to manage your service center
                  </p>
                </div>

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
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 login-btn"
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
                  © {new Date().getFullYear()} Automan Solutions
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
