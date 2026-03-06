import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role restriction (optional) - handle both number and string
  const userRoleId = Number(user.roleId);

  // if no role required we just let them through
  if (role) {
    let allowed = false;

    // convert both sides to number for comparison when possible
    if (!isNaN(userRoleId)) {
      allowed = userRoleId === role;
    }

    // admin string flag should always satisfy a request for role 2
    if (!allowed && role === 2) {
      if (user.role === "admin" || user.isAdmin === true) {
        allowed = true;
      }
    }

    if (!allowed) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}