import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Form, Button, Alert, Image, Spinner } from "react-bootstrap";
import { Trash2, Upload, ImageIcon, CheckCircle2, AlertCircle, Info } from "lucide-react";
import API from "../api";
import ChallanPreview from "../components/ChallanPreview";
import Loader from "../components/Loader";
import PageHeader from "../components/PageHeader";
import { useConfirm } from "../components/ConfirmDialog";
import { trackEvent, Events } from "../analytics";

const COLOR_PRESETS = ["#114e9e", "#4f46e5", "#0f766e", "#b45309", "#7c3aed", "#be123c", "#12141c"];
const HEX_RE = /^#[0-9a-fA-F]{6}$/;

const DEFAULT_TEMPLATE = {
  company_name: "",
  tagline: "",
  company_address: "",
  company_phone: "",
  company_email: "",
  logo_url: "",
  theme_color: "#114e9e",
  font_family: "Arial, sans-serif",
  show_accessories: true,
  footer_note: "Thank you!",
};

export default function SettingsPage() {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(DEFAULT_TEMPLATE));
  const [hexDraft, setHexDraft] = useState("#114e9e");

  const [notice, setNotice] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirm, confirmDialog] = useConfirm();

  const notify = (variant, text) => setNotice({ variant, text });
  const update = (patch) => setTemplate((t) => ({ ...t, ...patch }));

  // Load existing settings
  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/settings");
        if (res.data && res.data.branding) {
          setTemplate(res.data.branding);
          setSavedSnapshot(JSON.stringify(res.data.branding));
          setHexDraft(res.data.branding.theme_color || "#114e9e");
          localStorage.setItem("tenant_settings", JSON.stringify(res.data));
        }
      } catch (err) {
        console.warn("No settings found yet", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const isDirty = useMemo(() => JSON.stringify(template) !== savedSnapshot, [template, savedSnapshot]);

  // Logo changes are persisted by the upload endpoint itself, so keep them out of "unsaved changes".
  const syncSavedLogo = (logo_url) =>
    setSavedSnapshot((snap) => JSON.stringify({ ...JSON.parse(snap || "{}"), logo_url }));

  const setColor = (value) => {
    setHexDraft(value);
    if (HEX_RE.test(value)) update({ theme_color: value.toLowerCase() });
  };

  // Logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);

    try {
      setUploading(true);
      const res = await API.post("/upload_logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.logo_url) {
        update({ logo_url: res.data.logo_url });
        syncSavedLogo(res.data.logo_url);
        notify("success", "Logo uploaded.");
        trackEvent(Events.LOGO_UPLOADED);
      }
    } catch (err) {
      console.error("Logo upload failed", err);
      notify("danger", err.response?.data?.error || "Logo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // Logo delete
  const handleLogoDelete = async () => {
    const ok = await confirm({
      title: "Remove the logo?",
      body: "New challan PDFs will be generated without a logo.",
      confirmLabel: "Remove logo",
      tone: "danger",
    });
    if (!ok) return;
    try {
      setUploading(true);
      await API.delete("/upload_logo");
      update({ logo_url: "" });
      syncSavedLogo("");
      notify("success", "Logo removed.");
      trackEvent(Events.LOGO_DELETED);
      localStorage.setItem(
        "tenant_settings",
        JSON.stringify({ branding: { ...template, logo_url: "" } })
      );
    } catch (err) {
      console.error("Logo delete failed", err);
      notify("danger", "Logo delete failed.");
    } finally {
      setUploading(false);
    }
  };

  // Save design settings
  const save = async () => {
    try {
      setSaving(true);
      await API.put("/settings", {
        branding: template,
        challan: {}, // for future customization
      });
      notify("success", "Design saved. New challan PDFs will use it.");
      setSavedSnapshot(JSON.stringify(template));
      trackEvent(Events.DESIGN_SETTINGS_SAVED, {
        company_name: template.company_name,
        theme_color: template.theme_color,
      });
      localStorage.setItem("tenant_settings", JSON.stringify({ branding: template }));
    } catch (err) {
      console.error(err);
      notify("danger", "Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading settings…" fullscreen />;
  }

  const NoticeIcon = notice?.variant === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div className="page position-relative">
      {uploading && <Loader text="Uploading…" overlay />}

      <PageHeader
        eyebrow="Administration"
        title="Design settings"
        subtitle="Your company details and brand, as printed on every challan PDF."
        actions={
          <>
            {isDirty && <span className="status-pill is-warning align-self-center">Unsaved changes</span>}
            <Button onClick={save} disabled={saving || uploading}>
              {saving ? <Spinner animation="border" size="sm" /> : null}
              {saving ? "Saving…" : "Save design"}
            </Button>
          </>
        }
      />

      {notice && (
        <Alert variant={notice.variant} dismissible onClose={() => setNotice(null)}>
          <NoticeIcon size={16} className="flex-shrink-0 mt-1" /> <span>{notice.text}</span>
        </Alert>
      )}

      <Row className="g-3">
        <Col xl={7}>
          <section className="surface surface-pad mb-3">
            <div className="section-head">
              <h2 className="section-title">Company details</h2>
              <p className="section-desc">Shown in the header of every challan.</p>
            </div>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="st-company">
                  <Form.Label>Company name</Form.Label>
                  <Form.Control
                    value={template.company_name || ""}
                    placeholder="e.g. AutoMan Computers"
                    onChange={(e) => update({ company_name: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="st-tagline">
                  <Form.Label>Tagline <span className="optional">optional</span></Form.Label>
                  <Form.Control
                    value={template.tagline || ""}
                    placeholder="e.g. Excellence in service"
                    onChange={(e) => update({ tagline: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group controlId="st-address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={template.company_address || ""}
                    placeholder="Full shop address"
                    onChange={(e) => update({ company_address: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="st-phone">
                  <Form.Label>Contact number</Form.Label>
                  <Form.Control
                    value={template.company_phone || ""}
                    placeholder="+91 98765 43210"
                    onChange={(e) => update({ company_phone: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="st-email">
                  <Form.Label>Registered email</Form.Label>
                  <Form.Control type="email" value={template.company_email || ""} placeholder="Not available" disabled />
                  <Form.Text>Set when the workspace was created.</Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </section>

          <section className="surface surface-pad">
            <div className="section-head">
              <h2 className="section-title">Brand</h2>
              <p className="section-desc">Logo, colour and type for the printed receipt.</p>
            </div>

            <div className="form-label">Logo</div>
            <div className="d-flex align-items-center gap-3 mb-4">
              {template.logo_url ? (
                <div className="logo-hover-wrap">
                  <Image
                    src={template.logo_url}
                    alt="Company logo"
                    width={64}
                    height={64}
                    style={{ objectFit: "contain", background: "#fff", border: "1px solid var(--border-color)", borderRadius: 12, padding: 6 }}
                  />
                  <button
                    type="button"
                    className="logo-hover-overlay"
                    style={{ borderRadius: 12 }}
                    title="Remove logo"
                    aria-label="Remove logo"
                    onClick={handleLogoDelete}
                    disabled={uploading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <div className="icon-tile" style={{ width: 64, height: 64, borderRadius: 12, background: "var(--bg-subtle)", color: "var(--text-faint)" }}>
                  <ImageIcon size={22} />
                </div>
              )}
              <div>
                <label className="btn btn-secondary btn-sm mb-1" htmlFor="st-logo">
                  <Upload size={14} /> {template.logo_url ? "Replace logo" : "Upload logo"}
                </label>
                <input id="st-logo" type="file" accept="image/*" className="visually-hidden" onChange={handleLogoUpload} disabled={uploading} />
                <div className="form-text mt-0">PNG or JPG, square works best.{template.logo_url ? " Hover the logo to remove it." : ""}</div>
              </div>
            </div>

            <Row className="g-3">
              <Col md={7}>
                <div className="form-label" id="st-color-label">Theme colour</div>
                <div className="d-flex flex-wrap align-items-center gap-2" role="group" aria-labelledby="st-color-label">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className="swatch"
                      style={{ background: c }}
                      aria-label={`Use ${c}`}
                      aria-pressed={template.theme_color?.toLowerCase() === c}
                      onClick={() => setColor(c)}
                    />
                  ))}
                  <div className="input-with-icon" style={{ width: 128 }}>
                    <input
                      type="color"
                      className="color-well"
                      value={HEX_RE.test(template.theme_color || "") ? template.theme_color : "#114e9e"}
                      onChange={(e) => setColor(e.target.value)}
                      aria-label="Pick a custom colour"
                    />
                    <Form.Control
                      size="sm"
                      value={hexDraft}
                      onChange={(e) => setColor(e.target.value.trim())}
                      isInvalid={!HEX_RE.test(hexDraft)}
                      className="font-monospace"
                      style={{ paddingLeft: "2.3rem" }}
                      aria-label="Hex colour"
                    />
                  </div>
                </div>
              </Col>
              <Col md={5}>
                <Form.Group controlId="st-font">
                  <Form.Label>Font family</Form.Label>
                  <Form.Select
                    value={template.font_family}
                    onChange={(e) => update({ font_family: e.target.value })}
                  >
                    <option value="Inter, sans-serif">Inter (default)</option>
                    <option value="'Century Gothic', sans-serif">Century Gothic</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="'Courier New', monospace">Courier New</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group controlId="st-footer">
                  <Form.Label>Footer note</Form.Label>
                  <Form.Control
                    value={template.footer_note || ""}
                    placeholder="e.g. Thank you for trusting us."
                    onChange={(e) => update({ footer_note: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Check
                  type="switch"
                  id="show-accessories"
                  label="Show the accessories section on the receipt"
                  checked={template.show_accessories !== false}
                  onChange={(e) => update({ show_accessories: e.target.checked })}
                />
              </Col>
            </Row>
          </section>
        </Col>

        <Col xl={5}>
          <div className="settings-preview">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="page-eyebrow mb-0">Live preview</span>
            </div>
            <ChallanPreview
              template={template}
              data={{
                customer_name: "John Doe",
                serial_number: "SN-12345",
                problem: "No power / water damage",
                accessories: ["Charger", "Laptop Bag", "Wireless Mouse"],
              }}
            />
            <p className="small text-muted d-flex gap-2 mt-3 mb-0">
              <Info size={15} className="flex-shrink-0 mt-1" />
              A close approximation of the PDF your customers receive. Changes apply to challans created after you save.
            </p>
          </div>
        </Col>
      </Row>

      {confirmDialog}
    </div>
  );
}
