import React from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { getCloudinaryUrl } from "../utils/cloudinary";

export const ProductCard = React.memo(({
  product,
  isInWishlist,
  onToggleWishlist,
  onAddToCart,
  onBuyNow
}) => {
  const originalPrice = product.originalPrice || product.price;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#ff512f]/30 dark:hover:border-[#ff512f]/30 p-3 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 w-[240px] relative overflow-hidden flex flex-col justify-between text-left">
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleWishlist(product);
          }}
          className="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition z-20"
        >
          <Heart
            size={16}
            className={isInWishlist ? "fill-red-500 text-red-500" : "text-slate-400"}
          />
        </button>

        <Link to={`/product-details/${product.id}`} className="block">
          <div className="w-full h-[180px] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
            <img
              src={getCloudinaryUrl(product.images?.[0]?.imageUrl || product.image)}
              alt={product.name}
              className="w-full h-full object-contain p-2"
              loading="lazy"
            />
          </div>

          <h3 className="text-sm font-bold mb-1 text-slate-800 dark:text-slate-200 line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>

          <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-2 font-black uppercase tracking-wider">
            {product.categoryName || "Uncategorized"}
          </p>
        </Link>
      </div>

      <div>
        <div className="flex items-center mb-3 min-h-[28px]">
          <p className="text-[#ff512f] text-lg font-black font-title mr-2">
            ₹{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {originalPrice > product.price && (
            <p className="text-slate-400 dark:text-slate-500 line-through text-xs font-semibold">
              ₹{originalPrice.toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex justify-between gap-2 mt-auto">
          <button
            disabled={product.stock === 0}
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${product.stock === 0
              ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white hover:shadow-md cursor-pointer"
              }`}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>

          <button
            disabled={product.stock === 0}
            onClick={(e) => {
              e.preventDefault();
              onBuyNow(product);
            }}
            className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${product.stock === 0
              ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              : "bg-slate-800 dark:bg-slate-750 text-white hover:bg-slate-700 dark:hover:bg-slate-650 cursor-pointer"
              }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";
