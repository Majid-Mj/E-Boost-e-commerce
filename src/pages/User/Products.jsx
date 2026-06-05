import React, { useEffect, useState } from "react";
import { Heart, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { useCart } from "../../contexts/Cartcontext";
import api from "../../config/api";
import { getCloudinaryUrl } from "../../utils/cloudinary";

const PAGE_SIZE = 12;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const { addToCart, wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

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
        image: getCloudinaryUrl(product.images?.[0]?.imageUrl || product.image),
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

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, priceFilter]);

  // 📄 Pagination
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page number buttons (show max 5 around current)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };
  const categories = Array.from(
    new Set(products.map((p) => p.categoryName).filter(Boolean))
  ).sort();

  const formatCategoryLabel = (cat) => {
    if (!cat) return cat;
    const label = cat.replace(/[_-]/g, " ");
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Navbar />
      <div className="pt-28 py-10">

        {/* 🔍 Search & Filters */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Search Box */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search for products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl pl-12 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff512f]/40 border border-slate-200 dark:border-slate-800 transition-all font-medium text-sm"
              />
            </div>

            {/* Filter Group */}
            <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full lg:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff512f]/40 w-full md:w-[200px] border border-slate-200 dark:border-slate-800 cursor-pointer font-semibold text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {formatCategoryLabel(cat)}
                  </option>
                ))}
              </select>

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff512f]/40 w-full md:w-[200px] border border-slate-200 dark:border-slate-800 cursor-pointer font-semibold text-sm"
              >
                <option value="">Price Range</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-2000">₹1000 - ₹2000</option>
                <option value="2000-5000">₹2000 - ₹5000</option>
                <option value="5000-10000">₹5000 - ₹10000</option>
              </select>

              <button
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("");
                  setPriceFilter("");
                }}
                className="px-6 py-2.5 bg-slate-200 dark:bg-slate-850 hover:bg-slate-300 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-750 text-slate-700 dark:text-slate-300 rounded-xl transition-all text-sm font-bold uppercase tracking-wider active:scale-95 whitespace-nowrap w-full md:w-auto"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* 🛒 Products Grid */}
        <div className="flex flex-wrap justify-center gap-6">
          {loading ? (
            <p className="text-slate-400">Loading products...</p>
          ) : paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => {
              const originalPrice = product.originalPrice || product.price;
              return (
                <Link
                  to={`/product-details/${product.id}`}
                  key={product.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#ff512f]/30 dark:hover:border-[#ff512f]/30 p-3 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 w-[240px] relative overflow-hidden block text-left"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition z-20"
                  >
                    <Heart
                      size={16}
                      className={`${isInWishlist(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-slate-400"
                        }`}
                    />
                  </button>

                  <div className="w-full h-[180px] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={getCloudinaryUrl(product.images?.[0]?.imageUrl || product.image)}
                      alt={product.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  <h3 className="text-sm font-bold mb-1 text-slate-800 dark:text-slate-200 line-clamp-2 min-h-[40px]">
                    {product.name}
                  </h3>

                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-2 font-black uppercase tracking-wider">
                    {product.categoryName || "Uncategorized"}
                  </p>

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
                        if (product.stock > 0) {
                          addToCart(product);
                        }
                      }}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${product.stock === 0
                        ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white hover:shadow-md"
                        }`}
                    >
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>

                    <button
                      disabled={product.stock === 0}
                      onClick={(e) => {
                        e.preventDefault();
                        if (product.stock > 0) {
                          navigate("/cart/address", { state: { buyNowProduct: product, buyNowQuantity: 1 } });
                        }
                      }}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${product.stock === 0
                        ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                        : "bg-slate-800 dark:bg-slate-750 text-white hover:bg-slate-700 dark:hover:bg-slate-650"
                        }`}
                    >
                      Buy Now
                    </button>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-center text-slate-450 dark:text-slate-400 font-semibold">No products found...</p>
          )}
        </div>

        {/* 📄 Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
            {/* Previous */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-800 transition text-xs font-bold uppercase tracking-wider"
            >
              <ChevronLeft size={14} /> Prev
            </button>

            {/* First page + ellipsis */}
            {getPageNumbers()[0] > 1 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-850 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 transition text-xs font-bold"
                >
                  1
                </button>
                {getPageNumbers()[0] > 2 && (
                  <span className="text-slate-400 dark:text-slate-500 px-1 font-bold">…</span>
                )}
              </>
            )}

            {/* Page numbers */}
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition border ${page === currentPage
                  ? "bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white border-transparent"
                  : "bg-white dark:bg-slate-900 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850 border-slate-200 dark:border-slate-800"
                  }`}
              >
                {page}
              </button>
            ))}

            {/* Last page + ellipsis */}
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
              <>
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                  <span className="text-slate-400 dark:text-slate-500 px-1 font-bold">…</span>
                )}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-850 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 transition text-xs font-bold"
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-800 transition text-xs font-bold uppercase tracking-wider"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}