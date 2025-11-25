import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import axios from "axios";
import toast from "react-hot-toast";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      if (!user?.id) return;
      const res = await axios.get(`http://localhost:4444/users/${user.id}`);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Cancel order
  const handleCancelOrder = async (orderId) => {
    try {
      const updatedOrders = orders.map((o) =>
        o.date === orderId ? { ...o, status: "Cancelled" } : o
      );

      await axios.patch(`http://localhost:4444/users/${user.id}`, {
        orders: updatedOrders,
      });

      setOrders(updatedOrders);
      toast.success("Order cancelled successfully!", {
        position: "bottom-left",
        style: {
          background: "#1f1b2e",
          color: "#00FFFF",
          fontWeight: "bold",
          borderRadius: "10px",
          padding: "12px 20px",
        },
      });
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error("Failed to cancel order");
    }
  };

  // Step progress
  const getStepStatus = (currentStatus) => {
    const steps = ["Ordered", "Packed", "Shipped", "Delivered"];
    const currentIndex = steps.findIndex(
      (s) => s.toLowerCase() === currentStatus?.toLowerCase()
    );
    return steps.map((label, index) => ({
      label,
      completed: index <= currentIndex,
    }));
  };

  if (!isLoggedIn)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h2 className="text-3xl text-[#00FFFF] mb-4">Access Denied</h2>
        <p>Please login to view your orders.</p>
        <a
          href="/login"
          className="mt-6 bg-[#00FFFF] px-6 py-2 rounded font-semibold text-black"
        >
          Login
        </a>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Navbar />
      <div className="pt-24 px-6 pb-12 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#00FFFF] mb-10">
          My Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-400">No orders found.</p>
        ) : (
          orders.map((order, idx) => (
            <div
              key={idx}
              className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg mb-8 p-6 hover:shadow-cyan-500/20 transition"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-semibold text-[#00FFFF]">
                  Order #{idx + 1}
                </h3>
                <p className="text-gray-400">
                  {new Date(order.date).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b border-gray-700 pb-3"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">
                        {item.product.name}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-[#00FFFF] font-bold">
                        ₹{item.product.price} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-white font-semibold">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

            
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-3">Order Tracking</p>
                <div className="relative flex justify-between items-center w-full px-2 sm:px-6">
                  {getStepStatus(order.status).map((step, i, arr) => {
                    const nextCompleted =
                      arr[i + 1] && arr[i + 1].completed;
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center relative w-full"
                      >
                        
                        {i !== 0 && (
                          <div
                            className={`absolute top-[12px] left-[-50%] h-[3px] w-full transition-all duration-500 ${
                              step.completed ? "bg-green-500" : "bg-gray-600"
                            }`}
                          ></div>
                        )}

                        <div
                          className={`w-6 h-6 rounded-full z-10 flex items-center justify-center text-xs font-bold text-white ${
                            step.label === "Ordered" && step.completed
                              ? "bg-green-500"
                              : step.label === "Packed" && step.completed
                              ? "bg-blue-500"
                              : step.label === "Shipped" && step.completed
                              ? "bg-yellow-500"
                              : step.label === "Delivered" && step.completed
                              ? "bg-green-700"
                              : "bg-gray-500"
                          }`}
                        >
                          {step.completed ? "✓" : ""}
                        </div>

                   
                        <span
                          className={`mt-2 text-xs font-medium ${
                            step.completed ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center mt-8">
                <p className="text-lg font-semibold">
                  Total:{" "}
                  <span className="text-[#00FFFF]">
                    ₹{order.total.toFixed(2)}
                  </span>
                </p>

                {order.status !== "Delivered" &&
                  order.status !== "Cancelled" && (
                    <button
                      onClick={() => handleCancelOrder(order.date)}
                      className="bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-lg font-semibold"
                    >
                      Cancel Order
                    </button>
                  )}
              </div>

              {order.status === "Cancelled" && (
                <p className="mt-3 text-red-500 font-semibold text-right">
                  Order Cancelled
                </p>
              )}
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}
