import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";

function FloatingContact() {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    phone: "",
    subject: "General Inquiry",
    message: ""
  });

  // Pre-fill if user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        guestName: user.name || "",
        guestEmail: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = user ? "http://localhost:5000/api/inquiries" : "http://localhost:5000/api/inquiries/public";
      const headers = { "Content-Type": "application/json" };
      if (user) headers.Authorization = `Bearer ${localStorage.getItem("token")}`;

      const payload = user 
        ? { subject: formData.subject, message: formData.message, roomId: null }
        : formData;

      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setRefNumber(data.referenceNumber);
        setFormData({ ...formData, message: "" });
      } else {
        setError(data.message || "Failed to send inquiry.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setSuccess(false);
  };

  return (
    <>
      {/* 1. Vertical Floating Tab */}
      {!isOpen && (
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ 
            x: 0, 
            opacity: 1,
            boxShadow: ["-2px 0 10px rgba(59, 130, 246, 0.2)", "-2px 0 20px rgba(59, 130, 246, 0.6)", "-2px 0 10px rgba(59, 130, 246, 0.2)"]
          }}
          transition={{
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          onClick={toggleDrawer}
          style={{
            position: "fixed",
            right: 0,
            top: "40%",
            transform: "translateY(-50%)",
            background: "#3b82f6",
            color: "white",
            padding: "18px 12px",
            borderRadius: "15px 0 0 15px",
            cursor: "pointer",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontWeight: "800",
            letterSpacing: "1.5px",
            fontSize: "0.95rem",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRight: "none"
          }}
          whileHover={{ x: -8, background: "#2563eb", transition: { duration: 0.2 } }}
        >
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Let's Connect !
          </motion.span>
        </motion.div>
      )}

      {/* 2. Side Drawer Form */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleDrawer}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(4px)",
                zIndex: 1001
              }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{
                position: "fixed",
                right: 0,
                top: 0,
                bottom: 0,
                width: "min(400px, 90vw)",
                background: "white",
                zIndex: 1002,
                boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
                padding: "40px 30px",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto"
              }}
            >
              <button 
                onClick={toggleDrawer}
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748b"
                }}
              >✕</button>

              <div style={{ marginTop: "20px" }}>
                <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#1e293b", marginBottom: "8px" }}>Let's Connect</h2>
                <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "32px", lineHeight: "1.6" }}>
                  Have a question or need assistance? Fill out this form and we'll get back to you shortly.
                </p>

                {success ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ textAlign: "center", padding: "40px 0" }}
                  >
                    <div style={{ fontSize: "4rem", marginBottom: "20px" }}>✅</div>
                    <h3 style={{ color: "#059669", fontWeight: "800", marginBottom: "12px" }}>Submission Successful!</h3>
                    <p style={{ color: "#4b5563", marginBottom: "20px" }}>Reference: <strong style={{ color: "#111827" }}>{refNumber}</strong></p>
                    <button 
                      onClick={() => setSuccess(false)}
                      className="primary-button"
                      style={{ width: "100%" }}
                    >Send Another</button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div className="form-group">
                      <input 
                        type="text" 
                        placeholder="Your Name *" 
                        required
                        value={formData.guestName}
                        onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                        style={{ padding: "14px", borderRadius: "12px" }}
                        disabled={!!user}
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        type="email" 
                        placeholder="Your Email *" 
                        required
                        value={formData.guestEmail}
                        onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                        style={{ padding: "14px", borderRadius: "12px" }}
                        disabled={!!user}
                      />
                    </div>
                    <div className="form-group">
                      <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid var(--border-light)" }}
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Maintenance">Maintenance Request</option>
                        <option value="Room Booking">Room Booking</option>
                        <option value="Food Service">Food Service</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <input 
                        type="text" 
                        placeholder="Phone Number (Optional)" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{ padding: "14px", borderRadius: "12px" }}
                      />
                    </div>
                    <div className="form-group">
                      <textarea 
                        rows="4" 
                        placeholder="Your Message *" 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        style={{ padding: "14px", borderRadius: "12px", width: "100%", border: "1px solid var(--border-light)", resize: "none" }}
                      />
                    </div>
                    
                    {error && <p style={{ color: "#ef4444", fontSize: "0.85rem", margin: 0 }}>{error}</p>}

                    <button 
                      type="submit" 
                      className="primary-button" 
                      style={{ padding: "16px", borderRadius: "12px", fontWeight: "800", marginTop: "10px" }}
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Submit Inquiry"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. WhatsApp Floating Icon */}
      <motion.a
        href="https://wa.me/94771234567" // Placeholder Sri Lankan number
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          background: "#25d366",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 25px rgba(37, 211, 102, 0.3)",
          zIndex: 1000,
          textDecoration: "none"
        }}
        title="Chat with us on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </motion.a>
    </>
  );
}

export default FloatingContact;
