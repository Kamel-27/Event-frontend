import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getEvent, bookTicket } from "../api";
import { Calendar, MapPin, Clock, Users, DollarSign, ArrowLeft, CheckCircle } from "lucide-react";

const BookEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingStep, setBookingStep] = useState(1); // 1: seat selection, 2: user info, 3: confirmation
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    age: '25-34',
    gender: 'Male',
    location: 'Cairo',
    interests: []
  });

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAvailableSeats = (event) => {
    return event.seats - event.booked;
  };

  const handleSeatSelection = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      if (selectedSeats.length < 5) { // Limit to 5 seats per booking
        setSelectedSeats([...selectedSeats, seatNumber]);
      }
    }
  };

  const calculateTotal = () => {
    return selectedSeats.length * event.price;
  };

  const handleProceedToUserInfo = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    setBookingStep(2);
  };

  const handleProceedToPayment = () => {
    if (userInfo.interests.length === 0) {
      alert("Please select at least one interest");
      return;
    }
    handleBuyNow();
  };

  const handleBuyNow = async () => {
    setIsProcessing(true);
    try {
      // First update user profile with the information
      const updateUserResponse = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userInfo)
      });

      if (!updateUserResponse.ok) {
        console.error('Failed to update user profile');
      }

      // Then book the tickets
      const bookingPromises = selectedSeats.map(seatNumber => 
        bookTicket({
          eventId: event._id,
          seatNumber,
          paymentMethod: 'cashless'
        })
      );
      const results = await Promise.all(bookingPromises);
      const failedBookings = results.filter(result => !result.data.success);
      if (failedBookings.length > 0) {
        alert(`Failed to book ${failedBookings.length} seats. Please try again.`);
        setIsProcessing(false);
        return;
      }
      setIsProcessing(false);
      setBookingStep(3);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to book tickets. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleBackToSeats = () => {
    setBookingStep(1);
  };

  const handleBackToEvents = () => {
    navigate('/');
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

  const availableSeats = getAvailableSeats(event);

  return (
    <Layout>
      <div className="p-6">
        {/* Back Button */}
        <Link to={`/event/${event._id}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6">
          <ArrowLeft size={20} />
          Back to Event Details
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                bookingStep >= 1 ? 'bg-[#0df38a] text-black' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className={`text-sm ${bookingStep >= 1 ? 'text-black' : 'text-gray-500'}`}>
                Select Seats
              </div>
              <div className={`w-8 h-0.5 ${bookingStep >= 2 ? 'bg-[#0df38a]' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                bookingStep >= 2 ? 'bg-[#0df38a] text-black' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <div className={`text-sm ${bookingStep >= 2 ? 'text-black' : 'text-gray-500'}`}>
                Confirmation
              </div>
            </div>
          </div>

          {/* Event Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{event.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-gray-500" size={16} />
                <span className="text-gray-600">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-gray-500" size={16} />
                <span className="text-gray-600">{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-gray-500" size={16} />
                <span className="text-gray-600">{event.venue}</span>
              </div>
            </div>
          </div>

          {/* Step 1: Seat Selection */}
          {bookingStep === 1 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Select Your Seats</h3>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  Available seats: <span className="font-semibold text-green-600">{availableSeats}</span>
                </p>
                <p className="text-gray-600 mb-4">
                  Selected seats: <span className="font-semibold">{selectedSeats.length}</span> 
                  {selectedSeats.length > 0 && ` (${selectedSeats.join(', ')})`}
                </p>
              </div>

              {/* Seat Grid */}
              <div className="grid grid-cols-10 gap-2 mb-6">
                {Array.from({ length: event.seats }, (_, i) => {
                  const seatNumber = i + 1;
                  // Use actual booked seats from the API
                  const isBooked = event.bookedSeats && event.bookedSeats.includes(seatNumber.toString());
                  const isSelected = selectedSeats.includes(seatNumber);
                  
                  return (
                    <button
                      key={seatNumber}
                      onClick={() => !isBooked && handleSeatSelection(seatNumber)}
                      disabled={isBooked}
                      className={`w-12 h-12 rounded-lg text-sm font-semibold transition-colors ${
                        isBooked
                          ? 'bg-red-200 text-red-600 cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#0df38a] text-black'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {seatNumber}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#0df38a] rounded"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 rounded"></div>
                  <span>Booked</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {calculateTotal()} EGP
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToUserInfo}
                disabled={selectedSeats.length === 0 || isProcessing}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  selectedSeats.length === 0 || isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#0df38a] text-black hover:bg-green-400'
                }`}
              >
                Continue to Booking
              </button>
            </div>
          )}

          {/* Step 2: User Information */}
          {bookingStep === 2 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Your Information</h3>
              <p className="text-gray-600 mb-6">Please provide some information for analytics purposes:</p>
              
              <div className="space-y-6">
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                  <select
                    value={userInfo.age}
                    onChange={(e) => setUserInfo({...userInfo, age: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0df38a]"
                  >
                    <option value="18-24">18-24</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45+">45+</option>
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={userInfo.gender === 'Male'}
                        onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})}
                        className="mr-2"
                      />
                      Male
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={userInfo.gender === 'Female'}
                        onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})}
                        className="mr-2"
                      />
                      Female
                    </label>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={userInfo.location}
                    onChange={(e) => setUserInfo({...userInfo, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0df38a]"
                  >
                    <option value="Cairo">Cairo</option>
                    <option value="Alexandria">Alexandria</option>
                    <option value="Giza">Giza</option>
                    <option value="Luxor">Luxor</option>
                    <option value="Aswan">Aswan</option>
                    <option value="Sharm El Sheikh">Sharm El Sheikh</option>
                    <option value="Hurghada">Hurghada</option>
                    <option value="International">International</option>
                  </select>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interests (Select at least one)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Live Music', 'Innovation', 'EDM Music', 'Food Festivals', 'Technology', 'Sports', 'Art', 'Business'].map((interest) => (
                      <label key={interest} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={userInfo.interests.includes(interest)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUserInfo({...userInfo, interests: [...userInfo.interests, interest]});
                            } else {
                              setUserInfo({...userInfo, interests: userInfo.interests.filter(i => i !== interest)});
                            }
                          }}
                          className="mr-2"
                        />
                        {interest}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleBackToSeats}
                  className="flex-1 py-3 px-6 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back to Seats
                </button>
                <button
                  onClick={handleProceedToPayment}
                  disabled={userInfo.interests.length === 0 || isProcessing}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                    userInfo.interests.length === 0 || isProcessing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#0df38a] text-black hover:bg-green-400'
                  }`}
                >
                  {isProcessing ? 'Processing...' : `Complete Booking - ${calculateTotal()} EGP`}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {bookingStep === 3 && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600">Your tickets have been successfully booked.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-800 mb-4">Booking Details</h4>
                <div className="space-y-2 text-left">
                  <p><span className="font-medium">Event:</span> {event.name}</p>
                  <p><span className="font-medium">Date:</span> {formatDate(event.date)}</p>
                  <p><span className="font-medium">Time:</span> {event.time}</p>
                  <p><span className="font-medium">Venue:</span> {event.venue}</p>
                  <p><span className="font-medium">Seats:</span> {selectedSeats.join(', ')}</p>
                  <p><span className="font-medium">Total:</span> ${calculateTotal()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => navigate('/my-tickets')}
                  className="w-full bg-[#0df38a] text-black font-semibold py-3 px-6 rounded-lg hover:bg-green-400 transition-colors"
                >
                  View My Tickets
                </button>
                <button
                  onClick={handleBackToEvents}
                  className="w-full border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Browse More Events
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BookEvent;
