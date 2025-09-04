import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getUserTickets, cancelTicket } from "../api";
import { Calendar, MapPin, Clock, Users, QrCode, Download, Share2, X } from "lucide-react";
import QRCode from "qrcode";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrImages, setQrImages] = useState({});

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getUserTickets();
      
      if (response.data.success) {
        const fetchedTickets = response.data.tickets;
        // Normalize shape so UI always has eventName, date, time, venue
        const normalized = fetchedTickets.map((t) => ({
          ...t,
          eventName: t.event?.name || t.eventName,
          date: t.event?.date || t.date,
          time: t.event?.time || t.time,
          venue: t.event?.venue || t.venue,
          price: t.price,
        }));
        setTickets(normalized);
        // Generate QR images for each ticket with rich payload
        const entries = await Promise.all(
          normalized.map(async (ticket) => {
            const payload = JSON.stringify({
              id: ticket.id,
              eventId: ticket.event?.id || ticket.eventId || ticket.event_id,
              eventName: ticket.eventName,
              seatNumber: ticket.seatNumber,
              date: ticket.date,
              time: ticket.time,
              venue: ticket.venue,
              price: ticket.price,
            });
            try {
              const url = await QRCode.toDataURL(payload, { errorCorrectionLevel: 'M', margin: 1, scale: 6 });
              return [ticket.id, url];
            } catch (e) {
              console.error('QR generation failed for ticket', ticket.id, e);
              return [ticket.id, null];
            }
          })
        );
        setQrImages(Object.fromEntries(entries));
      } else {
        console.error("Failed to fetch tickets:", response.data.message);
      }
    } catch (error) {
      console.error("Fetch tickets error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId) => {
    if (window.confirm("Are you sure you want to cancel this ticket?")) {
      try {
        const response = await cancelTicket(ticketId);
        if (response.data.success) {
          alert("Ticket cancelled successfully");
          fetchTickets(); // Refresh the list
        } else {
          alert(response.data.message || "Failed to cancel ticket");
        }
      } catch (error) {
        console.error("Cancel ticket error:", error);
        alert("Failed to cancel ticket. Please try again.");
      }
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-gray-600 bg-gray-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  const handleDownloadTicket = (ticket) => {
    alert(`Downloading ticket ${ticket.id}...`);
  };

  const handleShareTicket = (ticket) => {
    if (navigator.share) {
      navigator.share({
        title: `Ticket for ${ticket.eventName}`,
        text: `I have a ticket for ${ticket.eventName} on ${formatDate(ticket.date)}`,
        url: window.location.href
      });
    } else {
      alert(`Sharing ticket ${ticket.id}...`);
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
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Tickets</h1>
          <p className="text-gray-600">Manage and access your event tickets</p>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No tickets yet</h3>
            <p className="text-gray-500 mb-6">Start by browsing and booking events</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-[#0df38a] text-black font-semibold py-3 px-6 rounded-lg hover:bg-green-400 transition-colors"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                {/* Ticket Header */}
                <div className="bg-gradient-to-r from-[#0df38a] to-green-400 p-4">
                  <div>
                    <h3 className="text-lg font-bold text-black mb-1 truncate">{ticket.eventName}</h3>
                    <p className="text-black/80 text-sm">{ticket.venue}</p>
                    <p className="text-black/80 text-sm">{formatDate(ticket.date)}</p>
                  </div>
                </div>

                {/* Ticket Content */}
                <div className="p-4 space-y-3">
                  {/* Booking Details */}
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-gray-500" size={14} />
                      <span className="text-gray-600">{formatDate(ticket.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-gray-500" size={14} />
                      <span className="text-gray-600">{ticket.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="text-gray-500" size={14} />
                      <span className="text-gray-600">{ticket.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="text-gray-500" size={14} />
                      <span className="text-gray-600">Seat {ticket.seatNumber}</span>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="text-center">
                    {qrImages[ticket.id] ? (
                      <img src={qrImages[ticket.id]} alt={`QR for ticket ${ticket.id}`} className="w-24 h-24 mx-auto" />
                    ) : (
                      <div className="w-24 h-24 mx-auto flex items-center justify-center text-gray-500 text-xs">Loading...</div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{ticket.price} EGP</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyTickets;
