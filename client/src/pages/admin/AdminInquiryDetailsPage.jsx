import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

function AdminInquiryDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    adminRemark: ""
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/inquiries/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data._id) {
          setInquiry(data);
          setFormData({
            status: data.status,
            adminRemark: data.adminRemark || ""
          });
        } else {
          setError(data.message || "Inquiry not found.");
        }
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch inquiry details.");
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await fetch(`http://localhost:5000/api/inquiries/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setInquiry(data);
        alert("Inquiry updated successfully!");
      } else {
        alert(data.message || "Update failed.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setUpdating(true);
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#94a3b8";
      case "In Review": return "#f59e0b";
      case "Resolved": return "#10b981";
      case "Rejected": return "#ef4444";
      default: return "#64748b";
    }
  };

  const getCategoryStyles = (category) => {
    switch (category) {
      case "Room": return { color: "#1d4ed8", bg: "#dbeafe", icon: "🏠" };
      case "Food": return { color: "#b45309", bg: "#fef3c7", icon: "🍔" };
      case "Transport": return { color: "#7e22ce", bg: "#f3e8ff", icon: "🚌" };
      default: return { color: "#475569", bg: "#f1f5f9", icon: "📋" };
    }
  };

  if (loading) return <div className="container mt-8"><p>Loading inquiry record...</p></div>;
  if (error) return <div className="container mt-8"><div className="message error"><span>⚠️</span>{error}</div><Link to="/admin/inquiries" className="primary-button mt-4">Back to Inbox</Link></div>;
  if (!inquiry) return null;

  return (
    <div className="container mt-8 mb-12">
      <Link to="/admin/inquiries" className="text-muted mb-4" style={{ display: "inline-block", textDecoration: "none" }}>
        ← Back to Inquiry Management
      </Link>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "32px", alignItems: "start" }}>
        {/* Left Col: Details */}
        <div className="card" style={{ padding: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "24px" }}>
            <div>
              <span style={{ 
                padding: "4px 12px", 
                background: `${getStatusColor(inquiry.status)}20`, 
                color: getStatusColor(inquiry.status), 
                borderRadius: "999px", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase"
              }}>
                {inquiry.status}
              </span>
              <span style={{ 
                marginLeft: "8px",
                padding: "4px 12px", 
                background: getCategoryStyles(inquiry.category).bg, 
                color: getCategoryStyles(inquiry.category).color, 
                borderRadius: "999px", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase"
              }}>
                {getCategoryStyles(inquiry.category).icon} {inquiry.category || "General"}
              </span>
              <h1 style={{ marginTop: "12px" }}>{inquiry.subject}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <p className="text-muted">Ref: {inquiry.referenceNumber}</p>
                <span style={{ fontSize: "0.75rem", color: "#166534", background: "#f0fdf4", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>🤖 AI Categorized</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p className="text-muted" style={{ fontSize: "0.9rem" }}>Submitted on</p>
              <p style={{ fontWeight: "600" }}>{new Date(inquiry.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "24px" }}>
            <h3 className="mb-2">{inquiry.user ? "Student Information" : "Guest Contact Information"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "32px" }}>
              <div>
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>Name</p>
                <p style={{ fontWeight: "600" }}>{inquiry.user?.name || inquiry.guestName}</p>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>Email</p>
                <p style={{ fontWeight: "600" }}>{inquiry.user?.email || inquiry.guestEmail}</p>
              </div>
              {inquiry.phone && (
                <div>
                  <p className="text-muted" style={{ fontSize: "0.85rem" }}>Phone</p>
                  <p style={{ fontWeight: "600" }}>{inquiry.phone}</p>
                </div>
              )}
            </div>

            <h3 className="mb-2">Inquiry Message</h3>
            <p style={{ lineHeight: "1.7", background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
              {inquiry.message}
            </p>

            {inquiry.roomId && (
              <div className="mt-8" style={{ background: "var(--primary-light)", padding: "16px", borderRadius: "12px", border: "1px solid var(--primary-light)" }}>
                <h4 style={{ color: "var(--primary)" }}>Related Accommodation</h4>
                <p style={{ fontWeight: "600" }}>{inquiry.roomId?.title} - {inquiry.roomId?.location}</p>
                <Link to={`/rooms/${inquiry.roomId?._id}`} target="_blank" style={{ fontSize: "0.9rem", color: "var(--primary)", textDecoration: "underline" }}>View Room Details</Link>
              </div>
            )}

            {inquiry.evidenceUrl && (
              <div className="mt-8">
                <h3 className="mb-4">Evidence Attachment</h3>
                <div style={{ maxWidth: "100%", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border-light)" }}>
                  <img src={inquiry.evidenceUrl} alt="Evidence" style={{ width: "100%", display: "block" }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Admin Action */}
        <div className="card" style={{ padding: "32px", position: "sticky", top: "20px" }}>
          <h2 className="mb-6">Management Action</h2>
          
          {inquiry.status === "Resolved" ? (
            <div style={{ background: "#f0fdf4", padding: "20px", borderRadius: "12px", border: "1px solid #10b981", color: "#166534" }}>
              <p style={{ fontWeight: "700", marginBottom: "8px" }}>✅ Inquiry Resolved</p>
              <p style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>
                This inquiry has been marked as resolved and can no longer be edited.
                If you need to make changes, please contact the system administrator.
              </p>
            </div>
          ) : (
            <form onSubmit={handleUpdate}>
              <div className="form-group mb-6">
                <label>Update Status</label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  required
                  style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1.5px solid var(--border-light)", fontSize: "1rem" }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Review">In Review</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="form-group mb-8">
                <label>Admin Remark / Response</label>
                <textarea 
                  rows="8" 
                  value={formData.adminRemark} 
                  onChange={e => setFormData({...formData, adminRemark: e.target.value})}
                  placeholder="Include details about the resolution or next steps for the student..."
                />
              </div>

              <button type="submit" className="primary-button" style={{ width: "100%", height: "54px", fontSize: "1.05rem" }} disabled={updating}>
                {updating ? "Saving Update..." : "Confirm & Save"}
              </button>
            </form>
          )}
          
          <p className="text-muted mt-6" style={{ fontSize: "0.85rem", textAlign: "center" }}>
            The student will see this status and remark on their "My Inquiries" dashboard immediately.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminInquiryDetailsPage;
