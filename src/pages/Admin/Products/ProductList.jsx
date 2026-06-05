import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";
import toast from "react-hot-toast";
import { useTheme } from "../../../contexts/ThemeContext";
import {
  Search,
  Plus,
  X,
  Edit3,
  Package,
  IndianRupee,
  Layers,
  CheckCircle,
  XCircle,
  Filter,
  Image as ImageIcon
} from "lucide-react";

export default function ProductList() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    stock: "",
    isFeatured: false,
  });

  const [imageFiles, setImageFiles] = useState([]);

  // 🔹 Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/Admin");
      const productList = res.data.data || [];
      const sorted = productList.sort((a, b) => b.id - a.id);
      setProducts(sorted);
      setFilteredProducts(sorted);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories/AllCategories");
      const categoryList = res.data.data || [];
      setCategories(categoryList.filter((c) => c.isActive));
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // 🔹 Search & Filter
  useEffect(() => {
    let result = products;

    if (categoryFilter !== "All") {
      result = result.filter(p => p.categoryName === categoryFilter);
    }

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(lower) ||
        p.id.toString().includes(lower) ||
        p.categoryName?.toLowerCase().includes(lower)
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, categoryFilter, products]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  // 🔹 Add Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("isFeatured", formData.isFeatured);

      imageFiles.forEach((file) => {
        formDataToSend.append("imageFiles", file);
      });

      await api.post("/products", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added successfully!");
      setShowAddForm(false);
      setImageFiles([]);
      setFormData({
        name: "",
        categoryId: "",
        price: "",
        stock: "",
        isFeatured: false,
      });
      fetchProducts();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔹 Toggle Active status
  const handleToggleStatus = async (productId) => {
    try {
      await api.patch(`/products/${productId}/toggle`);
      setProducts(prev =>
        prev.map(p =>
          p.id === productId ? { ...p, isActive: !p.isActive } : p
        )
      );
      toast.success("Product status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
        <div className="w-16 h-16 border-4 border-[#ff512f] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-700 dark:text-slate-300 font-black animate-pulse">Loading Products...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Product Catalog</h1>
          <p className="text-slate-500 dark:text-slate-400 font-semibold mt-1">Manage your store products, pricing and inventory levels.</p>
        </div>
        <div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black transition-all shadow-md ${showAddForm
              ? "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700"
              : "bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white hover:opacity-95 shadow-orange-500/10"
              }`}
          >
            {showAddForm ? <X size={20} /> : <Plus size={20} />}
            {showAddForm ? "Cancel" : "Add New Product"}
          </button>
        </div>
      </div>

      {/* Add Product Form (Collapsible) */}
      {showAddForm && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200/60 dark:border-slate-800/65 mb-8 animate-in fade-in slide-in-from-top-4 duration-300 transition-colors">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Plus className="text-[#ff512f]" />
            Create New Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Wireless Headphones"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#ff512f] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#ff512f] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#ff512f] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#ff512f] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-semibold focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-1 flex items-end">
                <label className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-3.5 rounded-xl w-full cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-slate-300 dark:border-slate-800 text-[#ff512f] focus:ring-[#ff512f]"
                  />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">Mark as Featured</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Product Images</label>
              <div className="relative group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-slate-250 dark:border-slate-800 group-hover:border-[#ff512f] dark:group-hover:border-[#ff512f] rounded-2xl p-10 flex flex-col items-center justify-center transition-all bg-slate-50 dark:bg-slate-950">
                  <ImageIcon size={40} className="text-slate-400 group-hover:text-[#ff512f] mb-2" />
                  <p className="font-bold text-slate-600 dark:text-slate-400">
                    {imageFiles.length > 0 ? `${imageFiles.length} images selected` : "Click to upload product images"}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">PNG, JPG or WebP (Max 5 images)</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white font-bold py-4 rounded-2xl hover:opacity-95 transition-all shadow-lg shadow-orange-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Product...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Add Product to Inventory
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 mb-6 flex flex-col lg:flex-row items-center gap-4 transition-colors">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by ID, product name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-slate-250 dark:border-slate-800 rounded-xl leading-5 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ff512f] transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold whitespace-nowrap">
            <Filter size={18} />
            <span>Category:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff512f] shadow-sm min-w-[180px]"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden mb-10 transition-colors">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950">
                <th className="px-6 py-5 text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">ID</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 text-center">Preview</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">Product Details</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">Category</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">Price & Stock</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 text-center">Live Status</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all duration-200 group">
                    <td className="px-6 py-6 whitespace-nowrap border-b border-slate-100 dark:border-slate-800/40">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-1 rounded-md text-xs font-black border border-slate-200 dark:border-slate-700">
                        #{product.id}
                      </span>
                    </td>
                    <td className="px-6 py-6 border-b border-slate-100 dark:border-slate-800/40">
                      <div className="flex justify-center">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform bg-white dark:bg-slate-950">
                          <img
                            src={product.images?.length > 0 ? product.images[0].imageUrl : "https://via.placeholder.com/80"}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 border-b border-slate-100 dark:border-slate-800/40">
                      <div className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight">{product.name}</div>
                      <div className="text-[12px] text-slate-550 dark:text-slate-400 font-normal mt-1 line-clamp-1 max-w-[200px]">
                        {product.description || "No description provided"}
                      </div>
                    </td>
                    <td className="px-6 py-6 border-b border-slate-100 dark:border-slate-800/40">
                      <div className="flex items-center gap-1.5 text-slate-750 dark:text-slate-350 font-semibold text-[13px]">
                        <Layers size={14} className="text-[#ff512f]" />
                        {product.categoryName}
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap border-b border-slate-100 dark:border-slate-800/40">
                      <div className="text-[15px] font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-0.5">
                        <IndianRupee size={14} />
                        {product.price?.toLocaleString()}
                      </div>
                      <div className={`text-[12px] font-bold mt-1 ${product.stock < 10 ? "text-rose-600" : "text-slate-600 dark:text-slate-400"}`}>
                        Stock: {product.stock} units
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap border-b border-slate-100 dark:border-slate-800/40">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleToggleStatus(product.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all border ${product.isActive
                            ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/35"
                            : "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/35"
                            }`}
                        >
                          {product.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                          {product.isActive ? "Active" : "Inactive"}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-right border-b border-slate-100 dark:border-slate-800/40">
                      <button
                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl hover:bg-gradient-to-r hover:from-[#ff512f] hover:to-[#dd2476] hover:text-white transition-all border border-slate-200 dark:border-slate-700 group-hover:border-slate-300 dark:group-hover:border-slate-600"
                        title="Edit Product"
                      >
                        <Edit3 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <Package size={64} className="mb-4 text-slate-300 dark:text-slate-600" />
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">No Products Found</h3>
                      <p className="text-slate-700 dark:text-slate-350 font-bold">Try adjusting your filters or search term.</p>
                      <button
                        onClick={() => { setSearchTerm(""); setCategoryFilter("All"); }}
                        className="mt-4 text-[#ff512f] font-black hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination/Summary Section */}
        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
          <p className="text-sm font-black text-slate-700 dark:text-slate-400">
            Total Inventory: <span className="text-[#ff512f]">{filteredProducts.length} Products</span>
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-black text-xs rounded-xl cursor-not-allowed">Previous</button>
            <button className="px-4 py-2 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white font-black text-xs rounded-xl hover:opacity-95 shadow-md">Next Page</button>
          </div>
        </div>
      </div>
    </div>
  );
}