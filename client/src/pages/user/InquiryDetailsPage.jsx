import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { motion } from "framer-motion";

function InquiryDetailsPage() {
  const { id } = useParams();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/inquiries/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setInquiry(data);
        } else {
          setError(data.message || "Failed to fetch details.");
        }
      } catch (err) {
        setError("Network error. Could not retrieve ticket details.");
      } finally {
        setLoading(false);
      }
    };
    fetchInquiry();
  }, [id]);

  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending": return { color: "#64748b", bg: "#f1f5f9", label: "Pending Review" };
      case "In Review": return { color: "#d97706", bg: "#fffbeb", label: "Currently In Review" };
      case "Resolved": return { color: "#166534", bg: "#f0fdf4", label: "Resolved & Closed" };
      case "Rejected": return { color: "#991b1b", bg: "#fef2f2", label: "Inquiry Declined" };
      default: return { color: "#64748b", bg: "#f1f5f9", label: status };
    }
  };

  if (loading) return (
    <div className="container mt-20 text-center">
      <p className="text-muted">Loading secure ticket details...</p>
    </div>
  );

  if (error) return (
    <div className="container mt-20 text-center">
      <div className="message error mb-8"><span>⚠️</span>{error}</div>
      <Link to="/my-inquiries" className="primary-button">Return to Dashboard</Link>
    </div>
  );

  if (!inquiry) return null;

  const statusConfig = getStatusConfig(inquiry.status);

  return (
    <div className="container mt-8 mb-20" style={{ maxWidth: "900px" }}>
      <div className="mb-6">
        <Link to="/my-inquiries" style={{ color: "#64748b", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", fontWeight: "600" }}>
          <span>←</span> Back to Dashboard
        </Link>
      </div>

      <motion.div 
        className="card shadow-lg" 
        style={{ padding: "0", borderRadius: "24px", overflow: "hidden", border: "1px solid #e2e8f0" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header Section */}
        <div style={{ padding: "40px", background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "24px", flexWrap: "wrap" }}>
            <div style={{ flex: "1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--primary)", background: "white", padding: "4px 12px", borderRadius: "6px", border: "1px solid #dcfce7", letterSpacing: "0.05em", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                  TICKET #{inquiry.referenceNumber}
                </span>
                <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>•</span>
                <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>
                  Submitted on {new Date(inquiry.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <h1 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#0f172a", lineHeight: "1.2" }}>{inquiry.subject}</h1>
            </div>
            <div style={{ 
              padding: "10px 24px", 
              background: "white", 
              color: statusConfig.color, 
              borderRadius: "14px", 
              fontWeight: "800",
              fontSize: "0.9rem",
              textTransform: "uppercase",
              border: `2px solid ${statusConfig.color}20`,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: statusConfig.color }}></span>
              {statusConfig.label}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "0" }}>
          
          {/* Main Details */}
          <div style={{ padding: "40px", borderRight: "1px solid #f1f5f9" }}>
            <div className="mb-10">
              <h3 style={{ fontSize: "1.1rem", color: "#334155", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>📝</span> Description of Issue
              </h3>
              <div style={{ 
                background: "#f8fafc", 
                padding: "24px", 
                borderRadius: "16px", 
                lineHeight: "1.8", 
                color: "#334155",
                whiteSpace: "pre-wrap",
                fontSize: "1.05rem",
                border: "1px solid #f1f5f9"
              }}>
                {inquiry.message}
              </div>
            </div>

            {inquiry.evidenceUrl && (
              <div className="mb-10">
                <h3 style={{ fontSize: "1.1rem", color: "#334155", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>📷</span> Representative Evidence
                </h3>
                <div style={{ 
                  borderRadius: "16px", 
                  overflow: "hidden", 
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                }}>
                   <img 
                    src={inquiry.evidenceUrl} 
                    alt="Submission Evidence" 
                    style={{ width: "100%", height: "auto", display: "block" }} 
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              </div>
            )}

            {/* Admin Response */}
            <div style={{ marginTop: "48px", paddingTop: "40px", borderTop: "2px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ background: "var(--primary)", color: "white", padding: "8px", borderRadius: "8px" }}>
                  <span>🏛️</span>
                </div>
                <h3 style={{ fontSize: "1.2rem", color: "#1e293b", margin: "0" }}>Administration Remarks</h3>
              </div>
              
              {inquiry.adminRemark ? (
                <div style={{ padding: "24px", background: "var(--background)", borderRadius: "20px", border: "1px solid #dcfce7", position: "relative" }}>
                  <p style={{ lineHeight: "1.7", color: "#065f46" }}>{inquiry.adminRemark}</p>
                  <p className="mt-4" style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: "700" }}>Official Response from Accommodation Board</p>
                </div>
              ) : (
                <div style={{ padding: "32px", background: "#f8fafc", borderRadius: "20px", border: "1px dashed #e2e8f0", textAlign: "center" }}>
                  <p className="text-muted italic" style={{ fontSize: "0.95rem" }}>
                    Status: Your inquiry is in the queue. A member of the administration team is currently reviewing your submission. You will see an official remark here once the review is complete.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Sidebar */}
          <div style={{ padding: "40px", background: "#fafafa" }}>
            {inquiry.roomId && (
              <div className="mb-10">
                <p style={{ color: "#94a3b8", fontWeight: "800", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>Linked Property</p>
                <div style={{ 
                  padding: "20px", 
                  background: "white", 
                  borderRadius: "16px", 
                  border: "1px solid #e2e8f0", 
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
                }}>
                  <div style={{ fontSize: "1.2rem", marginBottom: "6px" }}>🏠</div>
                  <p style={{ fontSize: "1rem", fontWeight: "700", color: "#1e293b", marginBottom: "4px" }}>{inquiry.roomId.title}</p>
                  <p className="text-muted" style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>📍 {inquiry.roomId.location}</p>
                </div>
              </div>
            )}

            <div className="mb-8">
              <p style={{ color: "#94a3b8", fontWeight: "800", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px" }}>Submission Logs</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ width: "2px", background: "#e2e8f0", position: "relative" }}>
                    <div style={{ position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)" }}></div>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#334155" }}>Ticket Created</p>
                    <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                {inquiry.status !== "Pending" && (
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ width: "2px", background: "#e2e8f0", position: "relative" }}>
                      <div style={{ position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", width: "8px", height: "8px", borderRadius: "50%", background: statusConfig.color }}></div>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#334155" }}>Last Updated</p>
                      <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{new Date(inquiry.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid #eee" }}>
              <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: "1.5" }}>
                Need to add more info? Please submit a new ticket referencing <strong>#{inquiry.referenceNumber}</strong>.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 850px) {
          .container > div:nth-child(2) > div:last-child { grid-template-columns: 1fr !important; }
          .container > div:nth-child(2) > div:last-child > div:first-child { border-right: none !important; border-bottom: 1px solid #f1f5f9 !important; }
        }
      `}</style>
    </div>
  );
}

export default InquiryDetailsPage;
