import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { useCart } from "../../contexts/Cartcontext";
import api from "../../config/api";
import { ProductCard } from "../../Components/ProductCard";
import { ProductFilters } from "../../Components/ProductFilters";
import { Pagination } from "../../Components/Pagination";
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

  const toggleWishlist = useCallback((product) => {
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
  }, [wishlist, isInWishlist, addToWishlist, removeFromWishlist]);

  // 🔎 Memoized Filtering
  const filteredProducts = useMemo(() => {
    return products
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
  }, [products, search, categoryFilter, priceFilter]);

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, priceFilter]);

  // 📄 Pagination details memoized
  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / PAGE_SIZE);
  }, [filteredProducts.length]);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    );
  }, [filteredProducts, currentPage]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((p) => p.categoryName).filter(Boolean))
    ).sort();
  }, [products]);

  const handleAddToCart = useCallback((product) => {
    addToCart(product);
  }, [addToCart]);

  const handleBuyNow = useCallback((product) => {
    navigate("/cart/address", { state: { buyNowProduct: product, buyNowQuantity: 1 } });
  }, [navigate]);

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setCategoryFilter("");
    setPriceFilter("");
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Navbar />
      <div className="pt-28 py-10">

        {/* 🔍 Search & Filters Component */}
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          priceFilter={priceFilter}
          onPriceChange={setPriceFilter}
          categories={categories}
          onClear={handleClearFilters}
        />

        {/* 🛒 Products Grid */}
        <div className="flex flex-wrap justify-center gap-6">
          {loading ? (
            <p className="text-slate-400">Loading products...</p>
          ) : paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInWishlist={isInWishlist(product.id)}
                onToggleWishlist={toggleWishlist}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            ))
          ) : (
            <p className="text-center text-slate-450 dark:text-slate-400 font-semibold">No products found...</p>
          )}
        </div>

        {/* 📄 Pagination Controls Component */}
        {!loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

      </div>
      <Footer />
    </div>
  );
}