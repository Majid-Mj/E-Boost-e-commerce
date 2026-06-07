import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "../contexts/CartContext";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import ScrollToTop from "../Components/ScrollToTop";
import ProtectedRoute from "../Components/ProtectedRoute";

// Lazy-loaded routes
const Home = lazy(() => import("../pages/User/Home"));
const Login = lazy(() => import("../pages/Auth/Login"));
const Signup = lazy(() => import("../pages/Auth/Signup"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/Auth/ResetPassword"));
const ProductView = lazy(() => import("../Components/Productsview"));
const Products = lazy(() => import("../pages/User/Products"));
const ProductDetail = lazy(() => import("../Components/ProductDetail"));
const Cart = lazy(() => import("../pages/User/Cart"));
const Addaddress = lazy(() => import("../pages/User/Addaddress"));
const Wishlist = lazy(() => import("../pages/User/Wishlist"));
const About = lazy(() => import("../pages/User/About"));
const Contact = lazy(() => import("../pages/User/Contact"));
const User = lazy(() => import("../pages/User/User"));
const Payment = lazy(() => import("../pages/User/Payment"));
const PaymentSuccess = lazy(() => import("../pages/User/PaymentSuccess"));
const Orders = lazy(() => import("../pages/User/Orders"));
const AdminRoutes = lazy(() => import("./AdminRoutes"));

// Loading spinner fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-800 dark:text-slate-200">
    <div className="w-10 h-10 border-4 border-[#ff512f] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function AppRoutes() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/home" element={<Home />} />
                <Route path="/ProductView" element={<ProductView />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/product-details/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/cart/address" element={<ProtectedRoute><Addaddress /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/User" element={<ProtectedRoute><User /></ProtectedRoute>} />
                <Route path="/address" element={<ProtectedRoute><Addaddress /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/admin/*" element={
                  <ProtectedRoute role={2}>
                    <AdminRoutes />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
