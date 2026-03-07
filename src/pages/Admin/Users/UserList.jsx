import { useEffect, useState } from "react";
import { getUsers, toggleBlockUser } from "../../../api/adminUsers";
import {
  Search,
  User,
  Mail,
  CheckCircle,
  Ban,
  Shield,
  Filter,
  Users,
  ChevronRight,
  MoreVertical,
  Activity
} from "lucide-react";
import toast from "react-hot-toast";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    blocked: 0
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();

      if (res.data) {
        const rd = res.data;
        let usersData = [];

        if (rd?.data && Array.isArray(rd.data.data)) {
          usersData = rd.data.data;
        } else if (Array.isArray(rd?.data)) {
          usersData = rd.data;
        } else if (Array.isArray(rd)) {
          usersData = rd;
        }

        setUsers(usersData);
        setFilteredUsers(usersData);

        // Calculate stats
        setStats({
          total: usersData.length,
          active: usersData.filter(u => !u.isBlocked).length,
          blocked: usersData.filter(u => u.isBlocked).length
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load user list");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔎 Search & Filter Logic
  useEffect(() => {
    let result = users;

    if (filterType === "Active") {
      result = result.filter(u => !u.isBlocked);
    } else if (filterType === "Blocked") {
      result = result.filter(u => u.isBlocked);
    }

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          (user?.name?.toLowerCase() || "").includes(lowerSearch) ||
          (user?.email?.toLowerCase() || "").includes(lowerSearch) ||
          (user?.id?.toString() || "").includes(lowerSearch)
      );
    }

    setFilteredUsers(result);
  }, [searchTerm, filterType, users]);

  const handleToggleBlock = async (id) => {
    try {
      const res = await toggleBlockUser(id);
      if (res?.data?.isSuccess) {
        toast.success("User status updated");
        fetchUsers(); // refresh after toggle
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Toggle block error:", error);
      toast.error("Action failed");
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-700 font-bold animate-pulse">Loading User Directory...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-[#f8fafc] min-h-screen font-sans text-slate-900">

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
        <p className="text-slate-600 font-medium mt-1">Monitor user activity, manage access permissions and status.</p>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="bg-purple-50 p-4 rounded-xl text-purple-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Customers</p>
            <h3 className="text-2xl font-bold mt-0.5 text-slate-900">{stats.total}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Users</p>
            <h3 className="text-2xl font-bold mt-0.5 text-slate-900">{stats.active}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="bg-rose-50 p-4 rounded-xl text-rose-600">
            <Ban size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Restricted</p>
            <h3 className="text-2xl font-bold mt-0.5 text-slate-900">{stats.blocked}</h3>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by ID, Name or Email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl leading-5 bg-white text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-slate-700 font-bold whitespace-nowrap">
            <Filter size={18} />
            <span>Filter Status:</span>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm min-w-[150px]"
          >
            <option value="All">All Users</option>
            <option value="Active">Active Only</option>
            <option value="Blocked">Restricted Only</option>
          </select>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-10">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-6 py-5 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">User Identification</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200">Contact Info</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200 text-center">Status</th>
                <th className="px-6 py-5 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b-2 border-slate-200 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-all duration-200 group">
                    <td className="px-6 py-6 border-b border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg border border-slate-200 shadow-sm transition-transform group-hover:scale-105">
                          {(user.fullName || user.name || user.FullName || user.Name)?.charAt(0) || <User size={20} />}
                        </div>
                        <div>
                          <div className="text-[15px] font-bold text-slate-900 leading-tight">
                            {user.fullName || user.name || user.FullName || user.Name || "User"}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded border border-purple-100 uppercase tracking-wider">
                              {user.role}
                            </span>
                            <span className="text-[11px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                              ID: #{user.id?.toString().slice(-6)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 border-b border-slate-100">
                      <div className="flex items-center gap-2 text-slate-800 font-semibold text-[14px]">
                        <Mail size={14} className="text-purple-500" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap border-b border-slate-100">
                      <div className="flex justify-center">
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase tracking-wider border ${!user.isBlocked
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}>
                          {!user.isBlocked ? <CheckCircle size={14} /> : <Ban size={14} />}
                          {!user.isBlocked ? "Active" : "Restricted"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-right border-b border-slate-100">
                      <button
                        onClick={() => handleToggleBlock(user.id)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all shadow-sm border ${user.isBlocked
                          ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 shadow-emerald-100"
                          : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-500 hover:text-white hover:border-rose-600"
                          }`}
                      >
                        {user.isBlocked ? "Restore Access" : "Restrict User"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <Users size={64} className="mb-4 text-slate-300" />
                      <h3 className="text-xl font-bold text-slate-900">User not found</h3>
                      <p className="text-slate-600 font-medium">No results match your current search or filter criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}