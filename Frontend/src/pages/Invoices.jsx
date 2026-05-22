import PageHeader from "../components/PageHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import StatusPill from "../components/StatusPill.jsx";
import useFetch from "../hooks/useFetch.js";

function money(n) {
  return n?.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function Invoices() {
  const { data, loading, error } = useFetch("/api/invoices");

  if (loading) return <div className="loader">Loading invoices...</div>;
  if (error) return <div className="alert error">{error}</div>;

  const columns = [
    { key: "id", label: "Invoice #", render: (r) => <span className="mono">{r.id}</span> },
    { key: "customer", label: "Customer" },
    { key: "date", label: "Date" },
    { key: "amount", label: "Amount", render: (r) => money(r.amount) },
    { key: "status", label: "Status", render: (r) => <StatusPill value={r.status} /> }
  ];

  return (
    <>
      <PageHeader title="Invoices" subtitle="Customer billing records" />
      <DataTable columns={columns} rows={data} searchKeys={["id", "customer", "status"]} />
    </>
  );
}
