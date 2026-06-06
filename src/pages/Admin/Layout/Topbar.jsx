import { useState, useEffect } from "react";
import api from "../../../config/api";
import { useTheme } from "../../../contexts/ThemeContext";
import {
  Menu,
  User,
  Sun,
  Moon
} from "lucide-react";

export default function Topbar({ onMenuClick }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

  // 🔥 Fetch logged-in admin using JWT
  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/auth/me");
        setAdmin(res.data);
      } catch (err) {
        console.error("Error fetching admin:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-white/80 dark:bg-slate-950/80 backdrop-blur-md text-slate-800 dark:text-slate-200 px-4 sm:px-8 py-4 border-b border-slate-200 dark:border-slate-800/60 transition-colors duration-300">
      
      <div className="flex items-center gap-4">
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-slate-600 dark:text-slate-400"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Light / Dark Mode Toggle button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-[#ff512f] transition rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
        </button>

        {/* Profile Info */}
        <div className="flex items-center gap-3 py-1 px-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#ff512f] to-[#dd2476] flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {(admin?.fullName || admin?.name)?.charAt(0).toUpperCase() || <User size={16} />}
          </div>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-150">
              {admin?.fullName || admin?.name || "Administrator"}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              System Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}