import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { Trash2, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../config/api";
import { useCart } from "../../contexts/CartContext";
import { AuthContext } from "../../contexts/AuthContext";
import { getCloudinaryUrl } from "../../utils/cloudinary";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useCart();
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h2 className="text-3xl font-black mb-4 font-title uppercase tracking-wide bg-gradient-to-r from-[#ff512f] to-[#dd2476] bg-clip-text text-transparent">
              Access Denied
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium text-sm">
              Please log in to view your wishlist.
            </p>
            <Link
              to="/login"
              className="px-6 py-3 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white rounded-xl font-bold uppercase tracking-wider text-xs transition shadow-md shadow-orange-500/10 hover:opacity-95"
            >
              Login
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 px-4 pb-10">
        {wishlist.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center pt-20">
            <h2 className="text-3xl font-black mb-6 font-title uppercase tracking-wide bg-gradient-to-r from-[#ff512f] to-[#dd2476] bg-clip-text text-transparent">
              Your Wishlist is Empty
            </h2>
            <p className="text-slate-550 dark:text-slate-400 mb-6 font-medium">
              Add some products to your wishlist!
            </p>
            <Link to="/products">
              <button className="px-6 py-3 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white rounded-xl font-bold uppercase tracking-wider text-xs transition shadow-md shadow-orange-500/10 hover:opacity-95">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h1 className="text-2xl font-black mb-8 font-title uppercase text-slate-800 dark:text-white">
              My Wishlist ({wishlist.length})
            </h1>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {wishlist.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4 hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-all rounded-xl px-4"
                >
                  {/* Left Side: Image & Text */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto text-center sm:text-left">
                    <div className="w-24 h-24 flex-shrink-0 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-lg p-2 flex items-center justify-center">
                      <img
                        src={getCloudinaryUrl(item.imageUrl || item.image)}
                        alt={item.productName || item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 hover:text-[#ff512f] dark:hover:text-[#ff512f] transition">
                        {item.productName}
                      </h3>
                      <div className="mt-2">
                        <span className="text-[#ff512f] text-lg font-black font-title">
                          ₹{Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Actions */}
                  <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => addToCart({ id: item.productId, name: item.productName })}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition shadow-md shadow-orange-500/10 hover:opacity-95"
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </button>

                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-slate-400 hover:text-red-500 transition font-semibold text-xs flex items-center gap-1.5 px-3 py-2.5 sm:p-0 hover:bg-red-50 dark:hover:bg-red-950/20 sm:hover:bg-transparent rounded-xl"
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}