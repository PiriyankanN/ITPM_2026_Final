import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import PageWrapper from "../../components/common/PageWrapper";

function FoodMenuPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/food/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data._id) {
          setService(data);
        } else {
          setError(data.message || "Menu not found.");
        }
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch menu details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <PageWrapper>
      <div className="container mt-12 text-center">
        <div className="loading-spinner" style={{ margin: "0 auto" }}></div>
        <p className="mt-4 text-muted">Preparing the menu...</p>
      </div>
    </PageWrapper>
  );

  if (error) return (
    <PageWrapper>
      <div className="container mt-12">
        <div className="message error"><span>⚠️</span>{error}</div>
        <Link to="/food" className="secondary-button mt-4" style={{ display: "inline-block" }}>Back to Discovery</Link>
      </div>
    </PageWrapper>
  );

  if (!service) return null;

  // Group items by category
  const categories = ["Breakfast", "Lunch", "Dinner", "Snacks", "Beverages", "Other"];
  const groupedMenu = (service.menuItems || []).reduce((acc, item) => {
    const cat = item.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  // Identify which categories actually have items
  const activeCategories = categories.filter(cat => groupedMenu[cat] && groupedMenu[cat].length > 0);
  
  // Add any categories not in our primary list but present in data
  Object.keys(groupedMenu).forEach(cat => {
    if (!categories.includes(cat)) activeCategories.push(cat);
  });

  return (
    <PageWrapper>
      <div className="container mt-8 mb-20">
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <header style={{ marginBottom: "40px" }}>
            <Link to={`/food/${id}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#64748b", textDecoration: "none", fontWeight: "700", marginBottom: "24px", fontSize: "0.9rem" }}>
              <span>←</span> Back to {service.restaurantName}
            </Link>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: "#1e293b", margin: 0 }}>Discover Our Menu</h1>
                <p style={{ fontSize: "1.1rem", color: "#64748b", marginTop: "8px" }}>Explored high-quality meals served at <span style={{ color: "var(--primary)", fontWeight: "700" }}>{service.restaurantName}</span></p>
              </div>
              <div style={{ background: "#f0fdf4", padding: "12px 24px", borderRadius: "16px", border: "1px solid #dcfce7", textAlign: "right" }}>
                <span style={{ display: "block", fontSize: "0.75rem", fontWeight: "800", color: "#166534", textTransform: "uppercase", letterSpacing: "1px" }}>Total Items</span>
                <span style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--primary)" }}>{service.menuItems?.length || 0}</span>
              </div>
            </div>
          </header>

          {activeCategories.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
              {activeCategories.map(category => (
                <section key={category}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b", margin: 0 }}>{category}</h2>
                    <div style={{ flex: 1, height: "2px", background: "linear-gradient(90deg, #e2e8f0, transparent)" }}></div>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {groupedMenu[category].map((item, idx) => (
                      <div key={idx} className="card shadow-sm" style={{ padding: "24px", borderRadius: "20px", border: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "transform 0.2s" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                            <h3 style={{ margin: 0, fontWeight: "800", color: "#1e293b", fontSize: "1.1rem" }}>{item.name}</h3>
                            {!item.isAvailable && (
                              <span style={{ background: "#fef2f2", color: "#ef4444", fontSize: "0.7rem", fontWeight: "800", padding: "2px 8px", borderRadius: "8px", textTransform: "uppercase" }}>Sold Out</span>
                            )}
                          </div>
                          {item.description && (
                            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "0.9rem", maxWidth: "500px" }}>{item.description}</p>
                          )}
                        </div>
                        <div style={{ textAlign: "right", minWidth: "100px" }}>
                          <span style={{ fontSize: "1.25rem", fontWeight: "900", color: "var(--primary)" }}>Rs.{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="card shadow-sm" style={{ padding: "60px", textAlign: "center", borderRadius: "24px" }}>
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📜</div>
              <h2 style={{ fontWeight: "800", color: "#1e293b" }}>Menu Under Maintenance</h2>
              <p className="text-muted" style={{ maxWidth: "400px", margin: "16px auto 0" }}>We are currently updating our digital menu records. Please check back shortly or visit us in person!</p>
              <Link to={`/food/${id}`} className="primary-button mt-8" style={{ display: "inline-block" }}>Back to Details</Link>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

export default FoodMenuPage;
