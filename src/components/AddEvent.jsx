import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { createEvent } from "../api";

const AddEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "",
    venue: "",
    description: "",
    price: "",
    seats: "",
    tags: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate form
      if (!form.name || !form.date || !form.time || !form.venue || !form.description || !form.price || !form.seats) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const response = await createEvent(form);
      
      if (response.data.success) {
        alert("Event created successfully!");
        navigate("/events");
      } else {
        setError(response.data.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Create event error:", error);
      setError(error.response?.data?.message || "Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div>
        {/* Back Arrow */}
        <div className="flex items-center mb-4">
          <Link to="/events">
            <img
              src="./Back Arrow.png" // حط هنا مسار صورة السهم عندك
              alt="Back"
              className="w-8 h-8 mr-2 cursor-pointer"
            />
          </Link>
          <h2 className="text-2xl font-bold">Add New Event</h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Event Name */}
          <input
            type="text"
            name="name"
            placeholder="Event Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0df38a]"
          />

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#0df38a]"
            />
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#0df38a]"
            />
          </div>

          {/* Venue */}
          <input
            type="text"
            name="venue"
            placeholder="Venue"
            value={form.venue}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#0df38a]"
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Event Description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#0df38a]"
          />

          {/* Ticket Price + Seats */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Ticket Price"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#0df38a]"
            />
            <input
              type="number"
              name="seats"
              placeholder="Seats"
              value={form.seats}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#0df38a]"
            />
          </div>

          {/* Tags */}
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#0df38a]"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold p-3 rounded-xl transition ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#0df38a] text-white hover:bg-green-500"
            }`}
          >
            {loading ? "Creating Event..." : "Save Event"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddEvent;
