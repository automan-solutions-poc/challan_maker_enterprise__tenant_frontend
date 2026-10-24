import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Alert, Spinner } from "react-bootstrap";
import { Clock, LogOut, RefreshCw, AlertCircle } from "lucide-react";
import API from "../api";
import AuthShell from "../components/AuthShell";
import { clearSession, getStoredTenant } from "../utils/session";

export default function PendingApprovalPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tenant, setTenant] = useState(getStoredTenant);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    try {
      await API.post("/logout");
    } catch {
      /* ignore */
    }
    clearSession();
    window.location.href = "/login";
  };

  return (
    <AuthShell
      wide
      icon={<Clock size={24} />}
      iconTone="warning"
      title="Awaiting approval"
      subtitle={
        <>
          Your registration for <strong className="text-body">{tenant?.name || "your organization"}</strong> has
          been submitted. A platform administrator will review it shortly.
        </>
      }
      footer={<Link to="/">Back to home</Link>}
    >
      <Alert variant="warning" className="mb-3">
        <span>
          You will receive an email once your account is approved. Until then, the dashboard and
          challan features stay locked.
        </span>
      </Alert>

      {error && (
        <Alert variant="danger">
          <AlertCircle size={16} className="flex-shrink-0 mt-1" /> <span>{error}</span>
        </Alert>
      )}

      <div className="d-flex flex-column flex-sm-row gap-2 mt-4">
        <Button className="flex-fill" onClick={refreshStatus} disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : <RefreshCw size={16} />}
          Check status
        </Button>
        <Button variant="secondary" className="flex-fill" onClick={logout}>
          <LogOut size={16} /> Sign out
        </Button>
      </div>
    </AuthShell>
  );
}
