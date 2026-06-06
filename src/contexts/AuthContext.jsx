import { createContext, useEffect, useState } from "react";
import api from "../config/api";

export const AuthContext = createContext();

const decodeJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const checkAuth = async () => {
      // If the user explicitly logged out, skip all auth checks
      if (sessionStorage.getItem("logged_out") === "true") {
        sessionStorage.removeItem("logged_out");
        setLoading(false);
        return;
      }

      let token = localStorage.getItem("token");
      const sessionToken = sessionStorage.getItem("token");

      if (sessionToken && !token) {
        localStorage.setItem("token", sessionToken);
        token = sessionToken;
      }

      const sessionRefreshToken = sessionStorage.getItem("refreshToken");
      if (sessionRefreshToken && !localStorage.getItem("refreshToken")) {
        localStorage.setItem("refreshToken", sessionRefreshToken);
      }

      // IMPORTANT: Always attempt /auth/me even without a local token.
      // The backend accepts the HttpOnly "access_token" cookie that was set at login.
      // If there's no token AND no cookie, the backend returns 401 and user stays null.
      // This fixes the post-Stripe-redirect logout bug where localStorage was cleared
      // but the HttpOnly cookie is still valid.
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

        // If /auth/me succeeded (possibly via HttpOnly cookie) but there's no local token,
        // call refresh to get a fresh access token and re-persist it to localStorage.
        if (!localStorage.getItem("token")) {
          try {
            const refreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
            const refreshRes = await api.post("/auth/refresh", null, {
              headers: refreshToken ? { "X-Refresh-Token": refreshToken } : {}
            });
            const newToken = refreshRes.data?.accessToken || refreshRes.data?.data?.accessToken;
            const newRefresh = refreshRes.data?.refreshToken || refreshRes.data?.data?.refreshToken;
            if (newToken) {
              localStorage.setItem("token", newToken);
              sessionStorage.setItem("token", newToken);
              console.log("Auth: Token re-persisted via cookie-based refresh after Stripe redirect.");
            }
            if (newRefresh) {
              localStorage.setItem("refreshToken", newRefresh);
              sessionStorage.setItem("refreshToken", newRefresh);
            }
          } catch (refreshErr) {
            console.warn("Auth: Token re-persist failed, user is still authenticated via cookie.", refreshErr.message);
          }
        }
      } catch (err) {
        // Use local JWT decode as fallback for ALL /auth/me failures,
        // as long as the token is not expired locally. This covers the case
        // where the user returns from a Stripe redirect and the server returns 401.
        const decoded = decodeJwt(token);
        const nowSeconds = Math.floor(Date.now() / 1000);
        const tokenExpired = decoded?.exp && decoded.exp < nowSeconds;

        // If no local token but /auth/me failed, try one last time with refresh cookie
        if (!token && err.response?.status === 401) {
          try {
            const refreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
            const refreshRes = await api.post("/auth/refresh", null, {
              headers: refreshToken ? { "X-Refresh-Token": refreshToken } : {}
            });
            const newToken = refreshRes.data?.accessToken || refreshRes.data?.data?.accessToken;
            if (newToken) {
              localStorage.setItem("token", newToken);
              sessionStorage.setItem("token", newToken);
              // Re-run auth check with the new token
              await checkAuth();
              return;
            }
          } catch (refreshErr) {
            console.warn("Auth: Cookie-based refresh also failed.", refreshErr.message);
          }
          setUser(null);
        } else if (decoded && !tokenExpired) {
          console.warn("Auth fallback: /auth/me failed but JWT is still valid locally. Using decoded JWT. Error:", err.response?.status || err.message);
          const fallbackUser = {
            id: Number(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || decoded.nameid || decoded.sub || 0),
            email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || decoded.email || "",
            roleId: Number(decoded.roleId || 1),
            fullName: decoded.name || "User"
          };
          setUser(fallbackUser);
        } else {
          console.warn("Auth: JWT is expired or invalid, setting user to null. Status:", err.response?.status);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    // ── 1. Clean up instantly (no waiting) ──────────────────────────────────
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("admin");
    sessionStorage.removeItem("isAdminLoggedIn");
    sessionStorage.removeItem("user");

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("admin");
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("user");

    // Force-expire the legacy 'RefreshToken' (PascalCase) cookie
    document.cookie = "RefreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;";

    // Flag so checkAuth skips /auth/me on the next page load
    sessionStorage.setItem("logged_out", "true");

    setUser(null);

    // ── 2. Redirect immediately — user sees login page at once ──────────────
    window.location.href = "/login";

    // ── 3. Revoke token on backend in the background (fire-and-forget) ──────
    // BCrypt.Verify is slow; doing this after the redirect means the user
    // doesn't wait for it. The token is already useless since we cleared it.
    const refreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
    api.post("/auth/logout", null, {
      headers: refreshToken ? { "X-Refresh-Token": refreshToken } : {}
    }).catch(() => { /* ignore — token is already cleared locally */ });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};