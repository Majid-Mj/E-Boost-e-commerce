// import { useEffect, useState } from "react";
// import api from "../../../config/api";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// export default function ProductList() {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   // 🔥 Fetch products
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await api.get("/products");
//         const productList = res.data.data || [];

//         setProducts(productList);
//         setFilteredProducts(productList);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         toast.error("Failed to load products");
//       }
//     };

//     fetchProducts();
//   }, []);

//   // 🔎 Search
//   useEffect(() => {
//     const lowerSearch = searchTerm.toLowerCase();

//     const filtered = products.filter(
//       (p) =>
//         p.name.toLowerCase().includes(lowerSearch) ||
//         String(p.id).includes(lowerSearch)
//     );

//     setFilteredProducts(filtered);
//   }, [searchTerm, products]);

//   // 🗑 Delete
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this product?")) return;

//     try {
//       await api.delete(`/products/${id}`);
//       setProducts((prev) => prev.filter((p) => p.id !== id));
//       toast.success("Product deleted");
//     } catch (error) {
//       console.error(error);
//       toast.error("Delete failed");
//     }
//   };

//   return (
//     <div className="admin-font bg-[#f7f6fb] min-h-screen p-6">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-[#333041]">
//           Product List
//         </h1>

//         <button
//           onClick={() => navigate("/admin/products/add")}
//           className="px-4 py-2 bg-[#413b55] text-white rounded-md hover:bg-[#52486e]"
//         >
//           + Add Product
//         </button>
//       </div>

//       {/* Search */}
//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-1/2 p-2 border rounded-md"
//         />
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-white rounded-2xl shadow-md border">
//         <table className="w-full text-sm">
//           <thead className="bg-[#333041]/10 uppercase font-semibold">
//             <tr>
//               <th className="p-4 text-left">ID</th>
//               <th className="p-4 text-left">Image</th>
//               <th className="p-4 text-left">Name</th>
//               <th className="p-4 text-left">Category</th>
//               <th className="p-4 text-left">Price</th>
//               <th className="p-4 text-left">Stock</th>
//               <th className="p-4 text-right">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredProducts.length > 0 ? (
//               filteredProducts.map((product) => (
//                 <tr key={product.id} className="hover:bg-[#f3f2f8]">
//                   <td className="p-4">{product.id}</td>

//                   {/* ✅ IMAGE FIXED HERE */}
//                   <td className="p-4">
//                     <img
//                       src={product.images?.[0]?.imageUrl}
//                       alt={product.name}
//                       className="w-16 h-16 object-cover rounded-md border"
//                     />
//                   </td>

//                   <td className="p-4 font-medium">{product.name}</td>

//                   <td className="p-4">{product.categoryName}</td>

//                   <td className="p-4 font-semibold text-green-700">
//                     ₹{product.price}
//                   </td>

//                   <td
//                     className={`p-4 font-semibold ${
//                       product.stock <= 5
//                         ? "text-red-600"
//                         : "text-gray-800"
//                     }`}
//                   >
//                     {product.stock}
//                   </td>

//                   <td className="p-4 text-right space-x-2">
//                     <button
//                       onClick={() =>
//                         navigate(`/admin/products/edit/${product.id}`)
//                       }
//                       className="px-3 py-1 bg-[#413b55] text-white rounded-md text-sm"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => handleDelete(product.id)}
//                       className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="text-center p-6 text-gray-500">
//                   No products found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";
import toast from "react-hot-toast";

export default function ProductList() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    stock: "",
    description: "",
    isFeatured: false,
  });

  const [imageFiles, setImageFiles] = useState([]);

  // 🔹 Fetch Products (Newest First)
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/Admin");
      const productList = res.data.data || [];

      const sorted = productList.sort((a, b) => b.id - a.id);
      setProducts(sorted);
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
      toast.error(
        error?.response?.data?.message || "Failed to add product"
      );
    } finally {
      setSubmitting(false);
    }
  };

 // 🔥 Toggle Active / Inactive (Correct Version)
    const handleToggleStatus = async (productId) => {
  try {
    await api.patch(`/products/${productId}/toggle`);

    // Instantly update UI without refetch
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, isActive: !p.isActive }
          : p
      )
    );

    toast.success("Product status updated");
  } catch (error) {
    toast.error("Failed to update status");
  }
};

  return (
    <div className="p-6 bg-[#f7f6fb] min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#333041]">
          Product List
        </h1>

        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-[#413b55] text-white px-4 py-2 rounded-md"
          >
            + Add Product
          </button>
        ) : (
          <button
            onClick={() => setShowAddForm(false)}
            className="bg-[#5a5270] text-white px-4 py-2 rounded-md"
          >
            × Cancel
          </button>
        )}
      </div>

      {/* 🔥 ADD PRODUCT FORM */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-xl font-semibold text-[#333041] mb-4">
            Add New Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />

              {/* Category */}
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Price */}
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />

              {/* Stock */}
              <input
                type="number"
                name="stock"
                placeholder="Stock Quantity"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Description */}
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />

            {/* Is Featured */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              Featured Product
            </label>

            {/* Image Files */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              <input
                type="file"
                name="imageFiles"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#413b55] file:text-white
                  hover:file:bg-[#52486e]"
              />
              {imageFiles.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  {imageFiles.length} file(s) selected
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#413b55] text-white py-2 rounded-md hover:bg-[#52486e] transition"
            >
              {submitting ? "Adding..." : "Add Product"}
            </button>
          </form>
        </div>
      )}

      {/* 🔥 PRODUCT TABLE */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        {loading ? (
          <p className="p-6">Loading...</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Active</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-t">
                  <td className="p-4">{product.id}</td>

                  <td className="p-4">
                    <img
                      src={
                        product.images?.length > 0
                          ? product.images[0].imageUrl
                          : "https://via.placeholder.com/80"
                      }
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded border"
                    />
                  </td>

                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4">{product.categoryName}</td>
                  <td className="p-4 text-green-600 font-semibold">
                    ₹{product.price}
                  </td>
                  <td className="p-4">{product.stock}</td>

                  {/* 🔥 Sliding Toggle */}
                  <td className="p-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={product.isActive}
                      onChange={() => handleToggleStatus(product.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer 
                      peer-checked:bg-green-500 
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                      after:bg-white after:border after:rounded-full after:h-5 after:w-5
                      after:transition-all
                      peer-checked:after:translate-x-full">
                    </div>
                  </label>
                </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        navigate(`/admin/products/edit/${product.id}`)
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}