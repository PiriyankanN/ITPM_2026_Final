import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageWrapper from "../components/common/PageWrapper";

function RoomDetailsPage() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:5000/api/rooms/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data._id) {
          setRoom(data);
        } else {
          setError(data.message || "Room not found.");
        }
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch room details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="container mt-12">
      <div style={{ height: "400px", background: "#f8fafc", borderRadius: "16px", animate: "pulse 2s infinite" }}></div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-12 text-center">
      <div className="message error" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <span>⚠️</span>{error}
      </div>
      <Link to="/rooms" className="primary-button mt-6">Back to All Rooms</Link>
    </div>
  );
  
  if (!room) return null;

  
  const statusConfig = room.isAvailable 
    ? { bg: "#DCFCE7", color: "#166534", label: "Available Now" }
    : { bg: "#FEF2F2", color: "#991B1B", label: "Waitlisted" };

  return (
    <PageWrapper>
      <div className="container mt-8 mb-12">
        
        <div className="mb-8">
          <Link to="/rooms" className="text-primary" style={{ textDecoration: "none", fontWeight: "600", fontSize: "0.95rem" }}>
            ← Back to All Accommodations
          </Link>
        </div>

        
        <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ flex: "1", minWidth: "300px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <span style={{ 
                padding: "4px 12px", 
                background: "var(--primary-light)", 
                color: "var(--primary)", 
                borderRadius: "999px", 
                fontSize: "0.75rem", 
                fontWeight: "700",
                textTransform: "uppercase"
              }}>
                {room.roomType || "Accommodation"}
              </span>
              <span style={{ 
                padding: "4px 12px", 
                background: statusConfig.bg, 
                color: statusConfig.color, 
                borderRadius: "999px", 
                fontSize: "0.75rem", 
                fontWeight: "700" 
              }}>
                {statusConfig.label}
              </span>
            </div>
            <h1 style={{ fontSize: "2.8rem", color: "var(--secondary)", margin: "0 0 8px", fontWeight: "800", lineHeight: "1.1" }}>
              {room.title}
            </h1>
            <p className="text-muted" style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "1.2rem" }}>📍</span> {room.locationName || room.location}
            </p>
          </div>

          <div style={{ textAlign: "right", minWidth: "200px" }}>
            <p className="text-muted" style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700", marginBottom: "4px" }}>Monthly Rent</p>
            <p style={{ fontSize: "2.5rem", fontWeight: "800", color: "var(--primary)", margin: 0 }}>
              Rs.{room.price}<span style={{ fontSize: "1rem", fontWeight: "500", color: "var(--text-muted)" }}> /mo</span>
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "40px" }}>
          
          <div>
            
            <div className="card" style={{ padding: "0", overflow: "hidden", borderRadius: "20px", marginBottom: "32px" }}>
              <div style={{ height: "450px", width: "100%", background: "#f8fafc" }}>
                <img 
                  src={room.images[activeImage]} 
                  alt={room.title} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  onError={(e) => { e.target.src = "https://via.placeholder.com/800x450?text=No+Room+Image"; }}
                />
              </div>
              
              {room.images && room.images.length > 1 && (
                <div style={{ padding: "16px", background: "white", borderTop: "1px solid var(--border-light)", display: "flex", gap: "12px", overflowX: "auto" }}>
                  {room.images.map((img, index) => (
                    <div 
                      key={index} 
                      onClick={() => setActiveImage(index)}
                      style={{ 
                        height: "70px", 
                        width: "100px", 
                        flexShrink: 0, 
                        borderRadius: "10px", 
                        overflow: "hidden", 
                        cursor: "pointer",
                        border: activeImage === index ? "3px solid var(--primary)" : "2px solid transparent",
                        transition: "all 0.2s ease",
                        opacity: activeImage === index ? 1 : 0.6
                      }}
                    >
                      <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={`Preview ${index}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            
            <div className="card mb-8" style={{ padding: "32px", borderRadius: "20px" }}>
              <h3 style={{ fontSize: "1.5rem", color: "var(--secondary)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
                <span>📝</span> Property Details
              </h3>
              <p style={{ 
                fontSize: "1.1rem", 
                lineHeight: "1.8", 
                color: "var(--text-main)", 
                whiteSpace: "pre-line",
                marginBottom: "32px"
              }}>
                {room.description}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div style={{ padding: "20px", background: "var(--bg-main)", borderRadius: "16px", border: "1px solid var(--border-light)" }}>
                  <p className="text-muted" style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>Room Type</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: "600" }}>{room.roomType || "Standard Listing"}</p>
                </div>
                <div style={{ padding: "20px", background: "var(--bg-main)", borderRadius: "16px", border: "1px solid var(--border-light)" }}>
                  <p className="text-muted" style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>Security Deposit</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: "600" }}>1 Month Equivalent</p>
                </div>
              </div>
            </div>

            
            <div className="card" style={{ padding: "32px", borderRadius: "20px" }}>
              <h3 style={{ fontSize: "1.5rem", color: "var(--secondary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                <span>📍</span> Neighborhood & Location
              </h3>
              <p className="text-muted" style={{ marginBottom: "20px" }}>
                Located at <strong>{room.location}</strong>. Explore the surrounding area below to see proximity to campus and transit.
              </p>
              
              <div style={{ 
                height: "250px", 
                background: "#f1f5f9", 
                borderRadius: "16px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                flexDirection: "column",
                border: "1px solid var(--border-light)",
                gap: "16px"
              }}>
                <span style={{ fontSize: "3rem" }}>🗺️</span>
                <a 
                  href={room.googleMapsLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="primary-button" 
                  style={{ textDecoration: "none", padding: "12px 32px" }}
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          
          <div style={{ height: "fit-content", position: "sticky", top: "100px" }}>
            <div className="card" style={{ padding: "32px", borderRadius: "24px", boxShadow: "var(--shadow-lg)", borderColor: "var(--primary)" }}>
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "8px" }}>Interested in this room?</h3>
                <p className="text-muted" style={{ fontSize: "0.95rem" }}>Submit an inquiry to the manager to discuss booking and viewings.</p>
              </div>

              <div style={{ background: "var(--bg-main)", padding: "20px", borderRadius: "16px", marginBottom: "24px", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "1.5rem" }}>📞</span>
                  <div>
                    <p style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "700", color: "var(--text-muted)" }}>Manager Contact</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: "700" }}>{room.contactNumber || "Contact Via Inquiry"}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "1.5rem" }}>🛡️</span>
                  <div>
                    <p style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "700", color: "var(--text-muted)" }}>Student Protection</p>
                    <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--primary)" }}>Verified Accommodation ✓</p>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link to="/inquiries/new" state={{ roomId: room._id, subject: `Accommodation Inquiry: ${room.title}` }} style={{ textDecoration: "none" }}>
                  <button className="primary-button" style={{ width: "100%", padding: "18px", fontSize: "1.05rem", fontWeight: "700" }}>
                    🚀 Send Official Inquiry
                  </button>
                </Link>
                <button 
                  className="secondary-button" 
                  style={{ width: "100%", padding: "14px", fontSize: "0.95rem" }}
                  onClick={() => window.print()}
                >
                  🖨️ Print Details
                </button>
              </div>
              
              <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "20px" }}>
                Usually responds within <span style={{ color: "var(--primary)", fontWeight: "700" }}>24 hours</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default RoomDetailsPage;
