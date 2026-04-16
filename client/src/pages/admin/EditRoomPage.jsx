import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import RoomForm from "../../components/RoomForm";

function EditRoomPage() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const { id } = useParams();
  
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
        const data = await response.json();
        if (response.ok) {
          setRoomData(data);
        } else {
          setError(data.message || "Failed to load room details.");
        }
      } catch (err) {
        setError("Network error fetching room data.");
      } finally {
        setLoading(false);
      }
    };

    if (locationState.state?.room) {
      setRoomData(locationState.state.room);
    } else {
      fetchRoom();
    }
  }, [id, locationState]);

  const handleUpdate = async (formData) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${id}`, {
        method: "PUT",
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
        setError(data.message || "Failed to edit room.");
      }
    } catch (err) {
      setError("Network or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-8 mb-12" style={{ maxWidth: "800px" }}>
      <PageHeader title="Edit Room Record" description={`Updating details for record ID: ${id}`} />

      <div className="card mt-8">
        {error && <div className="message error mb-6"><span>⚠️</span>{error}</div>}
        
        {!roomData && !error ? (
          <p className="text-center py-8">Loading room details...</p>
        ) : (
          <RoomForm 
            editingRoom={roomData} 
            onSubmit={handleUpdate} 
            onCancel={() => navigate("/admin/rooms")} 
          />
        )}
      </div>
    </div>
  );
}

export default EditRoomPage;
