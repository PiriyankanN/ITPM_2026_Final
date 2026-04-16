import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { checkServiceStatus } from "../utils/timeUtils";

function FoodServiceDetailsPage() {
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
          setError(data.message || "Service not found.");
        }
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch service details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container mt-12"><p>Loading store details...</p></div>;
  if (error) return <div className="container mt-12"><div className="message error"><span>⚠️</span>{error}</div></div>;
  if (!service) return null;

  const { isOpen: isCurrentlyOpen, statusText } = checkServiceStatus(service.openingHours, service.isOpen);

  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} style={{ color: i < fullStars ? "#fbbf24" : "#e2e8f0", fontSize: "1.5rem" }}>
          {i < fullStars ? "★" : "☆"}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="container mt-8 mb-20">
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Link to="/food" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#64748b", textDecoration: "none", fontWeight: "700", marginBottom: "32px", fontSize: "0.9rem" }}>
          <span>←</span> Back to Discovery
        </Link>
        
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "48px" }}>
          
          <div>
            
            <div className="card shadow-sm" style={{ padding: "0", overflow: "hidden", borderRadius: "24px", border: "1px solid #f1f5f9", marginBottom: "40px" }}>
              {service.image ? (
                <img src={service.image} alt={service.restaurantName} style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }} />
              ) : (
                <div style={{ height: "350px", background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "6rem" }}>
                  🍽️
                </div>
              )}
              
              <div style={{ padding: "40px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <span style={{ background: "var(--primary)", color: "white", padding: "4px 12px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase" }}>
                        {service.mealType}
                      </span>
                      {service.foodType && (
                        <span style={{ background: "#f1f5f9", color: "#475569", padding: "4px 12px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "800" }}>
                          {service.foodType}
                        </span>
                      )}
                    </div>
                    <h1 style={{ fontSize: "3rem", fontWeight: "900", color: "#1e293b", margin: 0, letterSpacing: "-1px" }}>{service.restaurantName}</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px" }}>
                      {renderStars(service.rating)}
                      <span style={{ color: "#64748b", fontWeight: "600", marginLeft: "4px" }}>({service.rating || "0.0"})</span>
                    </div>
                  </div>
                  
                  {service.googleMapsLink && (
                    <a href={service.googleMapsLink} target="_blank" rel="noopener noreferrer" className="primary-button" style={{ textDecoration: "none", padding: "16px 28px", borderRadius: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span>📍</span> View Directions
                    </a>
                  )}
                </div>

                <div className="mb-10">
                  <h3 style={{ fontSize: "1.25rem", color: "#1e293b", marginBottom: "16px", fontWeight: "800" }}>About this service</h3>
                  <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#475569" }}>{service.description}</p>
                </div>

                
                {/* Menu Preview / Action */}
                <div style={{ background: "#f8fafc", padding: "32px", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "1.25rem", color: "#1e293b", margin: 0, fontWeight: "800", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span>✨</span> Signature Menu Items
                    </h3>
                    <Link to={`/food/${id}/menu`} className="primary-button" style={{ textDecoration: "none", padding: "10px 20px", fontSize: "0.85rem" }}>
                      View Full Menu
                    </Link>
                  </div>
                  
                  {service.menuItems && service.menuItems.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                      {service.menuItems.slice(0, 6).map((item, index) => (
                        <div key={index} style={{ background: "white", padding: "10px 20px", borderRadius: "14px", border: "1px solid #e2e8f0", color: "#334155", fontWeight: "700", fontSize: "0.95rem", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                          {typeof item === 'string' ? item : item.name}
                        </div>
                      ))}
                      {service.menuItems.length > 6 && (
                        <div style={{ padding: "10px", color: "#64748b", fontSize: "0.85rem", fontWeight: "600" }}>
                          +{service.menuItems.length - 6} more items
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted" style={{ margin: 0, fontSize: "0.9rem" }}>No signature items listed yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          
          <div>
            <div style={{ position: "sticky", top: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="card shadow-sm" style={{ padding: "32px", borderRadius: "24px", border: "1px solid #f1f5f9" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "28px", color: "#1e293b" }}>Service Details</h2>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1px" }}>Opening Hours</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>🕘</div>
                      <div>
                        <p style={{ fontWeight: "700", color: "#1e293b", margin: 0 }}>{service.openingHours || "Contact for hours"}</p>
                        <span style={{ 
                          fontSize: "0.7rem", 
                          fontWeight: "800", 
                          color: isCurrentlyOpen ? "#166534" : "#ef4444",
                          textTransform: "uppercase",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          marginTop: "2px"
                        }}>
                          {isCurrentlyOpen ? "●" : "○"} {statusText}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1px" }}>Pricing Range</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>💵</div>
                      <p style={{ fontWeight: "700", color: "#1e293b" }}>{service.priceRange || "Varies by entry"}</p>
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1px" }}>Location</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>📍</div>
                      <p style={{ fontWeight: "700", color: "#1e293b" }}>{service.location}</p>
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1px" }}>Direct Support</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>📞</div>
                      <p style={{ fontWeight: "700", color: "#1e293b" }}>{service.contactInfo}</p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "32px", padding: "20px", background: "#fefce8", borderRadius: "20px", border: "1px solid #fef08a" }}>
                  <p style={{ fontSize: "0.85rem", color: "#854d0e", lineHeight: "1.5" }}>
                     Note: Prices and availability are subject to change. Please contact the service provider for the most up-to-date information.
                  </p>
                </div>
              </div>

              <button 
                className="secondary-button" 
                style={{ padding: "16px", borderRadius: "16px", fontWeight: "700", fontSize: "0.95rem" }}
                onClick={() => window.print()}
              >
                🖨️ Save or Print Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodServiceDetailsPage;
