require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const { products, inventory, invoices, bills } = require("./data/mockData");
const { authRequired } = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return res.json({
    token,
    user: { email, role: "admin", name: "Administrator" }
  });
});

app.get("/api/me", authRequired, (req, res) => {
  res.json({ user: req.user });
});

app.get("/api/products", authRequired, (_req, res) => res.json(products));
app.get("/api/inventory", authRequired, (_req, res) => res.json(inventory));
app.get("/api/invoices", authRequired, (_req, res) => res.json(invoices));
app.get("/api/bills", authRequired, (_req, res) => res.json(bills));

app.get("/api/summary", authRequired, (_req, res) => {
  const totalRevenue = invoices.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = bills.reduce((sum, b) => sum + b.amount, 0);
  const lowStock = inventory.filter((i) => i.qty <= i.reorder).length;
  res.json({
    products: products.length,
    inventoryItems: inventory.length,
    invoices: invoices.length,
    bills: bills.length,
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalExpenses: Number(totalExpenses.toFixed(2)),
    netProfit: Number((totalRevenue - totalExpenses).toFixed(2)),
    lowStock
  });
});

app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

app.listen(PORT, () => {
  console.log(`API ready on http://localhost:${PORT}`);
});
