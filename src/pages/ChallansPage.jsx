// src/pages/ChallansPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import API, { getApiOrigin } from "../api";
import { Table, Button, Spinner, Alert, Modal, Image, Form, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  QrCode,
  Pencil,
  Mail,
  Send,
  ShieldCheck,
  Trash2,
  Plus,
  Search,
  X,
  MoreHorizontal,
  Printer,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Info,
  SearchX,
} from "lucide-react";
import Loader from "../components/Loader";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useConfirm } from "../components/ConfirmDialog";
import "./ChallansPage.css";
import { trackEvent, Events } from "../analytics";
import { resolveTrustedAssetUrl } from "../utils/safeUrl";
import { getStoredUser } from "../utils/session";

const PAGE_SIZE = 25;
const EMPTY_FILTERS = { search: "", fromDate: "", toDate: "", status: "all" };
const NOTICE_ICONS = { success: CheckCircle2, danger: AlertCircle, warning: AlertTriangle, info: Info };

// Server dates arrive as "dd/mm/yyyy, hh:mm:ss"
const parseChallanDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    const [datePart] = dateStr.split(",");
    const [day, month, year] = datePart.split("/").map((v) => parseInt(v, 10));
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day);
  } catch {
    return null;
  }
};

const formatChallanDate = (dateStr) => {
  const d = parseChallanDate(dateStr);
  if (!d) return { day: dateStr || "—", time: "" };
  const time = (dateStr.split(",")[1] || "").trim().slice(0, 5);
  return { day: d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }), time };
};

const RowActionsToggle = React.forwardRef(({ onClick, className = "", ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    {...props}
    className={`${className} no-caret btn btn-ghost btn-icon btn-sm`}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <MoreHorizontal size={18} />
  </button>
));

export default function ChallansPage() {
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [notice, setNotice] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [selectedSet, setSelectedSet] = useState(() => new Set());
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [usage, setUsage] = useState(null);

  const [confirm, confirmDialog] = useConfirm();
  const navigate = useNavigate();
  const base_url_for_img = getApiOrigin();
  const headerCheckRef = useRef(null);

  const role = (() => {
    const u = getStoredUser();
    if (!u) return null;
    return u.role || u.user_type || u.type || (u.is_admin ? "tenant_admin" : "tenant_staff");
  })();
  // Both admins and staff may bulk delete
  const canBulkDelete = role === "tenant_admin" || role === "tenant_staff";

  const notify = (variant, text) => setNotice({ variant, text });

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => {
        if (res.data?.usage) setUsage(res.data.usage);
      })
      .catch(() => {});
  }, []);

  const fetchChallans = async () => {
    try {
      setProcessing(true);
      const res = await API.get("/challans");

      // Guard against tunnels (e.g. ngrok) answering with an HTML interstitial
      if (!res.headers["content-type"] || !res.headers["content-type"].includes("application/json")) {
        console.error("Non-JSON response received:", res.data);
        notify("danger", "The server returned an unexpected response. Please refresh and try again.");
        setChallans([]);
        return;
      }

      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.challans)
        ? res.data.challans
        : [];
      setChallans(list);
    } catch (err) {
      console.error("fetch challans error:", err);
      notify("danger", "Failed to fetch challans.");
      setChallans([]);
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchChallans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------
  // Filtering (live)
  // -----------------------
  const statusCounts = useMemo(() => {
    const counts = { all: challans.length, pending: 0, delivered: 0 };
    challans.forEach((c) => {
      if ((c.status || "").toLowerCase() === "delivered") counts.delivered += 1;
      else counts.pending += 1;
    });
    return counts;
  }, [challans]);

  const filteredChallans = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    const fromDate = filters.fromDate ? new Date(`${filters.fromDate}T00:00:00`) : null;
    const toDate = filters.toDate ? new Date(`${filters.toDate}T23:59:59.999`) : null;

    return challans.filter((c) => {
      const status = (c.status || "pending").toLowerCase();
      if (filters.status !== "all" && status !== filters.status) return false;

      if (fromDate || toDate) {
        const d = parseChallanDate(c.date);
        if (!d) return false;
        if (fromDate && d < fromDate) return false;
        if (toDate && d > toDate) return false;
      }

      if (term) {
        const haystack = [c.challan_no, c.customer_name, c.serial_number, c.problem, c.email, c.contact_number, c.city]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [challans, filters]);

  const filtersActive =
    filters.search.trim() !== "" || filters.fromDate !== "" || filters.toDate !== "" || filters.status !== "all";

  const pageCount = Math.max(1, Math.ceil(filteredChallans.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filteredChallans.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Any filter change starts over on page 1 with nothing selected
  useEffect(() => {
    setPage(1);
    setSelectedSet(new Set());
  }, [filters]);

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const resetFilters = () => setFilters(EMPTY_FILTERS);

  // -----------------------
  // Selection (current page)
  // -----------------------
  const pageSelectedCount = pageRows.filter((c) => selectedSet.has(c.challan_no)).length;
  const allOnPageSelected = pageRows.length > 0 && pageSelectedCount === pageRows.length;

  useEffect(() => {
    if (headerCheckRef.current) {
      headerCheckRef.current.indeterminate = pageSelectedCount > 0 && !allOnPageSelected;
    }
  }, [pageSelectedCount, allOnPageSelected]);

  const toggleRowSelect = (challan_no) => {
    setSelectedSet((prev) => {
      const next = new Set(prev);
      if (next.has(challan_no)) next.delete(challan_no);
      else next.add(challan_no);
      return next;
    });
  };

  const toggleSelectPage = () => {
    setSelectedSet((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) pageRows.forEach((c) => next.delete(c.challan_no));
      else pageRows.forEach((c) => next.add(c.challan_no));
      return next;
    });
  };

  // -----------------------
  // Bulk delete
  // -----------------------
  const handleBulkDelete = async () => {
    if (!canBulkDelete) {
      notify("danger", "You don't have permission to perform bulk delete.");
      return;
    }
    const items = Array.from(selectedSet);
    if (!items.length) {
      notify("warning", "No challans selected for deletion.");
      return;
    }
    const ok = await confirm({
      title: `Delete ${items.length} challan${items.length > 1 ? "s" : ""}?`,
      body: "This permanently removes the selected challans and their PDFs. This action cannot be undone.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;

    setProcessing(true);
    setNotice(null);
    try {
      const results = await Promise.allSettled(items.map((no) => API.delete(`/challan/${no}`)));
      const failed = results.reduce((acc, r, idx) => {
        if (r.status === "rejected" || (r.status === "fulfilled" && r.value?.data?.error)) acc.push(items[idx]);
        return acc;
      }, []);

      if (failed.length === 0) {
        notify("success", `Deleted ${items.length} challan${items.length > 1 ? "s" : ""}.`);
        trackEvent(Events.CHALLAN_BULK_DELETED, { count: items.length });
      } else {
        notify("warning", `Deleted ${items.length - failed.length} challan(s). Failed: ${failed.join(", ")}`);
      }
      setSelectedSet(new Set());
      await fetchChallans();
    } catch (err) {
      console.error("bulk delete error", err);
      notify("danger", "Bulk delete failed.");
    } finally {
      setProcessing(false);
    }
  };

  // -----------------------
  // Single-item actions
  // -----------------------
  const handleDelete = async (challan_no) => {
    const ok = await confirm({
      title: `Delete ${challan_no}?`,
      body: "The challan and its PDF will be removed permanently.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setProcessing(true);
    try {
      await API.delete(`/challan/${challan_no}`);
      trackEvent(Events.CHALLAN_DELETED, { challan_no });
      notify("success", `Challan ${challan_no} deleted.`);
      setSelectedSet((prev) => {
        const next = new Set(prev);
        next.delete(challan_no);
        return next;
      });
      fetchChallans();
    } catch (err) {
      console.error(err);
      notify("danger", "Failed to delete challan.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadPDF = (pdfUrl, challanNo) => {
    if (!pdfUrl) return notify("warning", "The PDF isn't available yet.");
    trackEvent(Events.CHALLAN_PDF_DOWNLOADED, { challan_no: challanNo });
    const fullUrl = resolveTrustedAssetUrl(pdfUrl, base_url_for_img);
    if (!fullUrl) return notify("danger", "Invalid or untrusted PDF URL.");
    window.open(fullUrl, "_blank", "noopener,noreferrer");
    return undefined;
  };

  const handleRequestDeliveredPDF = async (challan, { email = false } = {}) => {
    if (email) {
      const ok = await confirm({
        title: "Email the delivered PDF?",
        body: `A delivered copy of ${challan.challan_no} will be sent to ${challan.email || "the customer"}.`,
        confirmLabel: "Send email",
      });
      if (!ok) return;
    }
    setProcessing(true);
    try {
      const res = await API.post(`/challan/${challan.challan_no}/delivered_pdf`, { email });
      const pdfUrl = res.data?.pdf_url;
      if (email) {
        if (res.data?.emailed) notify("success", "Delivered PDF emailed.");
        else notify("warning", "Delivered PDF is ready, but this challan has no customer email.");
      } else {
        notify("success", "Delivered PDF is ready.");
      }
      fetchChallans();
      if (!email && pdfUrl) handleDownloadPDF(pdfUrl, challan.challan_no);
    } catch (err) {
      console.error(err);
      notify("danger", err.response?.data?.error || "Could not create the delivered PDF.");
    } finally {
      setProcessing(false);
    }
  };

  const openPdf = (c) =>
    c.status === "delivered" ? handleRequestDeliveredPDF(c) : handleDownloadPDF(c.pdf_url, c.challan_no);

  const handleViewQR = (qrUrl, challanNo) => {
    if (!qrUrl) return notify("warning", "The QR code isn't available for this challan.");
    trackEvent(Events.CHALLAN_QR_VIEWED, { challan_no: challanNo });
    const fullUrl = resolveTrustedAssetUrl(qrUrl, base_url_for_img);
    if (!fullUrl) return notify("danger", "Invalid or untrusted QR URL.");
    setQrLoading(true);
    setQrPreview({ url: fullUrl, challanNo });
    return undefined;
  };

  const handleSendOTP = async (challan, { skipConfirm = false } = {}) => {
    if (!skipConfirm) {
      const ok = await confirm({
        title: "Send pickup code?",
        body: `A one-time code will be emailed to ${challan.email || "the customer"} for ${challan.challan_no}.`,
        confirmLabel: "Send code",
      });
      if (!ok) return;
    }
    setProcessing(true);
    try {
      const res = await API.post(`/challan/${challan.challan_no}/send_otp`);
      trackEvent(Events.CHALLAN_OTP_SENT, { challan_no: challan.challan_no });
      notify("success", res.data?.message || "OTP sent to the customer.");
    } catch (err) {
      console.error(err);
      notify("danger", err.response?.data?.error || "Failed to send OTP.");
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenVerifyOTP = (challan) => {
    setSelectedChallan(challan);
    setOtpValue("");
    setOtpError("");
    setOtpModal(true);
  };

  const handleVerifyOTP = async (e) => {
    e?.preventDefault();
    if (otpValue.length !== 6) {
      setOtpError("Enter the 6-digit code the customer received.");
      return;
    }
    setVerifying(true);
    setOtpError("");
    try {
      const res = await API.post(`/challan/${selectedChallan.challan_no}/verify_otp`, { otp: otpValue });
      trackEvent(Events.CHALLAN_OTP_VERIFIED, { challan_no: selectedChallan.challan_no });
      trackEvent(Events.CHALLAN_DELIVERED, { challan_no: selectedChallan.challan_no });
      notify("success", res.data?.message || `${selectedChallan.challan_no} marked as delivered.`);
      setOtpModal(false);
      fetchChallans();
    } catch (err) {
      console.error(err);
      setOtpError(err.response?.data?.error || "Invalid or expired OTP.");
    } finally {
      setVerifying(false);
    }
  };

  const closeQr = () => {
    setQrPreview(null);
    setQrLoading(false);
  };

  // Opens a window with only the QR image and triggers print
  const printQR = () => {
    if (!qrPreview) return;
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        notify("warning", "Popup blocked. Allow popups for this site to print.");
        return;
      }
      const doc = printWindow.document;
      doc.open();
      doc.write("<!DOCTYPE html><html><head><title>Print QR</title></head><body></body></html>");
      doc.close();
      const style = doc.createElement("style");
      style.textContent =
        "body,html{margin:0;padding:0;display:flex;align-items:center;justify-content:center;height:100%;} img{max-width:90%;max-height:90vh;}";
      doc.head.appendChild(style);
      const img = doc.createElement("img");
      img.src = qrPreview.url;
      img.onload = () => setTimeout(() => printWindow.print(), 200);
      doc.body.appendChild(img);
    } catch (err) {
      console.error("Print QR failed:", err);
      notify("danger", "Unable to print the QR code.");
    }
  };

  const renderRowMenu = (c, scope) => {
    const delivered = c.status === "delivered";
    return (
      <Dropdown align="end">
        <Dropdown.Toggle as={RowActionsToggle} id={`actions-${scope}-${c.challan_no}`} aria-label={`Actions for ${c.challan_no}`} />
        <Dropdown.Menu popperConfig={{ strategy: "fixed" }} renderOnMount={false} style={{ minWidth: 210 }}>
          <Dropdown.Item onClick={() => openPdf(c)}>
            <FileText size={15} /> {delivered ? "Delivered PDF" : "View PDF"}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleViewQR(c.qr_code_url, c.challan_no)}>
            <QrCode size={15} /> View QR code
          </Dropdown.Item>
          {!delivered && (
            <>
              <Dropdown.Item onClick={() => navigate(`/app/challan/${c.challan_no}/edit`)}>
                <Pencil size={15} /> Edit challan
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => handleSendOTP(c)}>
                <Send size={15} /> Send pickup code
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleOpenVerifyOTP(c)}>
                <ShieldCheck size={15} /> Verify and deliver
              </Dropdown.Item>
            </>
          )}
          {delivered && (
            <Dropdown.Item onClick={() => handleRequestDeliveredPDF(c, { email: true })}>
              <Mail size={15} /> Email delivered PDF
            </Dropdown.Item>
          )}
          <Dropdown.Divider />
          <Dropdown.Item className="is-danger" onClick={() => handleDelete(c.challan_no)}>
            <Trash2 size={15} /> Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  if (loading) {
    return <Loader text="Loading challans…" fullscreen />;
  }

  const hasLimit = usage && usage.limit != null && usage.limit !== -1;
  const nearLimit = hasLimit && usage.used >= usage.limit * 0.8;
  const NoticeIcon = notice ? NOTICE_ICONS[notice.variant] || Info : null;
  const firstRow = filteredChallans.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const lastRow = Math.min(currentPage * PAGE_SIZE, filteredChallans.length);

  return (
    <div className="page position-relative">
      {processing && <Loader text="Working on it…" overlay />}

      <PageHeader
        title="Challans"
        subtitle="Search, track and hand over every job at the counter."
        actions={
          <Button onClick={() => navigate("/app/challan/new")}>
            <Plus size={16} /> New challan
          </Button>
        }
      />

      {notice && (
        <Alert variant={notice.variant} dismissible onClose={() => setNotice(null)}>
          <NoticeIcon size={16} className="flex-shrink-0 mt-1" /> <span>{notice.text}</span>
        </Alert>
      )}

      {nearLimit && (
        <Alert variant={usage.used >= usage.limit ? "danger" : "warning"}>
          <AlertTriangle size={16} className="flex-shrink-0 mt-1" />
          <span>
            {usage.used >= usage.limit
              ? `You've used all ${usage.limit} PDFs for this month. New challans can't generate PDFs until the quota resets.`
              : `${usage.used} of ${usage.limit} PDFs used this month — ${Math.max(usage.limit - usage.used, 0)} left.`}
          </span>
        </Alert>
      )}

      <div className="surface">
        {/* Toolbar */}
        <div className="challans-toolbar">
          <div className="input-with-icon has-action challans-search">
            <Search size={16} className="input-icon" />
            <Form.Control
              type="search"
              placeholder="Search by challan no, customer, serial…"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              aria-label="Search challans"
            />
            {filters.search && (
              <button type="button" className="input-action" onClick={() => updateFilter("search", "")} aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </div>

          <div className="segmented" role="group" aria-label="Filter by status">
            {["all", "pending", "delivered"].map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={filters.status === key}
                onClick={() => updateFilter("status", key)}
              >
                <span className="text-capitalize">{key}</span>
                <span className="segmented-count">{statusCounts[key]}</span>
              </button>
            ))}
          </div>

          <div className="challans-dates">
            <Form.Control
              type="date"
              size="sm"
              value={filters.fromDate}
              max={filters.toDate || undefined}
              onChange={(e) => updateFilter("fromDate", e.target.value)}
              aria-label="From date"
            />
            <span className="text-faint small">to</span>
            <Form.Control
              type="date"
              size="sm"
              value={filters.toDate}
              min={filters.fromDate || undefined}
              onChange={(e) => updateFilter("toDate", e.target.value)}
              aria-label="To date"
            />
          </div>

          {filtersActive && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <X size={14} /> Clear
            </Button>
          )}
        </div>

        {/* Bulk bar */}
        {canBulkDelete && selectedSet.size > 0 && (
          <div className="bulk-bar">
            <span>
              <strong>{selectedSet.size}</strong> selected
            </span>
            <div className="d-flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedSet(new Set())}>
                Clear selection
              </Button>
              <Button variant="outline-danger" size="sm" onClick={handleBulkDelete} disabled={processing}>
                <Trash2 size={14} /> Delete selected
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        {challans.length === 0 ? (
          <div className="empty-state">
            <div className="icon-tile mx-auto">
              <FileText size={24} />
            </div>
            <h3>No challans yet</h3>
            <p>Create a challan when a device comes in. The PDF, QR code and customer email are generated for you.</p>
            <Button onClick={() => navigate("/app/challan/new")}>
              <Plus size={16} /> New challan
            </Button>
          </div>
        ) : filteredChallans.length === 0 ? (
          <div className="empty-state">
            <div className="icon-tile mx-auto">
              <SearchX size={24} />
            </div>
            <h3>No matching challans</h3>
            <p>Try a different search term or widen the date range.</p>
            <Button variant="secondary" onClick={resetFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <ul className="challan-cards d-md-none">
              {pageRows.map((c, i) => {
                const checked = selectedSet.has(c.challan_no);
                const date = formatChallanDate(c.date);
                return (
                  <li key={c.challan_no || i} className={`challan-card ${checked ? "is-selected" : ""}`}>
                    <div className="challan-card-top">
                      <Form.Check
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRowSelect(c.challan_no)}
                        aria-label={`Select ${c.challan_no}`}
                      />
                      <button type="button" className="challan-link" onClick={() => openPdf(c)}>
                        {c.challan_no}
                      </button>
                      <StatusBadge status={c.status} />
                      <div className="ms-auto">{renderRowMenu(c, "m")}</div>
                    </div>
                    <div className="cell-primary">{c.customer_name || "—"}</div>
                    <div className="cell-sub">
                      {[c.serial_number, date.day].filter(Boolean).join(" · ")}
                    </div>
                    {c.problem && <div className="challan-card-problem">{c.problem}</div>}
                    {c.status !== "delivered" && (
                      <Button variant="secondary" size="sm" className="w-100 mt-3" onClick={() => handleOpenVerifyOTP(c)}>
                        <ShieldCheck size={14} /> Verify handover
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="data-table-wrap d-none d-md-block">
              <Table hover className="data-table challans-table">
                <thead>
                  <tr>
                    <th className="col-check">
                      <Form.Check
                        type="checkbox"
                        ref={headerCheckRef}
                        checked={allOnPageSelected}
                        onChange={toggleSelectPage}
                        aria-label="Select all on this page"
                      />
                    </th>
                    <th>Challan</th>
                    <th>Customer</th>
                    <th>Device</th>
                    <th>Problem</th>
                    <th>Status</th>
                    <th className="text-end">
                      <span className="visually-hidden">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((c, i) => {
                    const checked = selectedSet.has(c.challan_no);
                    const delivered = c.status === "delivered";
                    const date = formatChallanDate(c.date);
                    return (
                      <tr key={c.challan_no || i} className={checked ? "is-selected" : ""}>
                        <td className="col-check">
                          <Form.Check
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleRowSelect(c.challan_no)}
                            aria-label={`Select ${c.challan_no}`}
                          />
                        </td>
                        <td>
                          <button type="button" className="challan-link" onClick={() => openPdf(c)} title="Open PDF">
                            {c.challan_no}
                          </button>
                          <div className="cell-sub">
                            {date.day}
                            {date.time && ` · ${date.time}`}
                          </div>
                        </td>
                        <td>
                          <div className="cell-primary">{c.customer_name || "—"}</div>
                          {(c.contact_number || c.city) && (
                            <div className="cell-sub">{[c.contact_number, c.city].filter(Boolean).join(" · ")}</div>
                          )}
                        </td>
                        <td className="text-nowrap">{c.serial_number || "—"}</td>
                        <td>
                          <div className="cell-problem" title={c.problem || ""}>
                            {c.problem || <span className="text-faint">—</span>}
                          </div>
                        </td>
                        <td>
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="text-end">
                          <div className="d-inline-flex align-items-center gap-1">
                            {!delivered && (
                              <Button
                                variant="secondary"
                                size="sm"
                                className="d-none d-xl-inline-flex"
                                onClick={() => handleOpenVerifyOTP(c)}
                              >
                                <ShieldCheck size={14} /> Handover
                              </Button>
                            )}
                            {renderRowMenu(c, "t")}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>

            <div className="table-footer">
              <span className="text-muted small tabular-nums">
                {firstRow}–{lastRow} of {filteredChallans.length}
                {filtersActive && challans.length !== filteredChallans.length && ` (filtered from ${challans.length})`}
              </span>
              {pageCount > 1 && (
                <div className="d-flex align-items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="btn-icon"
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="small tabular-nums px-1">
                    {currentPage} / {pageCount}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="btn-icon"
                    disabled={currentPage === pageCount}
                    onClick={() => setPage(currentPage + 1)}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* QR Modal */}
      <Modal show={!!qrPreview} onHide={closeQr} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title>QR code{qrPreview?.challanNo ? ` · ${qrPreview.challanNo}` : ""}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center position-relative" style={{ minHeight: 240 }}>
          {qrLoading && (
            <div className="position-absolute top-50 start-50 translate-middle">
              <span className="app-spinner d-inline-block" aria-hidden="true" />
            </div>
          )}
          {qrPreview && (
            <div className="qr-frame" style={{ visibility: qrLoading ? "hidden" : "visible" }}>
              <Image
                src={qrPreview.url}
                alt={`QR code for ${qrPreview.challanNo}`}
                fluid
                onLoad={() => setQrLoading(false)}
                onError={() => {
                  setQrLoading(false);
                  notify("danger", "The QR image could not be loaded.");
                  setQrPreview(null);
                }}
              />
            </div>
          )}
          <p className="small text-muted mt-3 mb-0">Customers scan this to see the job status.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeQr}>
            Close
          </Button>
          <Button onClick={printQR} disabled={qrLoading || !qrPreview}>
            <Printer size={15} /> Print
          </Button>
        </Modal.Footer>
      </Modal>

      {/* OTP Modal */}
      <Modal show={otpModal} onHide={() => setOtpModal(false)} centered>
        <Form onSubmit={handleVerifyOTP}>
          <Modal.Header closeButton>
            <Modal.Title>Verify handover</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedChallan && (
              <div className="usage-card d-flex justify-content-between align-items-center gap-3 mb-4">
                <div className="min-w-0">
                  <div className="cell-primary" style={{ color: "var(--text-main)", fontWeight: 600 }}>
                    {selectedChallan.challan_no} · {selectedChallan.customer_name}
                  </div>
                  <div className="small text-muted text-truncate">{selectedChallan.email || "No email on file"}</div>
                </div>
                <StatusBadge status={selectedChallan.status} />
              </div>
            )}
            <Form.Group controlId="otp-code">
              <Form.Label>Code from the customer&apos;s email</Form.Label>
              <Form.Control
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otpValue}
                onChange={(e) => {
                  setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setOtpError("");
                }}
                placeholder="••••••"
                maxLength={6}
                className="otp-input"
                isInvalid={!!otpError}
                autoFocus
              />
              <Form.Control.Feedback type="invalid">{otpError}</Form.Control.Feedback>
            </Form.Group>
            <Button
              variant="link"
              size="sm"
              className="px-0 mt-2"
              onClick={() => selectedChallan && handleSendOTP(selectedChallan, { skipConfirm: true })}
              disabled={processing}
            >
              <Send size={13} /> Send a new code
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setOtpModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={verifying || otpValue.length !== 6}>
              {verifying ? (
                <>
                  <Spinner animation="border" size="sm" /> Verifying…
                </>
              ) : (
                <>
                  <ShieldCheck size={15} /> Verify and deliver
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {confirmDialog}
    </div>
  );
}
