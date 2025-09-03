import React, { useState } from "react";

const EventForm = ({ onSubmit }) => {
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
    let value = e.target.value;
    if (e.target.type === "number") {
      value = value.replace(/[^0-9]/g, ""); // force English digits
    }
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="block mb-2 font-semibold">Event Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#0df38a]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-semibold">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#0df38a]"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Time</label>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#0df38a]"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold">Venue</label>
        <input
          type="text"
          name="venue"
          value={form.venue}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#0df38a]"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#0df38a]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-semibold">Ticket Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#0df38a]"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Seats</label>
          <input
            type="number"
            name="seats"
            value={form.seats}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#0df38a]"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold">Tags</label>
        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#0df38a]"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#0df38a] text-white font-semibold p-3 rounded-xl hover:bg-green-500 transition"
      >
        Save Event
      </button>
    </form>
  );
};

export default EventForm;
