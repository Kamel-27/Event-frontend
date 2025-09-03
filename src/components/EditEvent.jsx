import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";
import { getEvent, updateEvent } from "../api";

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await getEvent(id);
      if (response.data.success) {
        const event = response.data.event;
        setForm({
          name: event.name,
          date: new Date(event.date).toISOString().split('T')[0],
          time: event.time,
          venue: event.venue,
          description: event.description,
          price: event.price.toString(),
          seats: event.seats.toString(),
          tags: event.tags ? event.tags.join(', ') : "",
        });
      } else {
        setError("Failed to load event");
      }
    } catch (error) {
      console.error("Fetch event error:", error);
      setError("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Validate form
      if (!form.name || !form.date || !form.time || !form.venue || !form.description || !form.price || !form.seats) {
        setError("Please fill in all required fields");
        setSaving(false);
        return;
      }

      const response = await updateEvent(id, form);
      
      if (response.data.success) {
        alert("Event updated successfully!");
        navigate("/events");
      } else {
        setError(response.data.message || "Failed to update event");
      }
    } catch (error) {
      console.error("Update event error:", error);
      setError(error.response?.data?.message || "Failed to update event. Please try again.");
    } finally {
      setSaving(false);
    }
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

  return (
    <Layout>
      <div>
        {/* Back Arrow */}
        <div className="flex items-center mb-4">
          <Link to="/events">
            <img
              src="./Back Arrow.png"
              alt="Back"
              className="w-8 h-8 mr-2 cursor-pointer"
            />
          </Link>
          <h2 className="text-2xl font-bold">Edit Event</h2>
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
            disabled={saving}
            className={`w-full font-semibold p-3 rounded-xl transition ${
              saving 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#0df38a] text-white hover:bg-green-500"
            }`}
          >
            {saving ? "Updating Event..." : "Update Event"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditEvent;
