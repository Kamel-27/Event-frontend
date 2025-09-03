import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../utils/logout";
import {
  Calendar,
  Ticket,
  Search,
  LogOut,
  Home,
} from "lucide-react";

const UserNavbar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-[black] text-gray-200 min-h-screen border-r border-black">
      <div className="p-5">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-[#0df38a] rounded-xl flex items-center justify-center">
            <img
              src="./Group 1.png"
              alt="E logo"
              className="w-10 h-10 rounded-2xl"
            />
          </div>
          <span className="font-semibold text-lg tracking-wide">
            EventStudio
          </span>
        </div>

        {/* User Info */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0df38a] rounded-full flex items-center justify-center text-black font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="text-sm text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-[#1a1a1a] hover:text-[#0df38a] transition-colors"
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
          
          <Link
            to="/my-tickets"
            className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-[#1a1a1a] hover:text-[#0df38a] transition-colors"
          >
            <Ticket size={20} />
            <span>My Tickets</span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <button
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
            className="flex items-center gap-3 py-3 px-4 rounded-lg text-red-400 hover:text-red-300 hover:bg-[#1a1a1a] transition-colors w-full"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default UserNavbar;
