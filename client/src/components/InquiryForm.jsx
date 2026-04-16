import { useState } from "react";

const initialForm = {
  studentName: "",
  email: "",
  roomId: "",
  message: ""
};

function InquiryForm({ rooms, onSubmit }) {
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
    setFormData(initialForm);
  };

  return (
    <div className="form-card">
      <h3>Submit Room Inquiry</h3>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label htmlFor="studentName">Student Name</label>
          <input
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="roomId">Room</label>
          <select id="roomId" name="roomId" value={formData.roomId} onChange={handleChange} required>
            <option value="">Select a room</option>
            {rooms.map((room) => (
              <option key={room._id} value={room._id}>
                {room.title} - {room.location}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} required />
        </div>

        <button type="submit" className="primary-button">
          Send Inquiry
        </button>
      </form>
    </div>
  );
}

export default InquiryForm;
