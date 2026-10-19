import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Spinner, Button } from "react-bootstrap";
import { Zap } from "lucide-react";
import "./LoginPage.css";
import { exchangeGoogleTicket, googleErrorMessage } from "../utils/googleAuth";
import { routeAfterTenantAuth } from "../utils/tenantStatus";
import {
  getPostAuthRedirect,
  clearPostAuthRedirect,
  resolvePostAuthTarget,
} from "../utils/postAuthRedirect";
import { identifyUser, trackEvent, Events } from "../analytics";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const errorCode = searchParams.get("error");
    const ticket = searchParams.get("ticket");
    const next = searchParams.get("next") || "";

    if (errorCode) {
      setError(googleErrorMessage(errorCode));
      trackEvent(Events.LOGIN_FAILED, { source: "google", reason: errorCode });
      return;
    }
    if (!ticket) {
      setError("Google sign-in could not be completed. Please try again.");
      return;
    }

    (async () => {
      try {
        const data = await exchangeGoogleTicket(ticket);
        const { token, tenant, user } = data;
        if (!token) throw new Error("invalid_response");

        localStorage.setItem("tenant_token", token);
        localStorage.setItem("tenant_user", JSON.stringify(user));
        localStorage.setItem("tenant_info", JSON.stringify(tenant));

        identifyUser(user.email, {
          user_id: user.id,
          role: user.role,
          tenant_id: tenant?.id,
          tenant_name: tenant?.name,
        });
        trackEvent(Events.LOGIN_SUCCESS, {
          source: "google",
          role: user.role,
          tenant_id: tenant?.id,
        });

        const intended = getPostAuthRedirect() || next;
        const target = resolvePostAuthTarget({
          intended,
          userRole: user.role,
          tenantStatus: tenant?.status,
        });
        clearPostAuthRedirect();
        if (target) {
          navigate(target, { replace: true });
        } else {
          routeAfterTenantAuth(tenant, user.role, navigate);
        }
      } catch (err) {
        const code = err?.response?.data?.error;
        setError(googleErrorMessage(code));
        trackEvent(Events.LOGIN_FAILED, { source: "google", reason: code || "exchange" });
      }
    })();
  }, [navigate, searchParams]);

  return (
    <div className="login-page">
      <Container fluid className="h-100 d-flex justify-content-center align-items-center">
        <Row className="justify-content-center w-100">
          <Col md={4} sm={8}>
            <Card className="login-card shadow-lg border-0">
              <Card.Body className="p-4 p-md-5 text-center">
                <div className="login-logo mx-auto mb-4 d-flex align-items-center justify-content-center">
                  <Zap size={32} fill="currentColor" />
                </div>

                {error ? (
                  <>
                    <h4 className="fw-bold mb-3">Sign-in failed</h4>
                    <Alert variant="danger" className="text-start">
                      {error}
                    </Alert>
                    <Button
                      className="login-btn w-100 py-2 fw-bold"
                      onClick={() => navigate("/login", { replace: true })}
                    >
                      Back to Login
                    </Button>
                    <div className="text-center mt-3">
                      <Link to="/signup" className="text-decoration-none small">
                        Create a new account
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="fw-bold mb-3">Completing sign-in…</h4>
                    <Spinner animation="border" role="status" aria-hidden="true" />
                    <p className="text-muted small mt-3 mb-0">
                      Please wait while we verify your Google account.
                    </p>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
