import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import api from "../../config/api";
import toast from "react-hot-toast";

export default function AddressPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state for new address
  const [addressForm, setAddressForm] = useState({
    FullName: "",
    PhoneNumber: "",
    Street: "",
    City: "",
    State: "",
    PostalCode: "",
    Country: "",
  });

  // Fetch standard addresses
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/UserShippingAddress");
      const fetchedAddresses = res.data?.data || res.data || [];

      setAddresses(fetchedAddresses);

      if (fetchedAddresses && fetchedAddresses.length > 0) {
        const defaultAddr = fetchedAddresses.find(a => a.isDefault);
        setSelectedAddressId(defaultAddr ? defaultAddr.id : fetchedAddresses[0].id);
        setShowAddForm(false);
      } else {
        setShowAddForm(true);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      toast.error("Failed to load addresses.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();

    if (
      !addressForm.FullName ||
      !addressForm.PhoneNumber ||
      !addressForm.Street ||
      !addressForm.City ||
      !addressForm.State ||
      !addressForm.PostalCode ||
      !addressForm.Country
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      if (editAddressId) {
        const updateData = {
          FullName: addressForm.FullName,
          PhoneNumber: addressForm.PhoneNumber,
          Street: addressForm.Street,
          City: addressForm.City,
          State: addressForm.State,
          PostalCode: addressForm.PostalCode,
          Country: addressForm.Country
        };

        await api.put(`/UserShippingAddress/${editAddressId}`, updateData);
        toast.success("Address updated successfully!");
      } else {
        const formData = new FormData();
        formData.append("FullName", addressForm.FullName);
        formData.append("PhoneNumber", addressForm.PhoneNumber);
        formData.append("Street", addressForm.Street);
        formData.append("City", addressForm.City);
        formData.append("State", addressForm.State);
        formData.append("PostalCode", addressForm.PostalCode);
        formData.append("Country", addressForm.Country);
        formData.append("IsDefault", true);

        await api.post("/UserShippingAddress", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Address added successfully!");
      }

      setAddressForm({
        FullName: "",
        PhoneNumber: "",
        Street: "",
        City: "",
        State: "",
        PostalCode: "",
        Country: "",
      });
      setEditAddressId(null);
      await fetchAddresses();
      setShowAddForm(false);
    } catch (err) {
      console.error("Error saving address:", err);
      toast.error("Failed to save address.");
    }
  };

  const handleSetDefault = async (e, id) => {
    e.stopPropagation();
    try {
      await api.put(`/UserShippingAddress/${id}/set-default`);
      toast.success("Default address updated!");
      await fetchAddresses();
    } catch (err) {
      toast.error("Failed to set default address.");
    }
  };

  const handleEditClick = (e, addr) => {
    e.stopPropagation();
    setEditAddressId(addr.id);
    setAddressForm({
      FullName: addr.fullName || "",
      PhoneNumber: addr.phoneNumber || "",
      Street: addr.street || "",
      City: addr.city || "",
      State: addr.state || "",
      PostalCode: addr.postalCode || "",
      Country: addr.country || "",
    });
    setShowAddForm(true);
  };

  const handleProceed = () => {
    if (addresses.length === 0 || !selectedAddressId) {
      toast.error("Please add and select an address to continue.");
      return;
    }

    const selectedAddrObject = addresses.find(a => String(a.id) === String(selectedAddressId));
    sessionStorage.setItem("userAddress", JSON.stringify(selectedAddrObject));

    if (location.state?.buyNowProduct) {
      navigate("/payment", {
        state: {
          buyNowProduct: location.state.buyNowProduct,
          buyNowQuantity: location.state.buyNowQuantity
        }
      });
    } else {
      navigate("/payment");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Navbar />

      <div className="flex-grow flex flex-col items-center justify-center py-24 px-4">
        <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-left">
          <h2 className="text-3xl font-black mb-8 text-center font-title uppercase tracking-wide bg-gradient-to-r from-[#ff512f] to-[#dd2476] bg-clip-text text-transparent">
            Shipping Address
          </h2>

          {loading ? (
            <div className="text-center text-slate-500 dark:text-slate-400 py-4 font-semibold">Loading your addresses...</div>
          ) : (
            <>
              {/* Selectable Address List */}
              {addresses.length > 0 && !showAddForm && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4 gap-2">
                    <label className="text-slate-700 dark:text-slate-350 text-xs font-bold uppercase tracking-wider">Select Saved Address</label>
                    <button
                      type="button"
                      onClick={() => {
                        setEditAddressId(null);
                        setAddressForm({
                          FullName: "",
                          PhoneNumber: "",
                          Street: "",
                          City: "",
                          State: "",
                          PostalCode: "",
                          Country: "",
                        });
                        setShowAddForm(true);
                      }}
                      className="bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white px-4 py-2 rounded-xl hover:opacity-95 transition flex items-center gap-2 font-bold text-xs uppercase tracking-wider"
                    >
                      <Plus size={14} /> Add New
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar text-left">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-xl border-2 transition cursor-pointer relative text-left ${selectedAddressId === addr.id
                          ? "border-[#ff512f] bg-[#ff512f]/5"
                          : "border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 hover:border-slate-350 dark:hover:border-slate-700"
                          }`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 text-left">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">{addr.fullName}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{addr.street}, {addr.city}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{addr.state}, {addr.postalCode}, {addr.country}</p>
                            <p className="text-xs text-slate-650 dark:text-slate-355 font-bold mt-2">Phone: {addr.phoneNumber}</p>
                          </div>
                          <div className="flex flex-col items-end gap-3 h-full justify-between self-stretch min-h-[90px]">
                            {addr.isDefault ? (
                              <span className="bg-green-500/10 text-green-550 dark:text-green-400 text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-lg border border-green-500/20">
                                Default
                              </span>
                            ) : (
                              <button
                                onClick={(e) => handleSetDefault(e, addr.id)}
                                className="text-xs font-bold text-[#ff512f] hover:underline z-10"
                              >
                                Set Default
                              </button>
                            )}
                            <button
                              onClick={(e) => handleEditClick(e, addr)}
                              className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-750 dark:text-white px-4 py-1.5 rounded-lg font-bold uppercase tracking-wider transition border border-slate-200 dark:border-slate-700 z-10"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Address Form Section */}
              {(showAddForm || addresses.length === 0) && (
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-250 dark:border-slate-850 mt-6 relative overflow-hidden text-left">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wide">
                    {editAddressId ? "Edit Address" : "Add New Address"}
                  </h3>
                  <form onSubmit={handleAddNewAddress} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-650 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Full Name</label>
                        <input
                          type="text"
                          name="FullName"
                          value={addressForm.FullName}
                          onChange={handleChange}
                          required
                          className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 text-slate-850 dark:text-white text-sm font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-650 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="PhoneNumber"
                          value={addressForm.PhoneNumber}
                          onChange={handleChange}
                          required
                          pattern="^\+?[0-9]{7,15}$"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 text-slate-855 dark:text-white text-sm font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-650 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Street Address</label>
                      <input
                        type="text"
                        name="Street"
                        value={addressForm.Street}
                        onChange={handleChange}
                        required
                        className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 text-slate-855 dark:text-white text-sm font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-650 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">City</label>
                        <input
                          type="text"
                          name="City"
                          value={addressForm.City}
                          onChange={handleChange}
                          required
                          className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 text-slate-855 dark:text-white text-sm font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-650 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">State</label>
                        <input
                          type="text"
                          name="State"
                          value={addressForm.State}
                          onChange={handleChange}
                          required
                          className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 text-slate-855 dark:text-white text-sm font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-650 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Postal Code</label>
                        <input
                          type="text"
                          name="PostalCode"
                          value={addressForm.PostalCode}
                          onChange={handleChange}
                          required
                          className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 text-slate-855 dark:text-white text-sm font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-650 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Country</label>
                        <input
                          type="text"
                          name="Country"
                          value={addressForm.Country}
                          onChange={handleChange}
                          required
                          className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff512f]/40 text-slate-855 dark:text-white text-sm font-semibold"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddForm(false);
                            setEditAddressId(null);
                          }}
                          className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition border border-slate-200 dark:border-slate-700"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs hover:opacity-95 transition"
                      >
                        {editAddressId ? "Update Address" : "Save Address"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Proceed Button */}
              {addresses.length > 0 && !showAddForm && (
                <button
                  type="button"
                  onClick={handleProceed}
                  className="w-full bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white py-4 rounded-xl font-bold text-base hover:opacity-95 shadow-md shadow-orange-500/10 active:scale-95 transition mt-8"
                >
                  Proceed to Payment
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
