import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import EventCard from "../components/EventCard";
import EventHeader from "../components/EventHeader";
import { useNavigate } from "react-router-dom";
import { getAllEvents } from "../api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, [currentPage, searchTerm]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
      };

      const response = await getAllEvents(params);
      
      if (response.data.success) {
        setEvents(response.data.events);
        setTotalPages(response.data.totalPages);
      } else {
        setError(response.data.message || "Failed to fetch events");
      }
    } catch (error) {
      console.error("Fetch events error:", error);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (eventId) => {
    setEvents(events.filter(event => event._id !== eventId));
  };

  const handleEdit = (event) => {
    // Navigate to edit page
    window.location.href = `/edit-event/${event._id}`;
  };

  return (
    <Layout>
      <EventHeader
        searchTerm={searchTerm}
        onSearch={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        onAddEvent={() => navigate('/add-event')}
      />

      {/* Error Message */}
      {error && (
        <div className="p-6 pb-0">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0df38a]"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Events Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length > 0 ? (
              events.map((event) => (
                <EventCard 
                  key={event._id} 
                  event={event} 
                  isAdmin={true} 
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? "No events found matching your search." : "No events available."}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 pt-0 flex justify-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#0df38a] hover:bg-green-500 text-white"
                  }`}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? "bg-[#0df38a] text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#0df38a] hover:bg-green-500 text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default Events;
