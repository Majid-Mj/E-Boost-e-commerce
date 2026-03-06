import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Eye,
  Calendar,
  IndianRupee,
  User,
  MapPin,
  Phone,
  Clock,
  ChevronDown,
  Filter,
  MoreVertical,
  Download
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    revenue: 0
  });

  // ✅ Fetch from real backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Order/admin?page=1&pagesize=500");
      console.log("FULL RAW RESPONSE:", res.data);

      const rd = res.data;
      let ordersList = [];

      if (Array.isArray(rd)) {
        ordersList = rd;
      } else if (rd && typeof rd === 'object') {
        for (const key of Object.keys(rd)) {
          if (Array.isArray(rd[key])) {
            ordersList = rd[key];
            break;
          }
        }
        if (ordersList.length === 0 && rd.data && typeof rd.data === 'object' && !Array.isArray(rd.data)) {
          for (const key of Object.keys(rd.data)) {
            if (Array.isArray(rd.data[key])) {
              ordersList = rd.data[key];
              break;
            }
          }
        }
      }

      const normalizedOrders = ordersList.map(order => ({
        ...order,
        id: order.id || order.Id,
        status: order.status || order.Status,
        shippingFullName: order.shippingFullName || order.ShippingFullName || "Customer",
        shippingPhone: order.shippingPhone || order.ShippingPhone || "",
        items: (order.items || order.Items || order.orderItems || order.OrderItems || []).map(item => ({
          ...item,
          productId: item.productId || item.ProductId,
          productName: item.productName || item.ProductName || "Unknown Product",
          quantity: item.quantity || item.Quantity || 0,
          unitPrice: item.unitPrice || item.UnitPrice || 0,
          status: item.status || item.Status || "Pending"
        })),
        totalAmount: order.totalAmount || order.TotalAmount || 0,
        shippingStreet: order.shippingStreet || order.ShippingStreet || "",
        shippingCity: order.shippingCity || order.ShippingCity || "",
        shippingState: order.shippingState || order.ShippingState || "",
        orderDate: order.orderDate || order.OrderDate || order.createdAt || order.CreatedAt
      }));

      // Calculate Stats
      const statsObj = {
        total: normalizedOrders.length,
        pending: normalizedOrders.filter(o => o.status === "Pending").length,
        delivered: normalizedOrders.filter(o => o.status === "Delivered").length,
        revenue: normalizedOrders.reduce((acc, curr) => acc + curr.totalAmount, 0)
      };
      setStats(statsObj);

      setOrders(normalizedOrders);
      setFilteredOrders(normalizedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Search & Filter
  useEffect(() => {
    let result = orders;

    // Filter by Status
    if (statusFilter !== "All") {
      result = result.filter(o => o.status === statusFilter);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      result = result.filter((order) => {
        const matchName = order.shippingFullName?.toLowerCase().includes(lower);
        const matchPhone = order.shippingPhone?.includes(lower);
        const matchId = order.id?.toString().includes(lower);
        const matchProduct = order.items?.some((item) =>
          item.productName?.toLowerCase().includes(lower)
        );
        return matchName || matchPhone || matchId || matchProduct;
      });
    }

    setFilteredOrders(result);
  }, [searchQuery, statusFilter, orders]);

  // ✅ Update Product Status
  const updateOrderItemStatus = async (orderId, productId, newStatus) => {
    try {
      const updatePromise = api.patch(`/Order/${orderId}/items/${productId}/status?status=${newStatus}`);

      toast.promise(updatePromise, {
        loading: 'Updating product status...',
        success: 'Status updated successfully!',
        error: 'Failed to update status'
      });

      await updatePromise;

      setOrders((prev) =>
        prev.map((order) => {
          if (order.id === orderId) {
            const updatedItems = order.items.map(item =>
              item.productId === productId ? { ...item, status: newStatus } : item
            );
            return { ...order, items: updatedItems };
          }
          return order;
        })
      );
    } catch (err) {
      console.error("Error updating order item status:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Confirmed": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Shipped": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "Delivered": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Cancelled": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <Clock size={14} />;
      case "Confirmed": return <CheckCircle size={14} />;
      case "Shipped": return <Truck size={14} />;
      case "Delivered": return <CheckCircle size={14} />;
      case "Cancelled": return <XCircle size={14} />;
      default: return <RefreshCcw size={14} />;
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium animate-pulse">Loading amazing orders...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Order Management</h1>
        <p className="text-slate-600 font-medium mt-1">Manage, Track and Update customer orders in real-time.</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by ID, Customer Name, Phone or Product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl leading-5 bg-white text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-slate-700 font-bold whitespace-nowrap">
            <Filter size={18} />
            <span>Filter Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm min-w-[150px]"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-10">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-6 py-5 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">Order ID</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">Customer</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">Product</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">Amount</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">Date & Time</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200 text-center">Product Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.flatMap((order) =>
                  order.items?.map((item, idx) => (
                    <tr key={`${order.id}-${item.productId}-${idx}`} className="hover:bg-slate-50/80 transition-all duration-200 group">
                      <td className="px-6 py-4 whitespace-nowrap border-b border-slate-50">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md text-[13px] font-bold border border-purple-100">
                            #{order.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-slate-100 min-w-[200px]">
                        <div className="flex flex-col">
                          <div className="text-[14px] font-bold text-slate-900 leading-tight">{order.shippingFullName}</div>
                          <div className="text-[12px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                            <Phone size={10} className="text-slate-400" />
                            {order.shippingPhone}
                          </div>
                          {(order.shippingStreet || order.shippingCity || order.shippingState) && (
                            <div className="text-[11px] text-slate-500 mt-1 flex items-start gap-1">
                              <MapPin size={10} className="text-slate-400 mt-0.5 shrink-0" />
                              <span className="line-clamp-2 leading-tight">
                                {[order.shippingStreet, order.shippingCity, order.shippingState].filter(Boolean).join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-slate-100 max-w-[250px]">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded flex items-center justify-center font-bold shrink-0 border border-slate-200 text-xs">
                            {item.quantity}x
                          </span>
                          <span className="text-slate-800 font-bold text-[13px] truncate">{item.productName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-slate-100">
                        <div className="text-[14px] font-bold text-emerald-700">
                          ₹{item.unitPrice ? (item.unitPrice * item.quantity).toLocaleString() : order.totalAmount?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-slate-100">
                        <div className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                          {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-slate-100">
                        <div className="flex justify-center">
                          <div className="relative group/select w-full max-w-[140px]">
                            <select
                              value={item.status || "Pending"}
                              onChange={(e) => updateOrderItemStatus(order.id, item.productId, e.target.value)}
                              className={`appearance-none w-full border rounded-lg pl-8 pr-4 py-1.5 text-[12px] font-bold cursor-pointer transition-all outline-none border-transparent shadow-sm ${getStatusColor(item.status || "Pending")} hover:scale-[1.02]`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none`}>
                              {getStatusIcon(item.status || "Pending")}
                            </div>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                              <ChevronDown size={12} className="opacity-60" />
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <Package size={64} className="mb-4 text-slate-300" />
                      <h3 className="text-xl font-bold text-slate-900">No Orders Found</h3>
                      <p className="text-slate-500">We couldn't find any orders matching your filters.</p>
                      <button
                        onClick={() => { setSearchQuery(""); setStatusFilter("All"); }}
                        className="mt-4 text-purple-600 font-bold hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="bg-white px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-bold text-slate-900">{filteredOrders.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 font-bold text-xs cursor-not-allowed">Previous</button>
            <button className="px-4 py-2 bg-purple-600 border border-purple-600 rounded-lg text-white font-bold text-xs hover:bg-purple-700 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}