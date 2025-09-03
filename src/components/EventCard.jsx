import React from "react";
import { Calendar, MapPin, Clock, ArrowRight, Edit, Trash2 } from "lucide-react";
import { deleteEvent } from "../api";

const EventCard = ({ event, isAdmin, onDelete, onEdit }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate available seats
  const availableSeats = event.seats - event.booked;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await deleteEvent(event._id);
        if (response.data.success) {
          onDelete && onDelete(event._id);
        } else {
          alert("Failed to delete event");
        }
      } catch (error) {
        console.error("Delete event error:", error);
        alert("Failed to delete event");
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-3 hover:shadow-lg transition">
      {/* Event Name */}
      <h2 className="text-lg font-bold">{event.name}</h2>

      {/* Prices & Seats */}
      <div className="flex justify-between text-sm font-medium">
        <span className="flex items-center gap-1 text-green-600">
          <img src="./Cash.svg" alt="Price" /> ${event.price}
        </span>
        <span className="flex items-center gap-1 text-red-500">
          <img src="./Flight Seat.png" alt="Booked" />
          {event.booked} booked
        </span>
        <span className="flex items-center gap-1 text-purple-600">
          <img src="./Ticket.svg" alt="Seats" /> {availableSeats} available
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <MapPin size={16} /> {event.venue}
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <Calendar size={16} /> {formatDate(event.date)}
      </div>

      {/* Time */}
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <Clock size={16} /> {event.time}
      </div>

      {/* Tags */}
      {event.tags && event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {event.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{event.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium text-sm"
              >
                <Trash2 size={16} /> Delete
              </button>
            </>
          )}
        </div>
        
        {isAdmin ? (
          <a
            href={`/edit-event/${event._id}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            aria-label="Edit event"
            title="Edit event"
          >
            <ArrowRight size={18} />
          </a>
        ) : (
          <a
            href={`/events/${event._id}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            View & Book
            <ArrowRight size={18} />
          </a>
        )}
      </div>
    </div>
  );
};

export default EventCard;
