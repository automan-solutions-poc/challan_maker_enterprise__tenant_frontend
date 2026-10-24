import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import { Trash2, Plus, ImagePlus, X, CheckCircle2, AlertCircle } from "lucide-react";
import API from "../api";
import { useNavigate, useParams } from "react-router-dom";
import ChallanPreview from "../components/ChallanPreview";
import Loader from "../components/Loader";
import PageHeader from "../components/PageHeader";
import "./ChallanForm.css";
import { trackEvent, Events } from "../analytics";

const ACCESSORIES = [
  "Desktop", "Laptop", "SSD", "Adapter", "RAM", "Carry Case",
  "HDD", "Damage", "Mother Board", "Printer", "CPU", "Toner",
  "LCD / LED / IPS", "Head", "Keyboard or Mouse", "Speaker",
];

const WARRANTY_OPTIONS = ["Warranty", "No Warranty", "Chargeable", "Material Send to Customer"];

const formatBytes = (bytes) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function ChallanForm({ editMode = false }) {
  const { challan_no } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    contact_number: "",
    city: "",
    serial_number: "",
    problem: "",
    accessories: [],
    warranty: "",
    dispatch_through: "",
    employee_id: "",
    items: [{ description: "", quantity: 1 }],
  });

  const [images, setImages] = useState([]);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false); // submission loading
  const [pageLoading, setPageLoading] = useState(true); // initial page loader
  const [template, setTemplate] = useState(null); // null ensures preview waits

  // Load design + challan (both must complete before rendering)
  useEffect(() => {
    const initializePage = async () => {
      try {
        setPageLoading(true);
        const designPromise = API.get("/design").then((res) => {
          if (res.data && res.data.design) {
            setTemplate(res.data.design);
            localStorage.setItem("tenant_design", JSON.stringify(res.data.design));
          } else {
            const cached = localStorage.getItem("tenant_design");
            setTemplate(cached ? JSON.parse(cached) : {});
          }
        }).catch(() => {
          const cached = localStorage.getItem("tenant_design");
          setTemplate(cached ? JSON.parse(cached) : {});
        });

        const challanPromise =
          editMode && challan_no
            ? API.get(`/challan/${challan_no}`).then((res) => {
                const data = res.data;
                setForm({
                  customer_name: data.customer_name || "",
                  email: data.email || "",
                  contact_number: data.contact_number || "",
                  city: data.city || "",
                  serial_number: data.serial_number || "",
                  problem: data.problem || "",
                  accessories: data.accessories || [],
                  warranty: data.warranty || "",
                  dispatch_through: data.dispatch_through || "",
                  employee_id: data.employee_id || "",
                  items: data.items?.length
                    ? data.items
                    : [{ description: "", quantity: 1 }],
                });
              })
            : Promise.resolve();

        await Promise.all([designPromise, challanPromise]);
      } catch (err) {
        console.error("Initialization error:", err);
        setNotice({ variant: "danger", text: "Failed to load the challan. Please go back and try again." });
      } finally {
        setPageLoading(false);
      }
    };

    initializePage();
  }, [editMode, challan_no]);

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleItemChange = (idx, key, value) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((item, i) => (i === idx ? { ...item, [key]: value } : item)),
    }));
  };

  const addItem = () =>
    setForm((f) => ({ ...f, items: [...f.items, { description: "", quantity: 1 }] }));

  const removeItem = (idx) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const toggleAccessory = (value) => {
    setForm((f) => ({
      ...f,
      accessories: f.accessories.includes(value)
        ? f.accessories.filter((a) => a !== value)
        : [...f.accessories, value],
    }));
  };

  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files || []);
    setImages((prev) => {
      const seen = new Set(prev.map((f) => `${f.name}-${f.size}`));
      return [...prev, ...picked.filter((f) => !seen.has(`${f.name}-${f.size}`))];
    });
    e.target.value = "";
  };

  const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);
    try {
      const data = new FormData();
      data.append("data", JSON.stringify(form));
      photoItems.forEach((p) => data.append("images", p.file));

      if (editMode && challan_no) {
        await API.put(`/challan/${challan_no}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        trackEvent(Events.CHALLAN_UPDATED, { challan_no });
        setNotice({ variant: "success", text: "Challan updated. Taking you back to the list…" });
      } else {
        const res = await API.post("/challan", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        trackEvent(Events.CHALLAN_CREATED, {
          challan_no: res.data?.challan_no,
          email_sent: Boolean(form.email),
        });
        setNotice({
          variant: "success",
          text: `Challan ${res.data?.challan_no || ""} created${form.email ? " and emailed to the customer" : ""}. Taking you back to the list…`,
        });
      }

      setTimeout(() => navigate("/app/challans"), 1200);
    } catch (err) {
      console.error("Error saving challan", err);
      setNotice({ variant: "danger", text: err.response?.data?.error || "Save failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading || !template) {
    return <Loader text={editMode ? "Loading challan…" : "Preparing form…"} fullscreen />;
  }

  return (
    <div className="page position-relative">
      {loading && <Loader text={editMode ? "Updating challan…" : "Creating challan…"} overlay />}

      <PageHeader
        back={{ to: "/app/challans", label: "Challans" }}
        title={editMode ? `Edit ${challan_no}` : "New challan"}
        subtitle={
          editMode
            ? "Changes regenerate the PDF and QR code."
            : "Log the job once. The PDF, QR code and customer email are generated on save."
        }
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

      <div className="challan-form-grid">
        <Form onSubmit={submit} className="challan-form-main">
          <fieldset disabled={loading}>
            {/* Customer */}
            <section className="surface surface-pad mb-3">
              <div className="section-head">
                <h2 className="section-title">Customer</h2>
                <p className="section-desc">The receipt and pickup code are sent to this email.</p>
              </div>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="cf-name">
                    <Form.Label>Customer name / M/s.</Form.Label>
                    <Form.Control value={form.customer_name} onChange={setField("customer_name")} required placeholder="e.g. Asha Mehta" autoComplete="off" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="cf-email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="customer@example.com" value={form.email} onChange={setField("email")} required autoComplete="off" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="cf-phone">
                    <Form.Label>Contact number</Form.Label>
                    <Form.Control type="tel" value={form.contact_number} placeholder="e.g. 98765 43210" onChange={setField("contact_number")} required autoComplete="off" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="cf-city">
                    <Form.Label>City</Form.Label>
                    <Form.Control placeholder="e.g. Pune" value={form.city} onChange={setField("city")} required />
                  </Form.Group>
                </Col>
              </Row>
            </section>

            {/* Device */}
            <section className="surface surface-pad mb-3">
              <div className="section-head">
                <h2 className="section-title">Device and job</h2>
                <p className="section-desc">What came in, what's wrong, and the parts involved.</p>
              </div>

              <Form.Group className="mb-3" controlId="cf-serial">
                <Form.Label>Serial number / asset tag</Form.Label>
                <Form.Control placeholder="e.g. SN-987654321" value={form.serial_number} onChange={setField("serial_number")} required />
              </Form.Group>

              <Form.Group className="mb-4" controlId="cf-problem">
                <Form.Label>Problem description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Describe the issue reported by the customer…"
                  value={form.problem}
                  onChange={setField("problem")}
                />
              </Form.Group>

              <div className="form-label mb-2">Items</div>
              <div className="item-rows">
                <div className="item-row item-row-head" aria-hidden="true">
                  <span>#</span>
                  <span>Description / component</span>
                  <span>Qty</span>
                  <span />
                </div>
                {form.items.map((item, idx) => (
                  <div className="item-row" key={idx}>
                    <span className="item-index">{idx + 1}</span>
                    <Form.Control
                      placeholder="e.g. Replacement display"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                      aria-label={`Item ${idx + 1} description`}
                    />
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                      aria-label={`Item ${idx + 1} quantity`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="btn-icon"
                      onClick={() => removeItem(idx)}
                      disabled={form.items.length === 1}
                      aria-label={`Remove item ${idx + 1}`}
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline-primary" size="sm" className="mt-2" onClick={addItem}>
                <Plus size={15} /> Add item
              </Button>

              <hr className="divider" />

              <div className="form-label mb-1">Condition photos <span className="optional">optional</span></div>
              <p className="form-text mt-0 mb-2">Document scratches or damage at intake.</p>
              <label className="upload-drop" htmlFor="cf-images">
                <ImagePlus size={20} />
                <span>
                  <strong>Choose photos</strong> or drop them here
                </span>
                <input id="cf-images" type="file" multiple accept="image/*" onChange={handleFileChange} />
              </label>
              {images.length > 0 && (
                <ul className="file-list">
                  {images.map((file, idx) => (
                    <li key={`${file.name}-${file.size}`}>
                      <span className="text-truncate">{file.name}</span>
                      <span className="text-faint small flex-shrink-0">{formatBytes(file.size)}</span>
                      <button type="button" onClick={() => removeImage(idx)} aria-label={`Remove ${file.name}`}>
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Handover */}
            <section className="surface surface-pad mb-3">
              <div className="section-head">
                <h2 className="section-title">Handover details</h2>
                <p className="section-desc">Printed on the receipt so both sides agree on what was left.</p>
              </div>

              <div className="form-label mb-2" id="cf-accessories-label">
                Accessories received
                {form.accessories.length > 0 && <span className="optional">{form.accessories.length} selected</span>}
              </div>
              <div className="chip-group mb-4" role="group" aria-labelledby="cf-accessories-label">
                {ACCESSORIES.map((acc) => (
                  <button
                    key={acc}
                    type="button"
                    className="chip"
                    aria-pressed={form.accessories.includes(acc)}
                    onClick={() => toggleAccessory(acc)}
                  >
                    {acc}
                  </button>
                ))}
              </div>

              <div className="form-label mb-2" id="cf-warranty-label">Warranty status</div>
              <div className="chip-group mb-4" role="radiogroup" aria-labelledby="cf-warranty-label">
                {WARRANTY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    role="radio"
                    className="chip"
                    aria-checked={form.warranty === opt}
                    onClick={() => setForm((f) => ({ ...f, warranty: f.warranty === opt ? "" : opt }))}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <Form.Group controlId="cf-dispatch">
                <Form.Label>Dispatch method <span className="optional">optional</span></Form.Label>
                <Form.Control
                  placeholder="e.g. Courier, walk-in, hand delivery"
                  value={form.dispatch_through}
                  onChange={setField("dispatch_through")}
                />
              </Form.Group>
            </section>

            <div className="form-actions">
              <Button variant="secondary" onClick={() => navigate("/app/challans")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Saving…
                  </>
                ) : editMode ? (
                  "Update challan"
                ) : (
                  "Save challan"
                )}
              </Button>
            </div>
          </fieldset>
        </Form>

        <aside className="challan-form-preview">
          <div className="preview-sticky">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="page-eyebrow mb-0">Live preview</span>
              <span className="small text-faint">Updates as you type</span>
            </div>
            <ChallanPreview template={template} data={{ ...form, challan_no: editMode ? challan_no : "AUTO" }} />
          </div>
        </aside>
      </div>
    </div>
  );
}
