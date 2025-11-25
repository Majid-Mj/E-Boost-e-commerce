import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

export default function SalesChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:4444/orders"); 
        const orders = res.data;
        const monthlyStats = {};

        orders.forEach((order) => {
          const date = new Date(order.date);
          const month = date.toLocaleString("default", { month: "short" });
          if (!monthlyStats[month]) {
            monthlyStats[month] = { sales: 0, revenue: 0 };
          }
          monthlyStats[month].sales += 1;
          monthlyStats[month].revenue += order.totalPrice; 
        });

        const labels = Object.keys(monthlyStats);
        const salesData = Object.values(monthlyStats).map((v) => v.sales);
        const revenueData = Object.values(monthlyStats).map((v) => v.revenue);

        setChartData({
          labels,
          datasets: [
            {
              label: "Sales (Orders)",
              data: salesData,
              borderColor: "#6366F1",
              backgroundColor: "rgba(99,102,241,0.2)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "Revenue ($)",
              data: revenueData,
              borderColor: "#22C55E",
              backgroundColor: "rgba(34,197,94,0.2)",
              tension: 0.4,
              fill: true,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 py-6">Loading chart...</p>;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Sales & Revenue Overview
      </h2>
      {chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: "#374151",
                  font: { size: 12 },
                },
              },
              tooltip: {
                backgroundColor: "#111827",
                titleColor: "#fff",
                bodyColor: "#fff",
              },
            },
            scales: {
              x: {
                ticks: { color: "#6B7280" },
                grid: { color: "#E5E7EB" },
              },
              y: {
                ticks: { color: "#6B7280" },
                grid: { color: "#E5E7EB" },
              },
            },
          }}
        />
      ) : (
        <p className="text-center text-gray-500">No sales data available.</p>
      )}
    </div>
  );
}
