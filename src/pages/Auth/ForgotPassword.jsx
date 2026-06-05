import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendResetLink = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Enter a valid email" });
      return;
    }

    setErrors({});
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("Email", email);

      const res = await api.post("/auth/forgot-password", formData);

      let successMsg = "OTP sent to your email!";
      if (res.data && typeof res.data === 'object' && res.data.message) {
        successMsg = String(res.data.message);
      } else if (typeof res.data === 'string') {
        successMsg = res.data;
      }
      toast.success(successMsg);

      setMessage("An OTP code has been sent to your email.");
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);
    } catch (err) {
      console.error(err);

      let errMsg = "Failed to send reset link";
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
          Forgot Password?
        </h2>

        <form onSubmit={sendResetLink} className="space-y-5 text-left">
          <div>
            <label className="block mb-1.5 text-slate-650 dark:text-slate-400 text-xs font-bold uppercase tracking-wider text-left">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 transition border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} text-sm font-semibold`}
              placeholder="Enter your registered email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-2 font-bold uppercase tracking-wider">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white p-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition duration-300 disabled:opacity-50 shadow-md shadow-orange-500/10 active:scale-95"
          >
            {loading ? "Sending OTP..." : "Send Reset OTP"}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 rounded-xl bg-[#ff512f]/5 border border-[#ff512f]/20 text-center text-xs font-bold uppercase tracking-wider text-[#ff512f]">
            {message}
          </div>
        )}

        <p className="text-center mt-6 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
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
