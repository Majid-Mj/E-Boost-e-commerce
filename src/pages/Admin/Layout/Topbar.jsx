import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";
import {
  UserCircle2,
  LogOut,
  Mail,
  Shield,
  Menu,
  Bell,
  Settings,
  Search,
  ChevronDown,
  User
} from "lucide-react";

export default function Topbar({ onMenuClick }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await api.post("/auth/logout");
      } catch (err) {
        console.error("Logout error:", err);
      }
      localStorage.clear();
      navigate("/login");
    }
  };

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
      <div className="flex items-center gap-2 sm:gap-6">
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-3 p-1 rounded-2xl hover:bg-slate-100 transition-all"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-200">
              {(admin?.fullName || admin?.name)?.charAt(0).toUpperCase() || <User size={20} />}
            </div>

            <div className="hidden md:flex flex-col items-start mr-1">
              <span className="text-sm font-bold text-slate-900 leading-tight">
                {admin?.fullName || admin?.name || "Administrator"}
              </span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                System Admin
              </span>
            </div>
            <ChevronDown size={16} className={`text-slate-400 transition-transform hidden md:block ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-5 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xl border border-slate-200">
                  {(admin?.fullName || admin?.name)?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-bold text-slate-900">{admin?.fullName || admin?.name}</h3>
                  <p className="text-xs font-semibold text-slate-500 truncate max-w-[160px]">{admin?.email}</p>
                </div>
              </div>

              <div className="space-y-1">
                <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
                  <User size={18} className="text-slate-400" /> My Profile
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
                  <Shield size={18} className="text-slate-400" /> Access Logs
                </button>
              </div>

              <div className="h-px bg-slate-100 my-3"></div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}