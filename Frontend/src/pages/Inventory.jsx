import PageHeader from "../components/PageHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import useFetch from "../hooks/useFetch.js";

export default function Inventory() {
  const { data, loading, error } = useFetch("/api/inventory");

  if (loading) return <div className="loader">Loading inventory...</div>;
  if (error) return <div className="alert error">{error}</div>;

  const columns = [
    { key: "sku", label: "SKU", render: (r) => <span className="mono">{r.sku}</span> },
    { key: "product", label: "Product" },
    { key: "warehouse", label: "Warehouse" },
    { key: "qty", label: "On Hand" },
    { key: "reorder", label: "Reorder Lvl" },
    {
      key: "health",
      label: "Stock Health",
      render: (r) => {
        const pct = r.reorder === 0 ? 100 : Math.min(100, Math.round((r.qty / (r.reorder * 2)) * 100));
        const tone = r.qty === 0 ? "danger" : r.qty <= r.reorder ? "warn" : "ok";
        return (
          <div className="bar">
            <div className={`bar-fill bar-${tone}`} style={{ width: `${pct}%` }} />
          </div>
        );
      }
    },
    { key: "updated", label: "Updated" }
  ];

  return (
    <>
      <PageHeader title="Inventory" subtitle="Stock levels across warehouses" />
      <DataTable columns={columns} rows={data} searchKeys={["sku", "product", "warehouse"]} />
    </>
  );
}
