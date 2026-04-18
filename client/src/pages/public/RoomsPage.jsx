import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import RoomList from "../../components/RoomList";
import StatusMessage from "../../components/StatusMessage";
import { getRooms } from "../../services/roomService";

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({ location: "", roomType: "", isAvailable: "" });
  const [error, setError] = useState("");

  const loadRooms = async (activeFilters = filters) => {
    try {
      const data = await getRooms(activeFilters);
      setRooms(data);
      setError("");
    } catch (loadError) {
      setError("Unable to load rooms.");
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    // Refresh the list immediately so the filtering behavior is easy to follow.
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    loadRooms(updatedFilters);
  };

  return (
    <div>
      <PageHeader
        title="Accommodation Search"
        description="Find your next place to stay."
      />

      <StatusMessage message={error} type="error" />

      <div className="list-card">
        <h3>Available Rooms</h3>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="locationFilter">Location Filter</label>
            <input
              id="locationFilter"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Search by location"
            />
          </div>

          <div className="form-group">
            <label htmlFor="roomTypeFilter">Room Type</label>
            <select id="roomTypeFilter" name="roomType" value={filters.roomType} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Single">Single</option>
              <option value="Shared">Shared</option>
              <option value="Apartment">Apartment</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="availabilityFilter">Availability</label>
            <select
              id="availabilityFilter"
              name="isAvailable"
              value={filters.isAvailable}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
        </div>

        <RoomList rooms={rooms} />
      </div>
    </div>
  );
}

export default RoomsPage;
