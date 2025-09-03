import React from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import EventForm from "./EventForm";

const AddEvent = () => {
  const handleFormSubmit = (formData) => {
    console.log("Event Submitted:", formData);
  };

  return (
    <Layout>
      <div>
        <div className="flex items-center mb-6">
          <Link to="/events">
            <img
              src="./Back Arrow.png"
              alt="Back"
              className="w-8 h-8 mr-2 cursor-pointer"
            />
          </Link>
          <h2 className="text-2xl font-bold mx-auto">Add New Event</h2>
        </div>

        <EventForm onSubmit={handleFormSubmit} />
      </div>
    </Layout>
  );
};

export default AddEvent;
