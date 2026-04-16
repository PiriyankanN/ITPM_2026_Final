import { useState, useContext } from "react";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";
import { AuthContext } from "../context/AuthContext";
import PageWrapper from "../components/common/PageWrapper";

function InquiryPage() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    studentName: user?.name || "",
    email: user?.email || "",
    roomId: "",
    message: ""
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

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
        setStatus({ type: "success", message: "Inquiry submitted successfully! A staff member will contact you soon." });
        setFormData({ ...formData, roomId: "", message: "" });
      } else {
        setStatus({ type: "error", message: data.message || "Failed to submit inquiry. Check validation." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="container mt-8 mb-8">
        <PageHeader title="Room Inquiries" description="Submit questions or requests directly to housing administration." />

        <motion.div 
          className="auth-card" 
          style={{ maxWidth: "600px", margin: "0 auto", marginTop: "32px", padding: "32px" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="mb-6">Submit an Inquiry</h2>
          
          {status.message && (
            <motion.div 
              className={`message ${status.type} mb-6`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span>{status.type === "error" ? "⚠️" : "✅"}</span>
              {status.message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label>Student Name</label>
              <input 
                type="text" 
                value={formData.studentName} 
                onChange={e => setFormData({...formData, studentName: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Interested Room / ID</label>
              <input 
                type="text" 
                placeholder="e.g. Building A - Room 101"
                value={formData.roomId} 
                onChange={e => setFormData({...formData, roomId: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Your Message</label>
              <textarea 
                rows="4"
                placeholder="How can we help you?"
                value={formData.message} 
                onChange={e => setFormData({...formData, message: e.target.value})} 
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-light)", outline: "none", resize: "vertical" }}
                required 
              />
            </div>
            
            <button type="submit" className="primary-button mt-4" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Submitting..." : "Send Inquiry"}
            </button>
          </form>
        </motion.div>
      </div>
    </PageWrapper>
  );
}

export default InquiryPage;
