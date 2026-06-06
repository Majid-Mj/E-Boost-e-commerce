import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { getCloudinaryUrl } from "../utils/cloudinary";

export default function WeeklyDeals() {
  const { addToCart, addToWishlist } = useCart();
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 45 });

  // Countdown calculations
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 4); // 4 days from now

    const interval = setInterval(() => {
      const difference = targetDate.getTime() - new Date().getTime();
      if (difference <= 0) {
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const dealProduct = {
    id: 16, 
    name: "Logitech G Pro X Superlight Wireless Gaming Mouse",
    price: 499.99,
    originalPrice: 999.99,
    image: getCloudinaryUrl("/assets/products/Logitech G Pro X Superlight Wireless Gaming Mouse.png"),
    rating: 5,
    reviewsCount: 148
  };

  return (
    <section className="py-20 bg-[#f8f9fa] dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-800 relative transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,81,47,0.03),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text & Timer Info */}
          <div className="lg:col-span-6 text-left">
            <span className="text-[#dd2476] font-bold text-xs uppercase tracking-[0.2em] mb-4 block">
              LIMITED TIME OFFER
            </span>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight font-title text-slate-800 dark:text-white">
              WEEKLY DEALS — GEAR UP FOR VICTORY
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mb-8 max-w-lg leading-relaxed">
              Don't Miss Out! Get premium esports-grade tactical accessories at unmatched prices. Unleash your full gaming potential without breaking the bank.
            </p>

            {/* Countdown Widget */}
            <div className="flex gap-2 sm:gap-4 md:gap-6 mb-8">
              {[
                { label: "DAYS", value: timeLeft.days },
                { label: "HOURS", value: timeLeft.hours },
                { label: "MINS", value: timeLeft.minutes },
                { label: "SECS", value: timeLeft.seconds }
              ].map((time, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center shadow-sm relative overflow-hidden">
                    <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 font-title">
                      {String(time.value).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 tracking-widest font-bold mt-2">
                    {time.label}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#ff512f] dark:hover:border-[#ff512f] hover:text-[#ff512f] dark:hover:text-[#ff512f] font-bold text-xs uppercase tracking-wider rounded-lg transition duration-300 shadow-sm"
            >
              Shop All Deals
            </Link>
          </div>

          {/* Right Product Spotlight card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 relative overflow-hidden group hover:border-[#ff512f]/30 dark:hover:border-[#ff512f]/30 hover:shadow-lg transition duration-500">
              {/* Corner Ribbon */}
              <div className="absolute top-0 right-0 bg-[#dd2476] text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                SAVE {Math.round(((dealProduct.originalPrice - dealProduct.price) / dealProduct.originalPrice) * 100)}%
              </div>

              {/* Product Visual */}
              <div className="w-full h-64 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl flex items-center justify-center relative overflow-hidden p-6 mb-6">
                <img
                  src={dealProduct.image}
                  alt={dealProduct.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition duration-500"
                />
              </div>

              {/* Stars & Reviews */}
              <div className="flex items-center gap-1 mb-2">
                {[...Array(dealProduct.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[#ff512f] text-[#ff512f]" />
                ))}
                <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">({dealProduct.reviewsCount} reviews)</span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 line-clamp-1">
                {dealProduct.name}
              </h3>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl font-black text-[#ff512f] font-title">
                  ₹{dealProduct.price.toLocaleString()}
                </span>
                <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
                  ₹{dealProduct.originalPrice.toLocaleString()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Link
                  to={`/products/${dealProduct.id}`}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-800 hover:border-[#ff512f] text-slate-600 dark:text-slate-400 hover:text-[#ff512f] dark:hover:text-[#ff512f] text-xs uppercase tracking-wider font-bold rounded-lg text-center transition"
                >
                  View Details
                </Link>
                <button
                  onClick={() => addToWishlist(dealProduct)}
                  className="px-6 py-3 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white text-xs uppercase tracking-wider font-bold rounded-lg flex items-center justify-center gap-2 transition hover:opacity-90 shadow-md shadow-orange-500/10"
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
