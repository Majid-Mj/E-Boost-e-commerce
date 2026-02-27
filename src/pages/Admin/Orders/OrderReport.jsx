// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function AdminOrders() {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   // ✅ Fetch all users and flatten their orders
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await axios.get("http://localhost:4444/users");
//         const users = res.data;

//         const allOrders = users
//           .filter((user) => user.orders && user.orders.length > 0)
//           .flatMap((user) =>
//             user.orders.map((order) => ({
//               ...order,
//               userId: user.id,
//               userName: user.name,
//             }))
//           );

//         setOrders(allOrders);
//         setFilteredOrders(allOrders);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   // ✅ Search logic
//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setFilteredOrders(orders);
//       return;
//     }

//     const lower = searchQuery.toLowerCase();
//     const filtered = orders.filter((order) => {
//       const matchName = order.userName.toLowerCase().includes(lower);
//       const matchId = order.userId.toString().includes(lower);
//       const matchProduct = order.items.some((item) =>
//         item.product.name.toLowerCase().includes(lower)
//       );
//       return matchName || matchId || matchProduct;
//     });

//     setFilteredOrders(filtered);
//   }, [searchQuery, orders]);

//   // ✅ Update by items.id
//   const updateOrderStatus = async (itemId, newStatus) => {
//     try {
//       const { data: users } = await axios.get("http://localhost:4444/users");

//       // Find the user and order containing this item ID
//       const user = users.find((u) =>
//         u.orders?.some((order) =>
//           order.items?.some((item) => item.id === itemId)
//         )
//       );

//       if (!user) {
//         alert("Order not found for any user");
//         return;
//       }

//       // Update the order's status that contains the item
//       const updatedOrders = user.orders.map((order) => {
//         if (order.items.some((item) => item.id === itemId)) {
//           return { ...order, status: newStatus };
//         }
//         return order;
//       });

//       // Save to JSON server
//       await axios.patch(`http://localhost:4444/users/${user.id}`, {
//         orders: updatedOrders,
//       });

//       // Update local state
//       setOrders((prev) =>
//         prev.map((o) =>
//           o.items.some((item) => item.id === itemId)
//             ? { ...o, status: newStatus }
//             : o
//         )
//       );
//       setFilteredOrders((prev) =>
//         prev.map((o) =>
//           o.items.some((item) => item.id === itemId)
//             ? { ...o, status: newStatus }
//             : o
//         )
//       );

//       console.log(`✅ Updated item ${itemId} → ${newStatus}`);
//     } catch (err) {
//       console.error("Error updating order status:", err);
//     }
//   };

//   if (loading) return <p className="p-6">Loading orders...</p>;

//   return (
//     <div className="p-4 sm:p-6 bg-[#f7f6fb] min-h-screen">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
//         <h1 className="text-2xl font-bold text-[#333041]">Manage Orders</h1>
//         <input
//           type="text"
//           placeholder="Search by user ID, name, or product"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded-md w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#413b55]"
//         />
//       </div>

//       <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-200">
//         <table className="w-full border-collapse text-sm md:text-base">
//           <thead className="bg-[#333041]/10 text-gray-700 uppercase font-semibold">
//             <tr>
//               <th className="p-4 text-left border-b">Customer</th>
//               <th className="p-4 text-left border-b">Products</th>
//               <th className="p-4 text-left border-b">Total</th>
//               <th className="p-4 text-left border-b">Address</th>
//               <th className="p-4 text-left border-b">Date</th>
//               <th className="p-4 text-left border-b">Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredOrders.length > 0 ? (
//               filteredOrders.map((order) => (
//                 <tr key={order.id} className="hover:bg-gray-50 transition">
//                   <td className="p-4 border-b text-gray-700">
//                     {order.userName}
//                     <br />
//                     <span className="text-xs text-gray-500">
//                       ({order.userId})
//                     </span>
//                   </td>

//                   <td className="p-4 border-b text-gray-700">
//                     <ul className="list-disc list-inside space-y-1">
//                       {order.items.map((item) => (
//                         <li key={item.id}>
//                           <span className="text-xs text-gray-500">
//                             #{item.product.id}
//                           </span>{" "}
//                           <span className="font-medium">
//                             {item.product.name}
//                           </span>{" "}
//                           × {item.quantity}
//                         </li>
//                       ))}
//                     </ul>
//                   </td>

//                   <td className="p-4 border-b font-semibold text-green-700">
//                     ₹{order.total}
//                   </td>

//                   <td className="p-4 border-b text-gray-600">
//                     {order.address.fullName}
//                     <br />
//                     <span className="text-sm text-gray-500">
//                       {order.address.city}, {order.address.state}
//                     </span>
//                   </td>

//                   <td className="p-4 border-b text-gray-500">
//                     {new Date(order.date).toLocaleDateString()}
//                   </td>

//                   <td className="p-4 border-b">
//                     <select
//                       value={order.status || "Pending"}
//                       onChange={(e) =>
//                         updateOrderStatus(order.items[0].id, e.target.value)
//                       }
//                       className={`border rounded-md px-2 py-1 focus:ring-2 ${
//                         order.status === "Delivered"
//                           ? "bg-green-100 border-green-400 text-green-800"
//                           : order.status === "Shipped"
//                           ? "bg-blue-100 border-blue-400 text-blue-800"
//                           : order.status === "Cancelled"
//                           ? "bg-red-100 border-red-400 text-red-800"
//                           : "bg-yellow-100 border-yellow-400 text-yellow-800"
//                       }`}
//                     >
//                       <option value="Pending">Pending</option>
//                       <option value="Shipped">Shipped</option>
//                       <option value="Delivered">Delivered</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="text-center p-6 text-gray-500">
//                   No matching orders found
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

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch from real backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/Order/admin");
        setOrders(res.data || []);
        setFilteredOrders(res.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const lower = searchQuery.toLowerCase();

    const filtered = orders.filter((order) => {
      const matchName = order.userName?.toLowerCase().includes(lower);
      const matchId = order.userId?.toString().includes(lower);
      const matchProduct = order.orderItems?.some((item) =>
        item.productName?.toLowerCase().includes(lower)
      );

      return matchName || matchId || matchProduct;
    });

    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  // ✅ Update Status (REAL BACKEND)
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/Order/${orderId}/status`, {
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      setFilteredOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      console.log(`✅ Updated order ${orderId} → ${newStatus}`);
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-4 sm:p-6 bg-[#f7f6fb] min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-[#333041]">Manage Orders</h1>

        <input
          type="text"
          placeholder="Search by user ID, name, or product"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#413b55]"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-200">
        <table className="w-full border-collapse text-sm md:text-base">
          <thead className="bg-[#333041]/10 text-gray-700 uppercase font-semibold">
            <tr>
              <th className="p-4 text-left border-b">Customer</th>
              <th className="p-4 text-left border-b">Products</th>
              <th className="p-4 text-left border-b">Total</th>
              <th className="p-4 text-left border-b">Address</th>
              <th className="p-4 text-left border-b">Date</th>
              <th className="p-4 text-left border-b">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 border-b text-gray-700">
                    {order.userName}
                    <br />
                    <span className="text-xs text-gray-500">
                      ({order.userId})
                    </span>
                  </td>

                  <td className="p-4 border-b text-gray-700">
                    <ul className="list-disc list-inside space-y-1">
                      {order.orderItems?.map((item) => (
                        <li key={item.id}>
                          <span className="text-xs text-gray-500">
                            #{item.productId}
                          </span>{" "}
                          <span className="font-medium">
                            {item.productName}
                          </span>{" "}
                          × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="p-4 border-b font-semibold text-green-700">
                    ₹{order.totalAmount}
                  </td>

                  <td className="p-4 border-b text-gray-600">
                    {order.shippingAddress?.fullName}
                    <br />
                    <span className="text-sm text-gray-500">
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}
                    </span>
                  </td>

                  <td className="p-4 border-b text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4 border-b">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className="border rounded-md px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No matching orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}