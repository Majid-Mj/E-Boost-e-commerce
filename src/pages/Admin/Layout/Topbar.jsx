import { useState, useEffect } from "react";
import api from "../../../config/api";
import {
  UserCircle2,
  Mail,
  Shield,
  Menu,
  User
} from "lucide-react";

export default function Topbar({ onMenuClick }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch logged-in admin using JWT
  useEffect(() => {
    const fetchAdmin = async () => {
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
    <header className="sticky top-0 z-40 flex items-center justify-between bg-white/80 backdrop-blur-md text-slate-900 px-4 sm:px-8 py-4 border-b border-slate-200">

      <div className="flex items-center gap-4">
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Profile Info */}
        <div className="flex items-center gap-3 py-1 px-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {(admin?.fullName || admin?.name)?.charAt(0).toUpperCase() || <User size={16} />}
          </div>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-xs font-bold text-slate-900">
              {admin?.fullName || admin?.name || "Administrator"}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              System Admin
            </span>
          </div>
        </div>


      </div>
    </header>
  );
}