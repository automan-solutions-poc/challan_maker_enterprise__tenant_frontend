import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button, Alert, Image, Spinner } from "react-bootstrap";
import API from "../api";
import ChallanPreview from "../components/ChallanPreview";

export default function SettingsPage() {
  const [template, setTemplate] = useState({
    company_name: "",
    tagline: "",
    company_address: "",
    company_phone: "",
    company_email: "", // ✅ new field
    logo_url: "",
    theme_color: "#114e9e",
    font_family: "Arial, sans-serif",
    show_accessories: true,
    footer_note: "Thank you!",
  });

  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ loading for page load

  // ✅ Load existing settings
  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/settings");
        if (res.data && res.data.branding) {
          setTemplate(res.data.branding);
          localStorage.setItem("tenant_settings", JSON.stringify(res.data));
        }
      } catch (err) {
        console.warn("No settings found yet", err);
      } finally {
        setLoading(false); // ✅ hide loader once done
      }
    };
    load();
  }, []);

  // ✅ Handle logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);

    try {
      setUploading(true);
      const res = await API.post("/upload_logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.logo_url) {
        setTemplate({ ...template, logo_url: res.data.logo_url });
        setMsg("✅ Logo uploaded successfully");
      }
    } catch (err) {
      console.error("Logo upload failed", err);
      setMsg("❌ Logo upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Save design settings
  const save = async () => {
    try {
      setUploading(true);
      await API.put("/settings", {
        branding: template,
        challan: {}, // for future customization
      });
      setMsg("✅ Settings saved successfully");
      localStorage.setItem("tenant_settings", JSON.stringify({ branding: template }));
    } catch (err) {
      console.error(err);
      setMsg("❌ Save failed");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Show loading overlay while fetching data
  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <Spinner animation="border" variant="primary" />
        <div className="mt-3 text-muted fw-semibold">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4 position-relative">
      {/* Overlay while uploading/saving */}
      {uploading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
          style={{
            background: "rgba(0,0,0,0.2)",
            backdropFilter: "blur(4px)",
            zIndex: 10,
            borderRadius: "16px"
          }}
        >
          <Spinner animation="border" variant="primary" />
          <div className="mt-2 fw-semibold">Processing...</div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Challan Design Settings</h3>
        <Button className="btn-gradient" onClick={save} disabled={uploading}>
          Save Design
        </Button>
      </div>

      {msg && (
        <Alert
          variant={msg.includes("✅") ? "success" : "danger"}
          className="border-0 shadow-sm mb-4"
          onClose={() => setMsg("")}
          dismissible
        >
          {msg}
        </Alert>
      )}

      <Row className="g-4">
        {/* 🧾 Settings Form */}
        <Col lg={7}>
          <div className="card p-4 border-0 shadow-sm">
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-uppercase text-muted">Company Name</Form.Label>
                    <Form.Control
                      value={template.company_name}
                      placeholder="e.g. InfiChallan Tech"
                      onChange={(e) => setTemplate({ ...template, company_name: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-uppercase text-muted">Tagline</Form.Label>
                    <Form.Control
                      value={template.tagline}
                      placeholder="e.g. Excellence in Service"
                      onChange={(e) => setTemplate({ ...template, tagline: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-uppercase text-muted">Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={template.company_address}
                  placeholder="Complete office address"
                  onChange={(e) => setTemplate({ ...template, company_address: e.target.value })}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-uppercase text-muted">Contact Number</Form.Label>
                    <Form.Control
                      value={template.company_phone}
                      placeholder="+91 98765 43210"
                      onChange={(e) => setTemplate({ ...template, company_phone: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-uppercase text-muted">Registered Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={template.company_email || "Not Available"}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>

              <hr className="my-4 opacity-10" />

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-uppercase text-muted">Upload Logo</Form.Label>
                <div className="d-flex align-items-center gap-3">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                    className="flex-grow-1"
                  />
                  {template.logo_url && (
                    <Image
                      src={template.logo_url}
                      alt="Logo"
                      fluid
                      width={60}
                      className="rounded shadow-sm bg-white p-1"
                      style={{ border: "1px solid var(--border-color)" }}
                    />
                  )}
                </div>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-uppercase text-muted">Theme Color</Form.Label>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Control
                        type="color"
                        value={template.theme_color}
                        className="form-control-color border-0 p-0"
                        style={{ width: '40px', height: '40px' }}
                        onChange={(e) => setTemplate({ ...template, theme_color: e.target.value })}
                      />
                      <span className="font-monospace small">{template.theme_color}</span>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-uppercase text-muted">Font Family</Form.Label>
                    <Form.Select
                      value={template.font_family}
                      onChange={(e) => setTemplate({ ...template, font_family: e.target.value })}
                    >
                      <option value="Inter, sans-serif">Inter (Default)</option>
                      <option value="'Century Gothic', sans-serif">Century Gothic</option>
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="'Courier New', monospace">Courier New</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Check
                className="mb-3 fw-semibold"
                type="switch"
                id="show-accessories"
                label="Show Accessories Section"
                checked={template.show_accessories}
                onChange={(e) => setTemplate({ ...template, show_accessories: e.target.checked })}
              />

              <Form.Group className="mb-0">
                <Form.Label className="small fw-bold text-uppercase text-muted">Footer Note</Form.Label>
                <Form.Control
                  value={template.footer_note}
                  placeholder="e.g. Dhanyawad!"
                  onChange={(e) => setTemplate({ ...template, footer_note: e.target.value })}
                />
              </Form.Group>
            </Form>
          </div>
        </Col>

        {/* 🪄 Live Preview */}
        <Col lg={5}>
          <div className="sticky-top" style={{ top: '2rem', zIndex: 1 }}>
            <h6 className="small fw-bold text-uppercase text-muted mb-3">Live Preview</h6>
            <ChallanPreview
              template={template}
              data={{
                customer_name: "John Doe",
                serial_number: "SN-12345",
                problem: "No Power / Water Damage",
                accessories: ["Charger", "Laptop Bag", "Wireless Mouse"],
              }}
            />
            <div className="mt-3 p-3 bg-light rounded small text-muted border">
              <i className="bi bi-info-circle me-2"></i>
              This is a real-time preview of how your printed challans will look.
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
