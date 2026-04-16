import { NavLink, Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const navItems = user ? [
    { name: "Dashboard", path: "/app", icon: "📊" },
    { name: "Rooms", path: "/rooms", icon: "🏠" },
    { name: "Food", path: "/food", icon: "🍔" },
    { name: "Bus", path: "/routes", icon: "🚌" },
    { name: "Inquiries", path: "/my-inquiries", icon: "📋" },
    { name: "Contact", path: "/contact", icon: "✉️" },
  ] : [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Contact", path: "/contact", icon: "✉️" },
  ];

  return (
    <header className="navbar-top">
      <div className="nav-inner">
        <Link to="/" className="navbar-brand" style={{ flex: 0.3 }}>
          🏠 StudentLiving
        </Link>

        <nav className="nav-pill-container" style={{ flex: 1, justifyContent: "center" }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `nav-pill-item ${isActive ? "active" : ""}`
                }
              >
                <span>{item.icon}</span>
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="pill-highlight"
                    className="nav-pill-highlight"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="action-group" style={{ flex: 0.3, justifyContent: "flex-end" }}>
          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) => 
                  `nav-pill-item ${isActive ? "active" : ""}`
                }
                style={{ background: "transparent", boxShadow: "none" }}
              >
                <span>👤</span> Profile
                {location.pathname === "/profile" && (
                  <motion.div
                    layoutId="pill-highlight"
                    className="nav-pill-highlight"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </NavLink>
              <button 
                onClick={logout} 
                className="secondary-button logout-btn-themed" 
                style={{ padding: "8px 16px", fontSize: "0.85rem", marginLeft: "10px" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-pill-item">
                <span>🔑</span> Login
              </NavLink>
              <Link to="/register" style={{ marginLeft: "12px" }}>
                <button className="primary-button" style={{ padding: "10px 24px", fontSize: "0.9rem" }}>
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
