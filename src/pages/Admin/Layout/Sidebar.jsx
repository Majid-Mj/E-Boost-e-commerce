import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  X,
  LogOut,
  Zap,
  ChevronRight,
  Settings,
  HelpCircle
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Products", path: "/admin/products", icon: <Package size={20} /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
  ];

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.clear();
    navigate("/login");
  };

  const NavLink = ({ item, isMobile = false }) => {
    const isActive = location.pathname === item.path ||
      (item.path !== "/admin" && location.pathname.startsWith(item.path));

    return (
      <Link
        key={item.name}
        to={item.path}
        onClick={isMobile ? onClose : undefined}
        className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive
          ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
      >
        <div className="flex items-center gap-3">
          <span className={`${isActive ? "text-white" : "text-slate-500 group-hover:text-purple-400"} transition-colors`}>
            {item.icon}
          </span>
          <span className="font-bold tracking-tight">{item.name}</span>
        </div>
        {isActive && <ChevronRight size={14} className="opacity-60" />}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-full w-72 bg-[#0f172a] text-white flex-col z-40 border-r border-slate-800/50">
        <div className="flex items-center gap-3 px-8 py-10">
          <h1 className="text-2xl font-black tracking-tighter">
            E-BOOST<span className="text-purple-500">.</span>
          </h1>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto scrollbar-hide py-4">
          <p className="px-4 mb-4 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Main Navigation</p>
          {menuItems.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800/50 space-y-2">
          <p className="px-4 mb-2 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">System</p>

          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-3 w-full px-4 py-3 text-rose-400 font-bold hover:bg-rose-500/10 rounded-2xl transition-all"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      ></div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[#0f172a] text-white flex flex-col shadow-2xl transform transition-all duration-300 ease-in-out md:hidden z-50 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-8 py-8 border-b border-slate-800/50">
          <h2 className="text-xl font-black tracking-tighter text-white">E-BOOST</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-2 py-8">
          {menuItems.map((item) => (
            <NavLink key={item.name} item={item} isMobile />
          ))}
        </nav>

        <div className="p-8 border-t border-slate-800/50">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-900/20"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Custom Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogOut className="text-rose-600" size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Sign Out?</h2>
              <p className="text-slate-500 font-bold mb-8">
                Are you sure you want to end your current session?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-rose-200"
                >
                  Yes, Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
