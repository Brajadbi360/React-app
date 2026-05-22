import PageHeader from "../components/PageHeader.jsx";
import useFetch from "../hooks/useFetch.js";

function StatCard({ label, value, hint, tone }) {
  return (
    <div className={`stat-card stat-${tone || "default"}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {hint && <div className="stat-hint muted xs">{hint}</div>}
    </div>
  );
}

function formatMoney(n) {
  return n?.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function Overview() {
  const { data, loading, error } = useFetch("/api/summary");
  const { data: invoices } = useFetch("/api/invoices");

  if (loading) return <div className="loader">Loading overview...</div>;
  if (error) return <div className="alert error">{error}</div>;

  const recent = (invoices || []).slice(-5).reverse();

  return (
    <>
      <PageHeader title="Overview" subtitle="Live snapshot of operations" />

      <div className="stat-grid">
        <StatCard label="Products" value={data.products} hint="Catalog SKUs" tone="primary" />
        <StatCard label="Inventory Items" value={data.inventoryItems} hint={`${data.lowStock} below reorder`} tone="info" />
        <StatCard label="Revenue" value={formatMoney(data.totalRevenue)} hint={`${data.invoices} invoices`} tone="ok" />
        <StatCard label="Expenses" value={formatMoney(data.totalExpenses)} hint={`${data.bills} bills`} tone="warn" />
        <StatCard label="Net Profit" value={formatMoney(data.netProfit)} hint="Revenue − Expenses" tone={data.netProfit >= 0 ? "ok" : "danger"} />
      </div>

      <div className="card">
        <div className="card-head">
          <h2>Recent Invoices</h2>
          <span className="muted xs">Last 5</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id}>
                  <td className="mono">{r.id}</td>
                  <td>{r.customer}</td>
                  <td>{r.date}</td>
                  <td>{formatMoney(r.amount)}</td>
                  <td><span className={`pill pill-${r.status === "Paid" ? "ok" : r.status === "Pending" ? "warn" : "danger"}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
