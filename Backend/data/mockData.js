const products = [
  { id: "P-1001", name: "Wireless Mouse", category: "Electronics", price: 25.99, stock: 142, status: "Active" },
  { id: "P-1002", name: "Mechanical Keyboard", category: "Electronics", price: 89.5, stock: 64, status: "Active" },
  { id: "P-1003", name: "27\" 4K Monitor", category: "Displays", price: 349.0, stock: 18, status: "Active" },
  { id: "P-1004", name: "USB-C Hub", category: "Accessories", price: 39.99, stock: 230, status: "Active" },
  { id: "P-1005", name: "Noise Cancelling Headphones", category: "Audio", price: 199.0, stock: 47, status: "Low" },
  { id: "P-1006", name: "Webcam 1080p", category: "Electronics", price: 59.99, stock: 0, status: "Out" },
  { id: "P-1007", name: "Standing Desk", category: "Furniture", price: 459.0, stock: 12, status: "Active" },
  { id: "P-1008", name: "Office Chair", category: "Furniture", price: 289.0, stock: 25, status: "Active" }
];

const inventory = [
  { sku: "SKU-A1001", product: "Wireless Mouse", warehouse: "Bangalore-01", qty: 142, reorder: 50, updated: "2026-05-18" },
  { sku: "SKU-A1002", product: "Mechanical Keyboard", warehouse: "Bangalore-01", qty: 64, reorder: 30, updated: "2026-05-19" },
  { sku: "SKU-A1003", product: "27\" 4K Monitor", warehouse: "Mumbai-02", qty: 18, reorder: 20, updated: "2026-05-20" },
  { sku: "SKU-A1004", product: "USB-C Hub", warehouse: "Bangalore-01", qty: 230, reorder: 80, updated: "2026-05-21" },
  { sku: "SKU-A1005", product: "Noise Cancelling Headphones", warehouse: "Delhi-03", qty: 47, reorder: 50, updated: "2026-05-21" },
  { sku: "SKU-A1006", product: "Webcam 1080p", warehouse: "Mumbai-02", qty: 0, reorder: 25, updated: "2026-05-15" },
  { sku: "SKU-A1007", product: "Standing Desk", warehouse: "Delhi-03", qty: 12, reorder: 10, updated: "2026-05-17" },
  { sku: "SKU-A1008", product: "Office Chair", warehouse: "Delhi-03", qty: 25, reorder: 15, updated: "2026-05-20" }
];

const invoices = [
  { id: "INV-2026-001", customer: "Acme Corp", date: "2026-05-02", amount: 1249.75, status: "Paid" },
  { id: "INV-2026-002", customer: "Globex Inc", date: "2026-05-04", amount: 3490.0, status: "Paid" },
  { id: "INV-2026-003", customer: "Initech", date: "2026-05-09", amount: 879.5, status: "Pending" },
  { id: "INV-2026-004", customer: "Umbrella Co", date: "2026-05-12", amount: 2199.0, status: "Overdue" },
  { id: "INV-2026-005", customer: "Stark Industries", date: "2026-05-15", amount: 5890.0, status: "Paid" },
  { id: "INV-2026-006", customer: "Wayne Enterprises", date: "2026-05-18", amount: 1450.5, status: "Pending" },
  { id: "INV-2026-007", customer: "Hooli", date: "2026-05-20", amount: 999.99, status: "Paid" }
];

const bills = [
  { id: "BILL-5001", vendor: "Office Supplies Co", date: "2026-05-01", amount: 320.5, status: "Paid" },
  { id: "BILL-5002", vendor: "Cloud Hosting Ltd", date: "2026-05-03", amount: 1200.0, status: "Paid" },
  { id: "BILL-5003", vendor: "Electricity Board", date: "2026-05-07", amount: 540.75, status: "Pending" },
  { id: "BILL-5004", vendor: "Internet Provider", date: "2026-05-10", amount: 199.0, status: "Paid" },
  { id: "BILL-5005", vendor: "Logistics Partner", date: "2026-05-14", amount: 870.0, status: "Overdue" },
  { id: "BILL-5006", vendor: "Marketing Agency", date: "2026-05-18", amount: 2500.0, status: "Pending" }
];

module.exports = { products, inventory, invoices, bills };
