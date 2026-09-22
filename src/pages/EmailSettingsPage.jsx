import React, { useEffect, useState } from "react";
import API from "../api";
import {
  Form,
  Button,
  Alert,
  Card,
  Spinner,
  InputGroup,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import Loader from "../components/Loader";
import { trackEvent, Events } from "../analytics";

export default function EmailSettingsPage() {
  const [senderNames, setSenderNames] = useState([]);
  const [defaultSenderName, setDefaultSenderName] = useState("");
  const [newName, setNewName] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [testSenderName, setTestSenderName] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("tenant_user") || "null");
        if (user?.email) setTestEmail(user.email);

        const res = await API.get("/email_settings");
        const cfg = res.data?.email_config || {};
        const names = Array.isArray(cfg.sender_names) ? cfg.sender_names : [];
        setSenderNames(names);
        const defaultName = cfg.default_sender_name || names[0] || "";
        setDefaultSenderName(defaultName);
        setTestSenderName(defaultName);
      } catch (err) {
        console.error("Failed to load email settings", err);
        setMsg("⚠️ Could not load sender names.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (defaultSenderName) setTestSenderName(defaultSenderName);
  }, [defaultSenderName]);

  const addName = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (senderNames.includes(trimmed)) {
      setMsg("⚠️ That display name already exists.");
      return;
    }
    const updated = [...senderNames, trimmed];
    setSenderNames(updated);
    if (!defaultSenderName) setDefaultSenderName(trimmed);
    setNewName("");
    setMsg("");
  };

  const removeName = (name) => {
    if (senderNames.length <= 1) {
      setMsg("⚠️ At least one customer-visible name is required.");
      return;
    }
    const updated = senderNames.filter((n) => n !== name);
    setSenderNames(updated);
    if (defaultSenderName === name) setDefaultSenderName(updated[0]);
  };

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await API.post("/email_settings", {
        sender_names: senderNames,
        default_sender_name: defaultSenderName,
      });
      setMsg("✅ Sender names saved successfully!");
      trackEvent(Events.EMAIL_NAMES_SAVED, {
        name_count: senderNames.length,
        default_sender_name: defaultSenderName,
      });
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.error || "❌ Failed to save sender names.");
    } finally {
      setLoading(false);
    }
  };

  const sendTest = async () => {
    setSendingTest(true);
    setMsg("");
    try {
      const res = await API.post("/email_settings/test", {
        to_email: testEmail,
        sender_name: testSenderName || defaultSenderName,
      });
      setMsg(`✅ ${res.data?.message || "Test email sent."}`);
      trackEvent(Events.EMAIL_TEST_SENT, {
        to_email: testEmail,
        sender_name: testSenderName || defaultSenderName,
      });
    } catch (err) {
      setMsg(err.response?.data?.error || "❌ Failed to send test email.");
      trackEvent(Events.EMAIL_TEST_FAILED, { to_email: testEmail });
    } finally {
      setSendingTest(false);
    }
  };

  if (loading && senderNames.length === 0) {
    return <Loader text="Loading sender names..." fullscreen />;
  }

  return (
    <div className="container mt-4 position-relative">
      {(loading || sendingTest) && (
        <Loader text={sendingTest ? "Sending test email..." : "Saving..."} overlay />
      )}

      <Card className="p-4 shadow-sm">
        {msg && (
          <Alert
            variant={msg.startsWith("✅") ? "success" : "danger"}
            className="fw-semibold"
          >
            {msg}
          </Alert>
        )}

        <Form onSubmit={save}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Customer-visible sender names</Form.Label>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {senderNames.map((name) => (
                <Badge
                  key={name}
                  bg={name === defaultSenderName ? "primary" : "secondary"}
                  className="d-flex align-items-center gap-2 py-2 px-3"
                  style={{ fontSize: "0.9rem" }}
                >
                  <span>{name}</span>
                  {name === defaultSenderName && (
                    <span className="opacity-75" style={{ fontSize: "0.7rem" }}>
                      DEFAULT
                    </span>
                  )}
                  <Button
                    variant="link"
                    className="p-0 text-white text-decoration-none"
                    size="sm"
                    onClick={() => setDefaultSenderName(name)}
                    type="button"
                    title="Set as default"
                  >
                    ★
                  </Button>
                  <Button
                    variant="link"
                    className="p-0 text-white text-decoration-none"
                    size="sm"
                    onClick={() => removeName(name)}
                    type="button"
                    title="Remove"
                  >
                    ×
                  </Button>
                </Badge>
              ))}
            </div>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="e.g. Phoenix Computers"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addName();
                  }
                }}
              />
              <Button variant="outline-primary" type="button" onClick={addName}>
                Add name
              </Button>
            </InputGroup>
            <Form.Text className="text-muted">
              These names appear to customers in challan emails. Click ★ to choose the default.
            </Form.Text>
          </Form.Group>

          <div className="text-end mt-3">
            <Button type="submit" disabled={loading || senderNames.length === 0}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </Form>

        <hr className="my-4" />

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Send test email</Form.Label>
          <Form.Text className="text-muted d-block mb-3">
            Verify how your sender name appears before sending challans to customers.
          </Form.Text>
          <Row className="g-3 align-items-end">
            <Col md={5}>
              <Form.Label className="small text-muted">Recipient</Form.Label>
              <Form.Control
                type="email"
                placeholder="you@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                required
              />
            </Col>
            <Col md={5}>
              <Form.Label className="small text-muted">Sender name to preview</Form.Label>
              <Form.Select
                value={testSenderName}
                onChange={(e) => setTestSenderName(e.target.value)}
              >
                {senderNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                    {name === defaultSenderName ? " (default)" : ""}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2} className="d-grid">
              <Button
                variant="outline-secondary"
                type="button"
                disabled={sendingTest || !testEmail || senderNames.length === 0}
                onClick={sendTest}
              >
                {sendingTest ? "Sending…" : "Send test"}
              </Button>
            </Col>
          </Row>
        </Form.Group>
      </Card>
    </div>
  );
}
