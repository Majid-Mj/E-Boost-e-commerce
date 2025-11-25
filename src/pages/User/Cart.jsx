import React, { useState, useEffect } from "react";
import { useCart } from "../../contexts/Cartcontext";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { Link } from "react-router-dom";
import { getProducts } from "../../api.js";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const [products, setProducts] = useState([]);
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const cartProducts = products.filter((product) =>
    cart.some((item) => item.productId === product.id)
  );

  //Check if any item exceeds stock
  const isStockInsufficient = cart.some((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product && item.quantity > product.stock;
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white mt-10">
        <Navbar />
        <main className="flex-grow py-10 px-4 mb-25">
          <div className="max-w-4xl mx-auto text-center pt-20">
            <h2 className="text-3xl font-semibold mb-10 text-[#00FFFF]">Access Denied</h2>
            <p className="text-gray-400 mb-6">Please log in to view your cart.</p>
            <Link to="/login">
              <button className="bg-[#00FFFF] text-black px-6 py-3 rounded-lg font-semibold hover:bg-cyan-400 transition">
                Login
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white mt-10">
      <Navbar />

      <main className="flex-grow py-10 px-4 mb-25">
        {cart.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center pt-20">
            <h2 className="text-3xl font-semibold mb-10 text-[#00FFFF]">
              🛒 Your Cart is Empty
            </h2>
            <p className="text-gray-400 mb-6">Add some products to get started!</p>
            <Link to="/products">
              <button className="bg-[#00FFFF] text-black px-6 py-3 rounded-lg font-semibold hover:bg-cyan-400 transition">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-semibold mb-10 text-[#00FFFF]">
              🛒 My Cart ({getTotalItems()} items)
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartProducts.map((product) => {
                  const cartItem = cart.find((item) => item.productId === product.id);
                  const isOutOfStock = product.stock <= 0;
                  const isMaxReached = cartItem.quantity >= product.stock;

                  return (
                    <div
                      key={product.id}
                      className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center gap-4"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                        <p className="text-gray-400 text-sm mb-2">{product.description}</p>
                        <p className="text-[#00FFFF] text-lg font-bold">
                          ₹{product.price.toFixed(2)}
                        </p>

                        {/*Show available stock */}
                        <p
                          className={`text-sm mt-1 ${
                            product.stock > 0 ? "text-gray-400" : "text-red-400"
                          }`}
                        >
                          {product.stock > 0
                            ? `In Stock: ${product.stock}`
                            : "Out of Stock"}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                            className="bg-gray-600 text-white w-8 h-8 rounded-full hover:bg-gray-500 flex items-center justify-center"
                            disabled={cartItem.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="text-white w-8 text-center">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() =>
                              !isMaxReached &&
                              updateQuantity(cartItem.id, cartItem.quantity + 1)
                            }
                            disabled={isMaxReached}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isMaxReached
                                ? "bg-gray-700 cursor-not-allowed"
                                : "bg-gray-600 hover:bg-gray-500"
                            }`}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(cartItem.id)}
                          className="text-red-500 hover:text-red-400 ml-4"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

             
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-fit">
                <h3 className="text-xl font-semibold mb-4 text-[#00FFFF]">Price Details</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Price ({getTotalItems()} items)</span>
                    <span>₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="text-green-400">FREE</span>
                  </div>
                  <hr className="border-gray-600" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span>₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <Link to={isStockInsufficient ? "#" : "address"}>
                  <button
                    disabled={isStockInsufficient}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      isStockInsufficient
                        ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                        : "bg-[#00FFFF] text-black hover:bg-cyan-400"
                    }`}
                  >
                    {isStockInsufficient ? "Check Stock" : "Place Order"}
                  </button>
                </Link>

                {isStockInsufficient && (
                  <p className="text-center text-red-400 text-sm mt-2">
                    Some items exceed available stock.
                  </p>
                )}

                <p className="text-center text-gray-400 text-sm mt-2">
                  Safe and Secure Payments. Easy returns.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
