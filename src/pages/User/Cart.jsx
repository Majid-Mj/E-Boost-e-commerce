import React, { useState, useEffect, useContext } from "react";
import { useCart } from "../../contexts/Cartcontext";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { Link } from "react-router-dom";
import api from "../../config/api";
import { AuthContext } from "../../contexts/AuthContext";
import { getCloudinaryUrl } from "../../utils/cloudinary";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        let productsArray = [];
        if (Array.isArray(response.data?.data)) {
          productsArray = response.data.data;
        } else if (Array.isArray(response.data)) {
          productsArray = response.data;
        }
        setProducts(productsArray);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  //Check if any item exceeds stock
  const isStockInsufficient = cart.some((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product && item.quantity > product.stock;
  });

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
              Please log in to view your cart.
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white rounded-xl font-bold uppercase tracking-wider text-xs transition shadow-md shadow-orange-500/10 hover:opacity-95"
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

      <main className="flex-grow pt-28 px-4 pb-10 mb-10">
        {cart.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center pt-20">
            <h2 className="text-3xl font-black mb-10 font-title uppercase tracking-wide bg-gradient-to-r from-[#ff512f] to-[#dd2476] bg-clip-text text-transparent">
              Your Cart is Empty
            </h2>
            <p className="text-slate-550 dark:text-slate-400 mb-6 font-medium">Add some products to get started!</p>
            <Link to="/products">
              <button className="px-6 py-3 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white rounded-xl font-bold uppercase tracking-wider text-xs transition shadow-md shadow-orange-500/10 hover:opacity-95">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-2">
            <h1 className="text-3xl font-black mb-10 font-title uppercase text-slate-800 dark:text-white">
              My Cart ({getTotalItems()} items)
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cart.map((cartItem) => {
                  const product = products.find((p) => p.id === cartItem.productId);
                  const isMaxReached = product ? cartItem.quantity >= product.stock : false;

                  return (
                    <div
                      key={cartItem.productId}
                      className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between flex-wrap gap-4"
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-20 h-20 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-lg p-1 flex items-center justify-center flex-shrink-0">
                          <img
                            src={getCloudinaryUrl(cartItem.imageUrl)}
                            alt={cartItem.productName}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 max-w-xs">{cartItem.productName}</h3>
                          <p className="text-[#ff512f] text-base font-black font-title">
                            ₹{(cartItem.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-slate-450 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wide">
                            {product ? `In Stock: ${product.stock}` : "Checking stock..."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(cartItem.productId, cartItem.quantity - 1)}
                            className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-350 w-8 h-8 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center font-bold transition"
                            disabled={cartItem.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="text-slate-800 dark:text-slate-200 w-6 text-center font-semibold">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() =>
                              !isMaxReached &&
                                updateQuantity(cartItem.productId, cartItem.quantity + 1)
                            }
                            disabled={isMaxReached}
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition ${isMaxReached
                              ? "bg-slate-100 dark:bg-slate-950 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-850"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-300 dark:hover:bg-slate-700"
                              }`}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(cartItem.productId)}
                          className="text-red-500 hover:text-red-400 font-bold uppercase text-xs tracking-wider transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit text-left">
                <h3 className="text-lg font-black mb-4 font-title uppercase text-slate-850 dark:text-slate-200">Price Details</h3>
                <div className="space-y-3 mb-6 text-sm text-slate-650 dark:text-slate-350 font-medium">
                  <div className="flex justify-between">
                    <span>Price ({getTotalItems()} items)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">₹{getTotalPrice().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="text-green-500 font-bold">FREE</span>
                  </div>
                  <hr className="border-slate-250 dark:border-slate-800" />
                  <div className="flex justify-between text-base font-black text-slate-850 dark:text-white">
                    <span>Total Amount</span>
                    <span className="text-[#ff512f] font-title text-lg">₹{getTotalPrice().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <Link to={isStockInsufficient ? "#" : "address"}>
                  <button
                    disabled={isStockInsufficient}
                    className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition shadow-md ${isStockInsufficient
                      ? "bg-slate-200 dark:bg-slate-850 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white hover:opacity-95"
                      }`}
                  >
                    {isStockInsufficient ? "Check Stock" : "Place Order"}
                  </button>
                </Link>

                {isStockInsufficient && (
                  <p className="text-center text-red-500 text-xs font-semibold mt-3">
                    Some items exceed available stock.
                  </p>
                )}

                <p className="text-center text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-4">
                  Safe and Secure Payments. Easy returns.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
