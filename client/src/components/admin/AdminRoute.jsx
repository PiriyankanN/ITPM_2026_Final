import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    // If a normal user tries to access admin, lock them back to their standard App dashboard
    return <Navigate to="/app" replace />;
  }

  return children;
};

export default AdminRoute;
