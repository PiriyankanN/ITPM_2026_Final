import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={{ 
      background: "var(--secondary)", 
      color: "white", 
      padding: "60px 24px", 
      marginTop: "auto",
      borderTop: "1px solid var(--border-light)"
    }}>
      <div className="container">
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "40px", 
          marginBottom: "40px" 
        }}>
          <div>
            <h3 style={{ color: "var(--primary)", marginBottom: "16px" }}>🏫 StudentLiving</h3>
            <p style={{ color: "#BBF7D0", fontSize: "0.95rem", lineHeight: "1.6" }}>
              Simplifying campus life with a unified platform for housing, dining, and transit. Built for student convenience and peace of mind.
            </p>
          </div>
          
          <div>
            <h4 style={{ marginBottom: "16px" }}>Quick Links</h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "10px" }}><Link to="/rooms" style={{ color: "#BBF7D0" }}>Find a Room</Link></li>
              <li style={{ marginBottom: "10px" }}><Link to="/food" style={{ color: "#BBF7D0" }}>Meal Plans</Link></li>
              <li style={{ marginBottom: "10px" }}><Link to="/routes" style={{ color: "#BBF7D0" }}>Transport</Link></li>
              <li style={{ marginBottom: "10px" }}><Link to="/login" style={{ color: "#BBF7D0" }}>Student Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: "16px" }}>Support</h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "10px" }}><Link to="/my-inquiries" style={{ color: "#BBF7D0" }}>Submit Inquiry</Link></li>
              <li style={{ marginBottom: "10px" }}><Link to="/contact" style={{ color: "#BBF7D0" }}>Contact Us</Link></li>
              <li style={{ marginBottom: "10px" }}><span style={{ color: "#BBF7D0" }}>FAQs</span></li>
            </ul>
          </div>
        </div>
        
        <div style={{ 
          borderTop: "1px solid rgba(187, 247, 208, 0.2)", 
          paddingTop: "24px", 
          textAlign: "center", 
          fontSize: "0.9rem",
          color: "#BBF7D0"
        }}>
          <p>© {new Date().getFullYear()} Student Living Assistant. Built with ❤️ for the student community.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
