import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert, Spinner } from "react-bootstrap";
import { Clock, LogOut, RefreshCw } from "lucide-react";
import API from "../api";
import "./LoginPage.css";

export default function PendingApprovalPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tenant, setTenant] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tenant_info") || "null");
    } catch {
      return null;
    }
  });

  const refreshStatus = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await API.get("/account-status");
      const t = res.data.tenant;
      setTenant(t);
      localStorage.setItem("tenant_info", JSON.stringify(t));
      if (t?.status === "active") {
        window.location.href = "/app/dashboard";
      }
    } catch (err) {
      setError(err.response?.data?.error || "Could not refresh status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const logout = async () => {
    try {
      await API.post("/logout");
    } catch {
      /* ignore */
    }
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="login-page">
      <Container fluid className="h-100 d-flex justify-content-center align-items-center">
        <Row className="justify-content-center w-100">
          <Col md={5} sm={10}>
            <Card className="login-card shadow-lg border-0">
              <Card.Body className="p-4 p-md-5 text-center">
                <div className="login-logo mx-auto mb-3 d-flex align-items-center justify-content-center">
                  <Clock size={36} style={{ color: "#f59e0b" }} />
                </div>
                <h2 className="fw-bold brand-text mb-2">Awaiting admin approval</h2>
                <p className="text-muted mb-4">
                  Your registration for <strong>{tenant?.name || "your organization"}</strong> has been
                  submitted. A platform administrator will review your request shortly.
                </p>
                <Alert variant="warning" className="text-start small">
                  You will receive an email once your account is approved. Until then, the dashboard
                  and challan features stay locked.
                </Alert>

                {error && <Alert variant="danger">{error}</Alert>}

                <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center mt-4">
                  <Button
                    variant="primary"
                    className="login-btn d-inline-flex align-items-center justify-content-center gap-2"
                    onClick={refreshStatus}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : <RefreshCw size={16} />}
                    Check status
                  </Button>
                  <Button
                    variant="outline-secondary"
                    className="d-inline-flex align-items-center justify-content-center gap-2"
                    onClick={logout}
                  >
                    <LogOut size={16} /> Sign out
                  </Button>
                </div>

                <div className="mt-4 text-muted small">
                  <Link to="/" className="text-decoration-none">← Back to home</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
