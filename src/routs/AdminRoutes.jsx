import { Routes, Route } from "react-router-dom";
import AdminLayout from "../pages/Admin/Layout/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard/DashBoard";
import ProductList from "../pages/Admin/Products/ProductList";
import UserList from "../pages/Admin/Users/UserList";
import OrderReport from "../pages/Admin/Orders/OrderReport"


export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/users" element={<UserList />}/>
        <Route path="/orders" element={<OrderReport/>}/>
      </Route>
    </Routes>
  );
}
