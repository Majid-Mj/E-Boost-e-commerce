import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Home from "../pages/User/Home";
import ProductView from "../Components/Productsview";
import Products from "../pages/User/Products";
import Cart from "../pages/User/Cart";
import ProductDetail from "../Components/ProductDetail";
import { CartProvider } from "../contexts/Cartcontext";
import ScrollToTop from "../Components/ScrollToTop";
import About from "../pages/User/About";
import Contact from "../pages/User/Contact";
import Wishlist from "../pages/User/Wishlist";
import User from "../pages/User/User";
import Addaddress from "../pages/User/Addaddress";
import Payment from "../pages/User/Payment";
import Orders from "../pages/User/Orders";
import AdminRoutes from "./AdminRoutes";

 
export default function AppRoutes() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home" element={<Home/>}/>
          <Route path="/ProductView" element={<ProductView/>}/>
          <Route path="/products" element={<Products/>}/>
          <Route path="/products/:id" element={<ProductDetail/>}/>
          <Route path="/product-details/:id" element={<ProductDetail/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/cart/address" element={<Addaddress/>}/>
          <Route path="/wishlist" element={<Wishlist/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/User" element={<User/>}/>
          <Route path="/address" element={<Addaddress/>}/>
          <Route path="/payment" element={<Payment/>}/>
          <Route path="/orders" element={<Orders/>}/>
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}
