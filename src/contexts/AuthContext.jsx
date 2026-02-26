import { createContext, useEffect, useState } from "react";
import api from "../config/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");

        // the .NET backend might wrap the user differently; log whatever we
        // get so the developer can adjust accordingly.
        console.log("/auth/me response:", res.data);

        // the data could be under `data`, `user`, `result`, etc.
        let userData = res.data.data || res.data.user || res.data;

        // Normalize role information so we always have a numeric roleId
        if (userData) {
          // numeric roleId takes priority
          if (userData?.roleId != null) {
            userData.roleId = Number(userData.roleId);
          } else if (Array.isArray(userData.roles)) {
            // identity servers often return an array of role names
            if (userData.roles.includes("Admin") || userData.roles.includes("admin")) {
              userData.roleId = 2;
            }
          } else if (userData?.role || userData?.roleName) {
            const r = (userData.role || userData.roleName).toString().toLowerCase();
            if (r === "admin" || r === "administrator") {
              userData.roleId = 2;
            }
          } else if (userData.isAdmin === true) {
            userData.roleId = 2;
          }

          // fallback default
          if (userData.roleId == null || isNaN(Number(userData.roleId))) {
            userData.roleId = 1;
          }
        }

        setUser(userData);
      } catch {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.log("Logout error:", err);
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};