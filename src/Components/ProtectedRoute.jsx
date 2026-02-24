import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Checking session...</p>;

  if (!user) return <Navigate to="/login" />;

  if (requiredRole && user.roleId !== requiredRole)
    return <Navigate to="/home" />;

  return children;
}