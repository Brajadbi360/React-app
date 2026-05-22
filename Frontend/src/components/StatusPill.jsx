const TONE = {
  Active: "ok",
  Paid: "ok",
  Pending: "warn",
  Low: "warn",
  Overdue: "danger",
  Out: "danger"
};

export default function StatusPill({ value }) {
  const tone = TONE[value] || "muted";
  return <span className={`pill pill-${tone}`}>{value}</span>;
}
