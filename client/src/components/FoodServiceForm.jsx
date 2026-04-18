import { useState, useEffect } from "react";

const initialForm = {
  restaurantName: "",
  location: "",
  mealType: "Breakfast",
  foodType: "",
  priceRange: "",
  rating: 0,
  contactInfo: "",
  image: "",
  googleMapsLink: "",
  openingHours: "",
  description: "",
  menuItems: [],
  isOpen: true
};

function FoodServiceForm({ onSubmit, editingFood, onCancel }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [newItem, setNewItem] = useState({ name: "", category: "Lunch", price: "", description: "", isAvailable: true });

  useEffect(() => {
    if (editingFood) {
      setFormData({
        restaurantName: editingFood.restaurantName || "",
        location: editingFood.location || "",
        mealType: editingFood.mealType || "Breakfast",
        foodType: editingFood.foodType || "",
        priceRange: editingFood.priceRange || "",
        rating: editingFood.rating || 0,
        contactInfo: editingFood.contactInfo || "",
        image: editingFood.image || "",
        googleMapsLink: editingFood.googleMapsLink || "",
        openingHours: editingFood.openingHours || "",
        description: editingFood.description || "",
        menuItems: Array.isArray(editingFood.menuItems) ? editingFood.menuItems : [],
        isOpen: editingFood.isOpen !== undefined ? editingFood.isOpen : true
      });
      return;
    }
    setFormData(initialForm);
  }, [editingFood]);

  const addMenuItem = () => {
    if (!newItem.name || !newItem.price || !newItem.category) {
      alert("Please provide at least a name, category, and price for the menu item.");
      return;
    }
    setFormData(prev => ({
      ...prev,
      menuItems: [...prev.menuItems, { ...newItem, price: Number(newItem.price) }]
    }));
    setNewItem({ name: "", category: "Lunch", price: "", description: "", isAvailable: true });
  };

  const removeMenuItem = (index) => {
    setFormData(prev => ({
      ...prev,
      menuItems: prev.menuItems.filter((_, i) => i !== index)
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.restaurantName.trim()) newErrors.restaurantName = "Restaurant name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.mealType.trim()) newErrors.mealType = "Meal type is required";
    
    const isNumeric = /^\d*$/.test(formData.contactInfo);
    if (!formData.contactInfo) {
      newErrors.contactInfo = "Contact number is required";
    } else if (!isNumeric) {
      newErrors.contactInfo = "Only use numbers (no symbols or letters)";
    } else if (formData.contactInfo.length !== 10) {
      newErrors.contactInfo = "Phone number must be exactly 10 digits";
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = "Rating must be between 0 and 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({ 
      ...current, 
      [name]: type === "checkbox" ? checked : value 
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      const payload = {
        ...formData,
        rating: Number(formData.rating)
      };
      await onSubmit(payload);
      if (!editingFood) setFormData(initialForm);
    }
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label htmlFor="restaurantName">Restaurant Name *</label>
          <input 
            id="restaurantName" 
            name="restaurantName" 
            value={formData.restaurantName} 
            onChange={handleChange} 
            placeholder="e.g. Campus Hut"
            style={{ borderColor: errors.restaurantName ? "#ef4444" : "var(--border-light)" }}
          />
          {errors.restaurantName && <span style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "4px" }}>{errors.restaurantName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input 
            id="location" 
            name="location" 
            value={formData.location} 
            onChange={handleChange}
            placeholder="e.g. Main Hall"
            style={{ borderColor: errors.location ? "#ef4444" : "var(--border-light)" }}
          />
          {errors.location && <span style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "4px" }}>{errors.location}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="mealType">Meal Type *</label>
          <input 
            id="mealType" 
            name="mealType" 
            value={formData.mealType} 
            onChange={handleChange}
            placeholder="e.g. Breakfast, Lunch"
            style={{ borderColor: errors.mealType ? "#ef4444" : "var(--border-light)" }}
          />
          {errors.mealType && <span style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "4px" }}>{errors.mealType}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="foodType">Food Category (e.g. Pizza, Indian, Veg)</label>
          <input 
            id="foodType" 
            name="foodType" 
            value={formData.foodType} 
            onChange={handleChange}
            placeholder="e.g. Fast Food, Healthy"
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactInfo">Contact Number *</label>
          <input
            id="contactInfo"
            name="contactInfo"
            placeholder="e.g. 0771234567"
            value={formData.contactInfo}
            onChange={handleChange}
            style={{ borderColor: errors.contactInfo ? "#ef4444" : "var(--border-light)" }}
          />
          {errors.contactInfo && <span style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "4px" }}>{errors.contactInfo}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="priceRange">Price Range</label>
          <input 
            id="priceRange" 
            name="priceRange" 
            value={formData.priceRange} 
            onChange={handleChange}
            placeholder="e.g. $10 - $20, Low-cost"
          />
        </div>

        <div className="form-group">
          <label htmlFor="rating">User Rating (0-5)</label>
          <input 
            id="rating" 
            name="rating" 
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating} 
            onChange={handleChange}
          />
          {errors.rating && <span style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "4px" }}>{errors.rating}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input 
            id="image" 
            name="image" 
            type="url"
            value={formData.image} 
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="googleMapsLink">Google Maps Link</label>
          <input 
            id="googleMapsLink" 
            name="googleMapsLink" 
            type="url"
            value={formData.googleMapsLink} 
            onChange={handleChange}
            placeholder="https://maps.google.com/..."
            style={{ width: "100%" }}
          />
        </div>

        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="openingHours">Opening Hours</label>
          <input 
            id="openingHours" 
            name="openingHours" 
            value={formData.openingHours} 
            onChange={handleChange} 
            placeholder="e.g. 6.00 A.M - 11.00 A.M"
            style={{ width: "100%" }}
          />
          <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>
            Format: <strong>6.00 A.M - 11.00 A.M</strong> (Required for auto-calculating "Open Now" status)
          </p>
        </div>

        {/* Menu Management Section */}
        <div className="form-group" style={{ gridColumn: "1 / -1", marginTop: "24px", padding: "32px", background: "white", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800", color: "#1e293b", display: "flex", alignItems: "center", gap: "10px" }}>
              <span>📋</span> Menu Management
            </h3>
            <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", background: "#f1f5f9", padding: "4px 12px", borderRadius: "10px" }}>
              {formData.menuItems.length} {formData.menuItems.length === 1 ? "Item" : "Items"} Listed
            </span>
          </div>

          {/* Add New Item Sub-form */}
          <div style={{ background: "#f8fafc", padding: "24px", borderRadius: "20px", border: "1px solid #f1f5f9", marginBottom: "32px" }}>
            <p style={{ margin: "0 0 20px", fontWeight: "800", fontSize: "0.9rem", color: "#475569", textTransform: "uppercase", letterSpacing: "1px" }}>Add New Menu Item</p>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 0.8fr", gap: "16px", marginBottom: "16px" }}>
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Item Name (e.g. Pasta)" 
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  style={{ background: "white" }}
                />
              </div>
              <div className="form-group">
                <select 
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  style={{ background: "white", width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-light)" }}
                >
                  {["Breakfast", "Lunch", "Dinner", "Snacks", "Beverages", "Other"].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <input 
                  type="number" 
                  placeholder="Price (Rs)" 
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  style={{ background: "white" }}
                />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: "20px" }}>
              <textarea 
                placeholder="Short Description (Optional)" 
                rows="2"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                style={{ background: "white", width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-light)", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", color: "#64748b", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={newItem.isAvailable} 
                  onChange={(e) => setNewItem({ ...newItem, isAvailable: e.target.checked })} 
                /> Available Now
              </label>
              <button 
                type="button" 
                onClick={addMenuItem}
                className="secondary-button"
                style={{ padding: "10px 24px", fontSize: "0.9rem", height: "auto", background: "white", borderColor: "var(--primary)", color: "var(--primary)" }}
              >
                + Add to List
              </button>
            </div>
          </div>

          {/* List of current menu items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {formData.menuItems.length > 0 ? (
              formData.menuItems.map((item, index) => (
                <div key={index} style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  padding: "16px 20px", 
                  background: "white", 
                  borderRadius: "16px", 
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontWeight: "800", color: "#1e293b" }}>{item.name}</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: "800", color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: "6px" }}>{item.category}</span>
                      {!item.isAvailable && <span style={{ color: "#ef4444", fontSize: "0.7rem", fontWeight: "800" }}>(Sold Out)</span>}
                    </div>
                    {item.description && <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "0.8rem" }}>{item.description}</p>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <span style={{ fontWeight: "900", color: "var(--primary)" }}>Rs.{item.price}</span>
                    <button 
                      type="button" 
                      onClick={() => removeMenuItem(index)}
                      style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1.2rem", padding: "4px" }}
                      title="Remove Item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "32px", border: "2px dashed #f1f5f9", borderRadius: "20px" }}>
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem" }}>No items added yet. Use the form above to start building the menu.</p>
              </div>
            )}
          </div>
        </div>

        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="description">Detailed Description *</label>
          <textarea 
            id="description"
            name="description"
            rows="3" 
            value={formData.description} 
            onChange={handleChange} 
            required 
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-light)", outline: "none", resize: "vertical" }} 
          />
        </div>

        <div className="form-group" style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "#f8fafc", borderRadius: "12px" }}>
          <input 
            type="checkbox" 
            id="isOpen" 
            name="isOpen" 
            checked={formData.isOpen} 
            onChange={handleChange}
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
          />
          <label htmlFor="isOpen" style={{ margin: 0, fontWeight: "700", cursor: "pointer" }}>Currently accepting orders / Open for business</label>
        </div>

        <div style={{ gridColumn: "1 / -1", display: "flex", gap: "12px", marginTop: "16px" }}>
          <button type="submit" className="primary-button" style={{ padding: "12px 24px" }}>
            {editingFood ? "Update Service Information" : "Create Food Service Listing"}
          </button>
          
          {onCancel && (
            <button type="button" className="secondary-button" onClick={onCancel} style={{ padding: "12px 24px" }}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FoodServiceForm;
