import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import api from "../../config/api";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import { getCloudinaryUrl } from "../../utils/cloudinary";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await api.get("/Order/my-orders");
      const ordersData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setOrders(ordersData);

      // Fetch products to map images correctly
      const prodRes = await api.get("/products");
      let productsArray = [];
      if (Array.isArray(prodRes.data?.data)) {
        productsArray = prodRes.data.data;
      } else if (Array.isArray(prodRes.data)) {
        productsArray = prodRes.data;
      }
      setProducts(productsArray);

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
        <div className="w-8 h-8 rounded-full border-4 border-[#ff512f] border-t-transparent animate-spin"></div>
      </div>
    );

  // Flatten items for the Flipkart-style ungrouped list
  const allItems = [];
  if (Array.isArray(orders)) {
    orders.forEach(order => {
      const orderItemsList = order.items || order.Items || order.orderItems || [];

      if (Array.isArray(orderItemsList)) {
        orderItemsList.forEach(item => {
          const product = products.find(p => p.id === item.productId || p.id === item.ProductId);
          const dbImage = product?.images?.[0]?.imageUrl || product?.image || null;

          allItems.push({
            ...item,
            orderId: order.id || order.Id,
            orderDate: order.orderDate || order.OrderDate || order.createdAt,
            orderStatus: order.status || order.Status,
            status: item.status || item.Status || "Pending",
            price: item.unitPrice || item.price || item.UnitPrice || 0,
            productImage: getCloudinaryUrl(dbImage || item.productImage || item.img)
          });
        });
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow pt-28 px-4 pb-16 max-w-6xl mx-auto w-full">
        <div className="flex gap-4">

          {/* FLIPKART STYLE ORDER LIST */}
          <div className="flex-1">
            <h1 className="text-2xl font-black mb-8 font-title uppercase text-slate-800 dark:text-white text-left">
              My Orders ({allItems.length})
            </h1>

            {/* Items List */}
            {allItems.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 mb-4 bg-slate-100 dark:bg-slate-950 rounded-full flex items-center justify-center">
                  <Search size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-black font-title uppercase text-slate-800 dark:text-white mb-2">No Orders found</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Looks like you haven't placed any order yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allItems.map((item, idx) => {
                  const isDelivered = item.status === 'Delivered' || item.orderStatus === 'Delivered';
                  const isCancelled = item.status === 'Cancelled' || item.orderStatus === 'Cancelled';

                  return (
                    <div
                      key={`${item.orderId}-${item.productId}-${idx}`}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-md transition-all group"
                    >
                      <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center relative text-left">

                        {/* 1. Image */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl p-1.5 flex items-center justify-center">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* 2. Text Details */}
                        <div className="flex-1 min-w-0 text-left">
                          <h4 className="text-sm sm:text-base font-bold text-slate-850 dark:text-slate-200 line-clamp-2 transition-colors">
                            {item.productName}
                          </h4>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">Qty: {item.quantity}</p>

                          {/* Cancel Logic Button inline */}
                          {!isDelivered && !isCancelled && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCancelOrder(item.orderId); }}
                              className="mt-3 text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-400 transition"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>

                        {/* 3. Price */}
                        <div className="sm:w-24 shrink-0 sm:text-center mt-2 sm:mt-0 text-left sm:text-right">
                          <p className="text-base font-black font-title text-[#ff512f]">
                            ₹{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
                        </div>

                        {/* 4. Delivery Status */}
                        <div className="sm:w-64 shrink-0 mt-3 sm:mt-0 text-left">
                          <div className="flex items-start gap-3">
                            <div className="mt-1.5 shrink-0">
                              {isCancelled ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                              ) : isDelivered ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                              ) : (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff512f] animate-pulse"></div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-850 dark:text-slate-250">
                                {isCancelled
                                  ? "Cancelled"
                                  : isDelivered
                                    ? "Delivered on " + new Date(item.orderDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
                                    : (item.status || "Pending")
                                }
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
                                {isCancelled
                                  ? "As per your request, your order has been cancelled."
                                  : isDelivered
                                    ? "Your item has been delivered"
                                    : item.status === "Shipped"
                                      ? "Your item has been shipped and is on its way."
                                      : item.status === "Confirmed"
                                        ? "Your order has been confirmed by the seller."
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