import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminSidebar = () => {
  const { logout } = useContext(AuthContext);

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: "📊", end: true },
    { name: "Rooms", path: "/admin/rooms", icon: "🏠", end: false },
    { name: "Food", path: "/admin/food", icon: "🍔", end: false },
    { name: "Bus Routes", path: "/admin/routes", icon: "🚌", end: false },
    { name: "Inquiries", path: "/admin/inquiries", icon: "📋", end: false },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <span>🛡️</span> <span>Admin Hub</span>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => 
              `sidebar-item-pill ${isActive ? "active" : ""}`
            }
          >
            <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button 
          onClick={logout} 
          className="sidebar-item-pill" 
          style={{ 
            width: "100%", 
            background: "rgba(239, 68, 68, 0.1)", 
            color: "#ef4444",
            border: "none",
            cursor: "pointer",
            textAlign: "left"
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
