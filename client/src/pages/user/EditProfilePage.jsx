import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import PageHeader from "../../components/PageHeader";

function EditProfilePage() {
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
    address: "",
    budget: 0,
    preferredLocation: "",
    preferredRoomType: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Full name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    const isNumeric = /^\d*$/.test(formData.phone);
    if (formData.phone) {
      if (!isNumeric) {
        errors.phone = "Only use numbers (no symbols or letters)";
      } else if (formData.phone.length !== 10) {
        errors.phone = "Phone number must be exactly 10 digits";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            profileImage: data.profileImage || "",
            address: data.address || "",
            budget: data.preferences?.budget || 0,
            preferredLocation: data.preferences?.location || "",
            preferredRoomType: data.preferences?.roomType || ""
          });
        } else {
          setError(data.message || "Failed to load profile.");
        }
      } catch (err) {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({ ...formData, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSaving(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          ...formData,
          preferences: {
            budget: Number(formData.budget),
            location: formData.preferredLocation,
            roomType: formData.preferredRoomType
          }
        })
      });
      const data = await response.json();

      if (response.ok) {
        // Sync the AuthContext so the Navbar and other components update immediately
        updateUser(data);
        navigate("/profile");
      } else {
        setError(data.message || "Failed to update profile.");
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container mt-8"><p>Loading profile form...</p></div>;

  return (
    <div className="container mt-8 mb-20">
      <div className="mb-10 text-center">
        <PageHeader 
          title="Update Account Settings" 
          description="Keep your contact information current to ensure seamless communication with student services." 
        />
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px", maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Main Form Section */}
        <div className="card shadow-sm" style={{ padding: "40px", borderRadius: "24px", border: "1px solid #f1f5f9" }}>
          {error && <div className="message error mb-6"><span>⚠️</span>{error}</div>}
          
          <form onSubmit={handleSubmit} className="form-grid">
            {/* Profile Image URL */}
            <div className="form-group" style={{ gridColumn: "1 / -1", background: "#f8fafc", padding: "24px", borderRadius: "16px", marginBottom: "16px" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: "700", color: "#475569", marginBottom: "12px", display: "block" }}>Profile Representation</label>
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", background: "white", flexShrink: 0, border: "3px solid #fff", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
                  <img 
                    src={formData.profileImage || "https://ui-avatars.com/api/?name=" + formData.name + "&background=22c55e&color=fff"} 
                    alt="Preview" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <input 
                    type="url" 
                    placeholder="Paste image URL here (e.g. from Google Drive or Unsplash)" 
                    value={formData.profileImage} 
                    onChange={e => setFormData({...formData, profileImage: e.target.value})}
                    style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1" }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "6px" }}>Use a direct link to an image for best results.</p>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontWeight: "700", color: "#475569" }}>Full Name</label>
              <input 
                name="name"
                type="text" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Ex: John Doe"
                style={{ 
                  borderRadius: "10px", 
                  padding: "12px",
                  border: fieldErrors.name ? "2px solid #ef4444" : "1px solid #cbd5e1",
                  transition: "all 0.2s"
                }}
              />
              {fieldErrors.name && <span style={{ color: "#ef4444", fontSize: "0.75rem", fontWeight: "600", marginTop: "4px", display: "block" }}>{fieldErrors.name}</span>}
            </div>

            <div className="form-group">
              <label style={{ fontWeight: "700", color: "#475569" }}>Email Address</label>
              <input 
                name="email"
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="student@university.edu"
                style={{ 
                  borderRadius: "10px", 
                  padding: "12px",
                  border: fieldErrors.email ? "2px solid #ef4444" : "1px solid #cbd5e1",
                  transition: "all 0.2s"
                }}
              />
              {fieldErrors.email && <span style={{ color: "#ef4444", fontSize: "0.75rem", fontWeight: "600", marginTop: "4px", display: "block" }}>{fieldErrors.email}</span>}
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontWeight: "700", color: "#475569" }}>Contact Number</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>📞</span>
                <input 
                  name="phone"
                  type="text" 
                  placeholder="10-digit mobile number" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  style={{ 
                    borderRadius: "10px", 
                    padding: "12px 12px 12px 40px",
                    width: "100%",
                    border: fieldErrors.phone ? "2px solid #ef4444" : "1px solid #cbd5e1",
                    transition: "all 0.2s"
                  }}
                />
              </div>
              {fieldErrors.phone && <span style={{ color: "#ef4444", fontSize: "0.75rem", fontWeight: "600", marginTop: "4px", display: "block" }}>{fieldErrors.phone}</span>}
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontWeight: "700", color: "#475569" }}>Permanent/Current Address</label>
              <textarea 
                rows="4"
                placeholder="Enter your full mailing address..." 
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})}
                style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none", resize: "none", transition: "all 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
              />
            </div>

            {/* Living Preferences (New AI Section) */}
            <div className="form-group" style={{ gridColumn: "1 / -1", background: "#f0fdf4", padding: "24px", borderRadius: "16px", marginBottom: "16px" }}>
              <label style={{ fontSize: "1rem", fontWeight: "800", color: "#166534", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🤖</span> Living Preferences (Smart Suggestions)
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#3f6212" }}>Max Monthly Budget (Rs.)</label>
                  <input 
                    name="budget"
                    type="number" 
                    placeholder="e.g. 15000"
                    value={formData.budget} 
                    onChange={handleChange}
                    style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#3f6212" }}>Preferred Location</label>
                  <input 
                    name="preferredLocation"
                    type="text" 
                    placeholder="e.g. Near Campus"
                    value={formData.preferredLocation} 
                    onChange={handleChange}
                    style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#3f6212" }}>Room Type</label>
                  <select 
                    name="preferredRoomType"
                    value={formData.preferredRoomType} 
                    onChange={handleChange}
                    style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", marginTop: "4px" }}
                  >
                    <option value="">No Preference</option>
                    <option value="Single">Single</option>
                    <option value="Shared">Shared</option>
                    <option value="Apartment">Apartment</option>
                  </select>
                </div>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#166534", marginTop: "12px", opacity: 0.8 }}>
                Our system uses these details to automatically recommend the best accommodation matches for you.
              </p>
            </div>

            <div style={{ gridColumn: "1 / -1", display: "flex", gap: "16px", marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #f1f5f9" }}>
              <button 
                type="submit" 
                className="primary-button" 
                style={{ flex: "2", padding: "16px", borderRadius: "12px", fontWeight: "700", fontSize: "1rem" }} 
                disabled={saving}
              >
                {saving ? "Processing Changes..." : "Save Account Changes"}
              </button>
              <Link to="/profile" style={{ flex: "1", textDecoration: "none" }}>
                <button type="button" className="secondary-button" style={{ width: "100%", padding: "16px", borderRadius: "12px", fontWeight: "700" }}>
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>

        {/* Sidebar Guidance */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card shadow-sm" style={{ padding: "24px", borderRadius: "20px", background: "#f0fdf4", border: "1px solid #dcfce7" }}>
            <h4 style={{ color: "#166534", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>💡</span> Security Note
            </h4>
            <p style={{ fontSize: "0.85rem", color: "#166534", lineHeight: "1.5" }}>
              Your account role was assigned during registration. If you believe your role is incorrect, please contact the administration office.
            </p>
          </div>

          <div className="card shadow-sm" style={{ padding: "24px", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
            <h4 style={{ color: "#475569", marginBottom: "16px" }}>Submission Progress</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#166534", color: "white", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>✓</div>
                <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Load current profile data</p>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: saving ? "#fbbf24" : "#e2e8f0", color: "white", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>2</div>
                <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Update personal details</p>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#e2e8f0", color: "white", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>3</div>
                <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Synchronize with server</p>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

export default EditProfilePage;
