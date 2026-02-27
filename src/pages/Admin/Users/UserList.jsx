// import { useEffect, useState } from "react";

// export default function AdminUsers() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   const API_URL = "http://localhost:4444/users";

//   // Fetch users from DB
//   const fetchUsers = async () => {
//     try {
//       const res = await fetch(API_URL);
//       const data = await res.json();
//       setUsers(data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Toggle Block / Unblock
//   const handleToggleBlock = async (id, isBlocked) => {
//     try {
//       await fetch(`${API_URL}/${id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ isBlocked: !isBlocked }),
//       });
//       setUsers((prev) =>
//         prev.map((user) =>
//           user.id === id ? { ...user, isBlocked: !isBlocked } : user
//         )
//       );
//     } catch (error) {
//       console.error("Error updating user:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Filtered users based on search term
//   const filteredUsers = users.filter(
//     (user) =>
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.id.toString().includes(searchTerm)
//   );

//   if (loading)
//     return (
//       <div className="text-center py-10 text-gray-400">Loading users...</div>
//     );

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
//         <h2 className="text-2xl font-semibold text-gray-800">Manage Users</h2>

//         {/* Search Field */}
//         <input
//           type="text"
//           placeholder="Search by Name or ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="px-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
//         />
//       </div>

//       {filteredUsers.length === 0 ? (
//         <p className="text-gray-500">No users found.</p>
//       ) : (
//         <div className="overflow-x-auto bg-white shadow rounded-lg">
//           <table className="w-full border-collapse">
//             <thead className="bg-gray-200 text-gray-700">
//               <tr>
//                 <th className="p-3 text-left">#</th>
//                 <th className="p-3 text-left">User ID</th>
//                 <th className="p-3 text-left">Name</th>
//                 <th className="p-3 text-left">Email</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map((user, index) => (
//                 <tr
//                   key={user.id}
//                   className="border-t hover:bg-gray-50 transition"
//                 >
//                   <td className="p-3">{index + 1}</td>
//                   <td className="p-3 text-gray-600 text-sm">{user.id}</td>
//                   <td className="p-3 font-medium text-gray-800">
//                     {user.name}
//                   </td>
//                   <td className="p-3">{user.email}</td>
//                   <td className="p-3">
//                     {user.isBlocked ? (
//                       <span className="text-red-500 font-semibold">Blocked</span>
//                     ) : (
//                       <span className="text-green-500 font-semibold">
//                         Active
//                       </span>
//                     )}
//                   </td>
//                   <td className="p-3">
//                     <button
//                       onClick={() =>
//                         handleToggleBlock(user.id, user.isBlocked)       
//                       }
//                       className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
//                         user.isBlocked
//                           ? "bg-green-600 hover:bg-green-700"
//                           : "bg-red-500 hover:bg-red-600"
//                       }`}  
//                     >
//                       {user.isBlocked ? "Unblock" : "Block"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import api from "../../../config/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch users from real backend
  const fetchUsers = async () => {
    try {
      const res = await api.get("/User/admin");
      setUsers(res.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle Block / Unblock (REAL BACKEND)
  const handleToggleBlock = async (id, isBlocked) => {
    try {
      await api.patch(`/User/${id}/block`, {
        isBlocked: !isBlocked,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, isBlocked: !isBlocked } : user
        )
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id?.toString().includes(searchTerm)
  );

  if (loading)
    return (
      <div className="text-center py-10 text-gray-400">
        Loading users...
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-semibold text-gray-800">
          Manage Users
        </h2>

        <input
          type="text"
          placeholder="Search by Name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">User ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 text-gray-600 text-sm">
                    {user.id}
                  </td>
                  <td className="p-3 font-medium text-gray-800">
                    {user.fullName}
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    {user.isBlocked ? (
                      <span className="text-red-500 font-semibold">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-green-500 font-semibold">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() =>
                        handleToggleBlock(user.id, user.isBlocked)
                      }
                      className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                        user.isBlocked
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}