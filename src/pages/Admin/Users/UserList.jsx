import { useEffect, useState } from "react";
import { getUsers, toggleBlockUser } from "../../../api/adminUsers";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await getUsers();

      console.log("FULL RESPONSE:", res.data);

      if (res.data) {
        console.log("Users fetched:", res.data);
        const rd = res.data;
        let usersData = [];

        if (rd?.data && Array.isArray(rd.data.data)) {
          usersData = rd.data.data;
        } else if (Array.isArray(rd?.data)) {
          usersData = rd.data;
        } else if (Array.isArray(rd)) {
          usersData = rd;
        }

        console.log("Extracted users array:", usersData);
        setUsers(usersData);
      } else {
        console.log("Fetch not success:", res.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      const res = await toggleBlockUser(id);

      if (res?.data?.isSuccess) {
        fetchUsers(); // refresh after toggle
      }
    } catch (error) {
      console.error("Toggle block error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Safe filtering
  const filteredUsers = Array.isArray(users)
    ? users.filter(
      (user) =>
        (user?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    )
    : [];

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading users...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-semibold text-gray-800">
          Manage Users
        </h2>

        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-gray-500 text-center">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">User ID</th>
                <th className="p-3 text-left">Username</th>
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
                  <td className="p-3 text-sm text-gray-600">
                    {user.id}
                  </td>
                  <td className="p-3 font-medium text-gray-800">
                    {user.name}
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
                      onClick={() => handleToggleBlock(user.id)}
                      className={`px-4 py-2 rounded-lg text-white font-semibold transition ${user.isBlocked
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