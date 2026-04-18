import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import BusRouteForm from "../../components/BusRouteForm";

function EditBusRoutePage() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const { id } = useParams();
  
  const [routeData, setRouteData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/routes/${id}`);
        const data = await response.json();
        if (response.ok) {
          setRouteData(data);
        } else {
          setError(data.message || "Failed to load bus route details.");
        }
      } catch (err) {
        setError("Network error fetching route data.");
      } finally {
        setLoading(false);
      }
    };

    if (locationState.state?.route) {
      setRouteData(locationState.state.route);
    } else {
      fetchRoute();
    }
  }, [id, locationState]);

  const handleUpdate = async (formData) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5000/api/routes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        navigate("/admin/routes");
      } else {
        setError(data.message || "Failed to edit bus route.");
      }
    } catch (err) {
      setError("Network or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-8 mb-12" style={{ maxWidth: "800px" }}>
      <PageHeader title="Update Transit Form" description={`Editing schedule block: ${id}`} />

      <div className="card mt-6">
        {error && <div className="message error mb-4"><span>⚠️</span>{error}</div>}
        
        {!routeData && !error ? (
          <p className="text-center py-8">Loading route details...</p>
        ) : (
          <BusRouteForm 
            editingRoute={routeData} 
            onSubmit={handleUpdate} 
            onCancel={() => navigate("/admin/routes")} 
          />
        )}
      </div>
    </div>
  );
}

export default EditBusRoutePage;
