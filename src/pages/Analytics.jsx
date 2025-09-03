import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats, getAllEvents, getAttendeeInsights } from "../api";
import { 
  Search, 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  Filter,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";

const Analytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [statsResponse, eventsResponse, insightsResponse] = await Promise.all([
        getDashboardStats(),
        getAllEvents({ status: 'active', limit: 100 }),
        getAttendeeInsights()
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      if (eventsResponse.data.success) {
        setEvents(eventsResponse.data.events);
        // Set first event as default selected
        if (eventsResponse.data.events.length > 0) {
          setSelectedEvent(eventsResponse.data.events[0]);
        }
      }

      if (insightsResponse.data.success) {
        setInsights(insightsResponse.data.insights);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventInsights = async (eventId) => {
    try {
      const response = await getAttendeeInsights(eventId);
      if (response.data.success) {
        setInsights(response.data.insights);
      }
    } catch (error) {
      console.error("Error fetching event insights:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Get real data from API
  const getAttendeeAgeData = () => {
    if (!insights?.ageDistribution) return [];
    const colors = ["bg-blue-500", "bg-yellow-500", "bg-red-500", "bg-green-500"];
    return insights.ageDistribution.map((item, index) => ({
      age: item.age,
      count: item.count,
      percentage: item.percentage,
      color: colors[index % colors.length]
    }));
  };

  const getAttendeeGenderData = () => {
    if (!insights?.genderDistribution) return [];
    const colors = ["bg-blue-500", "bg-pink-500"];
    return insights.genderDistribution.map((item, index) => ({
      gender: item.gender,
      count: item.count,
      percentage: item.percentage,
      color: colors[index % colors.length]
    }));
  };

  const getAttendeeInterestsData = () => {
    if (!insights?.interestsDistribution) return [];
    const colors = ["bg-blue-500", "bg-green-500", "bg-orange-500", "bg-red-500", "bg-purple-500", "bg-yellow-500"];
    return insights.interestsDistribution.map((item, index) => ({
      interest: item.interest,
      count: item.count,
      percentage: item.percentage,
      color: colors[index % colors.length]
    }));
  };

  const getAttendeeLocationsData = () => {
    if (!insights?.locationDistribution) return [];
    const colors = ["bg-blue-500", "bg-red-500", "bg-purple-500", "bg-orange-500", "bg-green-500"];
    return insights.locationDistribution.map((item, index) => ({
      location: item.location,
      count: item.count,
      percentage: item.percentage,
      color: colors[index % colors.length]
    }));
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
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Analytics & Reports - All Events
          </h1>
          <p className="text-gray-600">Comprehensive analytics and reports across all events</p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0df38a]"
              />
            </div>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-200">
              <Filter size={16} />
              Filter
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
              <Users size={16} />
              <span>Attendees: {insights?.totalAttendees || 0}</span>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        {insights && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Age Distribution Card */}
            {getAttendeeAgeData().length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">ATTENDEE AGE</h4>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {getAttendeeAgeData()[0]?.age || 'N/A'}
                </div>
                <div className="text-sm text-gray-500">
                  {getAttendeeAgeData()[0]?.count || 0} attendees ({getAttendeeAgeData()[0]?.percentage || 0}%)
                </div>
              </div>
            )}

            {/* Gender Distribution Card */}
            {getAttendeeGenderData().length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">ATTENDEE GENDER</h4>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {getAttendeeGenderData()[0]?.gender || 'N/A'}
                </div>
                <div className="text-sm text-gray-500">
                  {getAttendeeGenderData()[0]?.count || 0} attendees ({getAttendeeGenderData()[0]?.percentage || 0}%)
                </div>
              </div>
            )}

            {/* Location Distribution Card */}
            {getAttendeeLocationsData().length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">ATTENDEE LOCATION</h4>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {getAttendeeLocationsData()[0]?.location || 'N/A'}
                </div>
                <div className="text-sm text-gray-500">
                  {getAttendeeLocationsData()[0]?.count || 0} attendees ({getAttendeeLocationsData()[0]?.percentage || 0}%)
                </div>
              </div>
            )}

            {/* Interests Distribution Card */}
            {getAttendeeInterestsData().length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">ATTENDEE INTERESTS</h4>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {getAttendeeInterestsData()[0]?.interest || 'N/A'}
                </div>
                <div className="text-sm text-gray-500">
                  {getAttendeeInterestsData()[0]?.count || 0} attendees ({getAttendeeInterestsData()[0]?.percentage || 0}%)
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Attendee Age Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">ATTENDEE AGE</h3>
              
              {/* Legend */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                {getAttendeeAgeData().map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span>{item.age}</span>
                  </div>
                ))}
              </div>
              
              {/* Chart */}
              <div className="h-48 bg-gray-50 rounded-lg p-4">
                <div className="flex items-end justify-between h-full gap-2">
                  {getAttendeeAgeData().map((item, index) => {
                    const maxCount = Math.max(...getAttendeeAgeData().map(d => d.count));
                    const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <div 
                          className={`w-8 rounded-t ${item.color}`}
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs text-gray-500">{item.count}</span>
                        <span className="text-xs text-gray-400">{item.age}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Attendee Gender Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">ATTENDEE GENDER</h3>
              
              {/* Legend */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                {getAttendeeGenderData().map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span>{item.gender}</span>
                  </div>
                ))}
              </div>
              
              {/* Chart */}
              <div className="h-48 bg-gray-50 rounded-lg p-4">
                <div className="flex items-end justify-between h-full gap-2">
                  {getAttendeeGenderData().map((item, index) => {
                    const maxCount = Math.max(...getAttendeeGenderData().map(d => d.count));
                    const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <div 
                          className={`w-8 rounded-t ${item.color}`}
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs text-gray-500">{item.count}</span>
                        <span className="text-xs text-gray-400">{item.gender}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Attendee Interests */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">ATTENDEE INTERESTS</h3>
              
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {/* Donut Chart */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {getAttendeeInterestsData().map((item, index) => {
                      const total = getAttendeeInterestsData().reduce((sum, d) => sum + d.count, 0);
                      const percentage = (item.count / total) * 100;
                      const startAngle = getAttendeeInterestsData()
                        .slice(0, index)
                        .reduce((sum, d) => sum + (d.count / total) * 360, 0);
                      const endAngle = startAngle + (percentage / 100) * 360;
                      
                      const x1 = 50 + 35 * Math.cos(startAngle * Math.PI / 180);
                      const y1 = 50 + 35 * Math.sin(startAngle * Math.PI / 180);
                      const x2 = 50 + 35 * Math.cos(endAngle * Math.PI / 180);
                      const y2 = 50 + 35 * Math.sin(endAngle * Math.PI / 180);
                      
                      const largeArcFlag = percentage > 50 ? 1 : 0;
                      
                      return (
                        <path
                          key={index}
                          d={`M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          fill={item.color.replace('bg-', '').includes('blue') ? '#3B82F6' : 
                                item.color.replace('bg-', '').includes('green') ? '#10B981' :
                                item.color.replace('bg-', '').includes('orange') ? '#F59E0B' : '#EF4444'}
                        />
                      );
                    })}
                  </svg>
                  
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{insights?.totalAttendees || 0}</div>
                      <div className="text-sm text-gray-500">Total</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="mt-4 space-y-2">
                {getAttendeeInterestsData().map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span>{item.interest}</span>
                    </div>
                    <span className="font-semibold">{item.count} ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Attendee Locations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">ATTENDEE LOCATIONS</h3>
              
              {/* Bar Chart */}
              <div className="h-32 mb-4">
                <div className="flex items-end justify-between h-full gap-2">
                  {getAttendeeLocationsData().map((item, index) => {
                    const maxCount = Math.max(...getAttendeeLocationsData().map(d => d.count));
                    const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <div 
                          className={`w-8 rounded-t ${item.color}`}
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs text-gray-500">{item.count}</span>
                        <span className="text-xs text-gray-400">{item.location}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Table */}
              <div className="space-y-2">
                {getAttendeeLocationsData().map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span>{item.location}</span>
                    </div>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
