import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

function ManageRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRooms = () => {
    fetch("http://localhost:5000/api/rooms")
      .then(res => res.json())
      .then(data => {
        setRooms(Array.isArray(data) ? data : (data.data || []));
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch rooms.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        fetchRooms(); 
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete room.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <PageHeader title="Manage Rooms" description="View, modify, or remove campus housing allocations." />
        <Link to="/admin/rooms/add">
          <button className="primary-button" style={{ background: "#10b981", border: "none" }}>+ Add New Room</button>
        </Link>
      </div>

      {loading && <p>Loading directory...</p>}
      {error && <div className="message error"><span>⚠️</span>{error}</div>}

      {!loading && !error && rooms.length === 0 && (
        <p className="text-muted">No rooms currently allocated.</p>
      )}

      {rooms.length > 0 && (
        <div style={{ overflowX: "auto", background: "white", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid var(--border-light)" }}>
                <th style={{ padding: "16px" }}>Title</th>
                <th style={{ padding: "16px" }}>Type</th>
                <th style={{ padding: "16px" }}>Location</th>
                <th style={{ padding: "16px" }}>Price</th>
                <th style={{ padding: "16px" }}>Status</th>
                <th style={{ padding: "16px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "16px", fontWeight: "500" }}>{room.title}</td>
                  <td style={{ padding: "16px", color: "var(--text-muted)" }}>{room.roomType}</td>
                  <td style={{ padding: "16px", color: "var(--text-muted)" }}>{room.location}</td>
                  <td style={{ padding: "16px", color: "var(--text-muted)" }}>Rs.{room.price}</td>
                  <td style={{ padding: "16px" }}>
                    <span style={{ 
                      padding: "4px 8px", 
                      background: room.isAvailable ? "#dcfce7" : "#fee2e2", 
                      color: room.isAvailable ? "#166534" : "#991b1b", 
                      borderRadius: "999px", fontSize: "0.85rem", fontWeight: "600"
                    }}>
                      {room.isAvailable ? "Available" : "Waitlist"}
                    </span>
                  </td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <Link to={`/admin/rooms/edit/${room._id}`} state={{ room }}>
                      <button className="secondary-button" style={{ padding: "6px 12px", marginRight: "8px", fontSize: "0.9rem" }}>Edit</button>
                    </Link>
                    <button onClick={() => handleDelete(room._id)} className="danger-button" style={{ padding: "6px 12px", fontSize: "0.9rem" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageRoomsPage;
