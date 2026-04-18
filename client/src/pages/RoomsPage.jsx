import { useState, useEffect } from "react";
import RoomCard from "../components/RoomCard";
import PageWrapper from "../components/common/PageWrapper";

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [roomType, setRoomType] = useState("All");



  const fetchRooms = () => {
    setLoading(true);
    let url = `http://localhost:5000/api/rooms?location=${searchTerm}&roomType=${roomType}`;
    if (onlyAvailable) url += "&isAvailable=true";
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setRooms(Array.isArray(data) ? data : (data.data || []));
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch accommodations.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const availableCount = rooms.filter(r => r.isAvailable).length;

  return (
    <PageWrapper>
      {/* 🏘️ Vibrant Housing Hero */}
      <section className="rooms-hero-vibrant">
        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{ textTransform: "uppercase", fontWeight: "800", fontSize: "0.9rem", letterSpacing: "3px", opacity: 0.8 }}>Campus Housing</span>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "900", margin: "16px 0", letterSpacing: "-0.04em" }}>Find Your Space</h1>
          <p style={{ maxWidth: "600px", margin: "0 auto", fontSize: "1.2rem", opacity: 0.9 }}>
            Professional, student-friendly rooms and apartments within walking distance of campus facilities.
          </p>
        </div>
      </section>

      {/* 🔍 Floating Filter Bar */}
      <div className="container" style={{ position: "relative", zIndex: 20 }}>
        <div className="rooms-filter-glass">
          <form onSubmit={handleApplyFilters} className="rooms-filter-grid">
            <div>
              <label className="filter-section-title">Location</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Street or building..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: "100%", padding: "14px 14px 14px 44px", borderRadius: "16px", background: "var(--bg-main)", border: "1px solid #f1f5f9" }}
                />
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}>🔍</span>
              </div>
            </div>

            <div>
              <label className="filter-section-title">Type</label>
              <select
                value={roomType}
                onChange={e => setRoomType(e.target.value)}
                style={{ width: "100%", padding: "14px", borderRadius: "16px", border: "1px solid #f1f5f9", background: "var(--bg-main)", fontWeight: "700" }}
              >
                <option value="All">All Categories</option>
                <option value="Single">Single Room</option>
                <option value="Shared">Shared Space</option>
                <option value="Apartment">Full Apartment</option>
              </select>
            </div>

            <div>
              <label className="filter-section-title">Budget (Rs.)</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ padding: "14px", width: "100%", borderRadius: "16px", background: "var(--bg-main)", border: "1px solid #f1f5f9" }} />
                <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ padding: "14px", width: "100%", borderRadius: "16px", background: "var(--bg-main)", border: "1px solid #f1f5f9" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", height: "54px" }}>
              <div
                className={`filter-pill-toggle ${onlyAvailable ? 'active' : ''}`}
                onClick={() => setOnlyAvailable(!onlyAvailable)}
              >
                {onlyAvailable ? "🟢 Available" : "⚪ Show All"}
              </div>
              <button type="submit" className="primary-button" style={{ height: "100%", borderRadius: "16px", padding: "0 24px", minWidth: "120px", fontWeight: "800" }}>
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mt-20 mb-20">
        {!loading && !error && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "1px solid #f1f5f9", paddingBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "850", color: "#1e293b", margin: 0 }}>Housing Catalog</h2>
              <p style={{ color: "#64748b", fontWeight: "600", marginTop: "4px" }}>Discovered {rooms.length} matching properties</p>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ background: "#f0fdf4", color: "#166534", padding: "10px 20px", borderRadius: "14px", border: "1px solid #bbf7d0", fontSize: "0.85rem", fontWeight: "800" }}>
                🏠 {availableCount} Vacancies
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div className="loading-spinner mb-4" style={{ margin: "0 auto" }}></div>
            <p className="text-muted" style={{ fontWeight: "700" }}>Scanning available listings...</p>
          </div>
        )}

        {error && <div className="message error"><span>⚠️</span>{error}</div>}

        {!loading && !error && rooms.length === 0 && (
          <div className="placeholder-container" style={{ padding: "100px 20px" }}>
            <div style={{ fontSize: "6rem", marginBottom: "24px", opacity: 0.1 }}>🏘️</div>
            <h2 style={{ fontWeight: "900", color: "#1e293b", fontSize: "2rem" }}>No Space Found</h2>
            <p className="text-muted" style={{ maxWidth: "400px", margin: "0 auto", fontSize: "1.1rem" }}>
              Try broadening your budget or search radius to see more options.
            </p>
            <button onClick={() => { setSearchTerm(""); setMinPrice(""); setMaxPrice(""); setRoomType("All"); setOnlyAvailable(false); fetchRooms(); }} className="secondary-button mt-8" style={{ padding: "14px 40px", borderRadius: "16px" }}>Clear All Filters</button>
          </div>
        )}

        <div className="rooms-results-grid">
          {rooms.map(room => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

export default RoomsPage;

