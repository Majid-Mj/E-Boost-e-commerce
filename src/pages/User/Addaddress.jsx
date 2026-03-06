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
      // Backend wraps responses in ApiResponse: { data: [...] }
      const fetchedAddresses = res.data?.data || res.data || [];

      setAddresses(fetchedAddresses);

      if (fetchedAddresses && fetchedAddresses.length > 0) {
        // Find default or use first
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

    // Validate fields
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
        // Update existing address
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
        // Create new address
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

      // Reset form and re-fetch list
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

    // Save address temporarily for frontend flow
    localStorage.setItem("userAddress", JSON.stringify(selectedAddrObject));

    // Optional: Pass buyNow product context forward if it came from the buyNow button
    if (location.state?.buyNowProduct) {
      navigate("/payment", {
        state: {
          buyNowProduct: location.state.buyNowProduct,
          buyNowQuantity: location.state.buyNowQuantity
        }
      });
    } else {
      navigate("/payment"); // Navigate to payment page for normal cart flow
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Navbar />

      <div className="flex-grow flex flex-col items-center justify-center py-24 px-4">
        <div className="bg-[#1f1b2e] w-full max-w-lg rounded-2xl p-8 shadow-[0_0_20px_rgba(0,255,255,0.1)] border border-gray-800">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#00FFFF]">
            Shipping Address
          </h2>

          {loading ? (
            <div className="text-center text-gray-400 py-4">Loading your addresses...</div>
          ) : (
            <>
              {/* Selectable Address List */}
              {addresses.length > 0 && !showAddForm && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-gray-300 font-medium">Select Saved Address</label>
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
                      className="bg-[#00FFFF] text-black px-4 py-2 rounded-lg hover:bg-cyan-400 transition flex items-center gap-2 font-semibold text-sm"
                    >
                      <Plus size={18} /> Add New
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-xl border-2 transition cursor-pointer relative ${selectedAddressId === addr.id
                          ? "border-[#00FFFF] bg-[#2a243a]"
                          : "border-gray-700 bg-[#2a243a]/40 hover:border-gray-500 hover:bg-[#2a243a]/60"
                          }`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-lg">{addr.fullName}</h4>
                            <p className="text-gray-400 mt-1">{addr.street}, {addr.city}</p>
                            <p className="text-gray-400">{addr.state}, {addr.postalCode}, {addr.country}</p>
                            <p className="text-gray-400 font-medium mt-1">Phone: {addr.phoneNumber}</p>
                          </div>
                          <div className="flex flex-col items-end gap-3 h-full justify-between">
                            {addr.isDefault ? (
                              <span className="bg-green-500/20 text-green-400 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border border-green-500/30">
                                Default
                              </span>
                            ) : (
                              <button
                                onClick={(e) => handleSetDefault(e, addr.id)}
                                className="text-xs text-gray-400 hover:text-[#00FFFF] underline z-10"
                              >
                                Set as Default
                              </button>
                            )}
                            <button
                              onClick={(e) => handleEditClick(e, addr)}
                              className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-4 py-1.5 rounded transition z-10"
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
                <div className="bg-[#2a243a]/50 p-5 rounded-xl border border-gray-700 mt-6 relative overflow-hidden">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {editAddressId ? "Edit Address" : "Add New Address"}
                  </h3>
                  <form onSubmit={handleAddNewAddress} className="space-y-4">
                    {/* Full Name & Phone Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="FullName"
                          value={addressForm.FullName}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#352f44] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00FFFF] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="PhoneNumber"
                          value={addressForm.PhoneNumber}
                          onChange={handleChange}
                          required
                          pattern="^\+?[0-9]{7,15}$"
                          className="w-full bg-[#352f44] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00FFFF] text-white"
                        />
                      </div>
                    </div>

                    {/* Street */}
                    <div>
                      <label className="block text-gray-300 mb-1">Street Address</label>
                      <input
                        type="text"
                        name="Street"
                        value={addressForm.Street}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#352f44] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00FFFF] text-white"
                      />
                    </div>

                    {/* City & State Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-1">City</label>
                        <input
                          type="text"
                          name="City"
                          value={addressForm.City}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#352f44] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00FFFF] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">State</label>
                        <input
                          type="text"
                          name="State"
                          value={addressForm.State}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#352f44] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00FFFF] text-white"
                        />
                      </div>
                    </div>

                    {/* Postal Code & Country Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-1">Postal Code</label>
                        <input
                          type="text"
                          name="PostalCode"
                          value={addressForm.PostalCode}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#352f44] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00FFFF] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">Country</label>
                        <input
                          type="text"
                          name="Country"
                          value={addressForm.Country}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#352f44] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00FFFF] text-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddForm(false);
                            setEditAddressId(null);
                          }}
                          className="flex-1 bg-transparent border-2 border-gray-600 text-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-1 bg-transparent border-2 border-[#00FFFF] text-[#00FFFF] py-2 rounded-lg font-semibold hover:bg-[#00FFFF] hover:text-black transition"
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
                  className="w-full bg-[#00FFFF] text-black py-4 rounded-lg font-bold text-lg hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition mt-8"
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
