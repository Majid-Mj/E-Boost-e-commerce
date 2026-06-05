import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/Cartcontext";
import api from "../config/api";
import { getCloudinaryUrl } from "../utils/cloudinary";

export default function ProductsView() {
  const [products, setProducts] = useState([]);
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlist } = useCart();

  // Fetch maximum of 4 products to display as "Featured"
  useEffect(() => {
    api
      .get("/products/paged?page=1&pageSize=15")
      .then((res) => {
        // Handle standard response or ApiResponseFilter wrapped response
        let fetchedProducts = res.data.data?.items || res.data?.items || [];
        setProducts(fetchedProducts);
      })
      .catch((err) => console.error("Error fetching featured products:", err));
  }, []);

  const calculateDiscount = (originalPrice, price) => {
    if (originalPrice > price) {
      const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
      return discount;
    }
    return 0;
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      const wishlistItem = wishlist.find(item => item.productId === product.id);
      if (wishlistItem) {
        removeFromWishlist(wishlistItem.productId);
      }
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.imageUrl || product.image || "/assets/placeholder.jpg",
        description:
          product.description ||
          "High-quality product for gamers and enthusiasts.",
      });
    }
  };

  return (
    <div className="py-10 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 mt-20 transition-colors duration-300">
      <h2 className="text-3xl font-black text-center mb-10 text-slate-800 dark:text-white font-title uppercase tracking-wide">
        Featured Products
      </h2>

      <div className="flex flex-wrap justify-center gap-6">
        {products.length > 0 ? (
          products.map((product) => {
            const originalPrice = product.originalPrice || product.price; // Fallback if no original price is provided by DTO
            const discount = calculateDiscount(originalPrice, product.price);
            const displayImage = getCloudinaryUrl(product.images?.[0]?.imageUrl || product.image);
            return (
              <Link
                to={`/product-details/${product.id}`}
                key={product.id}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-lg shadow-sm hover:shadow-lg hover:border-[#ff512f]/30 dark:hover:border-[#ff512f]/30 hover:bg-white dark:hover:bg-slate-950 transition-all duration-300 w-[240px] relative overflow-hidden block"
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product);
                  }}
                  className="absolute top-2 right-2 p-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition z-20"
                >
                  <Heart
                    size={16}
                    className={`${isInWishlist(product.id)
                      ? "fill-red-500 text-red-500"
                      : "text-slate-400"
                      }`}
                  />
                </button>

                <div className="w-full h-[160px] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                  <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                <h3 className="text-sm font-bold mb-1 text-slate-800 dark:text-slate-200 line-clamp-2 min-h-[40px]">
                  {product.name}
                </h3>

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

                <div className="flex justify-center gap-2">
                  <span className="text-[#ff512f] hover:text-[#dd2476] transition text-xs font-bold uppercase tracking-wider">
                    View Product
                  </span>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-center text-slate-400">Loading products...</p>
        )}
      </div>

      <div className="text-center mt-10">
        <Link to="/products">
          <button className="px-6 py-3 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white rounded-lg font-bold uppercase tracking-wider text-xs transition shadow-md shadow-orange-500/10 hover:opacity-95">
            View More Products
          </button>
        </Link>
      </div>
    </div>
  );
}
