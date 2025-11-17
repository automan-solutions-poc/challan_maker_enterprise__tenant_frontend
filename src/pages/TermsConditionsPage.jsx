// src/pages/TermsConditionsPage.jsx
import React, { useEffect, useState } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import API from "../api";

export default function TermsConditionsPage() {
  const [terms, setTerms] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await API.get("/settings/terms");
        setTerms(res.data?.terms_conditions || "");
      } catch (err) {
        console.error("Failed to load terms:", err);
        setMsg("⚠️ Failed to load Terms & Conditions.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      await API.put("/settings/terms", { terms_conditions: terms });
      setMsg("✅ Terms & Conditions saved successfully.");
    } catch (err) {
      console.error("Failed to save terms:", err);
      setMsg("❌ Failed to save Terms & Conditions.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3>Terms & Conditions</h3>
      <Card className="p-3 shadow-sm">
        {msg && (
          <Alert variant={msg.startsWith("✅") ? "success" : "danger"}>
            {msg}
          </Alert>
        )}

        {loading ? (
          <div className="d-flex align-items-center gap-2">
            <Spinner animation="border" size="sm" />
            <div>Loading...</div>
          </div>
        ) : (
          <Form onSubmit={save}>
            <Form.Group className="mb-3">
              <Form.Label>Terms & Conditions (HTML allowed)</Form.Label>
              <Form.Control
                as="textarea"
                rows={12}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Enter your shop's terms and conditions. You can use simple HTML for formatting."
              />
              <Form.Text className="text-muted">
                You can paste simple HTML (paragraphs, <code>&lt;br/&gt;</code>, lists). The content will be included in the challan PDF.
              </Form.Text>
            </Form.Group>

            <div className="text-end">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  "Save Terms & Conditions"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
}
