import { Link } from "react-router-dom";
import { checkServiceStatus } from "../utils/timeUtils";

function FoodCard({ service }) {
  const { isOpen: isCurrentlyOpen, statusText } = checkServiceStatus(service.openingHours, service.isOpen);

  // Helper to render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} style={{ color: i < fullStars ? "#fbbf24" : "#e2e8f0", fontSize: "1.2rem" }}>
          {i < fullStars ? "★" : "☆"}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="card shadow-sm hover-lift" style={{ display: "flex", flexDirection: "column", padding: "0", overflow: "hidden", borderRadius: "28px", border: "1px solid #f1f5f9", background: "white", transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}>
      {/* Image Section with Badges */}
      <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
        {service.image ? (
          <img 
            src={service.image} 
            alt={service.restaurantName} 
            className="card-image-hover"
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }} 
          />
        ) : (
          <div style={{ height: "100%", background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>
            🍽️
          </div>
        )}
        
        {/* Category Badge overlay */}
        {service.foodType && (
          <div className="food-badge-premium" style={{ position: "absolute", top: "16px", left: "16px", color: "var(--primary)" }}>
            {service.foodType}
          </div>
        )}

        {/* Price Range overlay */}
        {service.priceRange && (
          <div className="food-badge-premium" style={{ position: "absolute", top: "16px", right: "16px", background: "var(--primary)", color: "white" }}>
            {service.priceRange}
          </div>
        )}

        {/* Status Badge overlay */}
        <div style={{ 
          position: "absolute", 
          bottom: "16px", 
          right: "16px", 
          padding: "6px 14px", 
          borderRadius: "14px", 
          background: "rgba(255, 255, 255, 0.95)", 
          backdropFilter: "blur(8px)",
          display: "flex", 
          alignItems: "center", 
          gap: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <div className={isCurrentlyOpen ? "status-glow-green" : "status-glow-red"} style={{ 
            width: "8px", 
            height: "8px", 
            borderRadius: "50%", 
            background: isCurrentlyOpen ? "#166534" : "#ef4444" 
          }}></div>
          <span style={{ fontWeight: "800", fontSize: "0.75rem", color: isCurrentlyOpen ? "#166534" : "#991b1b", textTransform: "uppercase" }}>
            {statusText}
          </span>
        </div>
      </div>
      
      <div style={{ padding: "28px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <div>
            <h3 style={{ color: "var(--secondary)", fontWeight: "850", fontSize: "1.4rem", margin: 0, letterSpacing: "-0.02em" }}>{service.restaurantName}</h3>
            <p style={{ color: "var(--primary)", fontWeight: "700", fontSize: "0.85rem", marginTop: "4px" }}>{service.mealType}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", background: "#fff9eb", padding: "4px 8px", borderRadius: "8px" }}>
            {renderStars(service.rating)}
          </div>
        </div>

        <p className="text-muted" style={{ fontSize: "0.95rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ opacity: 0.8 }}>📍</span> {service.location}
        </p>
        
        <p className="text-muted" style={{ 
          flexGrow: 1, 
          fontSize: "0.95rem", 
          lineHeight: "1.6",
          display: "-webkit-box", 
          WebkitLineClamp: "3", 
          WebkitBoxOrient: "vertical", 
          overflow: "hidden",
          marginBottom: "24px"
        }}>{service.description}</p>
        
        <div style={{ display: "flex", gap: "12px", marginTop: "auto" }}>
          <Link to={`/food/${service._id}`} style={{ flex: 1, textDecoration: "none" }}>
            <button className="primary-button" style={{ width: "100%", padding: "16px", borderRadius: "16px", fontWeight: "800", background: "var(--secondary)" }}>
              Explore Menu
            </button>
          </Link>
          {service.googleMapsLink && (
            <a href={service.googleMapsLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button className="secondary-button" style={{ width: "54px", height: "54px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, border: "1px solid #e2e8f0" }}>
                🗺️
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
