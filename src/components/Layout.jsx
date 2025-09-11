import React, { useState } from "react";
import Navbar from "./Navbar";
import UserNavbar from "./UserNavbar";

import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  // Use UserNavbar for regular users, Navbar for admins
  const SidebarComponent = user?.role === 'admin' ? Navbar : UserNavbar;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full min-h-screen bg-gray-100 rounded-2xl shadow-lg border-16 border-black flex overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`fixed md:sticky md:top-0 top-0 left-0 h-full md:h-screen w-64 bg-black text-white transform ${
            open ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out z-30 overflow-y-auto`}
        >
          <SidebarComponent />
        </div>

        {/* Overlay (only on mobile when open) */}
        {open && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Toggle Button (Mobile only) */}
        <button
          onClick={() => setOpen(!open)}
          className="absolute top-4 left-4 md:hidden z-40 bg-white border border-black rounded-full p-2"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          {/* Page Content */}
          <div className="mt-0">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
