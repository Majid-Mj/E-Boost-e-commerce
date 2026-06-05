import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName)
      newErrors.fullName = "Name is required";

    if (!formData.email)
      newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";

    if (!formData.password)
      newErrors.password = "Password is required";
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(formData.password)
    )
      newErrors.password =
        "Password must contain uppercase, lowercase, number and special character (min 8 chars)";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        await api.post("/auth/register", {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });

        toast.success("Signup successful!");
        navigate("/login");

      } catch (error) {
        toast.error(
          error.response?.data?.message || "Signup failed"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 px-4 text-left">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm w-[90%] max-w-md border border-slate-200 dark:border-slate-800 text-left">
        <h2 className="text-2xl font-black mb-6 text-center font-title uppercase tracking-wide bg-gradient-to-r from-[#ff512f] to-[#dd2476] bg-clip-text text-transparent">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="block mb-1.5 text-slate-650 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onBlur={handleBlur}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-855 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 transition text-sm font-semibold"
            />
            {touched.fullName && errors.fullName && (
              <p className="text-red-500 text-xs mt-1.5 font-bold uppercase tracking-wider">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block mb-1.5 text-slate-650 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onBlur={handleBlur}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-855 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 transition text-sm font-semibold"
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-xs mt-1.5 font-bold uppercase tracking-wider">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-1.5 text-slate-650 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onBlur={handleBlur}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-855 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 transition text-sm font-semibold"
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-xs mt-1.5 font-bold uppercase tracking-wider leading-relaxed">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block mb-1.5 text-slate-650 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onBlur={handleBlur}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-855 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 transition text-sm font-semibold"
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5 font-bold uppercase tracking-wider">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white transition duration-300 p-3.5 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md shadow-orange-500/10 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-slate-550 dark:text-slate-400 font-bold uppercase tracking-wider">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#ff512f] hover:underline cursor-pointer transition-colors"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}