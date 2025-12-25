// src/pages/ChallansPage.jsx
import React, { useEffect, useState } from "react";
import API from "../api";
import {
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Image,
  Form,
  Badge,
  Dropdown,
  ButtonGroup,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FileEarmarkPdf,
  QrCode,
  PencilSquare,
  Envelope,
  Trash,
  Send,
  ShieldLock,
  Gear,
} from "react-bootstrap-icons";
import "./ChallansPage.css";

export default function ChallansPage() {
  const [challans, setChallans] = useState([]);
  const [filteredChallans, setFilteredChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [msg, setMsg] = useState("");
  const [qrPreview, setQrPreview] = useState(null);
  const [otpModal, setOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // Bulk selection state
  const [selectedSet, setSelectedSet] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: "all",
  });

  const navigate = useNavigate();
  const base_url_for_img = "http://api.automan.solutions";
  // const base_url_for_img = "http://192.168.1.12:6001";

  // Determine user role robustly from localStorage
  const getUserRole = () => {
    try {
      const u = JSON.parse(localStorage.getItem("tenant_user") || "null");
      if (!u) return null;
      // common possible fields used by your app
      return u.role || u.user_type || u.type || (u.is_admin ? "tenant_admin" : "tenant_staff");
    } catch {
      return null;
    }
  };

  const role = getUserRole();

  // Permission helpers (you told me tenant_admin + tenant_staff can bulk delete)
  const canBulkDelete = () => {
    // both admin & staff allowed by your choice B
    return role === "tenant_admin" || role === "tenant_staff";
  };

  // 🧠 Fetch all challans
  // const fetchChallans = async () => {
  //   try {
  //     setProcessing(true);
  //     const res = await API.get("/challans");
  //     setChallans(res.data);
  //     setFilteredChallans(res.data);
  //     // reset selections on fresh load
  //     setSelectedSet(new Set());
  //     setSelectAll(false);
  //   } catch (err) {
  //     console.error("fetch challans", err);
  //     setMsg("Failed to fetch challans");
  //   } finally {
  //     setLoading(false);
  //     setProcessing(false);
  //   }
  // };
const fetchChallans = async () => {
  try {
    setProcessing(true);

    const res = await API.get("/challans");

    // 🚨 NGROK SAFETY CHECK
    if (
      !res.headers["content-type"] ||
      !res.headers["content-type"].includes("application/json")
    ) {
      console.error("Non-JSON response received:", res.data);
      setMsg("❌ Server returned invalid response (ngrok warning)");
      setChallans([]);
      setFilteredChallans([]);
      return;
    }

    const list = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.challans)
      ? res.data.challans
      : [];

    setChallans(list);
    setFilteredChallans(list);
  } catch (err) {
    console.error("fetch challans error:", err);
    setMsg("❌ Failed to fetch challans");
    setChallans([]);
    setFilteredChallans([]);
  } finally {
    setLoading(false);
    setProcessing(false);
  }
};

  useEffect(() => {
    fetchChallans();
    // eslint-disable-next-line
  }, []);

  // -----------------------
  // Selection handlers
  // -----------------------
  const toggleRowSelect = (challan_no) => {
    const s = new Set(selectedSet);
    if (s.has(challan_no)) s.delete(challan_no);
    else s.add(challan_no);
    setSelectedSet(s);
    setSelectAll(false);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      // clear
      setSelectedSet(new Set());
      setSelectAll(false);
    } else {
      // select all currently filtered challans
      const all = new Set(filteredChallans.map((c) => c.challan_no));
      setSelectedSet(all);
      setSelectAll(true);
    }
  };

  // -----------------------
  // Bulk delete
  // -----------------------
  const handleBulkDelete = async () => {
    if (!canBulkDelete()) {
      return setMsg("❌ You don't have permission to perform bulk delete.");
    }
    const items = Array.from(selectedSet);
    if (!items.length) {
      return setMsg("⚠️ No challans selected for deletion.");
    }
    // if (!window.confirm(`Delete ${items.length} challan(s)? This action cannot be undone.`)) return;

    setProcessing(true);
    setMsg("");
    try {
      // perform deletes in parallel but handle failures individually
      const results = await Promise.allSettled(
        items.map((no) => API.delete(`/challan/${no}`))
      );

      const failed = results.reduce((acc, r, idx) => {
        if (r.status === "rejected" || (r.status === "fulfilled" && r.value?.data?.error)) {
          acc.push(items[idx]);
        }
        return acc;
      }, []);

      if (failed.length === 0) {
        setMsg(`✅ Deleted ${items.length} challan(s) successfully.`);
      } else {
        setMsg(`⚠️ Deleted ${items.length - failed.length} challan(s). Failed: ${failed.join(", ")}`);
      }

      // refresh
      await fetchChallans();
    } catch (err) {
      console.error("bulk delete error", err);
      setMsg("❌ Bulk delete failed.");
    } finally {
      setProcessing(false);
      setConfirmBulkDelete(false);
    }
  };

  // -----------------------
  // Filters
  // -----------------------
  const applyFilters = () => {
    let filtered = [...challans];

    const parseCustomDate = (dateStr) => {
      if (!dateStr) return null;
      try {
        const [datePart] = dateStr.split(",");
        const [day, month, year] = datePart.split("/").map((v) => parseInt(v, 10));
        return new Date(year, month - 1, day);
      } catch {
        return null;
      }
    };

    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(new Date(filters.toDate).setHours(23, 59, 59, 999)) : null;

    filtered = filtered.filter((c) => {
      const challanDate = parseCustomDate(c.date);
      if (!challanDate) return false;

      const dateMatch = (!fromDate || challanDate >= fromDate) && (!toDate || challanDate <= toDate);
      const statusMatch = filters.status === "all" || (c.status && c.status.toLowerCase() === filters.status);

      return dateMatch && statusMatch;
    });

    setFilteredChallans(filtered);
    // reset selections when filters applied
    setSelectedSet(new Set());
    setSelectAll(false);
  };

  const resetFilters = () => {
    setFilters({ fromDate: "", toDate: "", status: "all" });
    setFilteredChallans(challans);
    setSelectedSet(new Set());
    setSelectAll(false);
  };

  // -----------------------
  // Single-item actions (delete/send OTP/etc)
  // -----------------------
  const handleDelete = async (challan_no) => {
    if (!window.confirm("Delete this challan?")) return;
    setProcessing(true);
    try {
      await API.delete(`/challan/${challan_no}`);
      setMsg("🗑️ Challan deleted successfully");
      fetchChallans();
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to delete challan");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadPDF = (pdfUrl) => {
    if (!pdfUrl) return alert("PDF not available yet.");
    const fullUrl = pdfUrl.startsWith("http") ? pdfUrl : `${base_url_for_img}${pdfUrl}`;
    window.open(fullUrl, "_blank");
  };

  const handleViewQR = (qrUrl) => {
    if (!qrUrl) return alert("QR code not available.");
    const fullUrl = qrUrl.startsWith("http") ? qrUrl : `${base_url_for_img}${qrUrl}`;
    setQrPreview(fullUrl);
  };

  const handleSendOTP = async (challan_no) => {
    if (!window.confirm("Send OTP to customer’s email?")) return;
    setProcessing(true);
    try {
      const res = await API.post(`/challan/${challan_no}/send_otp`);
      setMsg(`✅ ${res.data.message}`);
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to send OTP");
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenVerifyOTP = (challan) => {
    setSelectedChallan(challan);
    setOtpValue("");
    setOtpModal(true);
  };

  const handleVerifyOTP = async () => {
    if (!otpValue.trim()) return alert("Please enter OTP");
    setVerifying(true);
    try {
      const res = await API.post(`/challan/${selectedChallan.challan_no}/verify_otp`, { otp: otpValue });
      setMsg(`✅ ${res.data.message}`);
      setOtpModal(false);
      fetchChallans();
    } catch (err) {
      console.error(err);
      setMsg("❌ Invalid or expired OTP");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendPDF = async (challan_no) => {
    if (!window.confirm("Resend challan PDF to customer’s email?")) return;
    setProcessing(true);
    try {
      await API.put(`/challan/${challan_no}`);
      setMsg("✅ PDF resent successfully!");
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to resend PDF");
    } finally {
      setProcessing(false);
    }
  };

  // 🖨️ Print QR helper — opens a new window with only the image and triggers print
  const printQR = () => {
    if (!qrPreview) return;
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Popup blocked. Allow popups for this site to print.");
        return;
      }
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR</title>
            <style>
              body, html { margin:0; padding:0; display:flex; align-items:center; justify-content:center; height:100%; }
              img { max-width: 90%; max-height: 90vh; }
            </style>
          </head>
          <body>
            <img src="${qrPreview}" onload="setTimeout(() => { window.print(); }, 200);" />
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error("Print QR failed:", err);
      alert("Unable to print QR. See console for details.");
    }
  };

  // 🌀 Loader
  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
        <Spinner animation="border" variant="primary" />
        <div className="mt-2 text-muted fw-semibold">Loading challans...</div>
      </div>
    );
  }

  return (
    <div className="position-relative">
      {/* Overlay loader for actions */}
      {processing && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-light bg-opacity-75"
          style={{ zIndex: 10 }}
        >
          <Spinner animation="border" variant="primary" />
          <div className="mt-2 text-muted fw-semibold">Processing, please wait...</div>
        </div>
      )}

      <h3>🧾 Challans</h3>
      {msg && <Alert variant={msg.startsWith("✅") ? "success" : "danger"}>{msg}</Alert>}

      {/* Filter Card */}
      <Card className="p-3 mb-3 shadow-sm challans-filter-card">
        <Row className="align-items-end">
          <Col md={3}>
            <Form.Group>
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                value={filters.fromDate}
                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                value={filters.toDate}
                onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3} className="text-end">
            <Button variant="primary" className="me-2" onClick={applyFilters}>
              Apply
            </Button>
            <Button variant="secondary" onClick={resetFilters}>
              Reset
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Top bar with Create & Bulk actions */}
      <div className="d-flex justify-content-between align-items-center mb-3 challans-actions-bar">
        <div>
          <Button onClick={() => navigate("/app/challan/new")} variant="primary" className="me-2">
            + Create Challan
          </Button>

          {/* Bulk delete UI */}
          {canBulkDelete() && (
            <>
              <Button
                variant="danger"
                disabled={selectedSet.size === 0 || processing}
                onClick={() => setConfirmBulkDelete(true)}
              >
                🗑️ Delete Selected ({selectedSet.size})
              </Button>
            </>
          )}
        </div>

        <div className="text-muted">{filteredChallans.length} challan(s)</div>
      </div>

      {/* Challans Table */}
      <div className="challans-table-responsive">
        <Table striped bordered hover className="mt-3 align-middle">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
              <Form.Check
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
                aria-label="Select all"
              />
            </th>
            <th>#</th>
            <th>Challan No</th>
            <th>Customer</th>
            <th>Serial No</th>
            <th>Problem</th>
            <th>Status</th>
            <th>Date</th>
            <th style={{ minWidth: 140 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredChallans.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center text-muted">
                No challans found for the selected filters.
              </td>
            </tr>
          ) : (
            filteredChallans.map((c, i) => {
              const checked = selectedSet.has(c.challan_no);
              return (
                <tr key={c.challan_no || i}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleRowSelect(c.challan_no)}
                    />
                  </td>
                  <td>{i + 1}</td>
                  <td onClick={() => handleDownloadPDF(c.pdf_url)} style={{ cursor: "pointer" }}>
                    {c.challan_no}
                  </td>
                  <td>{c.customer_name}</td>
                  <td>{c.serial_number}</td>
                  <td>{c.problem}</td>
                  <td>
                    {c.status === "delivered" ? (
                      <Badge bg="success">Delivered</Badge>
                    ) : (
                      <Badge bg="warning" text="dark">
                        Pending
                      </Badge>
                    )}
                  </td>
                  <td>{c.date}</td>
                  <td className="text-center">
                    <Dropdown as={ButtonGroup} align="end" autoClose="outside">
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        size="sm"
                        id={`dropdown-${c.challan_no}`}
                      >
                        <Gear size={16} className="me-1" />
                        Actions
                      </Dropdown.Toggle>

                      <Dropdown.Menu
                        container={document.body} // crucial fix for alignment/popover
                        popperConfig={{ strategy: "fixed" }}
                        style={{ minWidth: "180px", zIndex: 1050 }}
                      >
                        <Dropdown.Item onClick={() => handleDownloadPDF(c.pdf_url)}>
                          <FileEarmarkPdf className="me-2 text-danger" />
                          View PDF
                        </Dropdown.Item>

                        <Dropdown.Item onClick={() => handleViewQR(c.qr_code_url)}>
                          <QrCode className="me-2 text-primary" />
                          View QR
                        </Dropdown.Item>

                        {c.status !== "delivered" && (
                          <>
                            <Dropdown.Item onClick={() => navigate(`/app/challan/${c.challan_no}/edit`)}>
                              <PencilSquare className="me-2 text-info" />
                              Edit Challan
                            </Dropdown.Item>

                            <Dropdown.Item onClick={() => handleSendOTP(c.challan_no)}>
                              <Send className="me-2 text-warning" />
                              Send OTP
                            </Dropdown.Item>

                            <Dropdown.Item onClick={() => handleOpenVerifyOTP(c)}>
                              <ShieldLock className="me-2 text-success" />
                              Verify OTP
                            </Dropdown.Item>
                          </>
                        )}

                        {c.status === "delivered" && (
                          <Dropdown.Item onClick={() => handleResendPDF(c.challan_no)}>
                            <Envelope className="me-2 text-primary" />
                            Resend PDF
                          </Dropdown.Item>
                        )}

                        <Dropdown.Divider />

                        <Dropdown.Item className="text-danger" onClick={() => handleDelete(c.challan_no)}>
                          <Trash className="me-2" />
                          Delete Challan
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        </Table>
      </div>

      {/* QR Modal */}
      <Modal show={!!qrPreview} onHide={() => setQrPreview(null)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title>QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image src={qrPreview} alt="Challan QR Code" fluid style={{ maxWidth: 250 }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setQrPreview(null)}>
            Close
          </Button>
          <Button variant="primary" onClick={printQR} disabled={!qrPreview}>
            🖨️ Print QR
          </Button>
        </Modal.Footer>
      </Modal>

      {/* OTP Modal */}
      <Modal show={otpModal} onHide={() => setOtpModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🔐 Verify OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Enter OTP sent to customer email</Form.Label>
            <Form.Control
              type="text"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              placeholder="6-digit code"
              maxLength={6}
            />
          </Form.Group>
          <div className="text-end">
            <Button variant="primary" onClick={handleVerifyOTP} disabled={verifying}>
              {verifying ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Verifying...
                </>
              ) : (
                "✅ Verify & Deliver"
              )}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Confirm Bulk Delete Modal */}
      <Modal show={confirmBulkDelete} onHide={() => setConfirmBulkDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Bulk Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedSet.size}</strong> challan(s)? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmBulkDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleBulkDelete} disabled={processing}>
            {processing ? <Spinner animation="border" size="sm" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
