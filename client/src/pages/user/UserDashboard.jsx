import PageHeader from "../../components/PageHeader";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function UserDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name || "Student"}!`}
        description="Your Student Living Assistant dashboard."
      />
      <div className="list-card">
        <p>Use the navigation panel to browse available rooms, food services, or bus routes.</p>
        <p>Found a room you like? Head over to the Inquiries section to send a message!</p>
      </div>
    </div>
  );
}

export default UserDashboard;
