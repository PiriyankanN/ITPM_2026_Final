import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";

function AdminDashboardPage() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/stats", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          setError(data.message || "Failed to load dashboard metrics.");
        }
      } catch (err) {
        setError("Network error: Could not reach management server.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) return (
    <div style={{ padding: "100px 0", textAlign: "center" }}>
      <div className="loading-spinner" style={{ margin: "0 auto" }}></div>
      <p className="text-muted mt-4">Initializing Control Center...</p>
    </div>
  );

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      style={{ padding: "0" }}
    >
      {/* 1. Header Section */}
      <motion.div 
        variants={itemVariants}
        style={{ 
          background: "linear-gradient(135deg, #1e293b, #334155)", 
          padding: "40px", 
          borderRadius: "24px", 
          color: "white",
          marginBottom: "40px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", marginBottom: "12px", letterSpacing: "-1px", color: "white" }}>Control Center Dashboard</h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.9, maxWidth: "600px" }}>
            Welcome back, <span style={{ color: "#4ade80", fontWeight: "800" }}>{user?.name}</span>. Here's a brief overview of your campus operations and recent student engagements.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div style={{ position: "absolute", right: "-50px", top: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}></div>
        <div style={{ position: "absolute", left: "-30px", bottom: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(74, 222, 128, 0.1)" }}></div>
      </motion.div>

      {/* 2. Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", marginBottom: "48px" }}>
        {[
          { label: "Total Rooms", count: stats?.counts?.rooms || 0, icon: "🏠", color: "#3b82f6" },
          { label: "Food Services", count: stats?.counts?.food || 0, icon: "🍕", color: "#10b981" },
          { label: "Bus Routes", count: stats?.counts?.routes || 0, icon: "🚌", color: "#f59e0b" },
          { label: "Pending Issues", count: stats?.counts?.pendingInquiries || 0, icon: "🔔", color: "#ef4444" },
          { label: "Total Users", count: stats?.counts?.users || 0, icon: "👥", color: "#8b5cf6" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            className="card shadow-sm"
            style={{ 
              padding: "24px", 
              borderRadius: "20px", 
              border: "1px solid #f1f5f9", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              textAlign: "center",
              gap: "12px"
            }}
            whileHover={{ y: -5, boxShadow: "0 12px 20px rgba(0,0,0,0.05)" }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "4px" }}>{stat.icon}</div>
            <h2 style={{ fontSize: "2rem", fontWeight: "900", color: "#1e293b", margin: 0 }}>{stat.count}</h2>
            <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "40px" }}>
        {/* 3. Recent Activity Section */}
        <div>
          <motion.div variants={itemVariants} className="mb-8">
            <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5rem" }}>🕒</span> Recent System Activity
            </h3>
            
            <div className="card shadow-sm" style={{ padding: "0", borderRadius: "20px", overflow: "hidden", border: "1px solid #f1f5f9" }}>
              {stats?.recentActivity?.inquiries?.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {stats.recentActivity.inquiries.map((inq, idx) => (
                    <div key={inq._id} style={{ 
                      padding: "20px 24px", 
                      borderBottom: idx === stats.recentActivity.inquiries.length - 1 ? "none" : "1px solid #f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px"
                    }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>📩</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: "700", color: "#1e293b" }}>{inq.subject}</p>
                        <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#94a3b8" }}>
                          Submitted by <strong>{inq.user?.name}</strong> • Reference: {inq.referenceNumber}
                        </p>
                      </div>
                      <Link to={`/admin/inquiries/${inq._id}`}>
                        <button style={{ padding: "6px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "white", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer" }}>Review</button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "40px", textAlign: "center" }}>
                   <p className="text-muted">No recent inquiries to display.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* 4. Inquiry Status Analysis */}
          <motion.div variants={itemVariants}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5rem" }}>📊</span> Inquiry Resolution Status
            </h3>
            
            <div className="card shadow-sm" style={{ padding: "32px", borderRadius: "24px", border: "1px solid #f1f5f9" }}>
              {[
                { label: "Pending Review", count: stats?.inquiryBreakdown?.pending || 0, color: "#f59e0b" },
                { label: "Actively Investigating", count: stats?.inquiryBreakdown?.inReview || 0, color: "#3b82f6" },
                { label: "Resolved / Closed", count: stats?.inquiryBreakdown?.resolved || 0, color: "#10b981" },
                { label: "Rejected / Spam", count: stats?.inquiryBreakdown?.rejected || 0, color: "#ef4444" }
              ].map((item, i) => {
                const percentage = stats?.counts?.inquiries > 0 ? (item.count / stats.counts.inquiries) * 100 : 0;
                return (
                  <div key={i} style={{ marginBottom: i === 3 ? 0 : "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "#475569" }}>{item.label}</span>
                      <span style={{ fontSize: "0.9rem", fontWeight: "800", color: "#1e293b" }}>{item.count}</span>
                    </div>
                    <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        style={{ height: "100%", background: item.color, borderRadius: "10px" }}
                      ></motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar: Quick Actions & Navigation */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <motion.div variants={itemVariants}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b", marginBottom: "20px" }}>Quick Actions</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { label: "New Room", route: "/admin/rooms/add", icon: "➕🏠" },
                { label: "New Food", route: "/admin/food/add", icon: "➕🍕" },
                { label: "New Route", route: "/admin/routes/add", icon: "➕🚌" },
                { label: "Inquiries", route: "/admin/inquiries", icon: "📫" }
              ].map((act, i) => (
                <Link key={i} to={act.route} style={{ textDecoration: "none" }}>
                  <button style={{ 
                    width: "100%", 
                    padding: "20px 12px", 
                    borderRadius: "16px", 
                    border: "1px solid #e2e8f0", 
                    background: "white", 
                    fontWeight: "800", 
                    color: "#1e293b",
                    fontSize: "0.85rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }} className="hover-lift">
                    <span style={{ fontSize: "1.2rem" }}>{act.icon}</span>
                    {act.label}
                  </button>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b", marginBottom: "20px" }}>Core Modules</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { title: "Residential Management", route: "/admin/rooms", count: stats?.counts?.rooms || 0, meta: "Allocations" },
                { title: "Dining & Food Services", route: "/admin/food", count: stats?.counts?.food || 0, meta: "Meal Plans" },
                { title: "Transport Network", route: "/admin/routes", count: stats?.counts?.routes || 0, meta: "Routes" },
                { title: "Inquiry Support Desk", route: "/admin/inquiries", count: stats?.counts?.inquiries || 0, meta: "Tickets" }
              ].map((mod, i) => (
                <Link key={i} to={mod.route} style={{ textDecoration: "none" }}>
                  <div style={{ 
                    padding: "20px", 
                    borderRadius: "16px", 
                    background: "white", 
                    border: "1px solid #f1f5f9", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                  }} className="hover-lift">
                    <div>
                      <h4 style={{ margin: 0, fontWeight: "800", color: "#1e293b", fontSize: "0.95rem" }}>{mod.title}</h4>
                      <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>{mod.count} {mod.meta} configured</p>
                    </div>
                    <span style={{ color: "#cbd5e1", fontSize: "1.2rem" }}>➜</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminDashboardPage;
