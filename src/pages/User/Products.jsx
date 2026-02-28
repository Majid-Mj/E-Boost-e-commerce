import React, { useEffect, useState } from "react";
import { Heart, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { useCart } from "../../contexts/Cartcontext";
import api from "../../config/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const { addToCart, wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

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
        image: product.images?.[0]?.imageUrl || "/assets/placeholder.jpg",
        description:
          product.description ||
          "High-quality product for gamers and enthusiasts.",
      });
    }
  };

  // 🔥 Fetch products from real backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        console.log("Products from backend:", res.data);
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔎 Filtering
  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((product) => {
      if (!categoryFilter) return true;
      return (
        product.categoryName?.toLowerCase() ===
        categoryFilter.toLowerCase()
      );
    })
    .filter((product) => {
      if (!priceFilter) return true;
      const price = Number(product.price);
      if (priceFilter === "500-1000") return price >= 500 && price <= 1000;
      if (priceFilter === "1000-2000") return price > 1000 && price <= 2000;
      if (priceFilter === "2000-5000") return price > 2000 && price <= 5000;
      if (priceFilter === "5000-10000") return price > 5000 && price <= 10000;
      return true;
    });

  // 🏷 Extract categories
  const categories = Array.from(
    new Set(products.map((p) => p.categoryName).filter(Boolean))
  ).sort();

  const formatCategoryLabel = (cat) => {
    if (!cat) return cat;
    const label = cat.replace(/[_-]/g, " ");
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Navbar />
      <div className="pt-16 py-10">

        {/* 🔍 Search */}
        <div className="flex justify-center mb-6">
          <div className="relative w-[90%] md:w-[500px]">
            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* 🎯 Filters */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-400 w-[90%] md:w-[250px]"
          >
            <option value="">Filter by Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {formatCategoryLabel(cat)}
              </option>
            ))}
          </select>

          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-400 w-[90%] md:w-[250px]"
          >
            <option value="">Filter by Price</option>
            <option value="500-1000">₹500 - ₹1000</option>
            <option value="1000-2000">₹1000 - ₹2000</option>
            <option value="2000-5000">₹2000 - ₹5000</option>
            <option value="5000-10000">₹5000 - ₹10000</option>
          </select>

          <div className="flex items-center justify-center w-[90%] md:w-[150px]">
            <button
              onClick={() => {
                setSearch("");
                setCategoryFilter("");
                setPriceFilter("");
              }}
              className="w-full bg-transparent border border-gray-600 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* 🛒 Products Grid */}
        <div className="flex flex-wrap justify-center gap-6">
          {loading ? (
            <p className="text-gray-400">Loading products...</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
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
                  className="absolute top-2 right-2 p-1.5 bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-gray-700 transition z-10"
                >
                  <Heart
                    size={20}
                    className={`${isInWishlist(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                      }`}
                  />
                </button>

                <img
                  src={
                    product.images?.[0]?.imageUrl ||
                    "https://via.placeholder.com/200"
                  }
                  alt={product.name}
                  className="w-full h-[180px] object-fit rounded-md mb-3"
                />

                <h3 className="text-base font-medium mb-1 line-clamp-2">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                  {product.categoryName || "Uncategorized"}
                </p>

                <div className="flex items-center mb-3">
                  <p className="text-[#00FFFF] text-lg font-bold mr-2">
                    ₹{Number(product.price).toFixed(2)}
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    disabled={product.stock === 0}
                    onClick={(e) => {
                      e.preventDefault();
                      if (product.stock > 0) {
                        addToCart(product);
                      }
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${product.stock === 0
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-[#FF9F00] hover:bg-[#e68900]"
                      }`}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-400">No products found...</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}