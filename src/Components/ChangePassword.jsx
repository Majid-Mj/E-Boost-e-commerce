// import React, { useState } from "react";
// import { FaTimes } from "react-icons/fa";
// import axios from "axios";
// import api from "../config/api";

// export default function ChangePasswordModal({ user, onClose }) {
//   const [passwordData, setPasswordData] = useState({
//     current: "",
//     newPass: "",
//     confirm: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const handlePasswordChange = async () => {
//     if (!passwordData.current || !passwordData.newPass || !passwordData.confirm) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     if (passwordData.newPass !== passwordData.confirm) {
//       alert("New passwords do not match!");
//       return;
//     }

//     if (passwordData.current !== user.password) {
//       alert("Current password is incorrect!");
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.patch(`http://localhost:4444/users/${user.id}`, {
//         password: passwordData.newPass,
//       });

//       const updatedUser = { ...user, password: passwordData.newPass };
//       localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

//       alert("Password updated successfully!");
//       onClose();
//     } catch (error) {
//       console.error("Error updating password:", error);
//       alert("Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//       <div className="bg-[#1f1b2e] p-6 rounded-2xl w-[90%] max-w-md border border-gray-700 relative">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-400 hover:text-white"
//         >
//           <FaTimes />
//         </button>

//         <h3 className="text-xl font-semibold text-[#00FFFF] mb-4 text-center">
//           Change Password
//         </h3>

//         <div className="space-y-3">
//           <input
//             type="password"
//             placeholder="Current Password"
//             value={passwordData.current}
//             onChange={(e) =>
//               setPasswordData({ ...passwordData, current: e.target.value })
//             }
//             className="w-full p-3 rounded-md bg-[#2a243a]/70 border border-gray-600 text-white focus:outline-none"
//           />
//           <input
//             type="password"
//             placeholder="New Password"
//             value={passwordData.newPass}
//             onChange={(e) =>
//               setPasswordData({ ...passwordData, newPass: e.target.value })
//             }
//             className="w-full p-3 rounded-md bg-[#2a243a]/70 border border-gray-600 text-white focus:outline-none"
//           />
//           <input
//             type="password"
//             placeholder="Confirm New Password"
//             value={passwordData.confirm}
//             onChange={(e) =>
//               setPasswordData({ ...passwordData, confirm: e.target.value })
//             }
//             className="w-full p-3 rounded-md bg-[#2a243a]/70 border border-gray-600 text-white focus:outline-none"
//           />

//           <button
//             onClick={handlePasswordChange}
//             disabled={loading}
//             className="w-full bg-[#00FFFF] hover:bg-cyan-400 text-black font-semibold py-3 rounded-lg mt-2 transition"
//           >
//             {loading ? "Updating..." : "Update Password"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import api from "../config/api";

export default function ChangePasswordModal({ onClose }) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordChange = async () => {
    setError("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      alert("Password updated successfully!");
      onClose();
    } catch (err) {
      console.error("Password change error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1f1b2e] p-6 rounded-2xl w-[90%] max-w-md border border-gray-700 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <FaTimes />
        </button>

        <h3 className="text-xl font-semibold text-[#00FFFF] mb-4 text-center">
          Change Password
        </h3>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="Current Password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
            className="w-full p-3 rounded-md bg-[#2a243a]/70 border border-gray-600 text-white focus:outline-none"
          />

          <input
            type="password"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                newPassword: e.target.value,
              })
            }
            className="w-full p-3 rounded-md bg-[#2a243a]/70 border border-gray-600 text-white focus:outline-none"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value,
              })
            }
            className="w-full p-3 rounded-md bg-[#2a243a]/70 border border-gray-600 text-white focus:outline-none"
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handlePasswordChange}
            disabled={loading}
            className="w-full bg-[#00FFFF] hover:bg-cyan-400 text-black font-semibold py-3 rounded-lg mt-2 transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}