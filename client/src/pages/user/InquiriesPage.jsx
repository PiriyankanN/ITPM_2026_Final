import { useEffect, useState, useContext } from "react";
import InquiryForm from "../../components/InquiryForm";
import PageHeader from "../../components/PageHeader";
import StatusMessage from "../../components/StatusMessage";
import { createInquiry } from "../../services/inquiryService";
import { getRooms } from "../../services/roomService";
import { AuthContext } from "../../context/AuthContext";

function InquiriesPage() {
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  const loadData = async () => {
    try {
      const roomsData = await getRooms();
      setRooms(roomsData);
      setError("");
    } catch (loadError) {
      setError("Unable to load rooms data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateInquiry = async (formData) => {
    try {
      await createInquiry({ ...formData, userEmail: user?.email, userName: user?.name });
      setMessage("Inquiry sent successfully.");
    } catch (submitError) {
      setError("Unable to submit inquiry.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Submit an Inquiry"
        description="Ask about any room listings you are interested in."
      />

      <StatusMessage message={message} type="success" />
      <StatusMessage message={error} type="error" />

      <div className="two-column-grid">
        <InquiryForm rooms={rooms} onSubmit={handleCreateInquiry} />
      </div>
    </div>
  );
}

export default InquiriesPage;
