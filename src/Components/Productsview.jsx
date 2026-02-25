import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/Cartcontext";
import api from "../config/api";

export default function ProductsView() {
  const [products, setProducts] = useState([]);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, wishlist } = useCart();

useEffect(() => {
  api
    .get("/products")   // no need for full URL
    .then((res) => setProducts(res.data))
    .catch((err) => console.error("Error fetching products:", err));
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
        removeFromWishlist(wishlistItem.id);
      }
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price, 
        image: product.image,
        description:
          product.description ||
          "High-quality product for gamers and enthusiasts.",
      });
    }
  };

  return (
    <div className="py-10 bg-gradient-to-b from-black via-gray-900 to-black text-white mt-20">
      <h2 className="text-3xl font-semibold text-center mb-10 text-[#00FFFF]">
        Featured Products
      </h2>

      <div className="flex flex-wrap justify-center gap-6"> 
        {products.length > 0 ? (
          products.map((product) => {
            const discount = calculateDiscount(product.originalPrice, product.price);
            return (
              <Link
                to={`/product-details/${product.id}`}
                key={product.id}
                className="bg-gray-800 p-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-[240px] relative overflow-hidden block"
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product);
                  }}
                  className="absolute top-2 right-2 p-1 bg-gray-700 rounded-full hover:bg-gray-600 transition"
                >
                  <Heart
                    size={18}
                    className={`${
                      isInWishlist(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[160px] object-cover rounded-md mb-3"
                />

                <h3 className="text-base font-medium mb-1 line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center mb-3">
                  <p className="text-[#00FFFF] text-lg font-bold mr-2">
                    ₹{product.price.toFixed(2)}
                  </p>
                  {product.originalPrice > product.price && (
                    <p className="text-gray-400 line-through text-xs">
                      ₹{product.originalPrice}
                    </p>
                  )}
                </div>

                <div className="flex justify-center gap-2">
                  <span className="text-cyan-400 hover:text-cyan-300 transition text-sm font-medium underline">
                    View Product
                  </span>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-center text-gray-400">Loading products...</p>
        )}
      </div>

      <div className="text-center mt-10">
        <Link to="/products">
          <button className="px-6 py-3 bg-[#00FFFF] hover:bg-cyan-400 text-black rounded-lg font-semibold transition">
            View More Products
          </button>
        </Link>
      </div>
    </div>
  );
}
