import React from "react";
import { getStoredUser } from "../utils/session";

// Paper-style approximation of the generated PDF. Always light: it represents a printed document.
export default function ChallanPreview({ template = {}, data = {} }) {
  const theme = template.theme_color || "#114e9e";
  const font = template.font_family || "Arial, sans-serif";
  const accessories =
    Array.isArray(data.accessories) && data.accessories.length
      ? data.accessories.join(", ")
      : "—";
  const items = Array.isArray(data.items) ? data.items : [];
  const terms = template.terms_conditions ? template.terms_conditions.split("<br/>").filter(Boolean) : [];
  const user = getStoredUser();
  const givenBy = user?.name || user?.full_name || "—";

  const label = { color: "#6b7280", fontWeight: 600 };
  const sectionTitle = { color: theme, fontWeight: 600, fontSize: 13, letterSpacing: "0.02em", margin: "0 0 6px" };

  return (
    <div className="challan-preview" style={{ fontFamily: font, fontSize: 13.5, lineHeight: 1.55 }}>
      {/* Header */}
      <div style={{ borderTop: `6px solid ${theme}`, paddingTop: 14, margin: "-1.75rem -1.75rem 0", padding: "14px 1.75rem 0", borderRadius: "12px 12px 0 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            {template.logo_url && (
              <img
                src={template.logo_url}
                alt="Company logo"
                style={{
                  width: 56,
                  height: 56,
                  objectFit: "contain",
                  borderRadius: 8,
                  border: "1px solid #eee",
                  backgroundColor: "#fff",
                  flexShrink: 0,
                }}
              />
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ margin: 0, color: theme, fontSize: 18, fontWeight: 700, lineHeight: 1.25 }}>
                {template.company_name || "Company Name"}
              </div>
              {template.tagline && <div style={{ color: "#555", fontSize: 12.5 }}>{template.tagline}</div>}
              {template.company_address && <div style={{ color: "#666", fontSize: 12 }}>{template.company_address}</div>}
              {(template.company_phone || template.company_email) && (
                <div style={{ color: "#666", fontSize: 12 }}>
                  {[template.company_phone, template.company_email].filter(Boolean).join(" · ")}
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: "right", color: "#333", fontSize: 12.5, flexShrink: 0 }}>
            <div>
              <span style={label}>Challan No:</span> {data.challan_no || "CH-XXXXX"}
            </div>
            <div>
              <span style={label}>Date:</span>{" "}
              {data.created_at ? new Date(data.created_at).toLocaleString() : new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <hr style={{ margin: "14px 0", border: 0, borderTop: "1px solid #eee", opacity: 1 }} />

      {/* Customer Info */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2px 16px", color: "#333" }}>
        <div><span style={label}>Customer:</span> {data.customer_name || "John Doe"}</div>
        <div><span style={label}>Email:</span> {data.email || "example@email.com"}</div>
        <div><span style={label}>Contact:</span> {data.contact_number || "9999999999"}</div>
        <div><span style={label}>City:</span> {data.city || "Nashik"}</div>
        <div><span style={label}>Serial Number:</span> {data.serial_number || "SN-12345"}</div>
      </div>

      {/* Item Details */}
      {items.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={sectionTitle}>Item Details</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f9fa", textAlign: "left", borderBottom: "2px solid #eee", color: "#555" }}>
                <th style={{ padding: 6, width: 36 }}>#</th>
                <th style={{ padding: 6 }}>Description</th>
                <th style={{ padding: 6, width: 64 }}>Qty</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #eee", color: "#333" }}>
                  <td style={{ padding: 6 }}>{idx + 1}</td>
                  <td style={{ padding: 6 }}>{item.description || "—"}</td>
                  <td style={{ padding: 6 }}>{item.quantity || 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Accessories & Warranty */}
      <div style={{ marginTop: 16, color: "#333" }}>
        <div style={sectionTitle}>Additional Info</div>
        {template.show_accessories !== false && (
          <div><span style={label}>Accessories:</span> {accessories}</div>
        )}
        <div><span style={label}>Warranty:</span> {data.warranty || "—"}</div>
        <div><span style={label}>Dispatch Through:</span> {data.dispatch_through || "—"}</div>
        <div><span style={label}>Challan Given By:</span> {givenBy}</div>
      </div>

      {/* Problem */}
      <div style={{ marginTop: 16 }}>
        <span style={label}>Problem:</span>
        <div style={{ border: "1px solid #eee", borderRadius: 6, padding: "6px 10px", background: "#fafafa", marginTop: 4, color: "#333", whiteSpace: "pre-wrap" }}>
          {data.problem || "Describe problem here..."}
        </div>
      </div>

      {terms.length > 0 && (
        <div style={{ marginTop: 18, color: "#777", fontSize: 12 }}>
          {terms.map((term, index) => (
            <p key={index} style={{ margin: "0 0 4px" }}>{term}</p>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 18, paddingTop: 12, borderTop: "1px dashed #e5e3de", textAlign: "center", color: "#777", fontSize: 12.5 }}>
        {template.footer_note || "Thank you for choosing us!"}
      </div>
    </div>
  );
}
