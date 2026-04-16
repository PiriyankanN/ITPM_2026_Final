import { useEffect, useState } from "react";
import FoodServiceList from "../../components/FoodServiceList";
import PageHeader from "../../components/PageHeader";
import StatusMessage from "../../components/StatusMessage";
import { getFoodServices } from "../../services/foodService";

function FoodServicesPage() {
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({ location: "", mealType: "" });
  const [error, setError] = useState("");

  const loadServices = async (activeFilters = filters) => {
    try {
      const data = await getFoodServices(activeFilters);
      setServices(data);
      setError("");
    } catch (loadError) {
      setError("Unable to load food services.");
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    loadServices(updatedFilters);
  };

  return (
    <div>
      <PageHeader
        title="Food Service & Meal Discovery"
        description="Search for food services by location and meal type."
      />

      <StatusMessage message={error} type="error" />

      <div className="list-card">
        <h3>Food Services</h3>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="foodLocation">Location Filter</label>
            <input id="foodLocation" name="location" value={filters.location} onChange={handleFilterChange} placeholder="Search by location" />
          </div>

          <div className="form-group">
            <label htmlFor="mealTypeFilter">Meal Type</label>
            <select id="mealTypeFilter" name="mealType" value={filters.mealType} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>
        </div>

        <FoodServiceList services={services} />
      </div>
    </div>
  );
}

export default FoodServicesPage;
