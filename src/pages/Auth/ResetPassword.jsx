import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../config/api";
import toast from "react-hot-toast";

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Pre-fill email if passed from ForgotPassword
    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location.state]);

    const resetPassword = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";
        if (!otp || otp.length !== 6) newErrors.otp = "OTP must be a 6-digit number";
        if (!newPassword || newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);
        setMessage("");

        try {
            const formData = new FormData();
            formData.append("Email", email);
            formData.append("Otp", otp);
            formData.append("NewPassword", newPassword);

            const res = await api.post("/auth/reset-password", formData);

            let successMsg = "Password reset successful!";
            if (res.data && typeof res.data === 'object' && res.data.message) {
                successMsg = String(res.data.message);
            } else if (typeof res.data === 'string') {
                successMsg = res.data;
            }

            toast.success(successMsg);

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            console.error(err);

            let errMsg = "Failed to reset password";
            if (err.response?.data && typeof err.response.data === 'object' && err.response.data.message) {
                errMsg = String(err.response.data.message);
            } else if (typeof err.response?.data === 'string' && err.response.data.trim() !== '') {
                errMsg = String(err.response.data);
            }

            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 px-4 text-left">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm w-[90%] max-w-md border border-slate-200 dark:border-slate-800 text-left">
                <h2 className="text-2xl font-black mb-6 text-center font-title uppercase tracking-wide bg-gradient-to-r from-[#ff512f] to-[#dd2476] bg-clip-text text-transparent">
                    Reset Password
                </h2>

                <form onSubmit={resetPassword} className="space-y-5 text-left">
                    <div>
                        <label className="block mb-1.5 text-slate-650 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-855 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 transition border ${errors.email ? 'border-red-500' : 'border-slate-250 dark:border-slate-800'} text-sm font-semibold`}
                            placeholder="Enter your registered email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-2 font-bold uppercase tracking-wider">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1.5 text-slate-650 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">6-Digit OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className={`w-full p-3.5 rounded-xl tracking-widest text-center text-lg font-black bg-slate-50 dark:bg-slate-950 text-slate-855 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 transition border ${errors.otp ? 'border-red-500' : 'border-slate-250 dark:border-slate-800'}`}
                            placeholder="000000"
                        />
                        {errors.otp && (
                            <p className="text-red-500 text-xs mt-2 font-bold uppercase tracking-wider text-center">{errors.otp}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1.5 text-slate-650 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-855 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 transition border ${errors.newPassword ? 'border-red-500' : 'border-slate-250 dark:border-slate-800'} text-sm font-semibold`}
                            placeholder="Enter strong new password"
                        />
                        {errors.newPassword && (
                            <p className="text-red-500 text-xs mt-2 font-bold uppercase tracking-wider">{errors.newPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white p-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition duration-300 shadow-md shadow-orange-500/10 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "Resetting Password..." : "Reset Password"}
                    </button>
                </form>

                {message && (
                    <div className="mt-6 p-4 rounded-xl bg-[#ff512f]/5 border border-[#ff512f]/20 text-center text-xs font-bold uppercase tracking-wider text-[#ff512f]">
                        {message}
                    </div>
                )}

                <p className="text-center mt-6 text-xs text-slate-550 dark:text-slate-400 font-bold uppercase tracking-wider">
                    Remember password?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-[#ff512f] hover:underline cursor-pointer transition-colors"
                    >
                        Back to Login
                    </span>
                </p>
            </div>
        </div>
    );
}
