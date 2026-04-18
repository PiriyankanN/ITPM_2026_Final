import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

function SubmitInquiryPage() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const preSelectedRoomId = locationState.state?.roomId || "";
  const preSelectedSubject = locationState.state?.subject || "";
  const preSelectedRoomTitle = locationState.state?.roomTitle || "";

  const [formData, setFormData] = useState({
    subject: preSelectedSubject,
    message: "",
    roomId: preSelectedRoomId,
    evidenceUrl: ""
  });
  const [predictedCategory, setPredictedCategory] = useState("General");
  
  const detectCategory = (subject, message) => {
    const content = (subject + " " + message).toLowerCase();
    if (content.match(/room|apartment|rent|stay|accommodation|bed|bathroom|housing|living|maintenance|hot water|broken/i)) return "Room";
    if (content.match(/food|meal|dining|canteen|lunch|dinner|breakfast|menu|eat|restaurant|delicious|hunger|spicy/i)) return "Food";
    if (content.match(/bus|route|shuttle|transport|driver|stop|station|time|schedule|delay|location|tracker/i)) return "Transport";
    return "General";
  };

  useEffect(() => {
    setPredictedCategory(detectCategory(formData.subject, formData.message));
  }, [formData.subject, formData.message]);

  const [fieldErrors, setFieldErrors] = useState({});
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const validate = () => {
    const errors = {};
    if (!formData.subject.trim()) errors.subject = "Please provide a subject line";
    if (formData.message.trim().length < 20) {
      errors.message = "Please describe the issue in at least 20 characters so we can help you accurately";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then(res => res.json())
      .then(data => setRooms(Array.isArray(data) ? data : (data.data || [])))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setRefNumber(data.referenceNumber);
        setFormData({ subject: "", message: "", roomId: "", evidenceUrl: "" });
      } else {
        setError(data.message || "Something went wrong while submitting your request.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mt-12 mb-20 text-center" style={{ maxWidth: "650px" }}>
        <div className="card" style={{ padding: "60px 40px", borderRadius: "24px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}>
          <div style={{ display: "inline-flex", background: "#f0fdf4", padding: "24px", borderRadius: "50%", marginBottom: "24px" }}>
            <span style={{ fontSize: "3rem" }}>🚀</span>
          </div>
          <h2 style={{ fontSize: "2rem", color: "#064e3b", marginBottom: "16px" }}>Ticket Confirmed!</h2>
          <p className="text-muted mb-8" style={{ fontSize: "1.1rem" }}>We've received your inquiry. Our support team will review it and get back to you shortly.</p>
          
          <div style={{ background: "#f8fafc", padding: "32px", borderRadius: "16px", border: "1px solid var(--border-light)", marginBottom: "40px" }}>
            <p style={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", letterSpacing: "0.1em", marginBottom: "8px" }}>Your Reference Number</p>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--primary)", fontFamily: "monospace" }}>
              {refNumber}
            </div>
            <p className="mt-4" style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Use this number to track updates from your dashboard.</p>
          </div>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <Link to="/my-inquiries" className="primary-button" style={{ padding: "14px 32px" }}>Track Status</Link>
            <button onClick={() => setSuccess(false)} className="secondary-button" style={{ padding: "14px 32px" }}>Create Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-8 mb-20">
      <PageHeader 
        title="Student Support & Inquiries" 
        description="Need assistance with your accommodation or reporting an issue? Fill out the form below." 
      />
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px", marginTop: "32px" }}>
        {/* Main Content (Form) */}
        <div>
          {preSelectedRoomId && (
            <div className="mb-6" style={{ background: "#f0fdf4", padding: "16px 20px", borderRadius: "12px", border: "1px solid #dcfce7", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "1.2rem" }}>📍</span>
              <div>
                <p style={{ fontSize: "0.8rem", color: "#166534", fontWeight: "600", marginBottom: "2px" }}>SELECTED ACCOMMODATION</p>
                <p style={{ fontWeight: "700", color: "#064e3b" }}>{preSelectedRoomTitle || "Current Room Link Active"}</p>
              </div>
            </div>
          )}

          <div className="card shadow-sm" style={{ padding: "32px", borderRadius: "16px" }}>
            {error && <div className="message error mb-6"><span>⚠️</span>{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-6">
                <label style={{ color: "#052e16", fontWeight: "600" }}>Inquiry Subject *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Maintenance Request: Leaking Tap" 
                  value={formData.subject} 
                  onChange={e => {
                    setFormData({...formData, subject: e.target.value});
                    if (fieldErrors.subject) setFieldErrors({...fieldErrors, subject: ""});
                  }} 
                  style={{ 
                    borderColor: fieldErrors.subject ? "#ef4444" : "var(--border-light)",
                    fontSize: "1.05rem",
                    padding: "14px"
                  }}
                />
                {fieldErrors.subject && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "6px", display: "block" }}>{fieldErrors.subject}</span>}
                
                {/* 🤖 Smart Auto-Categorization Helper */}
                <div style={{ 
                  marginTop: "12px", 
                  padding: "8px 12px", 
                  background: "#f8fafc", 
                  borderRadius: "8px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between",
                  border: "1px solid #e2e8f0" 
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "#64748b" }}>
                    <span>🤖</span> 
                    <span>Smart Classification:</span>
                  </div>
                  <span style={{ 
                    fontSize: "0.75rem", 
                    fontWeight: "800", 
                    padding: "2px 8px", 
                    borderRadius: "4px",
                    background: predictedCategory === "Room" ? "#dbeafe" : 
                               predictedCategory === "Food" ? "#fef3c7" :
                               predictedCategory === "Transport" ? "#f3e8ff" : "#f1f5f9",
                    color: predictedCategory === "Room" ? "#1d4ed8" : 
                           predictedCategory === "Food" ? "#b45309" :
                           predictedCategory === "Transport" ? "#7e22ce" : "#475569"
                  }}>
                    {predictedCategory}
                  </span>
                </div>
              </div>

              <div className="form-group mb-6">
                <label style={{ color: "#052e16", fontWeight: "600" }}>Related Location (Optional)</label>
                <select 
                  value={formData.roomId} 
                  onChange={e => setFormData({...formData, roomId: e.target.value})}
                  disabled={!!preSelectedRoomId}
                  style={{ 
                    width: "100%", 
                    padding: "14px", 
                    borderRadius: "8px", 
                    border: "1px solid var(--border-light)",
                    background: preSelectedRoomId ? "#f8fafc" : "white",
                    cursor: preSelectedRoomId ? "not-allowed" : "pointer"
                  }}
                >
                  <option value="">General Support / No Specific Room</option>
                  {rooms.map(room => (
                    <option key={room._id} value={room._id}>{room.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-6">
                <label style={{ color: "#052e16", fontWeight: "600" }}>Evidence Attachment (URL)</label>
                <input 
                  type="url" 
                  placeholder="Paste photo link if available..." 
                  value={formData.evidenceUrl} 
                  onChange={e => setFormData({...formData, evidenceUrl: e.target.value})} 
                  style={{ padding: "14px" }}
                />
                <p className="mt-2" style={{ fontSize: "0.8rem", color: "#64748b" }}>Tip: Useful for reporting damages or documenting issues.</p>
              </div>

              <div className="form-group mb-8">
                <label style={{ color: "#052e16", fontWeight: "600" }}>Detailed Description *</label>
                <textarea 
                  rows="8" 
                  placeholder="Please provide specifics (room conditions, time of occurrence, etc.)" 
                  value={formData.message} 
                  onChange={e => {
                    setFormData({...formData, message: e.target.value});
                    if (fieldErrors.message) setFieldErrors({...fieldErrors, message: ""});
                  }} 
                  style={{ 
                    width: "100%", 
                    padding: "16px", 
                    borderRadius: "8px", 
                    border: "1px solid",
                    borderColor: fieldErrors.message ? "#ef4444" : "var(--border-light)",
                    outline: "none",
                    minHeight: "180px",
                    fontSize: "1rem",
                    lineHeight: "1.6"
                  }}
                />
                {fieldErrors.message && <span style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "6px", display: "block" }}>{fieldErrors.message}</span>}
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <button type="submit" className="primary-button" style={{ background: "var(--secondary)", padding: "14px 40px" }} disabled={loading}>
                  {loading ? "Sending Ticket..." : "Confirm & Submit"}
                </button>
                <Link to="/app" className="secondary-button" style={{ textDecoration: "none", textAlign: "center", padding: "14px 20px" }}>Cancel</Link>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Help */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card shadow-sm" style={{ padding: "24px", borderRadius: "16px", background: "#f8fafc" }}>
            <h4 style={{ color: "#064e3b", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>💡</span> Submission Tips
            </h4>
            <ul style={{ padding: "0", listStyle: "none", fontSize: "0.9rem", color: "#475569", lineHeight: "1.6" }}>
              <li className="mb-4"><strong>Be Specific:</strong> Mention room numbers, floor levels, or specific appliance names.</li>
              <li className="mb-4"><strong>Attach Evidence:</strong> Photos help our maintenance team understand the problem faster.</li>
              <li className="mb-4"><strong>Tracking:</strong> Keep your reference number safe to monitor updates later.</li>
              <li><strong>Response Time:</strong> We typically respond to new tickets within 24-48 business hours.</li>
            </ul>
          </div>

          <div className="card shadow-sm" style={{ padding: "24px", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
            <h4 style={{ fontSize: "1rem", color: "#334155", marginBottom: "12px" }}>Emergency Help?</h4>
            <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: "1.5" }}>
              If you have an immediate safety concern (gas leak, flooding), please contact the on-campus security office directly.
            </p>
          </div>
        </div>
      </div>
      
      {/* Mobile responsive styles (inline for simplicity if needed, but project uses global css) */}
      <style>{`
        @media (max-width: 900px) {
          .container > div { grid-template-columns: 1fr !important; }
          .container > div > div:last-child { order: -1; }
        }
      `}</style>
    </div>
  );
}

export default SubmitInquiryPage;
