import React, { useState } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { useCart } from "../../contexts/Cartcontext";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, Smartphone, Banknote, ShieldCheck } from "lucide-react";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const { clearCart, placeOrderFromCart, buyNow, getTotalItems, getTotalPrice } = useCart();

  const savedAddress = JSON.parse(localStorage.getItem("userAddress")) || {};

  const [address] = useState({
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
          background: "#1e293b",
          color: "#f87171",
          fontWeight: "bold",
        },
      });
      return;
    }

    let mappedMethod = "Cards";
    if (paymentMethod === "upi") mappedMethod = "UPI";
    else if (paymentMethod === "cod") mappedMethod = "CashOnDelivery";

    let success = false;
    if (location.state && location.state.buyNowProduct) {
      success = await buyNow(location.state.buyNowProduct.id, {
        addressId: savedAddress.id,
        quantity: location.state.buyNowQuantity || 1,
        paymentMethod: mappedMethod
      });
    } else {
      success = await placeOrderFromCart({
        addressId: savedAddress.id,
        paymentMethod: mappedMethod
      });
    }

    if (!success) {
      return;
    }

    clearCart();
    navigate("/payment-success", { state: { method: paymentMethod } });
  };

  let totalPrice = 0;
  let totalItems = 0;

  if (location.state && location.state.buyNowProduct) {
    const qty = location.state.buyNowQuantity || 1;
    totalPrice = location.state.buyNowProduct.price * qty;
    totalItems = qty;
  } else {
    totalPrice = getTotalPrice();
    totalItems = getTotalItems();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 text-left">
      <Navbar />

      <main className="flex-grow py-24 px-4 text-left">
        <div className="max-w-6xl mx-auto text-left">
          <h1 className="text-3xl font-black mb-8 font-title uppercase tracking-wide text-slate-850 dark:text-white">
            Checkout Process
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">

            {/* Left Column: Form & Address */}
            <div className="lg:col-span-2 space-y-8 text-left">
              <form id="payment-form" onSubmit={handlePayment} className="space-y-8 text-left">

                {/* Section 1: Address */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
                  <h2 className="text-base font-bold uppercase tracking-wider mb-4 text-[#ff512f] border-b border-slate-100 dark:border-slate-800 pb-2 text-left">
                    1. Delivery Address
                  </h2>

                  {address.fullName ? (
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-850 text-left">
                      <div className="flex justify-between items-start gap-4">
                        <div className="text-left">
                          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">{address.fullName}</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5">{address.street}, {address.city}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">{address.state}, {address.zip}, {address.country}</p>
                          <p className="text-slate-700 dark:text-slate-350 text-xs font-bold mt-2">Phone: {address.phone}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate('/cart/address')}
                          className="text-[#ff512f] text-xs font-bold uppercase tracking-wider hover:underline"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-500/10 border border-red-550/20 p-6 rounded-xl text-center">
                      <p className="text-red-500 dark:text-red-400 text-sm font-bold uppercase tracking-wide mb-3">You haven't selected a delivery address.</p>
                      <button
                        type="button"
                        onClick={() => navigate('/cart/address')}
                        className="px-6 py-2 rounded-xl text-white font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#ff512f] to-[#dd2476]"
                      >
                        Select Address
                      </button>
                    </div>
                  )}
                </div>

                {/* Section 2: Payment Method */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
                  <h2 className="text-base font-bold uppercase tracking-wider mb-4 text-[#ff512f] border-b border-slate-100 dark:border-slate-800 pb-2 text-left">
                    2. Payment Method
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    {/* Card Option */}
                    <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${paymentMethod === 'card' ? 'border-[#ff512f] bg-[#ff512f]/5 shadow-sm transform -translate-y-0.5' : 'border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950/40 hover:border-slate-350 dark:hover:border-slate-700'}`}>
                      <input type="radio" className="hidden" name="method" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
                      <div className={`p-2.5 rounded-full transition-colors ${paymentMethod === 'card' ? 'bg-[#ff512f] text-white' : 'bg-slate-200 dark:bg-slate-805 text-[#ff512f]'}`}>
                        <CreditCard size={18} />
                      </div>
                      <span className="font-bold text-center text-xs uppercase tracking-wider text-slate-700 dark:text-gray-250">Credit / Debit</span>
                    </label>

                    {/* UPI Option */}
                    <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${paymentMethod === 'upi' ? 'border-[#ff512f] bg-[#ff512f]/5 shadow-sm transform -translate-y-0.5' : 'border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950/40 hover:border-slate-350 dark:hover:border-slate-700'}`}>
                      <input type="radio" className="hidden" name="method" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} />
                      <div className={`p-2.5 rounded-full transition-colors ${paymentMethod === 'upi' ? 'bg-[#ff512f] text-white' : 'bg-slate-200 dark:bg-slate-805 text-[#ff512f]'}`}>
                        <Smartphone size={18} />
                      </div>
                      <span className="font-bold text-center text-xs uppercase tracking-wider text-slate-700 dark:text-gray-250">UPI App</span>
                    </label>

                    {/* COD Option */}
                    <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${paymentMethod === 'cod' ? 'border-[#ff512f] bg-[#ff512f]/5 shadow-sm transform -translate-y-0.5' : 'border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950/40 hover:border-slate-350 dark:hover:border-slate-700'}`}>
                      <input type="radio" className="hidden" name="method" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                      <div className={`p-2.5 rounded-full transition-colors ${paymentMethod === 'cod' ? 'bg-[#ff512f] text-white' : 'bg-slate-200 dark:bg-slate-805 text-[#ff512f]'}`}>
                        <Banknote size={18} />
                      </div>
                      <span className="font-bold text-center text-xs uppercase tracking-wider text-slate-700 dark:text-gray-250">Cash on Delivery</span>
                    </label>
                  </div>

                  {/* Dynamic Sub-forms */}
                  <div className="mt-6 text-left">
                    {paymentMethod === "card" && (
                      <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 space-y-4 text-left">
                        <input
                          type="text"
                          placeholder="Cardholder Name"
                          className="w-full p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff512f]/45 text-sm font-semibold"
                          required
                        />
                        <div className="relative">
                          <CreditCard size={18} className="absolute left-3 top-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Card Number"
                            className="w-full p-3 pl-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-855 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff512f]/45 text-sm font-semibold"
                            required
                          />
                        </div>
                        <div className="flex gap-4">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-1/2 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-855 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff512f]/45 text-sm font-semibold"
                            required
                          />
                          <input
                            type="text"
                            placeholder="CVV"
                            className="w-1/2 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-855 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff512f]/45 text-sm font-semibold"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === "upi" && (
                      <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-left">
                        <label className="block text-slate-500 dark:text-slate-400 mb-2 text-xs font-bold uppercase tracking-wider">Enter your Virtual Payment Address (VPA)</label>
                        <input
                          type="text"
                          placeholder="e.g. username@bank"
                          className="w-full p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-855 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff512f]/45 text-sm font-semibold"
                          required
                        />
                      </div>
                    )}

                    {paymentMethod === "cod" && (
                      <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 flex items-start gap-3 text-left">
                        <ShieldCheck className="text-green-55 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-slate-800 dark:text-slate-200 font-bold text-sm uppercase tracking-wide">Pay on Delivery</p>
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1 leading-relaxed">Please keep exact change ready. You can pay via Cash or UPI at your doorstep.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1 text-left">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24 text-left">
                <h3 className="text-lg font-black font-title uppercase tracking-wide mb-4 text-slate-800 dark:text-white">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-550 dark:text-slate-400 text-sm font-semibold">
                    <span>Items ({totalItems})</span>
                    <span>₹{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-550 dark:text-slate-400 text-sm font-semibold">
                    <span>Delivery Charges</span>
                    <span className="text-green-550 dark:text-green-400 font-black">FREE</span>
                  </div>
                  <hr className="border-slate-200 dark:border-slate-800" />
                  <div className="flex justify-between text-base font-bold text-slate-800 dark:text-white">
                    <span>Total Payable</span>
                    <span className="text-[#ff512f] font-black font-title">₹{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="payment-form"
                  disabled={!address.fullName || totalItems === 0}
                  className="w-full bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-95 transition shadow-md shadow-orange-500/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentMethod === 'cod' ? 'Proceed to Order' : `Pay ₹${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                </button>

                <p className="text-center text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-4 flex items-center justify-center gap-1">
                  <ShieldCheck size={14} className="text-[#ff512f]" /> Safe and Secure Payments
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
