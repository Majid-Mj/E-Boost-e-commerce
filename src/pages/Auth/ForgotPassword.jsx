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
      }, 1500); // Small delay to let user see success toast
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#111827] to-[#0a0a0a] text-white">
      <div className="bg-[#1e293b] p-8 rounded-xl shadow-md w-[90%] max-w-md border border-gray-700">
        <h2 className="text-3xl font-semibold mb-6 text-center text-cyan-400">
          Forgot Password?
        </h2>

        <form onSubmit={sendResetLink} className="space-y-5">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black p-3 rounded-lg font-semibold transition duration-300 disabled:opacity-50"
          >
            {loading ? "Sending Link..." : "Send Reset Link"}
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
