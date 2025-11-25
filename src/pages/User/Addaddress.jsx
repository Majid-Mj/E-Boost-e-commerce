import React, { useState } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { useNavigate } from "react-router-dom";

export default function AddressPage() {
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!address.name || !address.phone || !address.street || !address.city || !address.state || !address.pincode) {
      alert("Please fill in all required fields.");
      return;
    }

    // Save address temporarily (localStorage or backend API)
    localStorage.setItem("userAddress", JSON.stringify(address));

    alert("Address saved successfully!");
    navigate("/payment"); // Navigate to payment page
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Navbar />

      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-[#1f1b2e] w-full max-w-lg rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6 text-[#00FFFF]">
            Enter Shipping Address
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={address.name}
                onChange={handleChange}
                required
                className="w-full bg-[#2a243a] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00FFFF] text-white"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-300 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={address.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                placeholder="Enter 10-digit phone number"
                className="w-full bg-[#2a243a] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00FFFF] text-white"
              />
            </div>

            {/* Street */}
            <div>
              <label className="block text-gray-300 mb-1">Street Address</label>
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleChange}
                required
                className="w-full bg-[#2a243a] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00FFFF] text-white"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-gray-300 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                required
                className="w-full bg-[#2a243a] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00FFFF] text-white"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-gray-300 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleChange}
                required
                className="w-full bg-[#2a243a] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00FFFF] text-white"
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-gray-300 mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                required
                pattern="[0-9]{6}"
                placeholder="Enter 6-digit pincode"
                className="w-full bg-[#2a243a] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00FFFF] text-white"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#00FFFF] text-black py-3 rounded-lg font-semibold hover:bg-cyan-400 transition mt-4"
            >
              Save & Continue
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
