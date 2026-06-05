import React from "react";
import { Link } from "react-router-dom";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../contexts/Cartcontext";
import { getCloudinaryUrl } from "../utils/cloudinary";

export default function SideCart({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] overflow-hidden pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex flex-col shadow-2xl relative transition-colors duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xl font-black flex items-center gap-2 tracking-wide font-title text-black dark:text-white">
              <ShoppingBag className="text-[#ff512f]" size={20} />
              YOUR CART
            </h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto py-6 px-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-4 text-[#ff512f]/60 border border-slate-100 dark:border-slate-800 animate-pulse">
                  <ShoppingBag size={28} />
                </div>
                <p className="text-lg font-bold mb-2 text-slate-800 dark:text-slate-100">Your Cart is Empty</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[250px] mb-6">
                  Check out our new gaming accessories and level up your play!
                </p>
                <Link
                  to="/products"
                  onClick={onClose}
                  className="px-6 py-3 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white font-bold rounded-lg tracking-wide transition uppercase text-xs shadow-lg hover:opacity-90"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl relative group hover:border-[#ff512f]/30 dark:hover:border-[#ff512f]/30 transition duration-300"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-lg p-1 flex items-center justify-center shrink-0">
                    <img
                      src={getCloudinaryUrl(item.imageUrl)}
                      alt={item.productName}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1 pr-6">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-[#ff512f] font-bold mt-1">
                        ₹{(item.price || 0).toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden bg-white dark:bg-slate-950">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 px-2 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-30 disabled:hover:bg-transparent text-slate-400 transition"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold px-2 min-w-[20px] text-center text-slate-700 dark:text-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 px-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 transition"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Area */}
          {cart.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Subtotal ({getTotalItems()} items)</span>
                <span className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-wide">
                  ₹{getTotalPrice().toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Shipping charges and taxes are calculated at checkout.
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="w-full py-3 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-bold rounded-lg transition text-center uppercase tracking-wider text-xs block"
                >
                  View Cart
                </Link>
                <Link
                  to="/cart/address"
                  onClick={onClose}
                  className="w-full py-3 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white font-bold rounded-lg transition text-center uppercase tracking-wider text-xs block shadow-md hover:opacity-95"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
