import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { FaUser, FaEnvelope, FaUserTag, FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";

export default function User() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      user &&
      (
        user.roleId == 2 ||
        user.role === "admin" ||
        user.isAdmin === true
      )
    ) {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h2 className="text-3xl font-black mb-4 font-title uppercase tracking-wide bg-gradient-to-r from-[#ff512f] to-[#dd2476] bg-clip-text text-transparent">
              Access Denied
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium text-sm">
              Please log in to view your profile.
            </p>
            <Link
              to="/login"
              className="px-6 py-3 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white rounded-xl font-bold uppercase tracking-wider text-xs transition shadow-md shadow-orange-500/10 hover:opacity-95"
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col">
      <Navbar />
      <div className="pt-28 pb-10 flex-grow flex flex-col items-center justify-center">
        <div className="bg-white dark:bg-slate-900 w-[95%] max-w-md rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-full p-5">
              <FaUser className="text-slate-400 dark:text-slate-500 text-4xl" />
            </div>
          </div>

          <h2 className="text-2xl font-black font-title uppercase tracking-wide text-slate-800 dark:text-white mb-1">
            Welcome, <span className="text-[#ff512f]">{user.fullName || "User"}</span>
          </h2>
          <p className="text-slate-450 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-6">Manage your account details</p>

          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-850 font-semibold text-sm">
              <FaUser className="text-orange-400" />
              <p><span className="text-slate-450 dark:text-slate-500">Name:</span> {user.fullName || "N/A"}</p>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-850 font-semibold text-sm">
              <FaEnvelope className="text-amber-400" />
              <p><span className="text-slate-450 dark:text-slate-500">Email:</span> {user.email || "N/A"}</p>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-850 font-semibold text-sm">
              <FaUserTag className="text-rose-450" />
              <p>
                <span className="text-slate-450 dark:text-slate-500">Role:</span>{" "}
                {user.roleId === 2 ? "Admin" : "User"}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {user.roleId === 1 && (
              <Link to="/orders">
                <button className="w-full bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition shadow-md shadow-orange-500/10 hover:opacity-95">
                  View Orders
                </button>
              </Link>
            )}

            <button
              onClick={async () => {
                await logout();
                navigate("/", { replace: true });
              }}
              className="w-full bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-750"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}