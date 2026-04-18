import { Link } from "react-router-dom";

function RouteCard({ route }) {
  return (
    <div className="transit-ticket-shell">
      {/* Ticket Header Area */}
      <div style={{ background: "linear-gradient(135deg, #064e3b, #10b981)", padding: "24px", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: "900", fontSize: "1.4rem", letterSpacing: "-0.02em" }}>
              {route.routeName}
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "0.8rem", opacity: 0.8, fontWeight: "600" }}>Campus Shuttle Service</p>
          </div>
          <div className="transit-badge-glass">
            Transit
          </div>
        </div>
      </div>
      
      <div className="ticket-perforation"></div>

      <div style={{ padding: "24px", background: "white" }}>
        {/* Main Departure/Arrival Block */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "24px", background: "#f8fafc", padding: "20px", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
          <div className="route-dot-path">
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10b981", border: "3px solid #dcfce7" }}></div>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#064e3b", border: "3px solid #ecfdf5" }}></div>
          </div>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "60px" }}>
            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>Start Point</p>
              <p style={{ fontWeight: "800", color: "#1e293b", margin: 0, fontSize: "1rem" }}>{route.startLocation}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>Destination</p>
              <p style={{ fontWeight: "800", color: "#1e293b", margin: 0, fontSize: "1rem" }}>{route.endLocation}</p>
            </div>
          </div>
        </div>

        {/* Stops Summary */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>📍</span> Main Junctions
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {(Array.isArray(route.mainStops) ? route.mainStops : [route.mainStops]).map((stop, idx) => (
              <span key={idx} style={{ background: "#f1f5f9", padding: "6px 12px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: "600", color: "#475569" }}>
                {stop}
              </span>
            ))}
          </div>
        </div>
        
        {/* Footer Area */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "20px", borderTop: "1px solid #f1f5f9" }}>
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "2px" }}>Fare Type</p>
            <p style={{ fontWeight: "900", color: "#10b981", margin: 0, fontSize: "1.2rem" }}>{route.fare || "Standard Fare"}</p>
          </div>
          
          <Link to={`/routes/${route._id}`} style={{ textDecoration: "none" }}>
            <button className="primary-button" style={{ 
              padding: "14px 24px", 
              borderRadius: "16px", 
              fontWeight: "850", 
              fontSize: "0.85rem",
              background: "#1e293b",
              boxShadow: "0 8px 15px rgba(30, 41, 59, 0.2)"
            }}>
              View Schedule
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RouteCard;
