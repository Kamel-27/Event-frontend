import React from "react";
import { useState } from "react";
import { logout } from "../utils/logout";
import {
  Plus,
  ChevronDown,
  BarChart3,
  Calendar,
  Users,
  Settings,
  CreditCard,
  LifeBuoy,
  Megaphone,
  FolderOpen,
  UserCheck,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
            EventX Studio
          </span>
        </div>

        {/* Button */}
        <a href="/add-event" className="block w-full">
          <button className="w-full bg-[#0df38a] text-black hover:bg-[#0bc775] transition-colors mb-8 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium shadow-md">
            <Plus className="w-5 h-5" />
            Add Quick Event
          </button>
        </a>

        {/* Sections */}
        <div className="space-y-6 text-sm">
          {/* Main Navigation */}
          <div>
            <div className="flex items-center justify-between mb-2 text-gray-400 uppercase text-xs tracking-wide">
              <span>Main Navigation</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <nav className="space-y-1">
              <a
                href="/"
                className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-[#1a1a1a] hover:text-[#0df38a] transition-colors"
              >
                <BarChart3 className="w-4 h-4" /> Dashboard
              </a>
              <a
                href="/events"
                className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-[#1a1a1a] hover:text-[#0df38a]"
              >
                <Calendar className="w-4 h-4" /> Manage Events
              </a>
              <a
                href="/add-event"
                className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-[#1a1a1a] hover:text-[#0df38a]"
              >
                <CreditCard className="w-4 h-4" /> Booking & Tickets
              </a>
              <a
                href="/attendee-insights"
                className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-[#1a1a1a] hover:text-[#0df38a]"
              >
                <Users className="w-4 h-4" /> Attendee Insights
              </a>
              <a
                href="/analytics"
                className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-[#1a1a1a] hover:text-[#0df38a]"
              >
                <BarChart3 className="w-4 h-4" /> Analytics & Reports
              </a>
            </nav>
          </div>

          {/* Support & Management */}
          <div>
            <div className="flex items-center justify-between mb-2 text-gray-400 uppercase text-xs tracking-wide">
              <span>Support & Management</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <nav className="space-y-1">
              <a
                href="#"
                className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-[#1a1a1a] hover:text-[#0df38a]"
              >
                <LifeBuoy className="w-4 h-4" /> Contact Support
              </a>
              <a
                href="#"
                className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-[#1a1a1a] hover:text-[#0df38a]"
              >
                <Settings className="w-4 h-4" /> Settings
              </a>
            </nav>
          </div>

          {/* Additional Features */}
          <div>
            <div className="flex items-center justify-between mb-2 text-gray-400 uppercase text-xs tracking-wide">
              <span>Additional Features</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <nav className="space-y-1">
              <a
                href="#"
                className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-[#1a1a1a] hover:text-[#0df38a]"
              >
                <Megaphone className="w-4 h-4" /> Marketing
              </a>
              <a
                href="#"
                className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-[#1a1a1a] hover:text-[#0df38a]"
              >
                <FolderOpen className="w-4 h-4" /> Event Categories
              </a>
            </nav>
          </div>

          {/* Account Management */}
          <div>
            <div className="flex items-center justify-between mb-2 text-gray-400 uppercase text-xs tracking-wide">
              <span>Account Management</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <nav className="space-y-1">
              <a
                href="#"
                className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-[#1a1a1a] hover:text-[#0df38a]"
              >
                <UserCheck className="w-4 h-4" /> Manage Users
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
                className="flex items-center gap-3 py-2 px-3 rounded-md text-red-400 hover:text-red-300 hover:bg-[#1a1a1a]"
              >
                <LogOut className="w-4 h-4" /> Logout
              </a>
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
