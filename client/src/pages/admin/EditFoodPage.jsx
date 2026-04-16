import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import FoodServiceForm from "../../components/FoodServiceForm";

function EditFoodPage() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const { id } = useParams();
  
  const [foodData, setFoodData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/food/${id}`);
        const data = await response.json();
        if (response.ok) {
          setFoodData(data);
        } else {
          setError(data.message || "Failed to load food service details.");
        }
      } catch (err) {
        setError("Network error fetching food data.");
      } finally {
        setLoading(false);
      }
    };

    if (locationState.state?.food) {
      setFoodData(locationState.state.food);
    } else {
      fetchFood();
    }
  }, [id, locationState]);

  const handleUpdate = async (formData) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5000/api/food/${id}`, {
        method: "PUT",
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
        setError(data.message || "Failed to edit food service.");
      }
    } catch (err) {
      setError("Network or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-8 mb-12" style={{ maxWidth: "800px" }}>
      <PageHeader title="Update Meal Service" description={`Editing details for food service ID: ${id}`} />

      <div className="card mt-6">
        {error && <div className="message error mb-4"><span>⚠️</span>{error}</div>}
        
        {!foodData && !error ? (
          <p className="text-center py-8">Loading food service details...</p>
        ) : (
          <FoodServiceForm 
            editingFood={foodData} 
            onSubmit={handleUpdate} 
            onCancel={() => navigate("/admin/food")} 
          />
        )}
      </div>
    </div>
  );
}

export default EditFoodPage;
