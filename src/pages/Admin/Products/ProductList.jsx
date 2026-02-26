import { useEffect, useState } from "react";
import api from "../../../config/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // 🔥 Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const productList = res.data.data || [];

        setProducts(productList);
        setFilteredProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  // 🔎 Search
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();

    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerSearch) ||
        String(p.id).includes(lowerSearch)
    );

    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // 🗑 Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="admin-font bg-[#f7f6fb] min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#333041]">
          Product List
        </h1>

        <button
          onClick={() => navigate("/admin/products/add")}
          className="px-4 py-2 bg-[#413b55] text-white rounded-md hover:bg-[#52486e]"
        >
          + Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 p-2 border rounded-md"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md border">
        <table className="w-full text-sm">
          <thead className="bg-[#333041]/10 uppercase font-semibold">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#f3f2f8]">
                  <td className="p-4">{product.id}</td>

                  {/* ✅ IMAGE FIXED HERE */}
                  <td className="p-4">
                    <img
                      src={product.images?.[0]?.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                  </td>

                  <td className="p-4 font-medium">{product.name}</td>

                  <td className="p-4">{product.categoryName}</td>

                  <td className="p-4 font-semibold text-green-700">
                    ₹{product.price}
                  </td>

                  <td
                    className={`p-4 font-semibold ${
                      product.stock <= 5
                        ? "text-red-600"
                        : "text-gray-800"
                    }`}
                  >
                    {product.stock}
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/products/edit/${product.id}`)
                      }
                      className="px-3 py-1 bg-[#413b55] text-white rounded-md text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-500">
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