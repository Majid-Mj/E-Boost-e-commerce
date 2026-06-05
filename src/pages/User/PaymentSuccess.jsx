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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-200 transition-colors duration-300 px-4">
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center max-w-md w-full">
                <div className="flex justify-center mb-6">
                    {isCOD ? (
                        <Truck className="text-[#ff512f] w-20 h-20 animate-bounce" />
                    ) : (
                        <CheckCircle className="text-[#ff512f] w-20 h-20 animate-bounce" />
                    )}
                </div>
                <h1 className="text-2xl font-black font-title uppercase tracking-wide text-slate-850 dark:text-white mb-4">
                    {isCOD ? "Order Placed!" : "Payment Successful!"}
                </h1>
                <p className="text-slate-500 dark:text-slate-405 mb-8 text-sm font-semibold">
                    {isCOD
                        ? "Thank you! Your order is placed and will be paid on delivery."
                        : "Thank you for your purchase. Your order has been placed successfully."}
                </p>
                <div className="flex justify-center mb-6">
                    <div className="w-8 h-8 border-4 border-[#ff512f] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 font-bold uppercase tracking-wider">Redirecting to your orders...</p>
                <button
                    onClick={() => navigate("/orders")}
                    className="w-full bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-95 shadow-md shadow-orange-500/10 transition active:scale-95"
                >
                    View Orders Now
                </button>
            </div>
        </div>
    );
}
