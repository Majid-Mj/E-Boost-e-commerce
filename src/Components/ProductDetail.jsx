import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useCart } from "../contexts/Cartcontext";
import { Heart } from "lucide-react";
import { API_BASE_URL } from "../api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, wishlist } = useCart();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <p className="text-white text-center py-10">Loading...</p>;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Navbar />
      <div className="pt-16 p-10 flex flex-col md:flex-row gap-10 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-[400px] h-[400px] object-cover rounded-lg shadow-lg"
          />
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl font-bold text-[#00FFFF] mb-4">
            {product.name}
          </h2>

          <p className="text-gray-300 mb-4">
            {product.category
              ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
              : product.description || "High-quality gaming accessory for pro gamers."}
          </p>

          {/*Stock Display */}
          <p className={`mb-4 font-semibold ${isOutOfStock ? "text-red-500" : "text-green-400"}`}>
            {isOutOfStock
              ? "Out of Stock"
              : `In Stock: ${product.stock} item${product.stock > 1 ? "s" : ""}`}
          </p>

          <p className="text-3xl font-semibold mb-6 text-[#00FFFF]">
            ₹{product.price}
          </p>

          <div className="flex items-center gap-4 mb-6">
      
            <button
              onClick={() => {
                if (isInWishlist(product.id)) {
                  const wishlistItem = wishlist.find(item => item.productId === product.id);
                  if (wishlistItem) removeFromWishlist(wishlistItem.id);
                } else {
                  addToWishlist({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    description: product.description || "High-quality gaming accessory for pro gamers.",
                  });
                }
              }}
              className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition"
            >
              <Heart
                size={24}
                className={`${
                  isInWishlist(product.id)
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400"
                }`}
              />
            </button>

            {/* Add to Cart Button */}
            <button
              onClick={() => !isOutOfStock && addToCart(product)}
              disabled={isOutOfStock}
              className={`px-6 py-3 rounded-md font-semibold transition ${
                isOutOfStock
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-[#00FFFF] text-black hover:bg-cyan-400"
              }`}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            {/* Buy Now */}
            <Link to="/cart/address">
              <button
                disabled={isOutOfStock}
                className={`border px-6 py-3 rounded-md transition ${
                  isOutOfStock
                    ? "border-gray-600 text-gray-400 cursor-not-allowed"
                    : "border-[#00FFFF] hover:bg-[#00FFFF] hover:text-black"
                }`}
              >
                Buy Now
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
