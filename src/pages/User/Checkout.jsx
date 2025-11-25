import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { useCart } from "../../contexts/Cartcontext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get(`http://localhost:5001/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <p className="text-white text-center py-10">Loading...</p>;

  // Convert USD to INR (assuming 1 USD ≈ ₹83)
  const priceInINR = product.price * 83;

  // Format currency properly (e.g., ₹4,999.00)
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(priceInINR);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Navbar />
      <div className="pt-16 p-10 flex flex-col md:flex-row gap-10 items-center justify-center">
        {/* Left: Product Image */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-[400px] h-[400px] object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Right: Product Details */}
        <div className="max-w-md">
          <h2 className="text-4xl font-bold text-[#00FFFF] mb-4">
            {product.name}
          </h2>
          <p className="text-gray-300 mb-4">
            {product.description ||
              "High-quality gaming accessory for pro gamers."}
          </p>
          <p className="text-3xl font-semibold mb-6 text-[#00FFFF]">
            {formattedPrice}
          </p>

          <button
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: priceInINR,
                image: product.image,
                description:
                  product.description ||
                  "High-quality gaming accessory for pro gamers.",
              })
            }
            className="bg-[#00FFFF] text-black px-6 py-3 rounded-md font-semibold hover:bg-cyan-400 transition"
          >
            Add to Cart
          </button>
          <button className="ml-4 border border-[#00FFFF] px-6 py-3 rounded-md hover:bg-[#00FFFF] hover:text-black transition">
            Buy Now
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
