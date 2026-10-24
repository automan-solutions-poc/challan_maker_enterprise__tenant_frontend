import React, { useEffect, useState } from "react";
import API from "../api";
import { Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import { Plus, Star, X, Send, CheckCircle2, AlertCircle, AlertTriangle, Mail } from "lucide-react";
import Loader from "../components/Loader";
import PageHeader from "../components/PageHeader";
import { trackEvent, Events } from "../analytics";

const NOTICE_ICONS = { success: CheckCircle2, danger: AlertCircle, warning: AlertTriangle };

export default function EmailSettingsPage() {
  const [senderNames, setSenderNames] = useState([]);
  const [defaultSenderName, setDefaultSenderName] = useState("");
  const [newName, setNewName] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [testSenderName, setTestSenderName] = useState("");
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [savedKey, setSavedKey] = useState("");

  const notify = (variant, text) => setNotice({ variant, text });

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
        setSavedKey(JSON.stringify([names, defaultName]));
      } catch (err) {
        console.error("Failed to load email settings", err);
        notify("warning", "Could not load sender names.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (defaultSenderName) setTestSenderName(defaultSenderName);
  }, [defaultSenderName]);

  const isDirty = !loading && JSON.stringify([senderNames, defaultSenderName]) !== savedKey;

  const addName = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (senderNames.includes(trimmed)) {
      notify("warning", "That display name already exists.");
      return;
    }
    const updated = [...senderNames, trimmed];
    setSenderNames(updated);
    if (!defaultSenderName) setDefaultSenderName(trimmed);
    setNewName("");
    setNotice(null);
  };

  const removeName = (name) => {
    if (senderNames.length <= 1) {
      notify("warning", "At least one customer-visible name is required.");
      return;
    }
    const updated = senderNames.filter((n) => n !== name);
    setSenderNames(updated);
    if (defaultSenderName === name) setDefaultSenderName(updated[0]);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      await API.post("/email_settings", {
        sender_names: senderNames,
        default_sender_name: defaultSenderName,
      });
      notify("success", "Sender names saved.");
      setSavedKey(JSON.stringify([senderNames, defaultSenderName]));
      trackEvent(Events.EMAIL_NAMES_SAVED, {
        name_count: senderNames.length,
        default_sender_name: defaultSenderName,
      });
    } catch (err) {
      console.error(err);
      notify("danger", err.response?.data?.error || "Failed to save sender names.");
    } finally {
      setSaving(false);
    }
  };

  const sendTest = async (e) => {
    e.preventDefault();
    setSendingTest(true);
    setNotice(null);
    try {
      const res = await API.post("/email_settings/test", {
        to_email: testEmail,
        sender_name: testSenderName || defaultSenderName,
      });
      notify("success", res.data?.message || "Test email sent.");
      trackEvent(Events.EMAIL_TEST_SENT, {
        to_email: testEmail,
        sender_name: testSenderName || defaultSenderName,
      });
    } catch (err) {
      notify("danger", err.response?.data?.error || "Failed to send test email.");
      trackEvent(Events.EMAIL_TEST_FAILED, { to_email: testEmail });
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return <Loader text="Loading email settings…" fullscreen />;
  }

  const NoticeIcon = notice ? NOTICE_ICONS[notice.variant] || AlertCircle : null;

  return (
    <div className="page">
      <PageHeader
        eyebrow="Administration"
        title="Email settings"
        subtitle="Choose the name customers see when infiChallan emails a receipt or pickup code."
      />

      {notice && (
        <Alert variant={notice.variant} dismissible onClose={() => setNotice(null)}>
          <NoticeIcon size={16} className="flex-shrink-0 mt-1" /> <span>{notice.text}</span>
        </Alert>
      )}

      <Row className="g-3">
        <Col lg={7}>
          <Form onSubmit={save} className="surface surface-pad h-100 d-flex flex-column">
            <div className="section-head">
              <h2 className="section-title">Sender names</h2>
              <p className="section-desc">Shown in the "From" line of challan emails. The starred name is used by default.</p>
            </div>

            {senderNames.length === 0 ? (
              <p className="text-muted small mb-3">No sender names yet. Add your shop's name below.</p>
            ) : (
              <ul className="sender-list">
                {senderNames.map((name) => {
                  const isDefault = name === defaultSenderName;
                  return (
                    <li key={name} className={isDefault ? "is-default" : ""}>
                      <button
                        type="button"
                        className="sender-star"
                        onClick={() => setDefaultSenderName(name)}
                        aria-label={isDefault ? `${name} is the default` : `Make ${name} the default`}
                        aria-pressed={isDefault}
                        title={isDefault ? "Default sender" : "Make default"}
                      >
                        <Star size={15} fill={isDefault ? "currentColor" : "none"} />
                      </button>
                      <span className="sender-name text-truncate">{name}</span>
                      {isDefault && <span className="status-pill is-accent no-dot">Default</span>}
                      <button
                        type="button"
                        className="sender-remove"
                        onClick={() => removeName(name)}
                        aria-label={`Remove ${name}`}
                        title="Remove"
                      >
                        <X size={15} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <Form.Label htmlFor="es-new-name" className="mt-2">Add a name</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                id="es-new-name"
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
              <Button variant="secondary" type="button" onClick={addName} disabled={!newName.trim()}>
                <Plus size={15} /> Add
              </Button>
            </div>

            <div className="d-flex align-items-center justify-content-end gap-2 mt-auto pt-4">
              {isDirty && <span className="status-pill is-warning">Unsaved changes</span>}
              <Button type="submit" disabled={saving || senderNames.length === 0 || !isDirty}>
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" /> Saving…
                  </>
                ) : (
                  "Save names"
                )}
              </Button>
            </div>
          </Form>
        </Col>

        <Col lg={5}>
          <Form onSubmit={sendTest} className="surface surface-pad h-100">
            <div className="section-head">
              <h2 className="section-title">Send a test email</h2>
              <p className="section-desc">Check how the sender name looks in a real inbox.</p>
            </div>

            <Form.Group className="mb-3" controlId="es-test-to">
              <Form.Label>Recipient</Form.Label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <Form.Control
                  type="email"
                  placeholder="you@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-4" controlId="es-test-from">
              <Form.Label>Sender name</Form.Label>
              <Form.Select
                value={testSenderName}
                onChange={(e) => setTestSenderName(e.target.value)}
                disabled={senderNames.length === 0}
              >
                {senderNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                    {name === defaultSenderName ? " (default)" : ""}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button
              variant="secondary"
              type="submit"
              className="w-100"
              disabled={sendingTest || !testEmail || senderNames.length === 0}
            >
              {sendingTest ? <Spinner animation="border" size="sm" /> : <Send size={15} />}
              {sendingTest ? "Sending…" : "Send test email"}
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
