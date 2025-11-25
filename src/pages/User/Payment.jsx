import React, { useState } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { useCart } from "../../contexts/Cartcontext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export default function Payment() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const { cart, clearCart, placeOrder } = useCart();


  const savedAddress = JSON.parse(localStorage.getItem("userAddress")) || {};

  const [address, setAddress] = useState({
    fullName: savedAddress.name || "",
    phone: savedAddress.phone || "",
    street: savedAddress.street || "",
    city: savedAddress.city || "",
    state: savedAddress.state || "",
    zip: savedAddress.pincode || "",
  });

  const handlePayment = async (e) => {
    e.preventDefault();

    if (
      !address.fullName ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zip
    ) {
      toast.error("Please fill all address fields", {
        position: "bottom-left",
        style: {
          background: "#1f1b2e",
          color: "#ff6666",
          fontWeight: "bold",
          borderRadius: "10px",
          padding: "12px 20px",
        },
      });
      return;
    }

    // Save to database via API
    const success = await placeOrder({ address });
    if (!success) {
      return; // Error already handled in placeOrder
    }

  
    toast.success("Payment Successful!", {
      position: "bottom-left",
      style: {
        background: "#1f1b2e",
        color: "#00FFFF",
        fontWeight: "bold",
        borderRadius: "10px",
        padding: "12px 20px",
      },
      iconTheme: {
        primary: "#00FFFF",
        secondary: "#1f1b2e",
      },
    });

    setTimeout(() => {
      clearCart();
      navigate("/orders");
    }, 2000);
  };


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white mt-10">
      <Navbar />

      <main className="flex-grow py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-semibold mb-10 text-[#00FFFF] text-center">
            Payment & Address Details
          </h1>

          <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
            <form onSubmit={handlePayment} className="space-y-6">

              <div>
                <h2 className="text-2xl font-semibold text-[#00FFFF] mb-4">
                  Shipping Address
                </h2>

                {savedAddress.name && (
                  <div className="bg-[#2a243a] p-4 rounded-lg mb-4 border border-gray-600">
                    <h3 className="text-lg font-semibold text-[#00FFFF] mb-2">Delivery Address:</h3>
                    <p className="text-gray-300">
                      {savedAddress.name}, {savedAddress.street}, {savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}
                    </p>
                    <p className="text-gray-300">Phone: {savedAddress.phone}</p>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-[#00FFFF] mb-4">
                  Payment Method
                </h2>

                <div className="flex flex-col gap-3 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="method"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Credit / Debit Card
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="method"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    UPI (Google Pay / PhonePe / Paytm)
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="method"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Cash on Delivery
                  </label>
                </div>

        
                {paymentMethod === "card" && (
                  <div className="space-y-4 mt-4">
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      className="w-full p-3 rounded-lg bg-[#2a243a] text-white focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full p-3 rounded-lg bg-[#2a243a] text-white focus:outline-none"
                      required
                    />
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-1/2 p-3 rounded-lg bg-[#2a243a] text-white focus:outline-none"
                        required
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="w-1/2 p-3 rounded-lg bg-[#2a243a] text-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Enter UPI ID (e.g. name@okaxis)"
                      className="w-full p-3 rounded-lg bg-[#2a243a] text-white focus:outline-none"
                      required
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#00FFFF] text-black py-3 rounded-lg font-semibold hover:bg-cyan-400 transition"
              >
                Pay Now
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
