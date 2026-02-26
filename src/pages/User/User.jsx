import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { FaUser, FaEnvelope, FaUserTag, FaLock, FaSignOutAlt } from "react-icons/fa";
import ChangePasswordModal from "../../Components/ChangePassword";
import { AuthContext } from "../../contexts/AuthContext";

export default function User() {
  const { user, logout } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && (user.roleId == 2 || user.role === "admin")) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

    console.log(user)
    
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#00FFFF] mb-4">
              Access Denied
            </h2>
            <p className="text-gray-300 mb-6">
              Please log in to view your profile.
            </p>
            <Link
              to="/login"
              className="bg-[#00FFFF] text-black px-6 py-3 rounded-md font-semibold hover:bg-cyan-400 transition"
            >
              Login
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Navbar />
      <div className="pt-20 pb-10 flex flex-col items-center justify-center">
        <div className="bg-[#1f1b2e]/90 backdrop-blur-md w-[90%] max-w-md rounded-2xl p-8 shadow-xl text-center border border-gray-800">
          <div className="flex justify-center mb-4">
            <div className="bg-[#2a243a] rounded-full p-5">
              <FaUser className="text-gray-400 text-4xl" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-1">
            Welcome, <span className="text-[#00FFFF]">{user.fullName || "User"}</span>
          </h2>
          <p className="text-gray-400 text-sm mb-6">Manage your account details</p>

          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 bg-[#2a243a]/80 p-3 rounded-lg border border-gray-700">
              <FaUser className="text-purple-400" />
              <p><span className="text-gray-400">Name:</span> {user.fullName || "N/A"}</p>
            </div>
            <div className="flex items-center gap-3 bg-[#2a243a]/80 p-3 rounded-lg border border-gray-700">
              <FaEnvelope className="text-yellow-400" />
              <p><span className="text-gray-400">Email:</span> {user.email || "N/A"}</p>
            </div>
            <div className="flex items-center gap-3 bg-[#2a243a]/80 p-3 rounded-lg border border-gray-700">
              <FaUserTag className="text-green-400" />
              <p>
                <span className="text-gray-400">Role:</span>{" "}
                {user.roleId === 2 ? "Admin" : "User"}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-[#333041]/80 hover:bg-[#413b55] transition p-3 rounded-lg flex items-center justify-center gap-2 text-sm border border-gray-700"
            >
              <FaLock /> Change Password
            </button>

            {user.roleId === 1 && (
              <Link to="/orders">
                <button className="w-full bg-[#00FFFF] hover:bg-cyan-400 transition p-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-black">
                  View Orders
                </button>
              </Link>
            )}

            <button
              onClick={async () => {
                await logout();
                navigate("/", { replace: true });
              }}
              className="w-full bg-[#333041]/80 hover:bg-[#413b55] transition p-3 rounded-lg flex items-center justify-center gap-3 border border-gray-700 mt-4"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <ChangePasswordModal
          user={user}
          onClose={() => setShowModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}