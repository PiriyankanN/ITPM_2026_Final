import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  location: "",
  locationName: "",
  googleMapsLink: "",
  price: "",
  roomType: "Single",
  isAvailable: true,
  description: "",
  contactNumber: "",
  images: "" // Comma-separated string for the form
};

function RoomForm({ onSubmit, editingRoom, onCancel }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.locationName.trim()) newErrors.locationName = "Area name is required";
    if (!formData.googleMapsLink.trim()) newErrors.googleMapsLink = "Google Maps link is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Enter a valid monthly price";
    
    // Contact number validation (exactly 10 digits)
    const isNumeric = /^\d*$/.test(formData.contactNumber);
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!isNumeric) {
      newErrors.contactNumber = "Only use numbers (no symbols or letters)";
    } else if (formData.contactNumber.length !== 10) {
      newErrors.contactNumber = "Phone number must be exactly 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (editingRoom) {
      setFormData({
        title: editingRoom.title || "",
        location: editingRoom.location || "",
        locationName: editingRoom.locationName || "",
        googleMapsLink: editingRoom.googleMapsLink || "",
        price: editingRoom.price || "",
        roomType: editingRoom.roomType || "Single",
        isAvailable: editingRoom.isAvailable ?? true,
        description: editingRoom.description || "",
        contactNumber: editingRoom.contactNumber || "",
        images: Array.isArray(editingRoom.images) ? editingRoom.images.join(", ") : (editingRoom.images || "")
      });
      return;
    }

    setFormData(initialForm);
  }, [editingRoom]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      const payload = {
        ...formData,
        price: Number(formData.price),
        images: typeof formData.images === "string" 
          ? formData.images.split(",").map(url => url.trim()).filter(url => url !== "")
          : formData.images
      };
      await onSubmit(payload);

      if (!editingRoom) {
        setFormData(initialForm);
      }
    }
  };

  return (
    <div className="form-card">
      <h3>{editingRoom ? "Update Room" : "Add Room Listing"}</h3>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            style={{ borderColor: errors.title ? "#ef4444" : "var(--border-light)" }}
          />
          {errors.title && <span style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "4px" }}>{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="location">Street Address *</label>
          <input 
            id="location" 
            name="location" 
            placeholder="e.g. 123 University Ave"
            value={formData.location} 
            onChange={handleChange} 
            style={{ borderColor: errors.location ? "#ef4444" : "var(--border-light)" }}
          />
          {errors.location && <span style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "4px" }}>{errors.location}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="locationName">Area Name *</label>
          <input 
            id="locationName" 
            name="locationName" 
            placeholder="e.g. North Campus"
            value={formData.locationName} 
            onChange={handleChange} 
            style={{ borderColor: errors.locationName ? "#ef4444" : "var(--border-light)" }}
          />
          {errors.locationName && <span style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "4px" }}>{errors.locationName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="googleMapsLink">Google Maps Link *</label>
          <input 
            id="googleMapsLink" 
            name="googleMapsLink" 
            placeholder="https://maps.app.goo.gl/..."
            value={formData.googleMapsLink} 
            onChange={handleChange} 
            style={{ borderColor: errors.googleMapsLink ? "#ef4444" : "var(--border-light)" }}
          />
          {errors.googleMapsLink && <span style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "4px" }}>{errors.googleMapsLink}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Monthly Price *</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={handleChange}
            style={{ borderColor: errors.price ? "#ef4444" : "var(--border-light)" }}
          />
          {errors.price && <span style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "4px" }}>{errors.price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="roomType">Room Type</label>
          <select id="roomType" name="roomType" value={formData.roomType} onChange={handleChange}>
            <option value="Single">Single</option>
            <option value="Shared">Shared</option>
            <option value="Apartment">Apartment</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number *</label>
          <input
            id="contactNumber"
            name="contactNumber"
            placeholder="e.g. 0771234567"
            value={formData.contactNumber}
            onChange={handleChange}
            style={{ borderColor: errors.contactNumber ? "#ef4444" : "var(--border-light)" }}
          />
          {errors.contactNumber && <span style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "4px" }}>{errors.contactNumber}</span>}
        </div>

        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="images">Photos * (Comma-separated URLs)</label>
          <textarea
            id="images"
            name="images"
            rows="2"
            placeholder="url1, url2..."
            value={formData.images}
            onChange={handleChange}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid", borderColor: errors.images ? "#ef4444" : "var(--border-light)", outline: "none" }}
          />
          {errors.images && <span style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "4px" }}>{errors.images}</span>}
        </div>

        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-light)", outline: "none" }}
          />
        </div>

        <label>
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
          />{" "}
          Currently available
        </label>

        <div className="button-row">
          <button type="submit" className="primary-button">
            {editingRoom ? "Save Changes" : "Add Room"}
          </button>

          {editingRoom && (
            <button type="button" className="secondary-button" onClick={onCancel}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default RoomForm;
