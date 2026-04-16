import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import FoodServiceForm from "../../components/FoodServiceForm";

function AddFoodPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        navigate("/admin/food");
      } else {
        setError(data.message || "Failed to create food service.");
      }
    } catch (err) {
      setError("Network or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-8 mb-12" style={{ maxWidth: "800px" }}>
      <PageHeader title="Add Meal Service" description="Log a new restaurant or dining hall onto the grid." />

      <div className="card mt-6">
        {error && <div className="message error mb-4"><span>⚠️</span>{error}</div>}

        {loading ? (
          <p className="text-center py-8">Processing...</p>
        ) : (
          <FoodServiceForm onSubmit={handleCreate} onCancel={() => navigate("/admin/food")} />
        )}
      </div>
    </div>
  );
}

export default AddFoodPage;
