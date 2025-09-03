import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Welcome from "../components/Welcome";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats, getUserTickets, getAllEvents } from "../api";
import { Calendar, Ticket, Search, TrendingUp, MapPin, Clock, Users, DollarSign, ArrowRight, Bell, Settings } from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const [adminStats, setAdminStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (isAdmin) {
        // Fetch admin dashboard stats and events
        const [statsResponse, eventsResponse] = await Promise.all([
          getDashboardStats(),
          getAllEvents({ status: 'active', limit: 100 })
        ]);
        
        if (statsResponse.data.success) {
          setAdminStats(statsResponse.data.stats);
        }
        
        if (eventsResponse.data.success && eventsResponse.data.events) {
          const upcomingEvents = eventsResponse.data.events
            .filter(event => new Date(event.date) > new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);
          setEvents(upcomingEvents);
        }
      } else {
        // Fetch user dashboard data and events
        try {
          const [ticketsResponse, eventsResponse] = await Promise.all([
            getUserTickets(),
            getAllEvents({ status: 'active', limit: 100 })
          ]);
          
          // Initialize with default values
          let tickets = [];
          let events = [];
          
          if (ticketsResponse.data.success) {
            tickets = ticketsResponse.data.tickets || [];
          }
          
          if (eventsResponse.data.success && eventsResponse.data.events) {
            events = eventsResponse.data.events.filter(event => 
              new Date(event.date) > new Date()
            );
          }
          
          setUserStats({
            tickets: tickets,
            upcomingEvents: events.slice(0, 5)
          });
          setEvents(events);
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Set default values if API calls fail
          setUserStats({
            tickets: [],
            upcomingEvents: []
          });
          setEvents([]);
        }
      }
    } catch (error) {
      console.error("Fetch dashboard data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEvents = (events || []).filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAvailableSeats = (event) => {
    return event.seats - event.booked;
  };

  return (
    <Layout>
      <Welcome />
      
      {isAdmin ? (
        // Admin Dashboard
        <>

          
          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0df38a]"></div>
              </div>
            ) : (
              <>
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Events</p>
                        <p className="text-3xl font-bold text-gray-800">
                          {adminStats?.totalEvents || 28}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Ticket className="text-green-600" size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bookings</p>
                        <p className="text-3xl font-bold text-gray-800">
                          {adminStats?.totalTickets || 2759}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Revenue</p>
                        <p className="text-3xl font-bold text-gray-800">
                          {`${(adminStats?.totalRevenue || 623500).toLocaleString()} EGP`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Net Sales Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800">NET SALES</h3>
                        <button className="text-gray-500 hover:text-gray-700">
                          <TrendingUp size={20} />
                        </button>
                      </div>
                      
                      <div className="mb-4">
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
                          Filter: Weekly
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Total Revenue</p>
                          <p className="text-lg font-bold text-red-600">
                            {adminStats?.totalRevenue ? 
                              `${adminStats.totalRevenue.toLocaleString()} EGP` : 
                              '0 EGP'
                            }
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Total Tickets</p>
                          <p className="text-lg font-bold text-red-600">
                            {adminStats?.totalTickets || 0} Tickets
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Total Events</p>
                          <p className="text-lg font-bold text-red-600">
                            {adminStats?.totalEvents || 0} Events
                          </p>
                        </div>
                      </div>
                      
                      {/* Revenue Chart */}
                      <div className="h-48 bg-gray-50 rounded-lg p-4">
                        {adminStats?.monthlyRevenue && adminStats.monthlyRevenue.length > 0 ? (
                          <div className="h-full flex items-end justify-between gap-2">
                            {adminStats.monthlyRevenue.map((month, index) => {
                              const maxRevenue = Math.max(...adminStats.monthlyRevenue.map(m => m.revenue));
                              const height = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
                              
                              return (
                                <div key={index} className="flex flex-col items-center gap-1 flex-1">
                                  <div 
                                    className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t"
                                    style={{ height: `${height}%` }}
                                  ></div>
                                  <span className="text-xs text-gray-500 mt-1">
                                    {month.revenue > 0 ? `${(month.revenue / 1000).toFixed(0)}k` : '0'}
                                  </span>
                                  <span className="text-xs text-gray-400">{month.month}</span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <p className="text-gray-500">No revenue data available</p>
                          </div>
                        )}
                      </div>
                    </div>


                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">


                    {/* Upcoming Events */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">UPCOMING EVENTS</h3>
                        <ArrowRight size={20} className="text-gray-500" />
                      </div>
                      <div className="space-y-3">
                        {events && events.length > 0 ? (
                          events.map((event, index) => {
                            const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
                            return (
                              <div key={event._id} className="flex items-center gap-3">
                                <div className={`w-8 h-8 ${colors[index % colors.length]} rounded-full`}></div>
                                <div>
                                  <p className="font-medium text-sm">{event.name}</p>
                                  <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-500 text-sm">No upcoming events</p>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => window.location.href = '/events'}
                        className="w-full mt-4 text-sm text-blue-600 hover:underline"
                      >
                        See All
                      </button>
                    </div>


                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        // User Dashboard with Events
        <div className="mt-8 space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0df38a]"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Ticket className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {userStats?.tickets?.length || 0}
                      </p>
                      <p className="text-gray-600">My Tickets</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="text-green-600" size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {userStats?.upcomingEvents?.length || 0}
                      </p>
                      <p className="text-gray-600">Upcoming Events</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Events */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Discover Events</h3>
                  <p className="text-gray-600">Find and book amazing events</p>
                </div>
                
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search events by name or venue..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0df38a]"
                  />
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <div key={event._id} className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-3 hover:shadow-lg transition">
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
                            <img src="./Ticket.svg" alt="Seats" /> {getAvailableSeats(event)} available
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
                          <a
                            href={`/event/${event._id}`}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View & Book
                            <ArrowRight size={18} />
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500 text-lg">
                        {searchTerm ? "No events found matching your search." : "No events available at the moment."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Home;
