import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import PageWrapper from "../components/common/PageWrapper";
import RoomCard from "../components/RoomCard";

function AppHomePage() {
  const { user } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms/recommendations", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setRecommendations(Array.isArray(data) ? data : []);
        setLoadingRecs(false);
      })
      .catch(() => setLoadingRecs(false));
  }, []);

  const services = [
    { title: "Accommodation", description: "Find your perfect stay on campus.", path: "/rooms", icon: "🏠", color: "#3b82f6" },
    { title: "Inquiries", description: "Secure support for any room issue.", path: "/my-inquiries", icon: "💬", color: "#8b5cf6" },
    { title: "Food Services", description: "Delicious meals just a click away.", path: "/food", icon: "🍔", color: "#ec4899" },
    { title: "Bus Routes", description: "Live tracking & zone-wise transit.", path: "/routes", icon: "🚌", color: "#10b981" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15 } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <PageWrapper>
      <div className="container mt-8 mb-12">
        {/* 🌟 Premium Hero Section */}
        <motion.div 
          className="dashboard-hero-premium"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ fontSize: "1rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "2px", opacity: 0.8 }}
            >
              Student Portal
            </motion.span>
            <h1>Hi, {user?.name.split(' ')[0] || "Student"}! ✨</h1>
            <p>Your campus companion is ready. Explore housing, dining, and transit options tailored just for you.</p>
          </div>
          {/* Abstract background blobs */}
          <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "150px", height: "150px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", filter: "blur(30px)" }}></div>
          <div style={{ position: "absolute", bottom: "-30px", left: "20%", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", filter: "blur(20px)" }}></div>
        </motion.div>

        {/* 🤖 Smart Recommendations - Horizontal Scroll */}
        {recommendations.length > 0 && (
          <div className="mb-12">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "850", color: "#1e293b", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>🤖</span> Smart Match Recommendations
              </h2>
              <Link to="/rooms" className="text-primary" style={{ fontWeight: "700", textDecoration: "none" }}>See All →</Link>
            </div>
            
            <div style={{ 
              display: "flex", 
              gap: "24px", 
              overflowX: "auto", 
              padding: "10px 10px 30px",
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            }}>
              {recommendations.map((room) => (
                <motion.div 
                  key={room._id}
                  whileHover={{ scale: 1.02 }}
                  className="match-card-premium"
                >
                  <div style={{ position: "relative" }}>
                    <div className="status-pill-vibrant" style={{ 
                      position: "absolute", top: "10px", left: "10px", zIndex: 5, background: "#166534", color: "white" 
                    }}>
                      98% Match
                    </div>
                  </div>
                  <RoomCard room={room} compact />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 📱 Core Service Modules */}
        <motion.div 
          className="dashboard-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {services.map((service) => (
            <motion.div 
              key={service.title} 
              className="glass-card" 
              variants={cardVariants}
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
            >
              <div className="icon-blob" style={{ color: service.color }}>
                {service.icon}
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "850", color: "#1e293b", marginBottom: "8px" }}>{service.title}</h3>
              <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: "1.5", marginBottom: "24px", flexGrow: 1 }}>
                {service.description}
              </p>
              <Link to={service.path} style={{ width: "100%" }}>
                <button 
                  className="primary-button" 
                  style={{ 
                    width: "100%", 
                    background: service.color, 
                    borderRadius: "16px",
                    fontWeight: "800",
                    boxShadow: `0 8px 20px ${service.color}33`
                  }}
                >
                  Explore Now
                </button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageWrapper>
  );
}

export default AppHomePage;
