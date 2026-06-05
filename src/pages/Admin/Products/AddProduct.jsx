import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Image as ImageIcon } from "lucide-react";

export default function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    stock: "",
    isFeatured: false,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 🔹 Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/AllCategories");
        const categoryList = res.data.data || [];
        setCategories(categoryList.filter((c) => c.isActive));
      } catch {
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setImageFiles(e.target.files);
  };

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

      // Append multiple images
      for (let i = 0; i < imageFiles.length; i++) {
        formDataToSend.append("imageFiles", imageFiles[i]);
      }

      await api.post("/products", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully!");
      navigate("/admin/products");

    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to add product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col p-4 sm:p-8">
      {/* Back to list */}
      <div className="mb-6 max-w-lg mx-auto w-full">
        <button
          onClick={() => navigate("/admin/products")}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#ff512f] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Catalog
        </button>
      </div>

      <div className="flex-1 flex justify-center items-start">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200/60 dark:border-slate-800/60 w-full max-w-lg transition-colors"
        >
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Plus className="text-[#ff512f]" />
            Add New Product
          </h2>

          <div className="space-y-4">
            {/* Product Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-250 dark:border-slate-855 rounded-xl focus:ring-2 focus:ring-[#ff512f] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-250 dark:border-slate-855 rounded-xl focus:ring-2 focus:ring-[#ff512f] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-semibold focus:outline-none"
                />
              </div>

              {/* Stock */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock Quantity"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-250 dark:border-slate-855 rounded-xl focus:ring-2 focus:ring-[#ff512f] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Category</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                disabled={loadingCategories}
                className="w-full px-4 py-3 border border-slate-250 dark:border-slate-855 rounded-xl focus:ring-2 focus:ring-[#ff512f] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-none"
              >
                <option value="">
                  {loadingCategories ? "Loading Categories..." : "Select Category"}
                </option>

                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Is Featured */}
            <label className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 px-4 py-3.5 rounded-xl w-full cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-slate-350 dark:border-slate-800 text-[#ff512f] focus:ring-[#ff512f]"
              />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">Mark as Featured</span>
            </label>

            {/* Product Images Upload */}
            <div className="space-y-1 pt-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">
                Upload Product Images
              </label>

              <div className="relative group">
                <input
                  type="file"
                  name="imageFiles"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-slate-250 dark:border-slate-800 group-hover:border-[#ff512f] dark:group-hover:border-[#ff512f] rounded-2xl p-6 flex flex-col items-center justify-center transition-all bg-slate-50 dark:bg-slate-950">
                  <ImageIcon size={32} className="text-slate-400 group-hover:text-[#ff512f] mb-1" />
                  <p className="font-bold text-sm text-slate-650 dark:text-slate-450">
                    {imageFiles.length > 0 ? `${imageFiles.length} images selected` : "Click to choose images"}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">PNG, JPG or WebP (Max 5 images)</p>
                </div>
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white font-bold py-4 rounded-2xl hover:opacity-95 transition-all shadow-lg shadow-orange-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding Product...
              </>
            ) : (
              "Add Product to Inventory"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}