import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../../components/PageHeader";
import PageWrapper from "../../components/common/PageWrapper";

function MyInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyInquiries = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/inquiries/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setInquiries(data);
        setFilteredInquiries(data);
      } else {
        setError(data.message || "Failed to fetch inquiries.");
      }
    } catch (err) {
      setError("Network error. Could not load your tracking dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyInquiries();
  }, []);

  useEffect(() => {
    if (filter === "All") {
      setFilteredInquiries(inquiries);
    } else {
      setFilteredInquiries(inquiries.filter(inq => inq.status === filter));
    }
  }, [filter, inquiries]);

  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending": return { color: "#64748b", bg: "#f1f5f9", label: "Pending" };
      case "In Review": return { color: "#d97706", bg: "#fffbeb", label: "In Review" };
      case "Resolved": return { color: "#166534", bg: "#f0fdf4", label: "Resolved" };
      case "Rejected": return { color: "#991b1b", bg: "#fef2f2", label: "Declined" };
      default: return { color: "#64748b", bg: "#f1f5f9", label: status };
    }
  };

  const getCategoryConfig = (category) => {
    switch (category) {
      case "Room": return { color: "#1d4ed8", bg: "#dbeafe", icon: "🏠" };
      case "Food": return { color: "#b45309", bg: "#fef3c7", icon: "🍔" };
      case "Transport": return { color: "#7e22ce", bg: "#f3e8ff", icon: "🚌" };
      default: return { color: "#475569", bg: "#f1f5f9", icon: "📋" };
    }
  };

  const statusOptions = ["All", "Pending", "In Review", "Resolved", "Rejected"];

  return (
    <PageWrapper>
      <div className="container mt-8 mb-20">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "40px" }}>
          <div style={{ flex: "1", minWidth: "300px" }}>
            <PageHeader 
              title="Ticket Dashboard" 
              description="Track, manage, and review all your submitted support requests in one place." 
            />
          </div>
          <Link to="/inquiries/new" style={{ textDecoration: "none" }}>
            <button className="primary-button" style={{ background: "var(--secondary)", padding: "12px 24px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>+</span> Open New Ticket
            </button>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="mb-8" style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
          {statusOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              style={{
                padding: "8px 20px",
                borderRadius: "999px",
                border: "1px solid",
                borderColor: filter === opt ? "var(--primary)" : "var(--border-light)",
                background: filter === opt ? "var(--primary)" : "white",
                color: filter === opt ? "white" : "#64748b",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                boxShadow: filter === opt ? "0 4px 12px rgba(34, 197, 94, 0.2)" : "none"
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-20">
            <p className="text-muted">Loading your support history...</p>
          </div>
        )}
        
        {error && <div className="message error"><span>⚠️</span>{error}</div>}

        {!loading && !error && inquiries.length === 0 && (
          <motion.div 
            className="card text-center" 
            style={{ padding: "80px 40px", borderRadius: "24px", background: "#f8fafc", border: "2px dashed #e2e8f0" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📋</div>
            <h3 style={{ color: "#334155", marginBottom: "8px" }}>No Inquiries Yet</h3>
            <p className="text-muted mb-8" style={{ maxWidth: "400px", margin: "0 auto 32px" }}>
              Have a question about your room or a problem to report? We're here to help.
            </p>
            <Link to="/inquiries/new" className="primary-button" style={{ padding: "14px 32px" }}>Submit your first inquiry</Link>
          </motion.div>
        )}

        {inquiries.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
            <AnimatePresence mode="popLayout">
              {filteredInquiries.map((inq, index) => {
                const status = getStatusConfig(inq.status);
                return (
                  <motion.div
                    layout
                    key={inq._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="card hover-lift"
                    style={{ padding: "24px", border: "1px solid #e2e8f0" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94a3b8", fontFamily: "monospace", letterSpacing: "0.05em" }}>REF: {inq.referenceNumber}</span>
                        {inq.roomId && (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.7rem", color: "#166534", fontWeight: "700" }}>
                            <span>🏠</span> {inq.roomId.title}
                          </div>
                        )}
                      </div>
                      <div style={{ 
                        padding: "4px 12px", 
                        background: status.bg, 
                        color: status.color, 
                        borderRadius: "999px", 
                        fontSize: "0.75rem", 
                        fontWeight: "700",
                        border: `1px solid ${status.color}30`
                      }}>
                        {status.label}
                      </div>
                    </div>

                    {/* AI Category Badge */}
                    <div style={{ 
                      display: "inline-flex", 
                      alignItems: "center", 
                      gap: "6px", 
                      padding: "4px 10px", 
                      background: getCategoryConfig(inq.category).bg, 
                      color: getCategoryConfig(inq.category).color, 
                      borderRadius: "6px", 
                      fontSize: "0.7rem", 
                      fontWeight: "800",
                      marginBottom: "12px",
                      textTransform: "uppercase"
                    }}>
                      <span>{getCategoryConfig(inq.category).icon}</span>
                      {inq.category || "General"}
                    </div>

                    <h3 style={{ fontSize: "1.2rem", marginBottom: "12px", color: "#1e293b", display: "-webkit-box", WebkitLineClamp: "1", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {inq.subject}
                    </h3>
                    
                    <p style={{ 
                      fontSize: "0.95rem", 
                      color: "#64748b", 
                      marginBottom: "24px",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: "1.6"
                    }}>
                      {inq.message}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "20px", borderTop: "1px solid #f1f5f9" }}>
                      <div style={{ fontSize: "0.85rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>🗓️</span> {new Date(inq.createdAt).toLocaleDateString()}
                      </div>
                      <Link to={`/my-inquiries/${inq._id}`} style={{ textDecoration: "none" }}>
                        <button className="secondary-button" style={{ padding: "8px 16px", fontSize: "0.85rem", fontWeight: "700" }}>
                          Track Ticket
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
        
        {!loading && filteredInquiries.length === 0 && inquiries.length > 0 && (
          <motion.div 
            style={{ textAlign: "center", padding: "80px 0" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔍</div>
            <p className="text-muted">No tickets found matching the "{filter}" status.</p>
            <button onClick={() => setFilter("All")} className="text-button mt-4" style={{ color: "var(--primary)", fontWeight: "700", border: "none", background: "none", cursor: "pointer" }}>Show all tickets</button>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}

export default MyInquiriesPage;
