import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";
import RouteCard from "../components/RouteCard";
import PageWrapper from "../components/common/PageWrapper";

function BusRoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/routes")
      .then(res => res.json())
      .then(data => {
        setRoutes(Array.isArray(data) ? data : (data.data || []));
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch Route network.");
        setLoading(false);
      });
  }, []);

  const [filterQuery, setFilterQuery] = useState("");

  const filteredRoutes = routes.filter(rt => 
    rt.routeName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    rt.startLocation.toLowerCase().includes(filterQuery.toLowerCase()) ||
    rt.endLocation.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <PageWrapper>
      {/* 🚌 Vibrant Transit Hero */}
      <section className="transit-hero-vibrant">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span style={{ textTransform: "uppercase", fontWeight: "800", fontSize: "0.9rem", letterSpacing: "3px", opacity: 0.8 }}>Campus Transit</span>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "900", margin: "16px 0", letterSpacing: "-0.04em" }}>Navigate with Ease</h1>
          <p style={{ maxWidth: "600px", margin: "0 auto", fontSize: "1.2rem", opacity: 0.9 }}>
            Seamless shuttle routes connecting residential halls, lecture blocks, and the city center.
          </p>
        </motion.div>
      </section>

      {/* 🔍 Floating Search Bar */}
      <div className="container" style={{ position: "relative", zIndex: 20 }}>
        <div className="food-filter-glass" style={{ maxWidth: "700px" }}>
          <div style={{ position: "relative", padding: "8px" }}>
            <span style={{ position: "absolute", left: "24px", top: "50%", transform: "translateY(-50%)", fontSize: "1.2rem" }}>🚌</span>
            <input 
              type="text" 
              placeholder="Where are you heading? Enter destination or route..." 
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              style={{ 
                width: "100%", 
                padding: "18px 18px 18px 60px", 
                borderRadius: "24px", 
                border: "none", 
                outline: "none", 
                background: "#f8fafc", 
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "#1e293b"
              }}
            />
          </div>
        </div>
      </div>

      <div className="container mt-20 mb-20">
        {!loading && !error && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "1px solid #f1f5f9", paddingBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "850", color: "#1e293b", margin: 0 }}>Active Shuttle Network</h2>
              <p style={{ color: "#64748b", fontWeight: "600", marginTop: "4px" }}>{filteredRoutes.length} Available connections found</p>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ background: "#ecfdf5", padding: "10px 20px", borderRadius: "14px", border: "1px solid #d1fae5", fontSize: "0.85rem", fontWeight: "800", color: "#065f46" }}>
                🟢 {routes.length} Live Routes
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div className="loading-spinner mb-4" style={{ margin: "0 auto" }}></div>
            <p className="text-muted" style={{ fontWeight: "700" }}>Syncing shuttle schedules...</p>
          </div>
        )}
        
        {error && <div className="message error"><span>⚠️</span>{error}</div>}

        {!loading && !error && filteredRoutes.length === 0 && (
          <div className="placeholder-container" style={{ padding: "100px 20px" }}>
            <div style={{ fontSize: "6rem", marginBottom: "24px", opacity: 0.1 }}>🗺️</div>
            <h2 style={{ fontWeight: "900", color: "#1e293b", fontSize: "2rem" }}>Route Uncharted</h2>
            <p className="text-muted" style={{ maxWidth: "400px", margin: "0 auto", fontSize: "1.1rem" }}>
              We couldn't find a shuttle route for "<strong>{filterQuery}</strong>". Try a different terminal or building name.
            </p>
            <button onClick={() => setFilterQuery("")} className="primary-button mt-8" style={{ padding: "14px 40px", borderRadius: "16px", background: "#064e3b" }}>Reset Map</button>
          </div>
        )}

        <motion.div 
          className="dashboard-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ gap: "40px", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))" }}
        >
          {filteredRoutes.map(route => (
            <motion.div key={route._id} variants={itemVariants}>
              <RouteCard route={route} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageWrapper>
  );
}

export default BusRoutesPage;
