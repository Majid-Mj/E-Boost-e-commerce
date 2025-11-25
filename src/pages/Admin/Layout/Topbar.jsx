import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserCircle2, LogOut, Mail, Shield, Menu } from "lucide-react";

export default function Topbar() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:4444/admin");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setAdmin(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚪 Logout handler
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("admin");
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-[#3b3552] text-white px-4 sm:px-6 py-3 shadow-md border-b border-[#5a5270]">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu for Mobile */}
        <button
          className="sm:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-[#4a4264] transition"
          onClick={() => setShowMenu(!showMenu)}
        >
          <Menu size={22} />
        </button>

        <h1 className="text-lg sm:text-xl font-semibold tracking-wide">
          EBoost
        </h1>
      </div>

      {/* Right Section */}
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center gap-2 hover:text-gray-200 transition"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <UserCircle2 size={28} className="text-white" />
          {!loading && admin && (
            <span className="text-sm hidden md:inline-block font-medium">
              {admin.name}
            </span>
          )}
        </button>

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute right-0 mt-3 bg-white text-gray-600 rounded-md px-4 py-2 shadow-md text-sm">
            Loading...
          </div>
        )}

        {/* Dropdown */}
        {showDropdown && admin && !loading && (
          <div
            className="absolute right-0 mt-3 w-72 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 p-5 transition-all duration-200 ease-out animate-fadeIn"
            style={{
              animation: "fadeIn 0.2s ease-in-out",
            }}
          >
            {/* Profile Header */}
            <div className="flex items-center gap-4 border-b pb-4 mb-3">
              <div className="bg-[#3b3552] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                {admin.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {admin.name}
                </h3>
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-gray-500" /> {admin.email}
              </p>
              <p className="flex items-center gap-2">
                <Shield size={16} className="text-gray-500" /> Role:{" "}
                <span className="font-medium">Administrator</span>
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full mt-5 bg-[#e53935] text-white py-2.5 rounded-md hover:bg-[#c62828] transition font-medium"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu (Optional Future Expansion) */}
      {showMenu && (
        <div className="absolute top-full left-0 w-full bg-[#3b3552] border-t border-[#5a5270] flex flex-col items-start p-4 sm:hidden animate-fadeIn">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-left py-2 hover:bg-[#4a4264] rounded-md px-3"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/products")}
            className="w-full text-left py-2 hover:bg-[#4a4264] rounded-md px-3"
          >
            Products
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="w-full text-left py-2 hover:bg-[#4a4264] rounded-md px-3"
          >
            Orders
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 hover:bg-[#4a4264] rounded-md px-3 text-[#ffb3b3]"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
  