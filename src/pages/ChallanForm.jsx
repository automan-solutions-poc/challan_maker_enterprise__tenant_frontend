import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Table, Spinner, Row, Col } from "react-bootstrap";
import { Trash, Plus } from "lucide-react";
import API from "../api";
import { useNavigate, useParams } from "react-router-dom";
import ChallanPreview from "../components/ChallanPreview";
import Loader from "../components/Loader";
import "./ChallanForm.css";

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
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false); // submission loading
  const [pageLoading, setPageLoading] = useState(true); // initial page loader
  const [template, setTemplate] = useState(null); // null ensures preview waits
  
  // ✅ Load design + challan (both must complete before rendering)
  useEffect(() => {
    const initializePage = async () => {
      try {
        setPageLoading(true);
        // Load tenant design first
        const designPromise = API.get("/design").then((res) => {
          if (res.data && res.data.design) {
            setTemplate(res.data.design);
            localStorage.setItem("tenant_design", JSON.stringify(res.data.design));
          } else {
            const cached = localStorage.getItem("tenant_design");
            if (cached) setTemplate(JSON.parse(cached));
          }
        }).catch(() => {
          const cached = localStorage.getItem("tenant_design");
          if (cached) setTemplate(JSON.parse(cached));
        });

        // If edit mode, load challan simultaneously
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
        console.error("❌ Initialization error:", err);
        setMsg("❌ Failed to load page data");
      } finally {
        setPageLoading(false);
      }
    };

    initializePage();
  }, [editMode, challan_no]);

  // ✅ Form logic
  const handleItemChange = (idx, key, value) => {
    const updatedItems = [...form.items];
    updatedItems[idx][key] = value;
    setForm({ ...form, items: updatedItems });
  };

  const addItem = () =>
    setForm({ ...form, items: [...form.items, { description: "", quantity: 1 }] });

  const toggleAccessory = (value) => {
    const accessories = form.accessories.includes(value)
      ? form.accessories.filter((a) => a !== value)
      : [...form.accessories, value];
    setForm({ ...form, accessories });
  };

  const handleFileChange = (e) => setImages(Array.from(e.target.files));
  const handleWarrantyChange = (value) => setForm({ ...form, warranty: value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const data = new FormData();
      data.append("data", JSON.stringify(form));
      images.forEach((f) => data.append("images", f));

      if (editMode && challan_no) {
        await API.put(`/challan/${challan_no}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("✅ Challan updated successfully");
      } else {
        await API.post("/challan", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("✅ Challan created successfully");
      }

      setTimeout(() => navigate("/app/challans"), 1200);
    } catch (err) {
      console.error("Error saving challan", err);
      setMsg("❌ Save failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Show loader until both template + data are ready
  if (pageLoading || !template) {
    return <Loader text={editMode ? "Loading challan..." : "Preparing form..."} fullscreen />;
  }

  return (
    <div className="container-fluid p-4 position-relative">
      {/* 🔄 Overlay loader for submission */}
      {loading && (
        <Loader
          text={editMode ? "Updating challan..." : "Creating challan..."}
          overlay
        />
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">{editMode ? "Edit Challan" : "Create New Challan"}</h3>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => navigate("/app/challans")} disabled={loading}>
            Cancel
          </Button>
          <Button className="btn-gradient" onClick={submit} disabled={loading}>
            {loading ? (
              <><Spinner animation="border" size="sm" className="me-2" /> Saving...</>
            ) : editMode ? (
              "Update Challan"
            ) : (
              "Save Challan"
            )}
          </Button>
        </div>
      </div>

      {msg && (
        <Alert variant={msg.includes("✅") ? "success" : "danger"} className="border-0 shadow-sm mb-4">
          {msg}
        </Alert>
      )}

      <div className="challan-form-container">
        {/* LEFT SIDE: FORM */}
        <div className="challan-form-main">
          <Form onSubmit={submit}>
            <div className="card p-4 mb-4 border-0 shadow-sm">
              <h5 className="mb-4 fw-bold text-primary">Customer Information</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-uppercase text-muted">Customer Name / M/s.</Form.Label>
                    <Form.Control
                      value={form.customer_name}
                      onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                      required
                      placeholder="Enter customer name"
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-uppercase text-muted">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="customer@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-uppercase text-muted">Contact Number</Form.Label>
                    <Form.Control
                      type="tel"
                      value={form.contact_number}
                      placeholder="e.g. 9876543210"
                      onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-uppercase text-muted">City</Form.Label>
                    <Form.Control
                      placeholder="Enter city"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className="card p-4 mb-4 border-0 shadow-sm">
              <h5 className="mb-4 fw-bold text-primary">Device Details</h5>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-uppercase text-muted">Serial Number / Asset Tag</Form.Label>
                <Form.Control
                  placeholder="e.g. SN-987654321"
                  value={form.serial_number}
                  onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <div className="table-responsive">
                <Table className="align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th className="small fw-bold text-uppercase text-muted" style={{ width: "60px" }}>#</th>
                      <th className="small fw-bold text-uppercase text-muted">Description / Component</th>
                      <th className="small fw-bold text-uppercase text-muted" style={{ width: "120px" }}>Qty</th>
                      <th style={{ width: "50px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="fw-bold text-muted">{idx + 1}</td>
                        <td>
                          <Form.Control
                            placeholder="e.g. Replacement Display"
                            value={item.description}
                            className="border-0 bg-light"
                            onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                            disabled={loading}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            min="1"
                            value={item.quantity}
                            className="border-0 bg-light"
                            onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                            disabled={loading}
                          />
                        </td>
                        <td>
                          {form.items.length > 1 && (
                            <Button
                              variant="link"
                              className="text-danger p-0"
                              onClick={() => {
                                const newItems = form.items.filter((_, i) => i !== idx);
                                setForm({ ...form, items: newItems });
                              }}
                            >
                              <Trash size={18} />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={addItem} disabled={loading}>
                <Plus size={16} className="me-2" /> Add Item
              </Button>

              <Form.Group className="mt-4">
                <Form.Label className="small fw-bold text-uppercase text-muted">Problem Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Detail the issue reported by the customer..."
                  value={form.problem}
                  className="bg-light"
                  onChange={(e) => setForm({ ...form, problem: e.target.value })}
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label className="small fw-bold text-uppercase text-muted">Product Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <Form.Text className="text-muted">You can select multiple images to document device condition.</Form.Text>
              </Form.Group>
            </div>

            <div className="card p-4 mb-4 border-0 shadow-sm">
              <h5 className="mb-4 fw-bold text-primary">Additional Options</h5>
              <Form.Label className="small fw-bold text-uppercase text-muted mb-3">Accessories Received</Form.Label>
              <div className="row g-3">
                {[
                  "Desktop", "Laptop", "SSD", "Adapter", "RAM", "Carry Case",
                  "HDD", "Damage", "Mother Board", "Printer", "CPU", "Toner",
                  "LCD / LED / IPS", "Head", "Keyboard or Mouse", "Speaker"
                ].map((acc) => (
                  <div key={acc} className="col-6 col-md-4 col-lg-3">
                    <Form.Check
                      id={`acc-${acc}`}
                      label={acc}
                      type="checkbox"
                      className="small"
                      checked={form.accessories.includes(acc)}
                      onChange={() => toggleAccessory(acc)}
                      disabled={loading}
                    />
                  </div>
                ))}
              </div>

              <Form.Group className="mt-4">
                <Form.Label className="small fw-bold text-uppercase text-muted mb-3">Warranty Status</Form.Label>
                <div className="d-flex flex-wrap gap-4">
                  {[
                    "Warranty", "No Warranty", "Chargeable", "Material Send to Customer"
                  ].map((opt) => (
                    <Form.Check
                      key={opt}
                      id={`war-${opt}`}
                      label={opt}
                      type="radio"
                      name="warranty"
                      className="small"
                      checked={form.warranty === opt}
                      onChange={() => handleWarrantyChange(opt)}
                      disabled={loading}
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mt-4">
                <Form.Label className="small fw-bold text-uppercase text-muted">Dispatch Method</Form.Label>
                <Form.Control
                  placeholder="e.g. Courier, Walk-in, Hand Delivery"
                  value={form.dispatch_through}
                  className="bg-light"
                  onChange={(e) => setForm({ ...form, dispatch_through: e.target.value })}
                  disabled={loading}
                />
              </Form.Group>
            </div>
          </Form>
        </div>

        {/* RIGHT SIDE: PREVIEW */}
        <div className="challan-form-preview">
          <div className="sticky-top" style={{ top: '2rem', zIndex: 1 }}>
            <h6 className="small fw-bold text-uppercase text-muted mb-3">Live Preview</h6>
            <ChallanPreview
              template={template}
              data={{ ...form, challan_no: editMode ? challan_no : "AUTO" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
