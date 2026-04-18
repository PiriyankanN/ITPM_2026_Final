import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

function ManageBusRoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRoutes = () => {
    fetch("http://localhost:5000/api/routes")
      .then(res => res.json())
      .then(data => {
        setRoutes(Array.isArray(data) ? data : (data.data || []));
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch route records.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bus route?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/routes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        fetchRoutes();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete route.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <PageHeader title="Manage Bus Routes" description="Adjust campus transit links and path schedules." />
        <Link to="/admin/routes/add">
          <button className="primary-button" style={{ background: "#8b5cf6", border: "none" }}>+ Add Transit Route</button>
        </Link>
      </div>

      {loading && <p>Loading transit network...</p>}
      {error && <div className="message error"><span>⚠️</span>{error}</div>}

      {!loading && !error && routes.length === 0 && (
        <p className="text-muted">No campus transit loops configured.</p>
      )}

      {routes.length > 0 && (
        <div style={{ overflowX: "auto", background: "white", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid var(--border-light)" }}>
                <th style={{ padding: "16px" }}>Route Label</th>
                <th style={{ padding: "16px" }}>Origin</th>
                <th style={{ padding: "16px" }}>Destination</th>
                <th style={{ padding: "16px" }}>Fare Info</th>
                <th style={{ padding: "16px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map(rt => (
                <tr key={rt._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "16px", fontWeight: "600" }}>{rt.routeName}</td>
                  <td style={{ padding: "16px", color: "var(--text-muted)" }}>{rt.startLocation}</td>
                  <td style={{ padding: "16px", color: "var(--text-muted)" }}>{rt.endLocation}</td>
                  <td style={{ padding: "16px", color: "var(--text-muted)" }}>{rt.fare ? rt.fare : "Free"}</td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <Link to={`/admin/routes/edit/${rt._id}`} state={{ route: rt }}>
                      <button className="secondary-button" style={{ padding: "6px 12px", marginRight: "8px", fontSize: "0.9rem" }}>Edit</button>
                    </Link>
                    <button onClick={() => handleDelete(rt._id)} className="danger-button" style={{ padding: "6px 12px", fontSize: "0.9rem" }}>Delete</button>
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

export default ManageBusRoutesPage;
