import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button, Alert, Image, Spinner } from "react-bootstrap";
import API from "../api";
import ChallanPreview from "../compopnents/ChallanPreview";

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
    <div className="position-relative p-3">
      {/* Overlay while uploading/saving */}
      {uploading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
          style={{
            background: "rgba(255,255,255,0.7)",
            zIndex: 10,
          }}
        >
          <Spinner animation="border" variant="primary" />
          <div className="mt-2 text-muted fw-semibold">Processing...</div>
        </div>
      )}

      <h3>Challan Design Settings</h3>
      {msg && <Alert variant={msg.includes("✅") ? "success" : "danger"}>{msg}</Alert>}

      <Row>
        {/* 🧾 Settings Form */}
        <Col md={6}>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                value={template.company_name}
                onChange={(e) => setTemplate({ ...template, company_name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Tagline</Form.Label>
              <Form.Control
                value={template.tagline}
                onChange={(e) => setTemplate({ ...template, tagline: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={template.company_address}
                onChange={(e) => setTemplate({ ...template, company_address: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                value={template.company_phone}
                onChange={(e) => setTemplate({ ...template, company_phone: e.target.value })}
              />
            </Form.Group>

          <Form.Group className="mb-2">
  <Form.Label>Registered Email (Read Only)</Form.Label>
  <Form.Control
    type="email"
    value={template.company_email || "Not Available"}
    disabled
  />
</Form.Group>


            <Form.Group className="mb-2">
              <Form.Label>Upload Logo</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploading}
              />
              {template.logo_url && (
                <div className="mt-2">
                  <Image
                    src={template.logo_url}
                    alt="Logo"
                    fluid
                    thumbnail
                    width={100}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      backgroundColor: "#fff",
                      padding: 4,
                    }}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Theme Color</Form.Label>
              <Form.Control
                type="color"
                value={template.theme_color}
                onChange={(e) => setTemplate({ ...template, theme_color: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Font Family</Form.Label>
              <Form.Control
                value={template.font_family}
                onChange={(e) => setTemplate({ ...template, font_family: e.target.value })}
              />
            </Form.Group>

            <Form.Check
              className="mb-2"
              type="checkbox"
              label="Show Accessories"
              checked={template.show_accessories}
              onChange={(e) => setTemplate({ ...template, show_accessories: e.target.checked })}
            />

            <Form.Group className="mb-2">
              <Form.Label>Footer Note</Form.Label>
              <Form.Control
                value={template.footer_note}
                onChange={(e) => setTemplate({ ...template, footer_note: e.target.value })}
              />
            </Form.Group>

            <Button variant="primary" onClick={save} disabled={uploading}>
              Save Design
            </Button>
          </Form>
        </Col>

        {/* 🪄 Live Preview */}
        <Col md={6}>
          <h6>Live Preview</h6>
          <ChallanPreview
            template={template}
            data={{
              customer_name: "John Doe",
              serial_number: "SN-12345",
              problem: "No Power",
              accessories: ["Charger", "Adapter"],
            }}
          />
        </Col>
      </Row>
    </div>
  );
}
