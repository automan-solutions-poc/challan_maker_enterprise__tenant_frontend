import React from "react";
import { PAYMENT_LABELS } from "../utils/money";

const TONES = { paid: "is-success", partial: "is-warning", unpaid: "is-danger", none: "" };

export default function PaymentBadge({ status }) {
  const key = PAYMENT_LABELS[status] ? status : "none";
  return <span className={`status-pill ${TONES[key]}`}>{PAYMENT_LABELS[key]}</span>;
}
