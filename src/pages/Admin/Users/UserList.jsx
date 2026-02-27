import { useEffect, useState } from "react";
import { getUsers, toggleBlockUser } from "../../../api/adminUsers";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await getUsers();

      if (res.data.isSuccess) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      const res = await toggleBlockUser(id);

      if (res.data.isSuccess) {
        // Refresh list after toggle
        fetchUsers();
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="text-center py-10 text-gray-400">
        Loading users...
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Users</h2>

        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">User ID</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-3 text-sm">{user.id}</td>
                <td className="p-3">{user.userName}</td>
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
                    onClick={() => handleToggleBlock(user.id)}
                    className={`px-4 py-2 rounded text-white ${
                      user.isBlocked
                        ? "bg-green-600"
                        : "bg-red-500"
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
    </div>
  );
}



// import { useEffect, useState } from "react";
// import api from "../../../config/api";
// import toast from "react-hot-toast";

// export default function AdminUsers() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   // ✅ Fetch users (Correct Endpoint)
//   const fetchUsers = async () => {
//     try {
//       const res = await api.get("/admin/users/Users");

//       // Your backend returns wrapped response
//       const data = Array.isArray(res.data?.data)
//         ? res.data.data
//         : [];

//       setUsers(data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       toast.error("Failed to load users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Toggle Block / Unblock (Correct Endpoint)
//   const handleToggleBlock = async (id) => {
//     try {
//       await api.patch(`/admin/users/${id}/toggle-block`);

//       setUsers((prev) =>
//         prev.map((user) =>
//           user.id === id
//             ? { ...user, isBlocked: !user.isBlocked }
//             : user
//         )
//       );

//       toast.success("User status updated");
//     } catch (error) {
//       console.error("Error updating user:", error);
//       toast.error("Failed to update user");
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const filteredUsers = users.filter(
//     (user) =>
//       user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.id?.toString().includes(searchTerm)
//   );

//   if (loading)
//     return (
//       <div className="text-center py-10 text-gray-400">
//         Loading users...
//       </div>
//     );

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
//         <h2 className="text-2xl font-semibold text-gray-800">
//           Manage Users
//         </h2>

//         <input
//           type="text"
//           placeholder="Search by Name or ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="px-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
//                   className="border-t hover:bg-gray-50"
//                 >
//                   <td className="p-3">{index + 1}</td>
//                   <td className="p-3 text-sm text-gray-600">
//                     {user.id}
//                   </td>
//                   <td className="p-3 font-medium">
//                     {user.fullName}
//                   </td>
//                   <td className="p-3">{user.email}</td>
//                   <td className="p-3">
//                     {user.isBlocked ? (
//                       <span className="text-red-500 font-semibold">
//                         Blocked
//                       </span>
//                     ) : (
//                       <span className="text-green-500 font-semibold">
//                         Active
//                       </span>
//                     )}
//                   </td>
//                   <td className="p-3">
//                     <button
//                       onClick={() =>
//                         handleToggleBlock(user.id)
//                       }
//                       className={`px-4 py-2 rounded-lg text-white font-semibold ${
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