import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";

function ContactPage() {
  const contactMethods = [
    {
      title: "General query",
      email: "info@studentliving.com",
      icon: "❓",
      color: "#3b82f6"
    },
    {
      title: "Admissions",
      email: "admissions@studentliving.com",
      icon: "🎓",
      color: "#10b981"
    },
    {
      title: "Student Support",
      email: "support@studentliving.com",
      icon: "🎧",
      color: "#8b5cf6"
    }
  ];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "80px" }}>
      <div className="container mt-8">
        <PageHeader 
          title="Contact Our Team" 
          description="We're here to help you with any questions about campus living, housing, or student services." 
        />

        {/* 1. Contact Cards */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "24px", 
          marginTop: "40px" 
        }}>
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              style={{
                background: "white",
                padding: "32px",
                borderRadius: "24px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                border: "1px solid #f1f5f9"
              }}
            >
              <div style={{ 
                width: "60px", 
                height: "60px", 
                background: `${method.color}15`, 
                color: method.color,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.75rem"
              }}>
                {method.icon}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b", fontWeight: "600" }}>{method.title}</p>
                <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>{method.email}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 2. Offices Section */}
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            style={{ 
              fontSize: "2.5rem", 
              fontWeight: "900", 
              color: "#1e293b", 
              letterSpacing: "-1px",
              marginBottom: "16px"
            }}
          >
            OUR OFFICES WORLDWIDE
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ 
              maxWidth: "800px", 
              margin: "0 auto", 
              color: "#64748b", 
              lineHeight: "1.8",
              fontSize: "1.1rem"
            }}
          >
            We're growing globally with offices that bring us closer to our partners and students.
            Each location helps us serve better, respond faster, and stay connected where it matters most.
          </motion.p>
        </div>

        {/* 3. Map Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ 
            marginTop: "60px",
            background: "white",
            padding: "24px",
            borderRadius: "32px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.05)",
            border: "1px solid #f1f5f9",
            overflow: "hidden",
            position: "relative",
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <img 
            src="/world_map_contact.png" 
            alt="Our Global Presence"
            style={{ 
              width: "100%", 
              height: "auto", 
              maxHeight: "600px",
              objectFit: "contain",
              display: "block",
              borderRadius: "16px"
            }}
          />
          
          {/* Pulsing Dots on Map */}
          {[
            { top: "35%", left: "20%", name: "New York" },
            { top: "30%", left: "48%", name: "London" },
            { top: "60%", left: "75%", name: "Sydney" },
            { top: "45%", left: "68%", name: "New Delhi" }
          ].map((city, idx) => (
            <motion.div
              key={idx}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }}
              style={{
                position: "absolute",
                top: city.top,
                left: city.left,
                width: "12px",
                height: "12px",
                background: "#3b82f6",
                borderRadius: "50%",
                boxShadow: "0 0 10px #3b82f6"
              }}
              title={city.name}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default ContactPage;
