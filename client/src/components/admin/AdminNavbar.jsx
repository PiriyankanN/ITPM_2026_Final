import { NavLink, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminNavbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <header className="navbar-top" style={{ borderBottom: "4px solid var(--primary)", background: "rgba(15, 23, 42, 0.95)" }}>
      <div className="nav-inner">
        <Link to="/admin" className="navbar-brand" style={{ color: "white" }}>
          🛡️ Admin Hub
        </Link>

        <nav className="nav-links">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} style={{ color: "#cbd5e1" }}>
            <span>📊</span> Dashboard
          </NavLink>
          <NavLink to="/admin/rooms" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} style={{ color: "#cbd5e1" }}>
            <span>🏠</span> Rooms
          </NavLink>
          <NavLink to="/admin/food" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} style={{ color: "#cbd5e1" }}>
            <span>🍔</span> Food
          </NavLink>
          <NavLink to="/admin/routes" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} style={{ color: "#cbd5e1" }}>
            <span>🚌</span> Bus
          </NavLink>
          <NavLink to="/admin/inquiries" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} style={{ color: "#cbd5e1" }}>
            <span>📋</span> Inquiries
          </NavLink>
        </nav>

        <div className="action-group">
          <button onClick={logout} className="secondary-button logout-btn-themed" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
