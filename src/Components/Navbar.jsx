import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Heart, User, Menu, X, ChevronDown, LogOut, Phone, Mail, Settings, Sun, Moon } from "lucide-react";
import { useCart } from "../contexts/Cartcontext";
import { useTheme } from "../contexts/ThemeContext";
import { AuthContext } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import SideCart from "./SideCart";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const [cartOpen, setCartOpen] = useState(false);

  const location = useLocation();
  const { wishlist, getUniqueItemsCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  const { user, logout } = React.useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const getWishlistCount = () => wishlist ? wishlist.length : 0;

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      {/* Main Navbar (Floating Glassmorphism Light) */}
      <div className={`fixed top-6 left-0 right-0 z-[100] px-4 md:px-10 flex justify-center pointer-events-none transition-all duration-300 ${scrolled ? "top-2" : ""}`}>
        <nav
          className={`pointer-events-auto w-full max-w-7xl transition-all duration-500 rounded-2xl px-6 py-3 flex items-center justify-between
          bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl
          border border-slate-200/80 dark:border-slate-800/85
          shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]
          ${scrolled ? "shadow-[0_12px_40px_rgba(0,0,0,0.08)] py-2.5" : ""}
        `}
        >
          {/* Logo */}
          <Link
            to="/"
            className="relative group text-2xl font-black tracking-widest flex items-center"
            onClick={closeMenu}
          >
            <span className="text-black dark:text-white font-title pr-[2px]">E</span>
            <span className="text-[#ff512f] font-title group-hover:text-[#dd2476] transition-all">BOOST</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <div key={item.name} className="relative group/menu py-1">
                <Link
                  to={item.path}
                  className={`text-xs uppercase tracking-widest font-bold transition-all hover:text-[#ff512f] flex items-center gap-1 ${
                    location.pathname === item.path ? "text-[#ff512f]" : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Right Icon Utilities */}
          <div className="flex items-center space-x-4">
            


            {/* Wishlist Link */}
            <Link to="/wishlist" className="relative p-1.5 text-slate-500 dark:text-slate-400 hover:text-[#ff512f] transition">
              <Heart size={19} />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#dd2476] text-white text-[9px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center">
                  {getWishlistCount()}
                </span>
              )}
            </Link>

            {/* Shopping Cart Drawer Toggle */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-1.5 text-slate-500 dark:text-slate-400 hover:text-[#ff512f] transition"
            >
              <ShoppingCart size={19} />
              {getUniqueItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white text-[9px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center">
                  {getUniqueItemsCount()}
                </span>
              )}
            </button>

            {/* Light / Dark Mode Toggle button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-[#ff512f] transition rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              {user ? (
                <Link
                  to="/User"
                  className="flex items-center space-x-1 cursor-pointer group/user"
                >
                  <div className="w-8.5 h-8.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-350 hover:border-[#ff512f] transition-colors">
                    <User size={15} />
                  </div>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:inline-flex items-center justify-center px-5 py-1.5 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition hover:shadow-lg"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Icon */}
            <button
              className="md:hidden p-1.5 text-slate-700 dark:text-slate-300 hover:text-[#ff512f] transition"
              onClick={toggleMenu}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] md:hidden"
                onClick={closeMenu}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[300px] bg-white dark:bg-slate-950 z-[120] border-l border-slate-200 dark:border-slate-800 md:hidden flex flex-col"
              >
                <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <span className="text-lg font-black tracking-widest font-title flex items-center">
                    <span className="text-black dark:text-white pr-[2px]">E</span>
                    <span className="text-[#ff512f]">BOOST</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {/* Theme Toggle in Mobile */}
                    <button
                      onClick={toggleTheme}
                      className="p-2 text-slate-500 dark:text-slate-400 hover:text-[#ff512f] transition rounded-full hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                    <button onClick={closeMenu} className="p-2 text-slate-400 dark:text-slate-500 hover:text-black dark:hover:text-white">
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 py-8 px-6 space-y-5">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="block text-xl font-bold text-slate-800 dark:text-slate-200 hover:text-[#ff512f] transition"
                      onClick={closeMenu}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4" />
                  <Link
                    to="/orders"
                    className="block text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-[#ff512f] transition"
                    onClick={closeMenu}
                  >
                    Track My Order
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-[#ff512f] transition"
                    onClick={closeMenu}
                  >
                    My Wishlist
                  </Link>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="text-slate-800 dark:text-slate-200 font-bold text-xs">{user.name || "Gamer"}</p>
                          <Link to="/User" onClick={closeMenu} className="text-[10px] text-[#ff512f] hover:underline font-bold">Profile Settings</Link>
                        </div>
                      </div>
                      <button
                        onClick={() => { logout(); closeMenu(); }}
                        className="w-full flex items-center justify-center space-x-2 py-2.5 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-lg hover:bg-red-100 text-xs font-bold transition"
                      >
                        <LogOut size={14} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="w-full inline-flex items-center justify-center py-3 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white font-bold uppercase rounded-lg text-xs"
                    >
                      Login to Account
                    </Link>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Side drawer Cart overlays */}
      <SideCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
