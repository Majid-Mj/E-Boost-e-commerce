import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Truck } from "lucide-react";

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if it was a COD order
    const isCOD = location.state?.method === "cod";

    useEffect(() => {
        // Redirect to orders page after 3 seconds
        const timer = setTimeout(() => {
            navigate("/orders");
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black text-white px-4">
            <div className="bg-[#1f1b2e] p-8 md:p-12 rounded-2xl border border-gray-800 shadow-[0_0_30px_rgba(0,255,255,0.1)] text-center max-w-md w-full">
                <div className="flex justify-center mb-6">
                    {isCOD ? (
                        <Truck className="text-[#00FFFF] w-20 h-20 animate-bounce" />
                    ) : (
                        <CheckCircle className="text-[#00FFFF] w-20 h-20 animate-bounce" />
                    )}
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">
                    {isCOD ? "Order Placed Successfully!" : "Payment Successful!"}
                </h1>
                <p className="text-gray-400 mb-8">
                    {isCOD
                        ? "Thank you! Your order is placed and will be paid on delivery."
                        : "Thank you for your purchase. Your order has been placed successfully."}
                </p>
                <div className="flex justify-center mb-6">
                    <div className="w-8 h-8 border-4 border-[#00FFFF] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-sm text-gray-500 mb-6">Redirecting to your orders...</p>
                <button
                    onClick={() => navigate("/orders")}
                    className="w-full bg-[#00FFFF] text-black py-3 rounded-lg font-semibold hover:bg-cyan-400 transition shadow-[0_4px_14px_rgba(0,255,255,0.25)]"
                >
                    View Orders Now
                </button>
            </div>
        </div>
    );
}
