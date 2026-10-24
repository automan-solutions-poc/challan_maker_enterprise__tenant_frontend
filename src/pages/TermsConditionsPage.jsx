// src/pages/TermsConditionsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import { CheckCircle2, AlertCircle } from "lucide-react";
import API from "../api";
import { trackEvent, Events } from "../analytics";
import Loader from "../components/Loader";
import PageHeader from "../components/PageHeader";

// Plain-text rendering of the terms for the preview — tags are stripped, never injected.
const toPreviewLines = (html) => {
  if (!html) return [];
  const doc = new DOMParser().parseFromString(
    html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|li|div|h\d)>/gi, "\n"),
    "text/html"
  );
  return (doc.body.textContent || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

export default function TermsConditionsPage() {
  const [terms, setTerms] = useState("");
  const [savedTerms, setSavedTerms] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await API.get("/settings/terms");
        const value = res.data?.terms_conditions || "";
        setTerms(value);
        setSavedTerms(value);
      } catch (err) {
        console.error("Failed to load terms:", err);
        setNotice({ variant: "danger", text: "Failed to load Terms & Conditions." });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const previewLines = useMemo(() => toPreviewLines(terms), [terms]);
  const isDirty = terms !== savedTerms;

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      await API.put("/settings/terms", { terms_conditions: terms });
      trackEvent(Events.TERMS_SAVED, { length: terms.length });
      setSavedTerms(terms);
      setNotice({ variant: "success", text: "Terms & Conditions saved. They'll appear on new challans." });
    } catch (err) {
      console.error("Failed to save terms:", err);
      setNotice({ variant: "danger", text: "Failed to save Terms & Conditions." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading terms…" fullscreen />;
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Administration"
        title="Terms & conditions"
        subtitle="Printed at the bottom of every challan PDF."
      />

      {notice && (
        <Alert variant={notice.variant} dismissible onClose={() => setNotice(null)}>
          {notice.variant === "success" ? (
            <CheckCircle2 size={16} className="flex-shrink-0 mt-1" />
          ) : (
            <AlertCircle size={16} className="flex-shrink-0 mt-1" />
          )}
          <span>{notice.text}</span>
        </Alert>
      )}

      <Row className="g-3">
        <Col lg={7}>
          <Form onSubmit={save} className="surface surface-pad h-100 d-flex flex-column">
            <Form.Group controlId="terms-editor" className="flex-grow-1 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-baseline">
                <Form.Label>Your terms</Form.Label>
                <span className="small text-faint tabular-nums">{terms.length} characters</span>
              </div>
              <Form.Control
                as="textarea"
                rows={14}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder={"1. Devices not collected within 30 days…<br/>\n2. Data backup is the customer's responsibility…"}
                className="font-monospace flex-grow-1"
                style={{ fontSize: "0.84rem", lineHeight: 1.6 }}
              />
              <Form.Text>
                Simple HTML works: paragraphs, lists and <code>&lt;br/&gt;</code> for line breaks.
              </Form.Text>
            </Form.Group>

            <div className="d-flex align-items-center justify-content-end gap-2 pt-4">
              {isDirty && <span className="status-pill is-warning">Unsaved changes</span>}
              <Button type="submit" disabled={saving || !isDirty}>
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" /> Saving…
                  </>
                ) : (
                  "Save terms"
                )}
              </Button>
            </div>
          </Form>
        </Col>

        <Col lg={5}>
          <div className="surface surface-pad h-100">
            <div className="section-head">
              <h2 className="section-title">How it reads</h2>
              <p className="section-desc">Text only — formatting is applied in the PDF.</p>
            </div>
            <div className="challan-preview" style={{ padding: "1.25rem", fontSize: 12.5, color: "#555" }}>
              {previewLines.length ? (
                previewLines.map((line, i) => (
                  <p key={i} style={{ margin: "0 0 6px" }}>
                    {line}
                  </p>
                ))
              ) : (
                <p className="mb-0" style={{ color: "#999" }}>
                  Nothing yet. Your terms will appear here as you type.
                </p>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
