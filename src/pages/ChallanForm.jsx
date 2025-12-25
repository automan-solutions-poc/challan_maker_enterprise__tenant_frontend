import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Table, Spinner } from "react-bootstrap";
import API from "../api";
import { useNavigate, useParams } from "react-router-dom";
import ChallanPreview from "../compopnents/ChallanPreview";
import Loader from "../compopnents/Loader";
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
    <div className="p-3 position-relative">
      {/* 🔄 Overlay loader for submission */}
      {loading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
          style={{ background: "rgba(255,255,255,0.7)", zIndex: 10 }}
        >
          <Spinner animation="border" variant="primary" />
          <div className="mt-2 text-muted fw-semibold">
            {editMode ? "Updating challan..." : "Creating challan..."}
          </div>
        </div>
      )}

      <h3>{editMode ? "Edit Challan" : "Create Challan"}</h3>
      {msg && <Alert variant={msg.includes("✅") ? "success" : "danger"}>{msg}</Alert>}

      <div className="challan-form-container">
        {/* LEFT SIDE: FORM */}
        <div className="challan-form-main">
          <Form onSubmit={submit}>
            <div className="card p-3 mb-3 shadow-sm">
              <Form.Group className="mb-2">
                <Form.Label>M/s. (Customer)</Form.Label>
                <Form.Control
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="example@mail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="number"
                  value={form.contact_number}
                  onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>City</Form.Label>
                <Form.Control
                  placeholder="Enter city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Serial Number</Form.Label>
                <Form.Control
                  placeholder="Enter Serial Number"
                  value={form.serial_number}
                  onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Table bordered size="sm" className="mt-3">
                <thead>
                  <tr>
                    <th style={{ width: "8%" }}>No.</th>
                    <th style={{ width: "70%" }}>Description</th>
                    <th style={{ width: "10%" }}>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {form.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <Form.Control
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                          disabled={loading}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                          disabled={loading}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Button variant="secondary" size="sm" onClick={addItem} disabled={loading}>
                + Add Row
              </Button>

              <Form.Group className="mt-3">
                <Form.Label>Problem</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Describe problem..."
                  value={form.problem}
                  onChange={(e) => setForm({ ...form, problem: e.target.value })}
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Upload Product Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                />
              </Form.Group>
            </div>

            <div className="card p-3 mb-3 shadow-sm">
              <Form.Label>Accessories</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {[
                  "Desktop",
                  "Laptop",
                  "SSD",
                  "Adapter",
                  "RAM",
                  "Carry Case",
                  "HDD",
                  "Damage",
                  "Mother Board",
                  "Printer",
                  "CPU",
                  "Toner",
                  "LCD / LED / IPS",
                  "Head",
                  "Keyboard or Mouse",
                  "Speaker"
                ].map((acc) => (
                  <Form.Check
                    key={acc}
                    inline
                    label={acc}
                    type="checkbox"
                    checked={form.accessories.includes(acc)}
                    onChange={() => toggleAccessory(acc)}
                    disabled={loading}
                  />
                ))}
              </div>

              <Form.Group className="mt-3">
                <Form.Label>Warranty</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {[
                    "Warranty",
                    "No Warranty",
                    "Chargeable",
                    "Material Send to Customer",
                  ].map((opt) => (
                    <Form.Check
                      key={opt}
                      inline
                      label={opt}
                      type="radio"
                      name="warranty"
                      checked={form.warranty === opt}
                      onChange={() => handleWarrantyChange(opt)}
                      disabled={loading}
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Material Dispatch Through</Form.Label>
                <Form.Control
                  placeholder="Courier / Person"
                  value={form.dispatch_through}
                  onChange={(e) => setForm({ ...form, dispatch_through: e.target.value })}
                  disabled={loading}
                />
              </Form.Group>

              <div className="mt-3 text-end">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />{" "}
                      {editMode ? "Updating..." : "Creating..."}
                    </>
                  ) : editMode ? (
                    "Update Challan"
                  ) : (
                    "Create Challan"
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </div>

        {/* RIGHT SIDE: PREVIEW */}
        <div className="challan-form-preview">
          <div className="mt-4">
            <h5>Live Preview</h5>
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
