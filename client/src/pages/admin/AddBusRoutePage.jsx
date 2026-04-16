import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import BusRouteForm from "../../components/BusRouteForm";

function AddBusRoutePage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/routes", {
        method: "POST",
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
        setError(data.message || "Failed to create bus route.");
      }
    } catch (err) {
      setError("Network or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-8 mb-12" style={{ maxWidth: "800px" }}>
      <PageHeader title="Add Transit Flow" description="Link standard university buildings or regional maps together." />

      <div className="card mt-6">
        {error && <div className="message error mb-4"><span>⚠️</span>{error}</div>}

        {loading ? (
          <p className="text-center py-8">Processing...</p>
        ) : (
          <BusRouteForm onSubmit={handleCreate} onCancel={() => navigate("/admin/routes")} />
        )}
      </div>
    </div>
  );
}

export default AddBusRoutePage;
