function RoomList({ rooms, onEdit, onDelete }) {
  if (rooms.length === 0) {
    return <p className="empty-state">No room listings found.</p>;
  }

  return (
    <div className="stack">
      {rooms.map((room) => (
        <div key={room._id} className="list-item">
          <div className="list-item-header">
            <div>
              <h3>{room.title}</h3>
              <p>
                {room.location} | LKR {room.price}
              </p>
            </div>

            <div className="button-row">
              {onEdit && (
                <button className="secondary-button" onClick={() => onEdit(room)}>
                  Edit
                </button>
              )}
              {onDelete && (
                <button className="danger-button" onClick={() => onDelete(room._id)}>
                  Delete
                </button>
              )}
            </div>
          </div>

          <p>{room.description}</p>

          <div className="tag-row">
            <span className="tag">{room.roomType}</span>
            <span className="tag">{room.isAvailable ? "Available" : "Unavailable"}</span>
            <span className="tag">{room.contactNumber}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RoomList;
