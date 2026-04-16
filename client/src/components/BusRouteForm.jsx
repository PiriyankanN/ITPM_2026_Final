import { useState } from "react";

const initialForm = {
  routeName: "",
  startLocation: "",
  endLocation: "",
  mainStops: "",
  nearbyLandmark: ""
};

function BusRouteForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.routeName.trim()) newErrors.routeName = "Route name is required";
    if (!formData.startLocation.trim()) newErrors.startLocation = "Start location is required";
    if (!formData.endLocation.trim()) newErrors.endLocation = "End location is required";
    if (!formData.mainStops.trim()) newErrors.mainStops = "At least one stop is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      mainStops: formData.mainStops
        .split(",")
        .map((stop) => stop.trim())
        .filter(Boolean)
    };

    await onSubmit(payload);
    setFormData(initialForm);
  };

  return (
    <div className="form-card">
      <h3>Add Bus Route</h3>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label htmlFor="routeName">Route Name</label>
          <input id="routeName" name="routeName" value={formData.routeName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="startLocation">Start Location</label>
          <input
            id="startLocation"
            name="startLocation"
            value={formData.startLocation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endLocation">End Location</label>
          <input
            id="endLocation"
            name="endLocation"
            value={formData.endLocation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mainStops">Main Stops</label>
          <input
            id="mainStops"
            name="mainStops"
            placeholder="Enter comma-separated stops"
            value={formData.mainStops}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="nearbyLandmark">Nearby Landmark</label>
          <input
            id="nearbyLandmark"
            name="nearbyLandmark"
            value={formData.nearbyLandmark}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="primary-button">
          Add Route
        </button>
      </form>
    </div>
  );
}

export default BusRouteForm;
