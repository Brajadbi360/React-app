import PageHeader from "../components/PageHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import StatusPill from "../components/StatusPill.jsx";
import useFetch from "../hooks/useFetch.js";

function money(n) {
  return n?.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function Bills() {
  const { data, loading, error } = useFetch("/api/bills");

  if (loading) return <div className="loader">Loading bills...</div>;
  if (error) return <div className="alert error">{error}</div>;

  const columns = [
    { key: "id", label: "Bill #", render: (r) => <span className="mono">{r.id}</span> },
    { key: "vendor", label: "Vendor" },
    { key: "date", label: "Date" },
    { key: "amount", label: "Amount", render: (r) => money(r.amount) },
    { key: "status", label: "Status", render: (r) => <StatusPill value={r.status} /> }
  ];

  return (
    <>
      <PageHeader title="Bills" subtitle="Vendor and operating expenses" />
      <DataTable columns={columns} rows={data} searchKeys={["id", "vendor", "status"]} />
    </>
  );
}
