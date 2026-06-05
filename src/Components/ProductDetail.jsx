import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useCart } from "../contexts/Cartcontext";
import { Heart, ArrowLeft, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import api from "../config/api";
import { getCloudinaryUrl } from "../utils/cloudinary";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data.data || res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-28">
          <p className="text-slate-500 dark:text-slate-400 font-bold">Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrl = getCloudinaryUrl(product.images?.length > 0 ? product.images[0].imageUrl : product.image);
  const isOutOfStock = product.stock <= 0;
  const originalPrice = product.originalPrice || product.price;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 px-4 md:px-10 max-w-7xl mx-auto w-full mb-16">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-[#ff512f] dark:hover:text-[#ff512f] transition mb-8 active:scale-95"
        >
          <ArrowLeft size={16} /> Back to catalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Product Image */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[500px] aspect-square bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-center overflow-hidden">
              <img
                src={imageUrl}
                alt={product.name}
                className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Right Column: Information Panel */}
          <div className="lg:col-span-6 text-left space-y-6">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1.5 block">
                {product.categoryName || "Premium Gear"}
              </span>
              <h1 className="text-3xl md:text-4xl font-black font-title uppercase tracking-wide text-slate-850 dark:text-white leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-4 py-2 border-y border-slate-200/60 dark:border-slate-800/80">
              <span className="text-[#ff512f] text-3xl font-black font-title">
                ₹{Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              {originalPrice > product.price && (
                <span className="text-slate-400 dark:text-slate-500 line-through text-base font-semibold">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Product Status / Stock Indicator */}
            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                isOutOfStock
                  ? "bg-red-50 dark:bg-red-950/30 text-red-650 dark:text-red-400 border border-red-200/50 dark:border-red-900/30"
                  : "bg-green-55 dark:bg-green-950/30 text-green-650 dark:text-green-400 border border-green-200/50 dark:border-green-900/30"
              }`}>
                <span className={`w-2 h-2 rounded-full ${isOutOfStock ? "bg-red-55" : "bg-green-55"}`}></span>
                {isOutOfStock ? "Out of Stock" : `In Stock: ${product.stock} items available`}
              </span>
            </div>

            {/* Product Description */}
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
              {product.description || "Designed for competitive players demanding top-tier accuracy, speed, and premium build quality. Tested and certified by esports professionals worldwide."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => !isOutOfStock && addToCart(product)}
                disabled={isOutOfStock}
                className={`px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-md ${
                  isOutOfStock
                    ? "bg-slate-200 dark:bg-slate-850 text-slate-400 cursor-not-allowed border border-slate-300 dark:border-slate-800"
                    : "bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white hover:opacity-95 hover:shadow-orange-500/10 active:scale-95"
                }`}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>

              <button
                onClick={() => !isOutOfStock && navigate("/cart/address", { state: { buyNowProduct: product, buyNowQuantity: 1 } })}
                disabled={isOutOfStock}
                className={`px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 border ${
                  isOutOfStock
                    ? "border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed"
                    : "border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-95"
                }`}
              >
                Buy Now
              </button>

              <button
                onClick={() => {
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist(product);
                  }
                }}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition active:scale-95"
                title="Toggle Wishlist"
              >
                <Heart
                  size={20}
                  className={isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-slate-450 dark:text-slate-400"}
                />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs text-slate-500 dark:text-slate-450 font-bold uppercase tracking-wide">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#ff512f]" /> Free delivery
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#ff512f]" /> 1 year warranty
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw size={16} className="text-[#ff512f]" /> 7-day easy returns
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}