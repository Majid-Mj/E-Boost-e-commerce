import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../config/api";
import toast from "react-hot-toast";
import { ArrowLeft, Edit3, Image as ImageIcon } from "lucide-react";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    stock: "",
    isFeatured: false,
  });

  // 🔹 Fetch Product
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const product = res.data.data || res.data;

      setFormData({
        name: product.name || "",
        categoryId: product.categoryId || "",
        price: product.price || "",
        stock: product.stock || "",
        isFeatured: product.isFeatured || false,
      });

      setExistingImages(product.images || []);
    } catch (error) {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories/AllCategories");
      const categoryList = res.data.data || [];
      setCategories(categoryList.filter(c => c.isActive));
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  // 🔹 Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("isFeatured", formData.isFeatured);

      imageFiles.forEach(file => {
        formDataToSend.append("imageFiles", file);
      });

      await api.put(`/products/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated successfully!");
      navigate("/admin/products");

    } catch (error) {
      console.log(error.response);
      toast.error(
        error?.response?.data?.message || "Update failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
        <div className="w-16 h-16 border-4 border-[#ff512f] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-700 dark:text-slate-350 font-bold animate-pulse">Loading Product Details...</p>
      </div>
    );
  }

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
            <Edit3 className="text-[#ff512f]" />
            Edit Product
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
                className="w-full px-4 py-3 border border-slate-250 dark:border-slate-855 rounded-xl focus:ring-2 focus:ring-[#ff512f] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-none"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
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

            {/* 🔹 Existing Images */}
            {existingImages.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Existing Images</label>
                <div className="flex gap-3 flex-wrap">
                  {existingImages.map((img, index) => (
                    <div key={index} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white">
                      <img
                        src={img.imageUrl}
                        alt="existing"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 🔹 Upload New Images */}
            <div className="space-y-1 pt-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">
                Upload New Images
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
                    {imageFiles.length > 0 ? `${imageFiles.length} images selected` : "Click to select new images"}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">PNG, JPG or WebP (Max 5 images)</p>
                </div>
              </div>

              {/* Preview New Images */}
              {imageFiles.length > 0 && (
                <div className="flex gap-3 flex-wrap mt-3">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
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
                Updating Product...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}