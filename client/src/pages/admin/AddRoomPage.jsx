import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import RoomForm from "../../components/RoomForm";

function AddRoomPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        navigate("/admin/rooms");
      } else {
        setError(data.message || "Failed to create room.");
      }
    } catch (err) {
      setError("Network or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-8 mb-12" style={{ maxWidth: "800px" }}>
      <PageHeader title="Add New Room" description="Allocate a new housing unit to the system with full details." />

      <div className="card mt-8">
        {error && <div className="message error mb-6"><span>⚠️</span>{error}</div>}
        
        {loading ? (
          <p className="text-center py-8">Processing...</p>
        ) : (
          <RoomForm onSubmit={handleCreate} onCancel={() => navigate("/admin/rooms")} />
        )}
      </div>
    </div>
  );
}

export default AddRoomPage;
