import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { CheckCircle, Truck, XCircle } from "lucide-react";
import api from "../../config/api";
import toast from "react-hot-toast";

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [verifying, setVerifying] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const sessionId = searchParams.get("session_id");
    const isCOD = location.state?.method === "cod";

    const hasVerified = React.useRef(false);

    useEffect(() => {
        if (isCOD) {
            setSuccess(true);
            if (!hasVerified.current) {
                hasVerified.current = true;
                toast.success("Order placed successfully!", { id: "payment-success" });
            }
            
            const timer = setTimeout(() => {
                navigate("/orders");
            }, 3000);
            return () => clearTimeout(timer);
        }

        if (sessionId && !hasVerified.current) {
            hasVerified.current = true;
            const verifyPayment = async () => {
                setVerifying(true);
                try {
                    const res = await api.post("/payment/verify", {
                        sessionId: sessionId
                    });
                    
                    if (res.status === 200 || res.data?.success) {
                        setSuccess(true);
                        toast.success("Payment verified successfully!", { id: "payment-success" });
                        setTimeout(() => {
                            navigate("/orders");
                        }, 3000);
                    } else {
                        setErrorMsg("Verification failed on server.");
                    }
                } catch (err) {
                    console.error("Stripe verification error:", err);
                    setErrorMsg(err?.response?.data?.message || "Verification failed. Please contact support.");
                } finally {
                    setVerifying(false);
                }
            };

            verifyPayment();
        } else if (!sessionId && !isCOD) {
            setSuccess(true);
            const timer = setTimeout(() => {
                navigate("/orders");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [sessionId, isCOD, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-200 transition-colors duration-300 px-4">
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center max-w-md w-full">
                {verifying && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 border-4 border-t-transparent border-[#ff512f] rounded-full animate-spin"></div>
                        </div>
                        <h1 className="text-2xl font-black font-title uppercase tracking-wide text-slate-850 dark:text-white mb-4">
                            Verifying Payment...
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm font-semibold">
                            Please wait while we secure your payment and confirm your order. Do not refresh this page.
                        </p>
                    </>
                )}

                {!verifying && success && (
                    <>
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
                        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm font-semibold">
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
                    </>
                )}

                {!verifying && !success && errorMsg && (
                    <>
                        <div className="flex justify-center mb-6 text-red-500">
                            <XCircle className="w-20 h-20" />
                        </div>
                        <h1 className="text-2xl font-black font-title uppercase tracking-wide text-red-650 dark:text-red-400 mb-4">
                            Verification Failed
                        </h1>
                        <p className="text-slate-550 dark:text-slate-400 mb-8 text-sm font-semibold">
                            {errorMsg}
                        </p>
                        <button
                            onClick={() => navigate("/cart")}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-95 shadow-md shadow-red-500/10 transition active:scale-95 mb-3"
                        >
                            Back to Cart
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-750 transition"
                        >
                            Go Home
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
