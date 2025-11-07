import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />; // Not logged in
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/login" />; // Wrong role

  return children;
};
  
export default ProtectedRoute;
