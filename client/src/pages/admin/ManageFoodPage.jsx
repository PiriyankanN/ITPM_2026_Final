import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

function ManageFoodPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFoods = () => {
    fetch("http://localhost:5000/api/food")
      .then(res => res.json())
      .then(data => {
        setFoods(Array.isArray(data) ? data : (data.data || []));
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch food services.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food service?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/food/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        fetchFoods();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete food service.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <PageHeader title="Manage Food Services" description="Coordinate dining options and campus menu entries." />
        <Link to="/admin/food/add">
          <button className="primary-button" style={{ background: "#2563eb", border: "none" }}>+ Add Meal Service</button>
        </Link>
      </div>

      {loading && <p>Loading directory...</p>}
      {error && <div className="message error"><span>⚠️</span>{error}</div>}

      {!loading && !error && foods.length === 0 && (
        <p className="text-muted">No food services currently added to tracking.</p>
      )}

      {foods.length > 0 && (
        <div style={{ overflowX: "auto", background: "white", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid var(--border-light)" }}>
                <th style={{ padding: "16px" }}>Restaurant Name</th>
                <th style={{ padding: "16px" }}>Location</th>
                <th style={{ padding: "16px" }}>Meal Type</th>
                <th style={{ padding: "16px" }}>Contact</th>
                <th style={{ padding: "16px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map(food => (
                <tr key={food._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "16px", fontWeight: "600", color: "var(--primary)" }}>{food.restaurantName}</td>
                  <td style={{ padding: "16px", color: "var(--text-muted)" }}>{food.location}</td>
                  <td style={{ padding: "16px", color: "var(--text-muted)" }}>{food.mealType}</td>
                  <td style={{ padding: "16px", color: "var(--text-muted)" }}>{food.contactInfo}</td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <Link to={`/admin/food/edit/${food._id}`} state={{ food }}>
                      <button className="secondary-button" style={{ padding: "6px 12px", marginRight: "8px", fontSize: "0.9rem" }}>Edit</button>
                    </Link>
                    <button onClick={() => handleDelete(food._id)} className="danger-button" style={{ padding: "6px 12px", fontSize: "0.9rem" }}>Delete</button>
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

export default ManageFoodPage;
