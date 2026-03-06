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

            // Safely extract string message, aggressively converting to string to prevent React child object error
            let successMsg = "Password reset successful!";
            if (res.data && typeof res.data === 'object' && res.data.message) {
                successMsg = String(res.data.message);
            } else if (typeof res.data === 'string') {
                successMsg = res.data;
            }

            toast.success(successMsg);

            // Send user back to login after short delay
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            console.error(err);

            // Safely extract string error message
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#111827] to-[#0a0a0a] text-white">
            <div className="bg-[#1e293b] p-8 rounded-xl shadow-md w-[90%] max-w-md border border-gray-700">
                <h2 className="text-3xl font-semibold mb-6 text-center text-cyan-400">
                    Reset Password
                </h2>

                <form onSubmit={resetPassword} className="space-y-5 animate-in fade-in duration-300">
                    <div>
                        <label className="block mb-1 text-gray-300 font-medium">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full p-3 rounded-lg bg-[#0f172a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all border ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
                            placeholder="Enter your registered email"
                        />
                        {errors.email && (
                            <p className="text-red-400 text-xs mt-2 font-medium">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-300 font-medium">6-Digit OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className={`w-full p-3 rounded-lg tracking-widest text-center text-lg font-bold bg-[#0f172a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all border ${errors.otp ? 'border-red-500' : 'border-gray-600'}`}
                            placeholder="000000"
                        />
                        {errors.otp && (
                            <p className="text-red-400 text-xs mt-2 font-medium text-center">{errors.otp}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-300 font-medium">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`w-full p-3 rounded-lg bg-[#0f172a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all border ${errors.newPassword ? 'border-red-500' : 'border-gray-600'}`}
                            placeholder="Enter strong new password"
                        />
                        {errors.newPassword && (
                            <p className="text-red-400 text-xs mt-2 font-medium">{errors.newPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black p-3 rounded-lg font-semibold transition duration-300 disabled:opacity-50"
                    >
                        {loading ? "Resetting Password..." : "Reset Password"}
                    </button>
                </form>

                {message && (
                    <div className="mt-6 p-4 rounded-xl bg-cyan-900/20 border border-cyan-500/20 text-center text-sm font-medium text-cyan-400">
                        {message}
                    </div>
                )}

                <p className="text-center mt-6 text-gray-400">
                    Remember your password?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer transition-colors"
                    >
                        Back to Login
                    </span>
                </p>
            </div>
        </div>
    );
}
