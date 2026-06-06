import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import api from "../../config/api";
import { AuthContext } from "../../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const handleBlur = (e) => {
    setTouched(prev => ({
      ...prev,
      [e.target.name]: true
    }));
  };

  const validate = () => {
    const newErrors = {};
    const { email, password } = formData;

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Minimum 6 characters required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({
      email: true,
      password: true
    });

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      const loginRes = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password
      });

      if (loginRes.data?.accessToken) {
        sessionStorage.setItem("token", loginRes.data.accessToken);
        localStorage.setItem("token", loginRes.data.accessToken);
      }
      if (loginRes.data?.refreshToken) {
        sessionStorage.setItem("refreshToken", loginRes.data.refreshToken);
        localStorage.setItem("refreshToken", loginRes.data.refreshToken);
      }

      const meRes = await api.get("/auth/me");
      console.log("Auth /me response:", meRes.data);

      let user = meRes.data.data || meRes.data.user || meRes.data;

      if (user) {
        if (user.roleId != null) {
          user.roleId = Number(user.roleId);
        } else if (Array.isArray(user.roles)) {
          if (user.roles.includes("Admin") || user.roles.includes("admin")) {
            user.roleId = 2;
          }
        } else if (user.role || user.roleName) {
          const r = (user.role || user.roleName).toString().toLowerCase();
          if (r === "admin" || r === "administrator") {
            user.roleId = 2;
          }
        } else if (user.isAdmin === true) {
          user.roleId = 2;
        }

        if (user.roleId == null || isNaN(Number(user.roleId))) {
          user.roleId = 1;
        }
      }

      console.log("User after normalisation:", user);
      setUser(user);
      toast.success("Login successful!");

      if (
        user.roleId === 2 ||
        user.role === "admin" ||
        user.isAdmin === true ||
        (Array.isArray(user.roles) && user.roles.includes("admin"))
      ) {
        navigate("/admin");
      } else {
        navigate("/home");
      }

    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Invalid email or password";
      toast.error(errorMessage);
      
      setFormData(prev => ({
        ...prev,
        password: ""
      }));
      
      setErrors({
        password: errorMessage
      });
      
      setTouched({
        email: true,
        password: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 px-4 text-left">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm w-[90%] max-w-md border border-slate-200 dark:border-slate-800 text-left">
        <h2 className="text-2xl font-black mb-6 text-center font-title uppercase tracking-wide bg-gradient-to-r from-[#ff512f] to-[#dd2476] bg-clip-text text-transparent">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">

          {/* Email */}
          <div>
            <label className="block mb-1.5 text-slate-650 dark:text-slate-400 text-xs font-bold uppercase tracking-wider text-left">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onBlur={handleBlur}
              onChange={handleChange}
              autoComplete="email"
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-855 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-[#ff512f]/40 outline-none text-sm font-semibold"
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-xs mt-1.5 font-bold uppercase tracking-wider">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-slate-650 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onBlur={handleBlur}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full p-3.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-855 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-[#ff512f]/40 outline-none text-sm font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {touched.password && errors.password ? (
              <p className="text-red-500 text-xs mt-1.5 font-bold uppercase tracking-wider">
                {errors.password}
              </p>
            ) : null}
            <div className="flex justify-end mt-2.5">
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-xs font-bold uppercase tracking-wider text-[#ff512f] hover:underline cursor-pointer transition-colors"
              >
                Forgot Password?
              </span>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white p-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition duration-300 shadow-md shadow-orange-500/10 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-slate-550 dark:text-slate-400 font-bold uppercase tracking-wider">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#ff512f] hover:underline cursor-pointer transition-colors"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}