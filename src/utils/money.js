// Money helpers for challan pricing. Amounts are rupees, 2 decimal places.

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

export const formatMoney = (value) => inr.format(Number(value) || 0);

export const toNumber = (value) => {
  const n = parseFloat(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const round2 = (n) => Math.round(n * 100) / 100;

export const lineAmount = (item) =>
  item && item.rate !== "" && item.rate != null ? round2(toNumber(item.rate) * (toNumber(item.quantity) || 1)) : 0;

export const itemsTotal = (items = []) => round2(items.reduce((sum, it) => sum + lineAmount(it), 0));

export const paymentStatus = (total, paid) => {
  const t = toNumber(total);
  const p = toNumber(paid);
  if (t <= 0) return p > 0 ? "paid" : "none";
  if (p <= 0) return "unpaid";
  if (p >= t) return "paid";
  return "partial";
};

export const PAYMENT_MODES = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
];

export const PAYMENT_LABELS = {
  paid: "Paid",
  partial: "Part paid",
  unpaid: "Unpaid",
  none: "No charge",
};
