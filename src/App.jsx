import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/Register.jsx";
import Events from "./pages/Events.jsx";
import AddEvent from "./components/AddEvent.jsx";
import EditEvent from "./components/EditEvent.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import BookEvent from "./pages/BookEvent.jsx";
import MyTickets from "./pages/MyTickets.jsx";
import Analytics from "./pages/Analytics.jsx";
import AttendeeInsights from "./pages/AttendeeInsights.jsx";

const App = () => {
  return (
    <AuthProvider>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Admin Routes */}
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-event"
            element={
              <ProtectedRoute>
                <AddEvent />
              </ProtectedRoute>
            }
          />
                     <Route
             path="/edit-event/:id"
             element={
               <ProtectedRoute>
                 <EditEvent />
               </ProtectedRoute>
             }
           />
           
           <Route
             path="/analytics"
             element={
               <ProtectedRoute>
                 <Analytics />
               </ProtectedRoute>
             }
           />
           <Route
             path="/attendee-insights"
             element={
               <ProtectedRoute>
                 <AttendeeInsights />
               </ProtectedRoute>
             }
           />
          
          {/* User Routes */}
          <Route
            path="/event/:id"
            element={
              <ProtectedRoute>
                <EventDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:id"
            element={
              <ProtectedRoute>
                <BookEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-tickets"
            element={
              <ProtectedRoute>
                <MyTickets />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="*"
            element={<h1 className="text-center mt-20">404 Not Found</h1>}
          />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
