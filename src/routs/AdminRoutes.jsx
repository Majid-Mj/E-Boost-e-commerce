import { Routes, Route } from "react-router-dom";
import AdminLayout from "../pages/Admin/Layout/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard/DashBoard";
import ProductList from "../pages/Admin/Products/ProductList";
import UserList from "../pages/Admin/Users/UserList";
import OrderReport from "../pages/Admin/Orders/OrderReport"
import AdminRoute from "../Components/AdminRoute";
import AddProduct from "../pages/Admin/Products/AddProduct";


export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminRoute><Dashboard /></AdminRoute>} />

        <Route path="products" element={<AdminRoute><ProductList /></AdminRoute>} />
        <Route path="products/add" element={<AdminRoute><AddProduct /></AdminRoute>} />

        <Route path="users" element={<AdminRoute><UserList /></AdminRoute>} />
        <Route path="orders" element={<AdminRoute><OrderReport /></AdminRoute>} />
      </Route>
    </Routes>
  );
}