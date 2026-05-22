import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const NAV = [
  { to: "/", label: "Overview", icon: "🏠", end: true },
  { to: "/products", label: "Products", icon: "📦" },
  { to: "/inventory", label: "Inventory", icon: "🗃️" },
  { to: "/invoices", label: "Invoices", icon: "🧾" },
  { to: "/bills", label: "Bills", icon: "💳" }
];

export default function DashboardLayout() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="login-logo small">AD</div>
          <div>
            <div className="brand-title">Admin</div>
            <div className="muted xs">Testing Console</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="avatar">{(auth?.user?.email || "?").slice(0, 1).toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{auth?.user?.name || "Admin"}</div>
              <div className="muted xs">{auth?.user?.email}</div>
            </div>
          </div>
          <button className="ghost-btn block" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
