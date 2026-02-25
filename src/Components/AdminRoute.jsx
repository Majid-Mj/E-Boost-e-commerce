import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  if (user.roleId !== 2) {
    return <Navigate to="/home" />;
  }

  return children;
}