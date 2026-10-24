import React from "react";

export default function StatusBadge({ status }) {
  const delivered = String(status || "").toLowerCase() === "delivered";
  return (
    <span className={`status-pill ${delivered ? "is-delivered" : "is-pending"}`}>
      {delivered ? "Delivered" : "Pending"}
    </span>
  );
}
