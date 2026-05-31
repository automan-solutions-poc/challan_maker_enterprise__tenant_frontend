import React, { useEffect, useState } from "react";
import API from "../api";
import { Form, Button, Alert, Card, Row, Col, Spinner } from "react-bootstrap";
import Loader from "../components/Loader";

export default function EmailSettingsPage() {
  const [form, setForm] = useState({
    sender_name: "",
    sender_email: "",
    sender_password: "",
    smtp_server: "",
    smtp_port: "",
    use_tls: true,
    use_ssl: false,
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true); // 👈 start with loading true

  // 🧠 Load existing settings from backend
  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/email_settings");
        if (res.data?.email_config) {
          setForm((prev) => ({
            ...prev,
            ...res.data.email_config,
          }));
        }
      } catch (err) {
        console.error("Failed to load email settings", err);
        setMsg("⚠️ Could not load email settings.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // 💾 Save email settings
  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await API.post("/email_settings", form);
      setMsg("✅ Email settings saved successfully!");
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to save email settings.");
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Handle checkbox toggles
  const handleToggle = (field) =>
    setForm({ ...form, [field]: !form[field] });

  // ✅ Show loader while fetching or saving
  if (loading && !form.sender_email) {
    return <Loader text="Loading email settings..." fullscreen />;
  }

  return (
    <div className="container mt-4 position-relative">
      {loading && <Loader text="Saving email settings..." overlay />}

      <Card className="p-4 shadow-sm">
        <h3>📧 Challan Email Settings</h3>
        <p className="text-muted mb-4">
          Configure your service center’s SMTP details to send challan PDFs directly to customers.
        </p>

        {msg && (
          <Alert
            variant={msg.startsWith("✅") ? "success" : "danger"}
            className="fw-semibold"
          >
            {msg}
          </Alert>
        )}

        <Form onSubmit={save}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Sender Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Phoenix Computers"
                  value={form.sender_name}
                  onChange={(e) =>
                    setForm({ ...form, sender_name: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Sender Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="e.g. yourcompany@gmail.com"
                  value={form.sender_email}
                  onChange={(e) =>
                    setForm({ ...form, sender_email: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>App Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your app-specific password"
                  value={form.sender_password}
                  onChange={(e) =>
                    setForm({ ...form, sender_password: e.target.value })
                  }
                  required
                />
                <Form.Text className="text-muted">
                  ⚠️ Use an <strong>App Password</strong> (not your normal login password).
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>SMTP Server</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. smtp.gmail.com"
                  value={form.smtp_server}
                  onChange={(e) =>
                    setForm({ ...form, smtp_server: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>SMTP Port</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="587"
                  value={form.smtp_port}
                  onChange={(e) =>
                    setForm({ ...form, smtp_port: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Use TLS (STARTTLS)"
                  checked={form.use_tls}
                  onChange={() => handleToggle("use_tls")}
                />
                <Form.Check
                  type="checkbox"
                  label="Use SSL"
                  checked={form.use_ssl}
                  onChange={() => handleToggle("use_ssl")}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="text-end mt-3">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "💾 Save Settings"
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
