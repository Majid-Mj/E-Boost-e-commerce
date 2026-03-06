import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-[#f8fafc] min-h-screen font-sans">

      {/* Sidebar - fixed width on desktop */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col md:ml-72 transition-all duration-300">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-x-hidden">
          {/* We keep the padding inside the page components for more granular control */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
