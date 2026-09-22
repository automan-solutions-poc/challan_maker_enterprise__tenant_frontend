import React, { useEffect, useState } from "react";

export default function ChallanPreview({ template = {}, data = {} }) {
  
  const theme = template.theme_color || "#114e9e";
  const font = template.font_family || "Arial, sans-serif";
  const accessories =
    Array.isArray(data.accessories) && data.accessories.length
      ? data.accessories.join(", ")
      : "—";
  const items = Array.isArray(data.items) ? data.items : [];

  // 🧠 Logged-in user info (tenant)
  const [loggedInUser, setLoggedInUser] = useState("");
  ;
  if(template.terms_conditions){
  var terms_conditions_string=template.terms_conditions.split("<br/>");
  } else {
    terms_conditions_string=[];
  }
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("tenant_user") || "{}");
    if (userData?.name || userData?.full_name) {
      setLoggedInUser(userData.name || userData.full_name);
    }
  }, []);

  return (
    <div
      className="challan-preview p-4"
      style={{
        border: "1px solid #ddd",
        maxWidth: 780,
        fontFamily: font,
        fontSize: 14,
        borderRadius: 8,
        background: "#fff",
        color: "#333", // Ensure text is dark on white background
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <div style={{ borderTop: `6px solid ${theme}`, paddingTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {template.logo_url && (
              <img
                src={template.logo_url}
                alt="Company Logo"
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "contain",
                  borderRadius: 8,
                  border: "1px solid #eee",
                  backgroundColor: "#fff",
                }}
              />
            )}
            <div>
              <h4 style={{ margin: 0, color: theme }}>
                {template.company_name || "Company Name"}
              </h4>
              {template.tagline && (
                <div style={{ color: "#555", fontSize: 13 }}>
                  {template.tagline}
                </div>
              )}
              {template.company_address && (
                <div style={{ color: "#666", fontSize: 12 }}>
                  {template.company_address}
                </div>
              )}
              {template.company_phone && (
                <div style={{ color: "#666", fontSize: 12 }}>
                  📞 {template.company_phone}
                </div>
              )}
              {template.company_email && (
                <div style={{ color: "#666", fontSize: 12 }}>
                  ✉️ {template.company_email}
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: "right", color: "#333" }}>
            <div>
              <strong>Challan No:</strong> {data.challan_no || "CH-XXXXX"}
            </div>
            <div>
              <strong>Date:</strong>{" "}
              {data.created_at
                ? new Date(data.created_at).toLocaleString()
                : new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <hr style={{ margin: "12px 0", borderColor: "#eee" }} />

      {/* Customer Info */}
      <div style={{ color: "#333" }}>
        <div>
          <strong style={{ color: "#555" }}>Customer:</strong> {data.customer_name || "John Doe"}
        </div>
        <div>
          <strong style={{ color: "#555" }}>Email:</strong> {data.email || "example@email.com"}
        </div>
        <div>
          <strong style={{ color: "#555" }}>Contact:</strong> {data.contact_number || "9999999999"}
        </div>
        <div>
          <strong style={{ color: "#555" }}>City:</strong> {data.city || "Nashik"}
        </div>
        <div>
          <strong style={{ color: "#555" }}>Serial Number:</strong> {data.serial_number || "SN-12345"}
        </div>
      </div>

      {/* Item Details */}
      {items.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h6 style={{ color: theme, fontWeight: "600" }}>Item Details</h6>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 4,
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8f9fa",
                  textAlign: "left",
                  borderBottom: "2px solid #eee",
                  color: "#555"
                }}
              >
                <th style={{ padding: 6 }}>#</th>
                <th style={{ padding: 6 }}>Description</th>
                <th style={{ padding: 6, width: "80px" }}>Qty</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: "1px solid #eee",
                    fontSize: 13,
                    color: "#333"
                  }}
                >
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
        <h6 style={{ color: theme, fontWeight: "600" }}>Additional Info</h6>
        <div>
          <strong style={{ color: "#555" }}>Accessories:</strong> {accessories}
        </div>
        <div>
          <strong style={{ color: "#555" }}>Warranty:</strong> {data.warranty || "—"}
        </div>
        <div>
          <strong style={{ color: "#555" }}>Dispatch Through:</strong> {data.dispatch_through || "—"}
        </div>
      </div>

      {/* Employee (Challan Given By) */}
      <div style={{ marginTop: 16 }}>
        <strong style={{ color: "#555" }}>Challan Given By:</strong>
        <input
          type="text"
          value={loggedInUser || "Unknown"}
          disabled
          style={{
            marginLeft: 10,
            border: "1px solid #ddd",
            borderRadius: 4,
            padding: "4px 8px",
            fontSize: 13,
            color: "#333",
            backgroundColor: "#f9f9f9",
            width: "auto",
          }}
        />
      </div>

      {/* Problem */}
      <div style={{ marginTop: 16 }}>
        <strong style={{ color: "#555" }}>Problem:</strong>
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 4,
            padding: "6px 8px",
            background: "#fafafa",
            marginTop: 4,
            color: "#333"
          }}
        >
          {data.problem || "Describe problem here..."}
        </div>
      </div>
      <div
        style={{
          marginTop: 20,
          textAlign: "left",
          color: "#777",
          fontSize: 13,
        }}
      >
        {terms_conditions_string.map((term, index) => (
          <p key={index} style={{ marginBottom: '4px' }}>{term}</p>
        ))}
      </div>
      {/* Footer */}
      <div
        style={{
          marginTop: 20,
          textAlign: "center",
          color: "#777",
          fontSize: 13,
        }}
      >
        {template.footer_note || "Thank you for choosing us!"}
      </div>
    </div>
  );
}
