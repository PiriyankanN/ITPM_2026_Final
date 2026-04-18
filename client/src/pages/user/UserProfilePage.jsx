import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageHeader from "../../components/PageHeader";
import { AuthContext } from "../../context/AuthContext";
import PageWrapper from "../../components/common/PageWrapper";

function UserProfilePage() {
  const { user: authUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setProfile(data);
        } else {
          setError(data.message || "Failed to load profile.");
        }
      } catch (err) {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="container mt-8"><p>Loading your profile...</p></div>;
  if (error) return <div className="container mt-8"><div className="message error"><span>⚠️</span>{error}</div></div>;
  if (!profile) return null;

  return (
    <PageWrapper>
      <div className="container mt-8 mb-20">
        <div className="mb-10 text-center">
          <PageHeader 
            title="Account Information" 
            description="Manage your personal identity, contact details, and platform preferences." 
          />
        </div>

        <motion.div 
          className="card shadow-lg" 
          style={{ maxWidth: "900px", margin: "0 auto", padding: "0", borderRadius: "32px", overflow: "hidden", border: "1px solid #e2e8f0" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile Hero Header */}
          <div style={{ height: "180px", background: "linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)", position: "relative" }}>
            <div style={{ position: "absolute", bottom: "-60px", left: "50%", transform: "translateX(-50%)", textAlign: "center", width: "100%" }}>
              <motion.div 
                style={{ 
                  width: "140px", 
                  height: "140px", 
                  borderRadius: "50%", 
                  background: "white", 
                  padding: "6px", 
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  margin: "0 auto"
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              >
                <img 
                  src={profile.profileImage || "https://ui-avatars.com/api/?name=" + profile.name + "&background=22c55e&color=fff&size=200"} 
                  alt={profile.name} 
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #f0fdf4" }} 
                />
              </motion.div>
            </div>
          </div>
          
          <div style={{ padding: "80px 48px 48px", textAlign: "center" }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#1e293b", marginBottom: "8px" }}>{profile.name}</h1>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "32px" }}>
                <span style={{ fontSize: "1rem", color: "#64748b" }}>{profile.email}</span>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#cbd5e1" }}></span>
                <span style={{ 
                  padding: "4px 12px", 
                  background: "var(--primary-light)", 
                  color: "var(--primary)", 
                  borderRadius: "999px", 
                  fontSize: "0.75rem", 
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  border: "1px solid #dcfce7"
                }}>
                  {profile.role}
                </span>
              </div>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", textAlign: "left" }}>
              
              {/* Contact Details Card */}
              <motion.div 
                className="card" 
                style={{ padding: "24px", background: "#f8fafc", border: "1px solid #f1f5f9" }}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ background: "white", padding: "10px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>📱</div>
                  <h3 style={{ fontSize: "1.05rem", color: "#334155" }}>Contact Details</h3>
                </div>
                
                <div className="mb-4">
                  <p className="text-muted mb-1" style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase" }}>Phone Number</p>
                  <p style={{ fontSize: "1rem", fontWeight: "600", color: "#1e293b" }}>{profile.phone || "Not provided"}</p>
                </div>
                
                <div>
                  <p className="text-muted mb-1" style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase" }}>Registered Email</p>
                  <p style={{ fontSize: "1rem", fontWeight: "600", color: "#1e293b" }}>{profile.email}</p>
                </div>
              </motion.div>

              {/* Account Timeline Card */}
              <motion.div 
                className="card" 
                style={{ padding: "24px", background: "#f8fafc", border: "1px solid #f1f5f9" }}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.6 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ background: "white", padding: "10px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>🗓️</div>
                  <h3 style={{ fontSize: "1.05rem", color: "#334155" }}>Platform Activity</h3>
                </div>
                
                <div className="mb-4">
                  <p className="text-muted mb-1" style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase" }}>Member Since</p>
                  <p style={{ fontSize: "1rem", fontWeight: "600", color: "#1e293b" }}>{new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
                
                <div>
                  <p className="text-muted mb-1" style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase" }}>Account Status</p>
                  <p style={{ fontSize: "1rem", fontWeight: "600", color: "#10b981" }}>Verified Student Account</p>
                </div>
              </motion.div>

              {/* Address Card */}
              <motion.div 
                className="card" 
                style={{ padding: "24px", background: "#f8fafc", border: "1px solid #f1f5f9", gridColumn: "1 / -1" }}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.7 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ background: "white", padding: "10px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>📍</div>
                  <h3 style={{ fontSize: "1.05rem", color: "#334155" }}>Current Address</h3>
                </div>
                <p style={{ fontSize: "1.05rem", fontWeight: "600", color: "#1e293b", lineHeight: "1.6" }}>
                  {profile.address || "Please add your home address to help with accommodation logistics."}
                </p>
              </motion.div>

              {/* Living Preferences Card (New AI Feature) */}
              <motion.div 
                className="card" 
                style={{ padding: "24px", background: "linear-gradient(135deg, #f0fdf4 0%, #f7fee7 100%)", border: "1px solid #dcfce7", gridColumn: "1 / -1" }}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.75 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ background: "white", padding: "10px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>🤖</div>
                  <h3 style={{ fontSize: "1.05rem", color: "#166534" }}>Living Preferences (Smart Recommendations)</h3>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                  <div>
                    <p className="text-muted mb-1" style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "#166534" }}>Max Budget</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: "800", color: "#064e3b" }}>
                      {profile.preferences?.budget ? `Rs. ${profile.preferences.budget.toLocaleString()}` : "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted mb-1" style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "#166534" }}>Preferred Location</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: "800", color: "#064e3b" }}>
                      {profile.preferences?.location || "Anywhere"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted mb-1" style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "#166534" }}>Preferred Type</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: "800", color: "#064e3b" }}>
                      {profile.preferences?.roomType || "No preference"}
                    </p>
                  </div>
                </div>
                <p style={{ marginTop: "16px", fontSize: "0.85rem", color: "#3f6212", fontStyle: "italic" }}>
                  * These settings help our matching engine suggest the best rooms for you.
                </p>
              </motion.div>

              {/* Dashboard Link */}
              <motion.div style={{ gridColumn: "1 / -1", marginTop: "12px" }} variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.8 }}>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <Link to="/profile/edit" style={{ textDecoration: "none", flex: "1" }}>
                    <button className="primary-button" style={{ width: "100%", padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <span>✏️</span> Edit Profile Information
                    </button>
                  </Link>
                  <Link to="/my-inquiries" style={{ textDecoration: "none", flex: "1" }}>
                    <button className="secondary-button" style={{ width: "100%", padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                       <span>📋</span> Support Ticket Dashboard
                    </button>
                  </Link>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}

export default UserProfilePage;
