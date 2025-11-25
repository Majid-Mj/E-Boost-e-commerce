import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleBlur = () => {
    setTouched({ email: true });
  };

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Enter a valid email";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      setMessage("");

      setTimeout(() => {
        setMessage(
          "If an account with that email exists, a password reset link has been sent."
        );
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#120624] text-white">
      <div className="bg-[#333041]/80 p-8 rounded-2xl shadow-lg w-[90%] max-w-md backdrop-blur-md">
        <h2 className="text-3xl font-semibold mb-6 text-center text-white">
          Forgot Password?
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onBlur={handleBlur}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#413b55] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
              placeholder="Enter your email"
            />
            {touched.email && errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#333041]/80 hover:bg-[#413b55] transition duration-300 p-3 rounded-lg font-semibold"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-green-400">{message}</p>
        )}

        <p className="text-center mt-4 text-gray-400">
          Remember your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#7c3aed] hover:underline cursor-pointer"
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
}
