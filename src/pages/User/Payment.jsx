import React, { useState } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { useCart } from "../../contexts/Cartcontext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CreditCard, Smartphone, Banknote, ShieldCheck } from "lucide-react";


export default function Payment() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const { cart, clearCart, placeOrder, getTotalItems, getTotalPrice } = useCart();


  const savedAddress = JSON.parse(localStorage.getItem("userAddress")) || {};

  const [address, setAddress] = useState({
    fullName: savedAddress.fullName || savedAddress.name || "",
    phone: savedAddress.phoneNumber || savedAddress.phone || "",
    street: savedAddress.street || "",
    city: savedAddress.city || "",
    state: savedAddress.state || "",
    zip: savedAddress.postalCode || savedAddress.pincode || "",
    country: savedAddress.country || "",
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
        },
      });
      return;
    }

    // Save to database via API
    const success = await placeOrder({ address });
    if (!success) {
      return;
    }

    toast.success("Payment Successful!", {
      position: "bottom-left",
      style: {
        background: "#1f1b2e",
        color: "#00FFFF",
        fontWeight: "bold",
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

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Navbar />

      <main className="flex-grow py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold mb-8 text-[#00FFFF]">
            Checkout Process
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Form & Address */}
            <div className="lg:col-span-2 space-y-8">
              <form id="payment-form" onSubmit={handlePayment} className="space-y-8">

                {/* Section 1: Address */}
                <div className="bg-[#1f1b2e] p-6 rounded-2xl border border-gray-800 shadow-lg">
                  <h2 className="text-lg font-medium mb-4 text-[#00FFFF] border-b border-gray-700 pb-2">
                    1. Delivery Address
                  </h2>

                  {address.fullName ? (
                    <div className="bg-[#2a243a] p-4 rounded-xl border border-gray-600">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-white">{address.fullName}</h3>
                          <p className="text-gray-400 mt-1">{address.street}, {address.city}</p>
                          <p className="text-gray-400">{address.state}, {address.zip}, {address.country}</p>
                          <p className="text-gray-400 mt-2 font-medium">Phone: {address.phone}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate('/cart/address')}
                          className="text-[#00FFFF] text-sm hover:underline"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-xl text-center">
                      <p className="text-red-400 font-medium mb-3">You haven't selected a delivery address.</p>
                      <button
                        type="button"
                        onClick={() => navigate('/cart/address')}
                        className="bg-[#00FFFF] text-black px-6 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition"
                      >
                        Select Address
                      </button>
                    </div>
                  )}
                </div>

                {/* Section 2: Payment Method */}
                <div className="bg-[#1f1b2e] p-6 rounded-2xl border border-gray-800 shadow-lg">
                  <h2 className="text-lg font-medium mb-4 text-[#00FFFF] border-b border-gray-700 pb-2">
                    2. Payment Method
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card Option */}
                    <label className={`cursor-pointer border-2 rounded-xl p-5 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${paymentMethod === 'card' ? 'border-[#00FFFF] bg-[#2a243a] shadow-[0_0_15px_rgba(0,255,255,0.2)] transform -translate-y-1' : 'border-gray-700 bg-[#211c30] hover:border-gray-500 hover:bg-[#2a243a]/50'}`}>
                      <input type="radio" className="hidden" name="method" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
                      <div className={`p-4 rounded-full transition-colors ${paymentMethod === 'card' ? 'bg-[#00FFFF] text-black' : 'bg-[#352f44] text-[#00FFFF]'}`}>
                        <CreditCard size={28} />
                      </div>
                      <span className="font-medium text-center text-gray-200">Credit / Debit</span>
                    </label>

                    {/* UPI Option */}
                    <label className={`cursor-pointer border-2 rounded-xl p-5 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${paymentMethod === 'upi' ? 'border-[#00FFFF] bg-[#2a243a] shadow-[0_0_15px_rgba(0,255,255,0.2)] transform -translate-y-1' : 'border-gray-700 bg-[#211c30] hover:border-gray-500 hover:bg-[#2a243a]/50'}`}>
                      <input type="radio" className="hidden" name="method" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} />
                      <div className={`p-4 rounded-full transition-colors ${paymentMethod === 'upi' ? 'bg-[#00FFFF] text-black' : 'bg-[#352f44] text-[#00FFFF]'}`}>
                        <Smartphone size={28} />
                      </div>
                      <span className="font-medium text-center text-gray-200">UPI App</span>
                    </label>

                    {/* COD Option */}
                    <label className={`cursor-pointer border-2 rounded-xl p-5 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${paymentMethod === 'cod' ? 'border-[#00FFFF] bg-[#2a243a] shadow-[0_0_15px_rgba(0,255,255,0.2)] transform -translate-y-1' : 'border-gray-700 bg-[#211c30] hover:border-gray-500 hover:bg-[#2a243a]/50'}`}>
                      <input type="radio" className="hidden" name="method" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                      <div className={`p-4 rounded-full transition-colors ${paymentMethod === 'cod' ? 'bg-[#00FFFF] text-black' : 'bg-[#352f44] text-[#00FFFF]'}`}>
                        <Banknote size={28} />
                      </div>
                      <span className="font-medium text-center text-gray-200">Cash on Delivery</span>
                    </label>
                  </div>

                  {/* Dynamic Sub-forms */}
                  <div className="mt-6">
                    {paymentMethod === "card" && (
                      <div className="p-5 rounded-xl bg-gray-900/50 border border-gray-700 space-y-4">
                        <input
                          type="text"
                          placeholder="Cardholder Name"
                          className="w-full p-3 rounded-lg bg-[#2a243a] border border-gray-600 text-white focus:outline-none focus:border-[#00FFFF]"
                          required
                        />
                        <div className="relative">
                          <CreditCard size={20} className="absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Card Number"
                            className="w-full p-3 pl-10 rounded-lg bg-[#2a243a] border border-gray-600 text-white focus:outline-none focus:border-[#00FFFF]"
                            required
                          />
                        </div>
                        <div className="flex gap-4">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-1/2 p-3 rounded-lg bg-[#2a243a] border border-gray-600 text-white focus:outline-none focus:border-[#00FFFF]"
                            required
                          />
                          <input
                            type="text"
                            placeholder="CVV"
                            className="w-1/2 p-3 rounded-lg bg-[#2a243a] border border-gray-600 text-white focus:outline-none focus:border-[#00FFFF]"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === "upi" && (
                      <div className="p-5 rounded-xl bg-gray-900/50 border border-gray-700">
                        <label className="block text-gray-400 mb-2 text-sm">Enter your Virtual Payment Address (VPA)</label>
                        <input
                          type="text"
                          placeholder="e.g. username@bank"
                          className="w-full p-3 rounded-lg bg-[#2a243a] border border-gray-600 text-white focus:outline-none focus:border-[#00FFFF]"
                          required
                        />
                      </div>
                    )}

                    {paymentMethod === "cod" && (
                      <div className="p-5 rounded-xl bg-gray-900/50 border border-gray-700 flex items-start gap-3">
                        <ShieldCheck className="text-green-400 shrink-0 mt-1" />
                        <div>
                          <p className="text-gray-200 font-medium">Pay on Delivery</p>
                          <p className="text-gray-400 text-sm mt-1">Please keep exact change ready. You can pay via Cash or UPI at your doorstep.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>


            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#1f1b2e] p-6 rounded-2xl border border-gray-800 shadow-lg sticky top-24">
                <h3 className="text-lg font-semibold mb-4 text-white">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Items ({totalItems})</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Delivery Charges</span>
                    <span className="text-green-400">FREE</span>
                  </div>
                  <hr className="border-gray-700" />
                  <div className="flex justify-between text-lg font-semibold text-white">
                    <span>Total Payable</span>
                    <span className="text-[#00FFFF]">₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="payment-form" // Triggers the form in the other column
                  disabled={!address.fullName || totalItems === 0}
                  className="w-full bg-[#00FFFF] text-black py-4 rounded-xl font-bold text-lg hover:bg-cyan-400 transition shadow-[0_4px_14px_rgba(0,255,255,0.25)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay ₹{totalPrice.toFixed(2)}
                </button>

                <p className="text-center text-gray-500 text-xs mt-4 flex items-center justify-center gap-1">
                  <ShieldCheck size={14} /> Safe and Secure Payments
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
