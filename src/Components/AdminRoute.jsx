import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

// AdminRoute is a thin wrapper around the general ProtectedRoute logic
// that always requires an administrator.  This component is used within
// the nested admin routes so that each dashboard page is protected even
// if someone manually types the path in the address bar.

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // not logged in -> send to login
  if (!user) return <Navigate to="/login" replace />;

  const userRoleId = Number(user.roleId);
  const isAdmin =
    userRoleId === 2 || user.role === "admin" || user.isAdmin === true;

  if (!isAdmin) {
    // normal users get redirected back to the public home page
    return <Navigate to="/home" replace />;
  }

  return children;
}