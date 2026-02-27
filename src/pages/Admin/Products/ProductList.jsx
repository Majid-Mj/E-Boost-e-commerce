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
import api from "../../../config/api";
import toast from "react-hot-toast";

export default function ProductList() {
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

  // 🔹 Fetch Products
      const fetchProducts = async () => {
        try {
          const res = await api.get("/products/Admin");
          const productList = res.data.data || [];

          // 🔥 Sort by ID descending (newest first)
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to add product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 bg-[#f7f6fb] min-h-screen">

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
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Add New Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">

              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border px-3 py-2 rounded-md"
              />

              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="border px-3 py-2 rounded-md"
              >
                <option value="">Category</option>
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
                className="border px-3 py-2 rounded-md"
              />

              <input
                type="number"
                name="stock"
                placeholder="Stock Quantity"
                value={formData.stock}
                onChange={handleChange}
                required
                className="border px-3 py-2 rounded-md"
              />

            </div>

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded-md w-full"
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

            {/* 🔥 FILE INPUT */}
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

            {/* 🔥 IMAGE PREVIEW */}
            {imageFiles.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {imageFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setImageFiles(imageFiles.filter((_, i) => i !== index))
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#413b55] text-white px-6 py-2 rounded-md"
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
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md"
                    >
                      Delete
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