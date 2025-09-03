import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getEvent } from "../api";
import { Calendar, MapPin, Clock, Users, DollarSign, ArrowLeft, Tag, Edit } from "lucide-react";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await getEvent(id);
      
      if (response.data.success) {
        setEvent(response.data.event);
      } else {
        setError(response.data.message || "Failed to fetch event");
      }
    } catch (error) {
      console.error("Fetch event error:", error);
      setError("Failed to load event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAvailableSeats = (event) => {
    return event.seats - event.booked;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0df38a]"></div>
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || "Event not found"}
          </div>
          <Link to="/" className="inline-block mt-4 text-[#0df38a] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Event Details</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Event Information */}
            <div className="space-y-6">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={event.name} 
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" 
                  />
                  <Edit size={16} className="text-gray-500" />
                </div>
              </div>

              {/* Event Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Venue</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={event.venue} 
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" 
                  />
                  <MapPin size={16} className="text-gray-500" />
                </div>
              </div>

              {/* Event Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Description</label>
                <textarea 
                  value={event.description} 
                  readOnly
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none" 
                />
              </div>
            </div>

            {/* Right Column - Event Details */}
            <div className="space-y-6">
              {/* Event Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={formatDate(event.date)} 
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" 
                  />
                  <Calendar size={16} className="text-gray-500" />
                </div>
              </div>

              {/* Event Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Time</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={event.time} 
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" 
                  />
                  <Clock size={16} className="text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Ticket and Seat Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Price</label>
              <div className="flex items-center justify-center gap-2">
                <DollarSign size={24} className="text-green-600" />
                <span className="text-2xl font-bold text-green-600">${event.price}</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Seat Amount</label>
              <div className="flex items-center justify-center gap-2">
                <Users size={24} className="text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{event.seats}</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Seats</label>
              <div className="flex items-center justify-center gap-2">
                <Users size={24} className="text-green-600" />
                <span className="text-2xl font-bold text-green-600">{getAvailableSeats(event)}</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Popularity</label>
              <div className="flex items-center justify-center gap-2">
                <Tag size={24} className="text-purple-600" />
                <span className="text-lg font-bold text-purple-600">High Popularity</span>
              </div>
            </div>
          </div>

          {/* Seat Allocation */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Seat Allocation</h2>
            
            {/* Legend */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Paid Seats</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-800 rounded-full"></div>
                <span className="text-sm text-gray-600">Reserved Seats</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
            </div>

            {/* Seat Grid */}
            <div className="grid grid-cols-20 gap-1 mb-4 overflow-x-auto">
              {Array.from({ length: event.seats }, (_, i) => {
                const seatNumber = i + 1;
                const isBooked = seatNumber > getAvailableSeats(event);
                const isReserved = seatNumber > getAvailableSeats(event) && seatNumber <= getAvailableSeats(event) + 50;
                
                return (
                  <div
                    key={seatNumber}
                    className={`w-8 h-8 rounded text-xs font-semibold flex items-center justify-center ${
                      isBooked 
                        ? isReserved ? 'bg-purple-800 text-white' : 'bg-purple-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {seatNumber}
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center gap-4">
              <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                <ArrowLeft size={16} />
              </button>
              <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                <ArrowLeft size={16} className="rotate-180" />
              </button>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={event.tags ? event.tags.join(', ') : ''} 
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" 
                />
                <Tag size={16} className="text-gray-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Attendance</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={`+${Math.floor(event.seats * 0.8)}`} 
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" 
                />
                <Users size={16} className="text-gray-500" />
              </div>
            </div>
          </div>

          {/* QR Code for Payments */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">QR Code for Payments</h3>
            <div className="bg-gray-100 rounded-lg p-8 inline-block">
              <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                <div className="w-24 h-24 bg-black rounded-lg flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-black rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">Scan QR code for easy payments</p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => window.location.href = `/book/${event._id}`}
              disabled={getAvailableSeats(event) === 0}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                getAvailableSeats(event) === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#0df38a] text-black hover:bg-green-400"
              }`}
            >
              {getAvailableSeats(event) === 0 ? "Sold Out" : "Book Tickets"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetails;
