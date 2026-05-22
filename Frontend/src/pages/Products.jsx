import PageHeader from "../components/PageHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import StatusPill from "../components/StatusPill.jsx";
import useFetch from "../hooks/useFetch.js";

function money(n) {
  return n?.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function Products() {
  const { data, loading, error } = useFetch("/api/products");

  if (loading) return <div className="loader">Loading products...</div>;
  if (error) return <div className="alert error">{error}</div>;

  const columns = [
    { key: "id", label: "ID", render: (r) => <span className="mono">{r.id}</span> },
    { key: "name", label: "Product" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price", render: (r) => money(r.price) },
    { key: "stock", label: "Stock" },
    { key: "status", label: "Status", render: (r) => <StatusPill value={r.status} /> }
  ];

  return (
    <>
      <PageHeader title="Products" subtitle="All catalog items" />
      <DataTable columns={columns} rows={data} searchKeys={["id", "name", "category"]} />
    </>
  );
}
