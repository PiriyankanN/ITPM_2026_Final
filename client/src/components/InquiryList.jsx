function InquiryList({ inquiries, onStatusChange }) {
  if (inquiries.length === 0) {
    return <p className="empty-state">No inquiries found.</p>;
  }

  return (
    <div className="stack">
      {inquiries.map((inquiry) => (
        <div key={inquiry._id} className="list-item">
          <div className="list-item-header">
            <div>
              <h3>{inquiry.studentName}</h3>
              <p>{inquiry.email}</p>
              <p>Room: {inquiry.roomId?.title || "Unknown room"}</p>
            </div>

            <select
              value={inquiry.status}
              onChange={(event) => onStatusChange(inquiry._id, event.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <p>{inquiry.message}</p>

          <div className="tag-row">
            <span className="tag">{inquiry.status}</span>
            <span className="tag">{inquiry.adminReply || "No reply yet"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default InquiryList;
