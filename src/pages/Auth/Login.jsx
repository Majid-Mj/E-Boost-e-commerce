// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useCart } from "../../contexts/Cartcontext";

// export default function Login() {
//   const navigate = useNavigate();
//   const { refreshUserFromLocalStorage } = useCart();

//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleBlur = (e) => {
//     setTouched((prev) => ({ ...prev, [e.target.name]: true }));
//   };

//   const validate = () => {
//     const newErrors = {};
//     const { email, password } = formData;

//     if (!email) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";

//     if (!password) newErrors.password = "Password is required";
//     else if (password.length < 6)
//       newErrors.password = "Minimum 6 characters required";

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     setErrors(validationErrors);
//     if (Object.keys(validationErrors).length > 0) return;

//     setLoading(true);
//     try {
//       // Check if admin
//       const adminRes = await axios.get(
//         `http://localhost:4444/admin?email=${formData.email}&password=${formData.password}`
//       );

//       if (adminRes.data.length > 0) {
//         const admin = adminRes.data[0];
//         localStorage.setItem("isLoggedIn", "true");
//         localStorage.setItem("userRole", "admin");
//         localStorage.setItem("loggedInUser", JSON.stringify(admin));

//         toast.success("Welcome Admin!", {
//           position: "top-center",
//           style: {
//             background: "#1f1b2e",
//             color: "#4ade80",
//             fontWeight: "bold",
//             borderRadius: "10px",
//             padding: "12px 20px",
//           },
//         });

//         navigate("/admin");
//         return;
//       }

//       //  checking if user
//       const userRes = await axios.get(
//         `http://localhost:4444/users?email=${formData.email}&password=${formData.password}`
//       );

//       if (userRes.data.length > 0) {
//         const user = userRes.data[0];

//         //Blocked user check
//         if (user.isBlocked) {
//           toast.error("Your account has been blocked by the admin.", {
//             position: "top-center",
//             style: {
//               background: "#1f1b2e",
//               color: "#ff6666",
//               fontWeight: "bold",
//               borderRadius: "10px",
//               padding: "12px 20px",
//             },
//           });
//           setLoading(false);
//           return; 
//         }

//         //Allow login if not blocked
//         localStorage.setItem("isLoggedIn", "true");
//         localStorage.setItem("userRole", "user");
//         localStorage.setItem("loggedInUser", JSON.stringify(user));
//         refreshUserFromLocalStorage?.();

//         toast.success("Login successful!", {
//           position: "top-center",
//           style: {
//             background: "#1f1b2e",
//             color: "#4ade80",
//             fontWeight: "bold",
//             borderRadius: "10px",
//             padding: "12px 20px",
//           },
//         });

//         navigate("/home");
//       } else {
//         toast.error("Invalid credentials!", {
//           position: "top-center",
//           style: {
//             background: "#1f1b2e",
//             color: "#ff6666",
//             fontWeight: "bold",
//             borderRadius: "10px",
//             padding: "12px 20px",
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error("Login failed. Try again later.", {
//         position: "top-center",
//         style: {
//           background: "#1f1b2e",
//           color: "#ff6666",
//           fontWeight: "bold",
//           borderRadius: "10px",
//           padding: "12px 20px",
//         },
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#111827] to-[#0a0a0a] text-white">
//       <div className="bg-[#1e293b] p-8 rounded-xl shadow-md w-[90%] max-w-md border border-gray-700">
//         <h2 className="text-3xl font-semibold mb-6 text-center text-cyan-400">
//           Welcome Back
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Email */}
//           <div>
//             <label className="block mb-1 text-gray-300">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onBlur={handleBlur}
//               onChange={handleChange}
//               className="w-full p-3 rounded-lg bg-[#0f172a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
//             />
//             {touched.email && errors.email && (
//               <p className="text-red-400 text-sm mt-1">{errors.email}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block mb-1 text-gray-300">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onBlur={handleBlur}
//               onChange={handleChange}
//               className="w-full p-3 rounded-lg bg-[#0f172a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
//             />
//             {touched.password && errors.password && (
//               <p className="text-red-400 text-sm mt-1">{errors.password}</p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-cyan-500 hover:bg-cyan-400 text-black transition duration-300 p-3 rounded-lg font-semibold"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="text-center mt-5 text-gray-400">
//           <span
//             onClick={() => navigate("/forgot-password")}
//             className="text-cyan-400 hover:underline cursor-pointer block mb-2"
//           >
           
//           </span>
//           Don’t have an account?{" "}
//           <span
//             onClick={() => navigate("/signup")}
//             className="text-cyan-400 hover:underline cursor-pointer"
//           >
//             Sign up
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }




import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
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

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      await api.post("/auth/login", {
        email: formData.email,
        password: formData.password
      });

  
      const meRes = await api.get("/auth/me");
      const user = meRes.data.data;

      setUser(user);

      toast.success("Login successful!");

      // Role-based redirect
      if (user.roleId === 2 || user.roleId === "2") {
        navigate("/admin");
      } else {
        navigate("/home");
      }

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#111827] to-[#0a0a0a] text-white">
      <div className="bg-[#1e293b] p-8 rounded-xl shadow-md w-[90%] max-w-md border border-gray-700">
        <h2 className="text-3xl font-semibold mb-6 text-center text-cyan-400">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onBlur={handleBlur}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#0f172a] text-white border border-gray-600 focus:ring-2 focus:ring-cyan-400"
            />
            {touched.email && errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onBlur={handleBlur}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#0f172a] text-white border border-gray-600 focus:ring-2 focus:ring-cyan-400"
            />
            {touched.password && errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black p-3 rounded-lg font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-5 text-gray-400">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}