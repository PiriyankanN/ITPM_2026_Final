import { Link } from "react-router-dom";

function RoomCard({ room, compact = false }) {
  // Determine availability status colors
  const statusConfig = room.isAvailable 
    ? { bg: "#DCFCE7", color: "#166534", label: "Available Now" }
    : { bg: "#FEF2F2", color: "#991B1B", label: "Waitlisted" };

  return (
    <div 
      className="card fade-in" 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        padding: "0", 
        overflow: "hidden", 
        height: "100%",
        width: compact ? "300px" : "100%",
        borderRadius: "24px",
        background: "white",
        border: "1px solid #f1f5f9"
      }}
    >
      {/* Image Area with Badge Overlay */}
      <div style={{ position: "relative", height: compact ? "160px" : "220px", width: "100%", overflow: "hidden" }}>
        <img 
          src={room.images && room.images.length > 0 ? room.images[0] : "https://via.placeholder.com/400x220?text=No+Room+Image"} 
          alt={room.title} 
          className="card-image-hover"
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover",
            transition: "transform 0.5s ease" 
          }} 
          onError={(e) => { e.target.src = "https://via.placeholder.com/400x220?text=Room+Image+Unavailable"; }}
        />
        <div style={{ 
          position: "absolute", 
          top: "12px", 
          right: "12px", 
          padding: "4px 10px", 
          background: statusConfig.bg, 
          color: statusConfig.color, 
          borderRadius: "999px",
          fontSize: "0.7rem",
          fontWeight: "800",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          backdropFilter: "blur(4px)"
        }}>
          {statusConfig.label}
        </div>
      </div>
      
      {/* Content Area */}
      <div style={{ padding: compact ? "20px" : "28px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <div style={{ marginBottom: "12px" }}>
          <span style={{ 
            fontSize: "0.7rem", 
            color: "var(--primary)", 
            fontWeight: "700", 
            textTransform: "uppercase", 
            letterSpacing: "1px" 
          }}>
            {room.roomType || "Accommodation"}
          </span>
          <h3 style={{ 
            color: "var(--secondary)", 
            fontSize: compact ? "1.1rem" : "1.4rem", 
            fontWeight: "800", 
            margin: "4px 0 8px",
            lineHeight: "1.2"
          }}>
            {room.title}
          </h3>
          <p className="text-muted" style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "1rem" }}>📍</span> {room.locationName || room.location}
          </p>
        </div>

        {!compact && (
          <p style={{ 
            fontSize: "0.95rem", 
            color: "var(--text-muted)", 
            lineHeight: "1.6", 
            marginBottom: "24px",
            display: "-webkit-box", 
            WebkitLineClamp: "3", 
            WebkitBoxOrient: "vertical", 
            overflow: "hidden",
            flexGrow: 1
          }}>
            {room.description}
          </p>
        )}
        
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          paddingTop: compact ? "16px" : "24px", 
          borderTop: "1px solid #f1f5f9",
          marginTop: "auto"
        }}>
          <div>
            <span style={{ fontSize: compact ? "1.2rem" : "1.5rem", fontWeight: "800", color: "var(--primary)" }}>Rs.{room.price}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "2px" }}>/ mo</span>
          </div>
          
          <div style={{ display: "flex", gap: "8px" }}>
            <Link to={`/rooms/${room._id}`}>
              <button 
                className="primary-button" 
                style={{ padding: compact ? "8px 16px" : "12px 24px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "700" }}
              >
                {compact ? "View" : "Details"}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;
