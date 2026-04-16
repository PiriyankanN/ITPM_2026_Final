import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function DashboardPage() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
        Welcome to the Application Home, <strong>{user?.name}</strong>!
      </p>
      <div className="list-card" style={{ marginBottom: "30px" }}>
        <p>Your authentication mechanism is working perfectly.</p>
        <p>Email logged in: {user?.email}</p>
      </div>
      <button className="danger-button" onClick={logout} style={{ padding: "10px 20px" }}>
        Logout
      </button>
    </div>
  );
}

export default DashboardPage;
