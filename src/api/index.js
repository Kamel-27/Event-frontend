import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://event-backend-kohl-nine.vercel.app/api",
  withCredentials: true,
});

// Auth API functions
export const getProfile = async () => {
  const { data } = await API.get("/auth/profile");
  return data;
};

export const login = (formData) => API.post("/auth/login", formData);
export const register = (formData) => API.post("/auth/register", formData);
export const logout = () => API.post("/auth/logout");

// Event API functions
export const createEvent = (eventData) => API.post("/events", eventData);
export const getAllEvents = (params) => API.get("/events", { params });
export const getEvent = (id) => API.get(`/events/${id}`);
export const updateEvent = (id, eventData) =>
  API.put(`/events/${id}`, eventData);
export const deleteEvent = (id) => API.delete(`/events/${id}`);
export const getUserEvents = (params) =>
  API.get("/events/user/events", { params });

// Ticket API functions
export const bookTicket = (ticketData) => API.post("/tickets/book", ticketData);
export const getUserTickets = () => API.get("/tickets/my-tickets");
export const checkInTicket = (qrCode) =>
  API.post("/tickets/check-in", { qrCode });
export const cancelTicket = (ticketId) =>
  API.put(`/tickets/cancel/${ticketId}`);
export const getAllTickets = () => API.get("/tickets/all");

// Analytics API functions
export const getDashboardStats = () => API.get("/analytics/dashboard");
export const getUserDemographics = () => API.get("/analytics/demographics");
export const getEventPerformance = () => API.get("/analytics/performance");
export const getAttendeeInsights = (eventId = null) =>
  API.get("/analytics/attendee-insights", {
    params: eventId ? { eventId } : {},
  });
