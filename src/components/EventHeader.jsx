import React from "react";
import { Search } from "lucide-react";

const EventHeader = ({ searchTerm, onSearch, onAddEvent }) => {
  return (
    <div className="bg-white shadow-md rounded-b-2xl p-4 flex flex-col gap-3 sticky top-0 z-50">
      {/* Title */}
      <h1 className="text-xl font-bold">Event Management Section</h1>

      {/* Buttons + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Buttons */}
        <div className="flex items-center gap-3">
          <button onClick={onAddEvent} className="px-4 py-2 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition flex items-center gap-2">
            + New Event
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center border rounded-xl px-3 py-2 gap-2">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearch && onSearch(e.target.value)}
              className="outline-none text-sm w-32"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
