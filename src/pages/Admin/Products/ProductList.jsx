import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4444/products");
        setProducts(response.data);
        setFilteredProducts(response.data);

        const uniqueCats = [...new Set(response.data.map((p) => p.category))];
        setCategories(uniqueCats);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  //  Search and Filter
  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    const lowerSearch = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerSearch) ||
        String(p.id).includes(lowerSearch)
    );

    setFilteredProducts(filtered);
  }, [searchTerm, products, selectedCategory]);

  // image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct({ ...newProduct, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  //Delete product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:4444/products/${id}`);
        setProducts(products.filter((p) => p.id !== id));

        toast.success("Product deleted", {
          position: "top-center",
          style: {
            background: "#1f1b2e",
            color: "#4ade80",
            fontWeight: "bold",
            borderRadius: "10px",
            padding: "12px 20px",
          },
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product.", {
          position: "top-center",
          style: {
            background: "#1f1b2e",
            color: "#ff6666",
            fontWeight: "bold",
            borderRadius: "10px",
            padding: "12px 20px",
          },
        });
      }
    }
  };

  // ADD and Edit
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
      toast.error("Please fill all fields", {
        position: "top-center",
        style: {
          background: "#1f1b2e",
          color: "#ff6666",
          fontWeight: "bold",
          borderRadius: "10px",
          padding: "12px 20px",
        },
      });
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:4444/products/${currentId}`, {
          ...newProduct,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock),
        });

        setProducts((prev) =>
          prev.map((p) => (p.id === currentId ? { ...p, ...newProduct } : p))
        );

        toast.success("Product updated", {
          position: "top-center",
          style: {
            background: "#1f1b2e",
            color: "#4ade80",
            fontWeight: "bold",
            borderRadius: "10px",
            padding: "12px 20px",
          },
        });

        setIsEditing(false);
        setCurrentId(null);
      } else {
        const response = await axios.post("http://localhost:4444/products", {
          ...newProduct,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock),
        });
        setProducts([...products, response.data]);

        toast.success("Product added", {
          position: "top-center",
          style: {
            background: "#1f1b2e",
            color: "#4ade80",
            fontWeight: "bold",
            borderRadius: "10px",
            padding: "12px 20px",
          },
        });
      }

      setNewProduct({ name: "", category: "", price: "", stock: "", image: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product.", {
        position: "top-center",
        style: {
          background: "#1f1b2e",
          color: "#ff6666",
          fontWeight: "bold",
          borderRadius: "10px",
          padding: "12px 20px",
        },
      });
    }
  };

  // Edit product 
  const handleEdit = (product) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowForm(true);
    setIsEditing(true);
    setCurrentId(product.id);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock || "",
      image: product.image,
    });
  };

  return (
    <div className="admin-font bg-[#f7f6fb] min-h-screen p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#333041]">
          Product List
        </h1>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setIsEditing(false);
            setNewProduct({ name: "", category: "", price: "", stock: "", image: "" });
          }}
          className="w-full sm:w-auto px-4 py-2 bg-[#413b55] text-white text-sm font-medium rounded-md hover:bg-[#5a5270] transition"
        >
          {showForm ? "× Cancel" : "+ Add New Product"}
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-start gap-4">
        <input
          type="text"
          placeholder="Search by Product Name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#413b55]"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-1/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#413b55]"
        >
          <option value="All">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddProduct}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6"
        >
          <h2 className="text-lg font-semibold text-[#333041] mb-4">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <input
              type="text"
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              className="border border-gray-300 rounded-md p-2 w-full"
            />

            <input
              type="number"
              placeholder="Stock Quantity"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: e.target.value })
              }
              className="border border-gray-300 rounded-md p-2 w-full"
            />

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                onChange={handleImageUpload}
                className="hidden"
              />

              <label
                htmlFor="imageUpload"
                className="inline-block cursor-pointer px-4 py-2 bg-[#413b55] text-white text-sm rounded-md hover:bg-[#52486e] transition text-center w-fit"
              >
                📁 Upload Image
              </label>

              {newProduct.image && (
                <img
                  src={newProduct.image}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-md mt-3 border"
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 px-5 py-2 bg-[#413b55] text-white rounded-md hover:bg-[#52486e] transition"
          >
            {isEditing ? "Update Product" : "Add Product"}
          </button>
        </form>
      )}

      <div className="hidden sm:block overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-200">
        <table className="w-full border-collapse text-sm md:text-base">
          <thead className="bg-[#333041]/10 text-gray-700 uppercase font-semibold">
            <tr>
              <th className="p-4 border-b text-left">ID</th>
              <th className="p-4 border-b text-left">Image</th>
              <th className="p-4 border-b text-left">Name</th>
              <th className="p-4 border-b text-left">Category</th>
              <th className="p-4 border-b text-left">Price</th>
              <th className="p-4 border-b text-left">Stock</th>
              <th className="p-4 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr
                  key={product.id || index}
                  className="hover:bg-[#f3f2f8] transition duration-150 ease-in-out"
                >
                  <td className="p-4 border-b text-gray-700">{product.id}</td>
                  <td className="p-4 border-b">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                  </td>
                  <td className="p-4 border-b font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="p-4 border-b text-gray-700">
                    {product.category}
                  </td>
                  <td className="p-4 border-b font-semibold text-green-700">
                    ₹{product.price}
                  </td>
                  <td
                    className={`p-4 border-b font-semibold ${
                      product.stock <= 5 ? "text-red-600" : "text-gray-800"
                    }`}
                  >
                    {product.stock || 0}
                  </td>
                  <td className="p-4 border-b text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1.5 bg-[#413b55] text-white text-xs md:text-sm rounded-md hover:bg-[#52486e] transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1.5 bg-red-500 text-white text-xs md:text-sm rounded-md hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center p-6 text-gray-500 bg-gray-50"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
