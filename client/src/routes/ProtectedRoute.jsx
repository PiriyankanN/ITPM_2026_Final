import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If we wanted a loading state, we'd add it here. 
  // For now, simpler redirect logic.
  if (user === null && !localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
