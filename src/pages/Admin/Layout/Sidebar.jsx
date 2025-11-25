import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  X,
  LogOut,
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Products", path: "/admin/products", icon: <Package size={20} /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
  ];

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    localStorage.removeItem("admin");
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-[#1d1b2f] text-gray-200 flex-col shadow-xl z-40">
        <div className="text-2xl font-bold text-center py-6 border-b border-gray-700">
          Admin Panel
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 
                ${
                  location.pathname === item.path
                    ? "bg-purple-600 text-white"
                    : "hover:bg-[#2a2543]"
                }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

    
      <div
        className={`fixed inset-0 z-50 bg-black/40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#1d1b2f] text-gray-200 flex flex-col shadow-2xl transform transition-transform duration-300 md:hidden z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Eboost</h2>
          <button onClick={onClose}>
            <X size={22} className="text-gray-400 hover:text-white" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 
                ${
                  location.pathname === item.path
                    ? "bg-purple-600 text-white"
                    : "hover:bg-[#2a2543]"
                }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => {
            const confirmed = window.confirm("Are you sure you want to logout?");
            if (!confirmed) return;
            localStorage.removeItem("admin");
            localStorage.removeItem("isAdminLoggedIn");

            onClose();
            navigate("/login");
          }}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
        >
          <LogOut size={18} />
          Logout
        </button>
        </div>
      </div>
    </>
  );
}
