import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";
import toast from "react-hot-toast";
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
  Eye,
  Filter,
  Image as ImageIcon,
  ChevronDown
} from "lucide-react";

export default function ProductList() {
  const navigate = useNavigate();

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
    description: "",
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
      formDataToSend.append("description", formData.description);
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
        description: "",
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-700 font-black animate-pulse">Loading Products...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-[#f8fafc] min-h-screen font-sans text-slate-900">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Catalog</h1>
          <p className="text-slate-600 font-medium mt-1">Manage your store products, pricing and inventory levels.</p>
        </div>
        <div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black transition-all shadow-md ${showAddForm
              ? "bg-slate-200 text-slate-800 hover:bg-slate-300"
              : "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200"
              }`}
          >
            {showAddForm ? <X size={20} /> : <Plus size={20} />}
            {showAddForm ? "Cancel" : "Add New Product"}
          </button>
        </div>
      </div>

      {/* Add Product Form (Collapsible) */}
      {showAddForm && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Plus className="text-purple-600" />
            Create New Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Wireless Headphones"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-slate-50 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-slate-50 font-medium"
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
                <label className="text-sm font-semibold text-slate-700 ml-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-slate-50 font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-slate-50 font-semibold"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-1 flex items-end">
                <label className="flex items-center gap-3 bg-slate-50 border border-slate-300 px-4 py-3.5 rounded-xl w-full cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">Mark as Featured</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Description</label>
              <textarea
                name="description"
                placeholder="Enter detailed product description..."
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-slate-50 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Product Images</label>
              <div className="relative group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-slate-300 group-hover:border-purple-500 rounded-2xl p-10 flex flex-col items-center justify-center transition-all bg-slate-50">
                  <ImageIcon size={40} className="text-slate-400 group-hover:text-purple-500 mb-2" />
                  <p className="font-bold text-slate-600">
                    {imageFiles.length > 0 ? `${imageFiles.length} images selected` : "Click to upload product images"}
                  </p>
                  <p className="text-xs text-slate-400 font-semibold mt-1">PNG, JPG or WebP (Max 5 images)</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by ID, product name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl leading-5 bg-white text-slate-900 font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-slate-700 font-bold whitespace-nowrap">
            <Filter size={18} />
            <span>Category:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm min-w-[180px]"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-10">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-6 py-5 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">ID</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200 text-center">Preview</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">Product Details</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">Category</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">Price & Stock</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200 text-center">Live Status</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-all duration-200 group">
                    <td className="px-6 py-6 whitespace-nowrap border-b border-slate-100">
                      <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-xs font-black border border-slate-200">
                        #{product.id}
                      </span>
                    </td>
                    <td className="px-6 py-6 border-b border-slate-100">
                      <div className="flex justify-center">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm group-hover:scale-110 transition-transform bg-white">
                          <img
                            src={product.images?.length > 0 ? product.images[0].imageUrl : "https://via.placeholder.com/80"}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 border-b border-slate-100">
                      <div className="text-[15px] font-semibold text-slate-900 leading-tight">{product.name}</div>
                      <div className="text-[12px] text-slate-500 font-normal mt-1 line-clamp-1 max-w-[200px]">
                        {product.description || "No description provided"}
                      </div>
                    </td>
                    <td className="px-6 py-6 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-[13px]">
                        <Layers size={14} className="text-purple-500" />
                        {product.categoryName}
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap border-b border-slate-100">
                      <div className="text-[15px] font-bold text-emerald-700 flex items-center gap-0.5">
                        <IndianRupee size={14} />
                        {product.price?.toLocaleString()}
                      </div>
                      <div className={`text-[12px] font-semibold mt-1 ${product.stock < 10 ? "text-rose-600" : "text-slate-600"}`}>
                        Stock: {product.stock} units
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap border-b border-slate-100">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleToggleStatus(product.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all border ${product.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                            }`}
                        >
                          {product.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                          {product.isActive ? "Active" : "Inactive"}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-right border-b border-slate-100">
                      <button
                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        className="p-2.5 bg-slate-100 text-slate-800 rounded-xl hover:bg-purple-100 hover:text-purple-700 transition-all border border-slate-200 group-hover:border-purple-200"
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
                      <Package size={64} className="mb-4 text-slate-300" />
                      <h3 className="text-xl font-black text-slate-900">No Products Found</h3>
                      <p className="text-slate-700 font-bold">Try adjusting your filters or search term.</p>
                      <button
                        onClick={() => { setSearchTerm(""); setCategoryFilter("All"); }}
                        className="mt-4 text-purple-600 font-black hover:underline"
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
        <div className="bg-white px-6 py-5 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm font-black text-slate-700">
            Total Inventory: <span className="text-purple-600">{filteredProducts.length} Products</span>
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-slate-100 text-slate-400 font-black text-xs rounded-xl cursor-not-allowed">Previous</button>
            <button className="px-4 py-2 bg-purple-600 text-white font-black text-xs rounded-xl hover:bg-purple-700 shadow-md">Next Page</button>
          </div>
        </div>
      </div>
    </div>
  );
}