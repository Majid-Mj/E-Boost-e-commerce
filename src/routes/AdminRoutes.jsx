import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AdminRoute from "../Components/AdminRoute";

// Lazy-loaded Admin pages
const AdminLayout = lazy(() => import("../pages/Admin/Layout/AdminLayout"));
const Dashboard = lazy(() => import("../pages/Admin/Dashboard/DashBoard"));
const ProductList = lazy(() => import("../pages/Admin/Products/ProductList"));
const UserList = lazy(() => import("../pages/Admin/Users/UserList"));
const OrderReport = lazy(() => import("../pages/Admin/Orders/OrderReport"));
const AddProduct = lazy(() => import("../pages/Admin/Products/AddProduct"));
const EditProduct = lazy(() => import("../pages/Admin/Products/EditProduct"));

const AdminLoadingFallback = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-800 dark:text-slate-200">
    <div className="w-8 h-8 border-4 border-[#ff512f] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function AdminRoutes() {
  return (
    <Suspense fallback={<AdminLoadingFallback />}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminRoute><Dashboard /></AdminRoute>} />

          <Route path="products" element={<AdminRoute><ProductList /></AdminRoute>} />
          <Route path="products/add" element={<AdminRoute><AddProduct /></AdminRoute>} />
          <Route path="products/edit/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />

          <Route path="users" element={<AdminRoute><UserList /></AdminRoute>} />
          <Route path="orders" element={<AdminRoute><OrderReport /></AdminRoute>} />
        </Route>
      </Routes>
    </Suspense>
  );
}
