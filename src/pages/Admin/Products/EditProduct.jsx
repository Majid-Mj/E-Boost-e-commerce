import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../config/api";
import toast from "react-hot-toast";

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
    description: "",
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
        description: product.description || "",
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
      formDataToSend.append("description", formData.description);
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
      <div className="min-h-screen bg-[#f7f6fb] flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6fb] flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-[#333041] mb-6">
          Edit Product
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />

          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            Featured Product
          </label>

          {/* 🔹 Existing Images */}
          {existingImages.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {existingImages.map((img, index) => (
                <img
                  key={index}
                  src={img.imageUrl}
                  alt="existing"
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          )}

          {/* 🔹 Upload New Images */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:bg-[#413b55] file:text-white"
          />

          {/* Preview New Images */}
          {imageFiles.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-3">
              {imageFiles.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          )}

        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full bg-[#413b55] text-white py-2 rounded-md hover:bg-[#52486e]"
        >
          {submitting ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}