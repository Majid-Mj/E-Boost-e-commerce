import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import api from "../../config/api";
import toast from "react-hot-toast";
import { Search, Filter } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await api.get("/Order/my-orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Cancel order using backend endpoint
  const handleCancelOrder = async (orderId) => {
    try {
      await api.patch(`/Order/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "Cancelled" } : o
        )
      );
      toast.success("Order cancelled successfully!");
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error("Failed to cancel order");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111] text-white">
        <div className="w-8 h-8 rounded-full border-4 border-[#2874f0] border-t-transparent animate-spin"></div>
      </div>
    );

  // Flatten items for the Flipkart-style ungrouped list
  const allItems = [];
  orders.forEach(order => {
    order.orderItems?.forEach(item => {
      allItems.push({
        ...item,
        orderId: order.id,
        orderDate: order.createdAt,
        orderStatus: order.status
      });
    });
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#111111] text-white font-sans">
      <Navbar />

      <main className="flex-grow pt-24 px-4 pb-16 max-w-6xl mx-auto w-full">
        <div className="flex gap-4">



          {/* FLIPKART STYLE ORDER LIST */}
          <div className="flex-1">



            {/* Items List */}
            {allItems.length === 0 ? (
              <div className="bg-[#1c1c1c] border border-gray-800 rounded-sm p-10 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 mb-4 bg-[#111111] rounded-full flex items-center justify-center">
                  <Search size={40} className="text-gray-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Orders found</h3>
                <p className="text-gray-400">Looks like you haven't placed any order yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allItems.map((item, idx) => {
                  const isDelivered = item.status === 'Delivered';
                  const isCancelled = item.orderStatus === 'Cancelled' || item.status === 'Cancelled';

                  return (
                    <div
                      key={`${item.orderId}-${item.productId}-${idx}`}
                      className="bg-[#1c1c1c] border border-gray-800 rounded-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all group"
                    >
                      {/* Optional Header bridging multiple items if we wanted to show Order ID, 
                          but Flipkart mainly just flattens them cleanly. */}
                      <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center relative cursor-pointer">

                        {/* 1. Image */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-transparent flex items-center justify-center p-1">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>

                        {/* 2. Text Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm sm:text-base font-medium text-white line-clamp-2 group-hover:text-[#2874f0] transition-colors">
                            {item.productName}
                          </h4>
                          <p className="text-xs text-gray-400 mt-2">Qty: {item.quantity}</p>

                          {/* Cancel Logic Button inline */}
                          {!isDelivered && !isCancelled && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCancelOrder(item.orderId); }}
                              className="mt-3 text-sm font-semibold text-red-500 hover:text-red-400 transition-colors"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>

                        {/* 3. Price */}
                        <div className="sm:w-24 shrink-0 sm:text-center mt-2 sm:mt-0">
                          <p className="text-sm sm:text-base font-bold text-white">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* 4. Delivery Status */}
                        <div className="sm:w-64 shrink-0 mt-3 sm:mt-0">
                          <div className="flex items-start gap-3">
                            <div className="mt-1.5 shrink-0">
                              {isCancelled ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                              ) : isDelivered ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                              ) : (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#2874f0]"></div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {isCancelled
                                  ? "Cancelled"
                                  : isDelivered
                                    ? "Delivered on " + new Date(item.orderDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
                                    : (item.status || "Pending")
                                }
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {isCancelled
                                  ? "As per your request, your order has been cancelled."
                                  : isDelivered
                                    ? "Your item has been delivered"
                                    : "Your item is currently being processed by the seller"
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}