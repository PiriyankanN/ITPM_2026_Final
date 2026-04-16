import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";
import FoodCard from "../components/FoodCard";
import PageWrapper from "../components/common/PageWrapper";

function FoodServicesPage() {
  const [foodServices, setFoodServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/food")
      .then(res => res.json())
      .then(data => {
        setFoodServices(Array.isArray(data) ? data : (data.data || []));
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to connect to Food Services system.");
        setLoading(false);
      });
  }, []);

  const filteredFood = foodServices.filter(f =>
    f.mealType?.toLowerCase().includes(filterType.toLowerCase()) ||
    f.location?.toLowerCase().includes(filterType.toLowerCase())
  );

  return (
    <PageWrapper>
      {/* 🍕 Vibrant Hero Section */}
      <section className="food-hero-vibrant">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span style={{ textTransform: "uppercase", fontWeight: "800", fontSize: "0.9rem", letterSpacing: "3px", opacity: 0.8 }}>Campus Dining</span>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "900", margin: "16px 0", letterSpacing: "-0.04em" }}>Fuel Your Studies</h1>
          <p style={{ maxWidth: "600px", margin: "0 auto", fontSize: "1.2rem", opacity: 0.9 }}>
            From quick cafeteria bites to healthy gourmet meals, find the perfect fuel for your campus lifestyle.
          </p>
        </motion.div>
      </section>

      {/* 🔍 Floating Filter Bar */}
      <div className="container" style={{ position: "relative", zIndex: 20 }}>
        <div className="food-filter-glass">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", padding: "8px" }}>
            <div style={{ flex: "1", minWidth: "280px", position: "relative" }}>
              <span style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", fontSize: "1.2rem" }}>🔍</span>
              <input
                type="text"
                placeholder="Search by restaurant, category, or location..."
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "16px 16px 16px 56px",
                  borderRadius: "24px",
                  border: "none",
                  outline: "none",
                  background: "var(--bg-main)",
                  fontSize: "1rem",
                  fontWeight: "600"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "4px" }}>
              {["Breakfast", "Lunch", "Dinner", "All types of food"].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(filterType === type ? "" : type)}
                  className={`meal-type-pill ${filterType === type ? 'active' : ''}`}
                >
                  {type === "Breakfast" && "🍳"}
                  {type === "Lunch" && "🍱"}
                  {type === "Dinner" && "🥘"}
                  {type === "All types of food" && "🍽️"}
                  {type}
                </button>
              ))}
              {filterType && (
                <button
                  onClick={() => setFilterType("")}
                  className="meal-type-pill"
                  style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fee2e2" }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-20 mb-20">
        {!loading && !error && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "850", color: "var(--secondary)" }}>Today's Menu</h2>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ background: "#f0fdf4", padding: "8px 16px", borderRadius: "12px", border: "1px solid #dcfce7", fontSize: "0.85rem", fontWeight: "700", color: "#166534" }}>
                🍽️ {foodServices.length} Outlets
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div className="loading-spinner mb-4" style={{ margin: "0 auto" }}></div>
            <p className="text-muted" style={{ fontWeight: "600" }}>Fetching today's fresh finds...</p>
          </div>
        )}

        {error && <div className="message error"><span>⚠️</span>{error}</div>}

        {!loading && !error && filteredFood.length === 0 && (
          <div className="placeholder-container" style={{ padding: "100px 20px" }}>
            <div style={{ fontSize: "6rem", marginBottom: "24px", opacity: 0.1 }}>🍱</div>
            <h2 style={{ fontWeight: "900", color: "#1e293b", fontSize: "2rem" }}>No Tasty Matches</h2>
            <p className="text-muted" style={{ maxWidth: "400px", margin: "0 auto", fontSize: "1.1rem" }}>
              We couldn't find anything matching "<strong>{filterType}</strong>". Try a different meal category or location.
            </p>
            <button onClick={() => setFilterType("")} className="primary-button mt-8" style={{ padding: "14px 40px", borderRadius: "16px" }}>Reset All Filters</button>
          </div>
        )}

        <motion.div
          className="dashboard-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ gap: "40px", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}
        >
          {filteredFood.map(service => (
            <motion.div key={service._id} variants={itemVariants}>
              <FoodCard service={service} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageWrapper>
  );
}

export default FoodServicesPage;
