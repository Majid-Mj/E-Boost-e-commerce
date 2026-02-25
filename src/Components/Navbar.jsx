import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import { useCart } from "../contexts/Cartcontext";
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
  const { getUniqueItemsCount, getWishlistCount } = useCart();
  const { user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-[#141414] text-gray-200 py-3 px-6 md:px-8 flex items-center justify-between shadow-md fixed top-0 left-0 right-0 z-50">
      
      {/* Left: Logo */}
      <div className="text-2xl font-semibold tracking-wide">
        <Link
          to="/"
          className="text-white hover:text-[#00FFFF] transition-colors"
          onClick={closeMenu}
        >
          E<span className="text-[#00FFFF]">Boost</span>
        </Link>
      </div>

      {/* Hamburger Icon (Mobile) */}
      <button
        className="md:hidden text-white hover:text-[#00FFFF] transition-colors"
        onClick={toggleMenu}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Center Nav Links */}
      <ul
        className={`${menuOpen ? "flex" : "hidden"} 
        flex-col absolute top-16 left-0 w-full bg-[#141414] 
        md:bg-transparent md:static md:flex md:flex-row 
        md:space-x-10 md:w-auto text-sm uppercase 
        tracking-wider items-center space-y-4 md:space-y-0 
        py-4 md:py-0 transition-all duration-300`}
      >
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/about" onClick={closeMenu}>About</Link></li>
        <li><Link to="/products" onClick={closeMenu}>Shop</Link></li>
        <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
      </ul>

      {/* Right: Icons Section */}
      <div className="hidden md:flex items-center space-x-4">

        {/* Wishlist */}
        <Link to="/wishlist" className="hover:text-[#00FFFF] transition-colors relative">
          <Heart size={18} />
          {getWishlistCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {getWishlistCount()}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link to="/cart" className="hover:text-[#00FFFF] transition-colors relative">
          <ShoppingCart size={18} />
          {getUniqueItemsCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#00FFFF] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {getUniqueItemsCount()}
            </span>
          )}
        </Link>

        {/* User / Login */}
        {user ? (
          <Link to="/user" className="hover:text-[#00FFFF] transition-colors">
            <User size={18} />
          </Link>
        ) : (
          <Link
            to="/login"
            className="bg-[#00FFFF] text-black px-3 py-1 rounded-md font-semibold text-sm hover:bg-[#00cccc] transition-colors"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Icons */}
      {menuOpen && (
        <div className="flex md:hidden justify-center space-x-6 mt-3">
          <Link to="/wishlist" onClick={closeMenu} className="hover:text-[#00FFFF] transition-colors relative">
            <Heart size={20} />
            {getWishlistCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {getWishlistCount()}
              </span>
            )}
          </Link>

          <Link to="/cart" onClick={closeMenu} className="hover:text-[#00FFFF] transition-colors relative">
            <ShoppingCart size={20} />
            {getUniqueItemsCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#00FFFF] text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {getUniqueItemsCount()}
              </span>
            )}
          </Link>

          {user ? (
            <Link to="/user" onClick={closeMenu} className="hover:text-[#00FFFF] transition-colors">
              <User size={20} />
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="bg-[#00FFFF] text-black px-3 py-1 rounded-md font-semibold text-sm hover:bg-[#00cccc] transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}