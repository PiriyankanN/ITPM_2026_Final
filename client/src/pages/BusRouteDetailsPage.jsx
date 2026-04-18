import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../components/common/PageWrapper";

function BusRouteDetailsPage() {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/routes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRoute(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch transit details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      <div className="loading-spinner mb-4" style={{ margin: "0 auto" }}></div>
      <p className="text-muted">Locating transit vehicle...</p>
    </div>
  );
  
  if (error) return (
    <div className="container mt-12">
      <div className="message error"><span>⚠️</span>{error}</div>
      <Link to="/routes" className="secondary-button mt-4">Back to Routes</Link>
    </div>
  );

  if (!route) return null;

  return (
    <div className="container mt-8 mb-20">
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <Link to="/routes" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#64748b", textDecoration: "none", fontWeight: "700", marginBottom: "32px", fontSize: "0.9rem" }}>
          <span>←</span> All Transit Routes
        </Link>

        {/* Route Header Card */}
        <div className="card shadow-sm mb-10" style={{ padding: "40px", borderRadius: "24px", border: "1px solid #f1f5f9", background: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <span style={{ background: "#f0fdf4", color: "var(--primary)", padding: "6px 16px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", border: "1px solid #dcfce7" }}>
                  Active Route
                </span>
                <span style={{ background: "#f8fafc", color: "#64748b", padding: "6px 16px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "800" }}>
                  ID: {route._id.slice(-6).toUpperCase()}
                </span>
              </div>
              <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: "#1e293b", margin: 0, letterSpacing: "-1px" }}>{route.routeName}</h1>
            </div>
            
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1px" }}>Standard Fare</p>
              <div style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--primary)" }}>
                {route.fare || "Free of Charge"}
              </div>
            </div>
          </div>

          {/* Simple Start-End Bar */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "24px", padding: "24px", background: "#f8fafc", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "700", marginBottom: "4px" }}>ORIGIN</p>
              <p style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>{route.startLocation}</p>
            </div>
            <div style={{ fontSize: "1.5rem", opacity: 0.3 }}>➜</div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "700", marginBottom: "4px" }}>DESTINATION</p>
              <p style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>{route.endLocation}</p>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "40px" }}>
          {/* Stops Timeline */}
          <div>
            <h3 style={{ fontSize: "1.25rem", color: "#1e293b", marginBottom: "24px", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ background: "var(--primary)", color: "white", width: "32px", height: "32px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>📍</span> 
              Route Timeline & Stops
            </h3>
            
            <div style={{ position: "relative", paddingLeft: "32px", borderLeft: "4px dashed #e2e8f0", marginLeft: "14px" }}>
              {/* Start Stop */}
              <div style={{ position: "relative", marginBottom: "40px" }}>
                <div style={{ position: "absolute", left: "-42px", top: "0", width: "16px", height: "16px", borderRadius: "50%", background: "var(--primary)", border: "4px solid white", boxShadow: "0 0 0 4px #dcfce7" }}></div>
                <h4 style={{ margin: "0 0 4px 0", color: "#1e293b", fontWeight: "800" }}>{route.startLocation}</h4>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>Starting Point</p>
              </div>

              {/* Main Stops */}
              {route.mainStops && route.mainStops.map((stop, index) => (
                <div key={index} style={{ position: "relative", marginBottom: "40px" }}>
                  <div style={{ position: "absolute", left: "-40px", top: "4px", width: "12px", height: "12px", borderRadius: "50%", background: "white", border: "3px solid #94a3b8" }}></div>
                  <h4 style={{ margin: "0 0 4px 0", color: "#1e293b", fontWeight: "700" }}>{stop}</h4>
                  <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>Regular Stop</p>
                </div>
              ))}

              {/* End Stop */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "-42px", top: "0", width: "16px", height: "16px", borderRadius: "50%", background: "#ef4444", border: "4px solid white", boxShadow: "0 0 0 4px #fee2e2" }}></div>
                <h4 style={{ margin: "0 0 4px 0", color: "#1e293b", fontWeight: "800" }}>{route.endLocation}</h4>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>Final Destination</p>
              </div>
            </div>
          </div>

          {/* Additional Info Sidebar */}
          <div>
            <div className="card shadow-sm" style={{ padding: "32px", borderRadius: "24px", border: "1px solid #f1f5f9", background: "white", marginBottom: "24px" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b", marginBottom: "20px" }}>Transit Highlights</h4>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ fontSize: "1.5rem" }}>🏢</div>
                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px" }}>Key Landmark</p>
                    <p style={{ fontWeight: "700", color: "#1e293b", margin: 0 }}>{route.nearbyLandmark || "Standard Route"}</p>
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ fontSize: "1.5rem" }}>🚌</div>
                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px" }}>Bus Type</p>
                    <p style={{ fontWeight: "700", color: "#1e293b", margin: 0 }}>Campus Shuttle</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: "24px", background: "linear-gradient(135deg, #1e293b, #334155)", borderRadius: "24px", color: "white" }}>
              <h4 style={{ fontWeight: "800", marginBottom: "12px", fontSize: "1rem" }}>Need Help?</h4>
              <p style={{ fontSize: "0.85rem", opacity: 0.8, lineHeight: "1.6", marginBottom: "20px" }}>
                For real-time tracking or delay notifications, please check the official university transit dashboard.
              </p>
              <button 
                onClick={() => window.print()} 
                style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "white", fontWeight: "700", cursor: "pointer" }}
              >
                🖨️ Print Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusRouteDetailsPage;
