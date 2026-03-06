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
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
  BarChart3
} from "lucide-react";

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

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [ordersRes, productsRes] = await Promise.all([
          api.get("/orders/admin"),
          api.get("/products/admin")
        ]);

        const orders = Array.isArray(ordersRes.data?.data) ? ordersRes.data.data : [];
        const products = Array.isArray(productsRes.data?.data) ? productsRes.data.data : [];

        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        const monthlyRevenue = Array(12).fill(0);
        const monthlyOrders = Array(12).fill(0);

        orders.forEach((order) => {
          if (order.createdAt) {
            const date = new Date(order.createdAt);
            const month = date.getMonth();
            monthlyRevenue[month] += order.totalAmount || 0;
            monthlyOrders[month] += 1;
          }
        });

        const categoryCount = {};
        orders.forEach((order) => {
          if (order.orderItems) {
            order.orderItems.forEach((item) => {
              const category = item.category || "Uncategorized";
              categoryCount[category] = (categoryCount[category] || 0) + (item.quantity || 0);
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
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formattedRevenue = stats.revenue.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  const cards = [
    {
      title: "Total Revenue",
      value: formattedRevenue,
      icon: <IndianRupee size={22} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "+12.5%",
      isPostive: true
    },
    {
      title: "Orders Done",
      value: stats.orders,
      icon: <ShoppingBag size={22} />,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "+8.2%",
      isPostive: true,
      onClick: () => navigate("/admin/orders")
    },
    {
      title: "Active Customers",
      value: stats.customers,
      icon: <Users size={22} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+5.4%",
      isPostive: true,
      onClick: () => navigate("/admin/users")
    },
    {
      title: "Product Range",
      value: stats.products,
      icon: <Package size={22} />,
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: "Stable",
      isPostive: true,
      onClick: () => navigate("/admin/products")
    },
  ];

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const salesData = {
    labels: monthLabels,
    datasets: [
      {
        type: "bar",
        label: "Revenue (₹)",
        data: stats.monthlyRevenue,
        backgroundColor: "rgba(124, 58, 237, 0.7)", // Purple-600 with opacity
        borderRadius: 8,
        hoverBackgroundColor: "rgba(124, 58, 237, 1)",
      },
      {
        type: "line",
        label: "Order Count",
        data: stats.monthlyOrders,
        borderColor: "#10b981", // Emerald-500
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        yAxisID: "orders",
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { weight: '600', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        titleFont: { size: 14, weight: '700' },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { weight: '600' }, color: '#64748b' }
      },
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        ticks: { font: { weight: '600' }, color: '#64748b' }
      },
      orders: {
        beginAtZero: true,
        position: "right",
        grid: { display: false },
        ticks: { font: { weight: '600' }, color: '#10b981' }
      },
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-700 font-bold animate-pulse">Initializing Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-[#f8fafc] min-h-screen font-sans text-slate-900">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="text-purple-600" size={32} />
            Business Dashboard
          </h1>
          <p className="text-slate-600 font-medium mt-1">Detailed overview of your store's performance and operations.</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-3 text-slate-700 font-bold">
          <Calendar size={18} className="text-purple-600" />
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={card.onClick}
            className={`bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-purple-100 transition-all duration-300 group ${card.onClick ? 'cursor-pointer' : ''}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`${card.bg} ${card.color} p-3 rounded-2xl transition-transform group-hover:scale-110`}>
                {card.icon}
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-lg ${card.isPostive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {card.isPostive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {card.trend}
              </div>
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-bold mt-1 text-slate-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Overview */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-purple-600" size={20} />
              <h2 className="text-xl font-bold text-slate-900">Revenue Analytics</h2>
            </div>
            <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 uppercase tracking-widest">
              Last 12 Months
            </div>
          </div>
          <div className="h-[400px]">
            <Bar data={salesData} options={salesOptions} />
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <Layers className="text-purple-600" size={20} />
            <h2 className="text-xl font-bold text-slate-900">Category Share</h2>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center">
            {categoryChart.labels.length > 0 ? (
              <div className="relative w-full aspect-square max-w-[280px]">
                <Pie
                  data={{
                    labels: categoryChart.labels,
                    datasets: [{
                      data: categoryChart.data,
                      backgroundColor: [
                        "#7c3aed", // Purple
                        "#10b981", // Emerald
                        "#f59e0b", // Amber
                        "#3b82f6", // Blue
                        "#f43f5e", // Rose
                        "#0ea5e9", // Sky
                      ],
                      borderWidth: 6,
                      borderColor: "#ffffff",
                      hoverOffset: 15
                    }],
                  }}
                  options={{
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        enabled: true,
                        padding: 12,
                        backgroundColor: "#1e293b",
                        titleFont: { size: 14, weight: '700' },
                        bodyFont: { size: 13 },
                        cornerRadius: 8,
                      }
                    },
                    cutout: '65%'
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Total</span>
                  <span className="text-3xl font-bold text-slate-900">
                    {categoryChart.data.reduce((a, b) => a + b, 0)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center opacity-40 text-center">
                <Package size={64} className="mb-4 text-slate-300" />
                <p className="text-slate-700 font-bold">No categorical data found</p>
              </div>
            )}

            {/* Legend Mapping */}
            <div className="mt-10 grid grid-cols-2 gap-y-3 gap-x-6 w-full">
              {categoryChart.labels.map((label, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ["#7c3aed", "#10b981", "#f59e0b", "#3b82f6", "#f43f5e", "#0ea5e9"][idx % 6] }}></div>
                  <span className="text-xs font-bold text-slate-600 truncate">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}