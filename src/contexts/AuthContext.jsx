import { createContext, useEffect, useState } from "react";
import api from "../config/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.data);
      } catch  {
        setUser(null);
      }
    };

    checkAuth();
  }, []);


 const logout = async () => {
  // 1️⃣ Instantly update UI
  setUser(null);
  // 2️⃣ Then call backend in background
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.log("Logout error:", err);
  }
};

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};