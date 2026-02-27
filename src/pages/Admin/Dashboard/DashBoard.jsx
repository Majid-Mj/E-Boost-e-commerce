


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Pie, Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
// } from "chart.js";

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement
// );

// export default function Dashboard() {
//   const [stats, setStats] = useState({
//     revenue: 0,
//     orders: 0,
//     customers: 0,
//     products: 0,
//     monthlyRevenue: [],
//     monthlyOrders: [],
//   });

//   const [categoryChart, setCategoryChart] = useState({
//     labels: [],
//     data: [],
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const [usersRes, productsRes] = await Promise.all([
//           axios.get("http://localhost:4444/users"),
//           axios.get("http://localhost:4444/products"),
//         ]);

//         const users = usersRes.data || [];
//         const products = productsRes.data || [];

//         //Collect all orders
//         let allOrders = [];
//         users.forEach((user) => {
//           if (user.orders && Array.isArray(user.orders)) {
//             allOrders.push(...user.orders);
//           }
//         });

//         //Total revenue
//         const totalRevenue = allOrders.reduce(
//           (sum, order) => sum + (order.total || 0),
//           0
//         );

//         //Total customers
//         const totalCustomers = users.filter(
//           (user) => !user.email.includes("admin")
//         ).length;

//         //Monthly revenue and orders
//         const monthlyRevenue = Array(12).fill(0);
//         const monthlyOrders = Array(12).fill(0);

//         allOrders.forEach((order) => {
//           if (order.date) {
//             const month = new Date(order.date).getMonth();
//             monthlyRevenue[month] += order.total || 0;
//             monthlyOrders[month] += 1;
//           }
//         });

//         //Category data for Pie chart
//         const categoryCount = {};
//         allOrders.forEach((order) => {
//           if (order.items && Array.isArray(order.items)) {
//             order.items.forEach((item) => {
//               const category = item.product?.category || "Uncategorized";
//               categoryCount[category] =
//                 (categoryCount[category] || 0) + (item.quantity || 0);
//             });
//           }
//         });

//         const chartLabels = Object.keys(categoryCount);
//         const chartData = Object.values(categoryCount);

//         setCategoryChart({
//           labels: chartLabels,
//           data: chartData,
//         });

//         setStats({
//           revenue: totalRevenue,
//           orders: allOrders.length,
//           customers: totalCustomers,
//           products: products.length,
//           monthlyRevenue,
//           monthlyOrders,
//         });
//       } catch (error) {
//         console.error("Error fetching dashboard stats:", error);
//       }
//     };

//     fetchStats();
//   }, []);

//   const formattedRevenue = stats.revenue.toLocaleString("en-IN", {
//     style: "currency",
//     currency: "INR",
//   });

//   const cards = [
//     {
//       title: "Total Revenue",
//       value: formattedRevenue,
//       color: "bg-green-500",
//     },
//     {
//       title: "Total Orders",
//       value: stats.orders,
//       color: "bg-blue-500",
//       onClick: () => navigate("/admin/orders"),
//     },
//     {
//       title: "Total Customers",
//       value: stats.customers,
//       color: "bg-yellow-400",
//       onClick: () => navigate("/admin/users"),
//     },
//     {
//       title: "Total Products",
//       value: stats.products,
//       color: "bg-purple-500",
//       onClick: () => navigate("/admin/products"),
//     },
//   ];

//   const monthLabels = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

  
//   const salesData = {
//     labels: monthLabels,
//     datasets: [ 
//       {
//         type: "bar",
//         label: "Revenue (₹)",
//         data: stats.monthlyRevenue,
//         backgroundColor: "rgba(99, 102, 241, 0.7)",
//         borderRadius: 6,
//       },
//       {
//         type: "line",
//         label: "Orders",
//         data: stats.monthlyOrders,
//         borderColor: "rgba(16, 185, 129, 1)",
//         backgroundColor: "rgba(16, 185, 129, 0.3)",
//         tension: 0.4,
//         fill: true,
//         yAxisID: "orders",
//       },
//     ],
//   };


//     const salesOptions = {
//       responsive: true,
//       interaction: { mode: "index", intersect: false },
//       stacked: false,
//       animation: false, 
//       plugins: {
//         legend: { position: "top" },
//         tooltip: { mode: "index", intersect: false },
//       },
//       scales: {
//         y: {
//           beginAtZero: true,
//           title: { display: true, text: "Revenue (₹)" },
//         },
//         orders: {
//           beginAtZero: true,
//           position: "right",
//           title: { display: true, text: "Orders" },
//           grid: { drawOnChartArea: false },
//         },
//       },
//     };


//   return (
//     <div className="font-sans text-gray-800 p-4 sm:p-6 lg:p-8 bg-[#f7f6fb] min-h-screen">
//       <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-[#333041]">
//         Dashboard
//       </h1>

    
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
//         {cards.map((card) => (
//           <div
//             key={card.title}
//             onClick={card.onClick}
//             className="bg-white rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition duration-200 p-5 sm:p-6 flex flex-col justify-between cursor-pointer"
//           >
//             <p className="text-gray-500 text-sm sm:text-base">{card.title}</p>
//             <h2 className="text-2xl sm:text-3xl font-bold mt-2">
//               {card.value}
//             </h2>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="col-span-2 bg-white rounded-xl shadow p-4 sm:p-6">
//           <h2 className="font-semibold text-base sm:text-lg mb-4">
//             Sales Overview
//           </h2>
//           <Bar data={salesData} options={salesOptions} />
//         </div>

//         {/* Orders by Category */}
//         <div className="bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col justify-between">
//           <h2 className="font-semibold text-base sm:text-lg mb-4">
//             Orders by Category
//           </h2>

//           <div className="relative flex flex-col items-center">
//             <div className="flex justify-center items-center h-64 w-full">
//               {categoryChart.labels.length > 0 ? (
//                 <Pie
//                   data={{
//                     labels: categoryChart.labels,
//                     datasets: [
//                       {
//                         label: "Products Ordered",
//                         data: categoryChart.data,
//                         backgroundColor: [
//                           "#10B981",
//                           "#3B82F6",
//                           "#F59E0B",
//                           "#6366F1",
//                           "#8B5CF6",
//                           "#EC4899",
//                         ],
//                         borderWidth: 0,
//                         cutout: "70%",
//                       },
//                     ],
//                   }}
//                   options={{
//                     responsive: true,
//                     plugins: {
//                       legend: { display: false },
//                       tooltip: {
//                         backgroundColor: "#111827",
//                         bodyColor: "#fff",
//                         borderColor: "#fff",
//                         borderWidth: 1,
//                         padding: 10,
//                         displayColors: false,
//                       },
//                     },
//                   }}
//                 />
//               ) : (
//                 <p className="text-gray-500 text-sm">
//                   No category data available
//                 </p>
//               )}

//               <div className="absolute text-center">
//                 <p className="text-gray-500 text-sm">Total Products</p>
//                 <p className="text-2xl font-semibold text-gray-800">
//                   {categoryChart.data.reduce((sum, val) => sum + val, 0)}
//                 </p>
//               </div>
//             </div>

//             {categoryChart.labels.length > 0 && (
//               <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 text-sm text-gray-600">
//                 {categoryChart.labels.map((label, index) => (
//                   <div key={index} className="flex items-center space-x-2">
//                     <span
//                       className="inline-block w-3 h-3 rounded-full"
//                       style={{
//                         backgroundColor: [
//                           "#10B981",
//                           "#3B82F6",
//                           "#F59E0B",
//                           "#6366F1",
//                           "#8B5CF6",
//                           "#EC4899",
//                         ][index % 6],
//                       }}
//                     ></span>
//                     <span>{label}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// } 


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import api from "../../../config/api";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    products: 0,
    monthlyRevenue: [],
    monthlyOrders: [],
  });

  const [categoryChart, setCategoryChart] = useState({
    labels: [],
    data: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get("/orders/admin"),   // admin orders
          api.get("/products/admin")   // since you're admin 
        ]);
        const orders = Array.isArray(ordersRes.data?.data)
          ? ordersRes.data.data
          : [];

        const products = Array.isArray(productsRes.data?.data)
          ? productsRes.data.data
          : [];

        const totalRevenue = orders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );

        const monthlyRevenue = Array(12).fill(0);
        const monthlyOrders = Array(12).fill(0);

        orders.forEach((order) => {
          if (order.createdAt) {
            const month = new Date(order.createdAt).getMonth();
            monthlyRevenue[month] += order.totalAmount || 0;
            monthlyOrders[month] += 1;
          }
        });

        const categoryCount = {};
        orders.forEach((order) => {
          if (order.orderItems) {
            order.orderItems.forEach((item) => {
              const category = item.category || "Uncategorized";
              categoryCount[category] =
                (categoryCount[category] || 0) + item.quantity;
            });
          }
        });

        setCategoryChart({
          labels: Object.keys(categoryCount),
          data: Object.values(categoryCount),
        });

        setStats({
          revenue: totalRevenue,
          orders: orders.length,
          customers: new Set(orders.map(o => o.userId)).size,
          products: products.length,
          monthlyRevenue,
          monthlyOrders,
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchStats();
  }, []);

  const formattedRevenue = stats.revenue.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  const cards = [
    { title: "Total Revenue", value: formattedRevenue },
    {
      title: "Total Orders",
      value: stats.orders,
      onClick: () => navigate("/admin/orders"),
    },
    {
      title: "Total Customers",
      value: stats.customers,
      onClick: () => navigate("/admin/users"),
    },
    {
      title: "Total Products",
      value: stats.products,
      onClick: () => navigate("/admin/products"),
    },
  ];

  const monthLabels = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  const salesData = {
    labels: monthLabels,
    datasets: [
      {
        type: "bar",
        label: "Revenue (₹)",
        data: stats.monthlyRevenue,
        backgroundColor: "rgba(99,102,241,0.7)",
        borderRadius: 6,
      },
      {
        type: "line",
        label: "Orders",
        data: stats.monthlyOrders,
        borderColor: "rgba(16,185,129,1)",
        backgroundColor: "rgba(16,185,129,0.3)",
        tension: 0.4,
        fill: true,
        yAxisID: "orders",
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    stacked: false,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: { beginAtZero: true },
      orders: {
        beginAtZero: true,
        position: "right",
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div className="font-sans text-gray-800 p-6 bg-[#f7f6fb] min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-[#333041]">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={card.onClick}
            className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg"
          >
            <p className="text-gray-500">{card.title}</p>
            <h2 className="text-2xl font-bold mt-2">{card.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">Sales Overview</h2>
          <Bar data={salesData} options={salesOptions} />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">Orders by Category</h2>
          {categoryChart.labels.length > 0 ? (
            <Pie
              data={{
                labels: categoryChart.labels,
                datasets: [{
                  data: categoryChart.data,
                  backgroundColor: [
                    "#10B981","#3B82F6","#F59E0B",
                    "#6366F1","#8B5CF6","#EC4899",
                  ],
                }],
              }}
            />
          ) : (
            <p>No category data</p>
          )}
        </div>
      </div>
    </div>
  );
}