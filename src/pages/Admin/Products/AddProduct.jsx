import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import toast from "react-hot-toast";

export default function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    image: "",
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/AllCategories");

        const categoryList = res.data.data || [];

        // Only active categories
        setCategories(categoryList.filter(c => c.isActive));
      } catch (error) {
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/products", {
        name: formData.name,
        categoryId: parseInt(formData.categoryId),
        price: parseFloat(formData.price),
        image: formData.image
      });

      toast.success("Product added successfully!");
      navigate("/admin/products");

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6fb] flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-[#333041] mb-4">
          Add New Product
        </h2>

        <div className="space-y-3">

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />

          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            disabled={loadingCategories}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">
              {loadingCategories ? "Loading..." : "Select Category"}
            </option>

            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

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
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />

        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full bg-[#413b55] text-white py-2 rounded-md hover:bg-[#52486e]"
        >
          {submitting ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}