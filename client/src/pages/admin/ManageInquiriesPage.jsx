import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

function ManageInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchInquiries = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/inquiries/admin/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setInquiries(Array.isArray(data) ? data : (data.data || []));
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch inquiry log.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this record?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/inquiries/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        fetchInquiries();
      } else {
        alert("Delete operation failed.");
      }
    } catch(err) {
      alert("Network action failed.");
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
      case "Room": return { color: "#1d4ed8", bg: "#dbeafe" };
      case "Food": return { color: "#b45309", bg: "#fef3c7" };
      case "Transport": return { color: "#7e22ce", bg: "#f3e8ff" };
      default: return { color: "#475569", bg: "#f1f5f9" };
    }
  };

  const filteredInquiries = inquiries.filter(inq => 
    filterStatus === "All" ? true : inq.status === filterStatus
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <PageHeader title="Manage Inquiries" description="Monitor active questions and resolve student requests with status tracking." />
        
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <label className="text-muted" style={{ fontSize: "0.9rem" }}>Filter Status:</label>
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "0.9rem" }}
          >
            <option value="All">All Inquiries</option>
            <option value="Pending">Pending</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading && <p className="mt-6">Loading inquiries inbox...</p>}
      {error && <div className="message error mt-6"><span>⚠️</span>{error}</div>}

      {!loading && !error && filteredInquiries.length === 0 && (
        <div className="card" style={{ padding: "40px", textAlign: "center", marginTop: "24px" }}>
          <p className="text-muted">No inquiries found for the selected status.</p>
        </div>
      )}

      {filteredInquiries.length > 0 && (
        <div style={{ marginTop: "24px", overflowX: "auto", background: "white", borderRadius: "12px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid var(--border-light)" }}>
                <th style={{ padding: "16px" }}>Ref / Subject</th>
                <th style={{ padding: "16px" }}>Student</th>
                <th style={{ padding: "16px" }}>Date</th>
                <th style={{ padding: "16px" }}>Category</th>
                <th style={{ padding: "16px" }}>Status</th>
                <th style={{ padding: "16px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map(inq => (
                <tr key={inq._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "16px" }}>
                    <div style={{ fontWeight: "700", color: "var(--primary)", fontSize: "0.85rem" }}>{inq.referenceNumber}</div>
                    <div style={{ fontWeight: "600", marginTop: "4px" }}>{inq.subject}</div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <strong>{inq.user?.name || inq.guestName || "Guest"}</strong>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{inq.user?.email || inq.guestEmail}</div>
                  </td>
                  <td style={{ padding: "16px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span style={{ 
                      padding: "4px 10px", 
                      background: getCategoryStyles(inq.category).bg, 
                      color: getCategoryStyles(inq.category).color, 
                      borderRadius: "6px", fontSize: "0.75rem", fontWeight: "800",
                      textTransform: "uppercase"
                    }}>
                      {inq.category || "General"}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span style={{ 
                      padding: "4px 10px", 
                      background: `${getStatusColor(inq.status)}20`, 
                      color: getStatusColor(inq.status), 
                      borderRadius: "999px", fontSize: "0.8rem", fontWeight: "600"
                    }}>
                      {inq.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <Link to={`/admin/inquiries/${inq._id}`}>
                      <button className="primary-button" style={{ padding: "6px 14px", marginRight: "8px", fontSize: "0.85rem" }}>
                        View Details
                      </button>
                    </Link>
                    <button onClick={() => handleDelete(inq._id)} className="danger-button" style={{ padding: "6px 14px", fontSize: "0.85rem" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageInquiriesPage;
