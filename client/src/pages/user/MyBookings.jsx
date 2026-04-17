import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  Calendar,
  MapPin,
  Users,
  Ticket,
  X,
  CheckCircle,
} from "lucide-react";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmBookingId, setConfirmBookingId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch bookings from backend
  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/my-bookings");
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Cancel booking handler (called after user confirms)
  const handleCancelBooking = async () => {
    const bookingId = confirmBookingId;
    setConfirmBookingId(null);
    setCancellingId(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      // Remove the booking card from the list
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      // Show success toast
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  // Format date to Indian style
  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Booking status badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= Confirm Cancel Modal ================= */}
      {confirmBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Cancel Booking?</h3>
            <p className="text-gray-500 mb-6 text-sm">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmBookingId(null)}
                className="flex-1 py-2.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium transition"
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelBooking}
                className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium transition"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Success Toast ================= */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white border border-green-200 shadow-xl rounded-2xl px-5 py-4">
          <CheckCircle size={22} className="text-green-500 shrink-0" />
          <p className="text-gray-800 font-medium text-sm">Booking cancelled successfully!</p>
        </div>
      )}

      {/* ================= Hero Section ================= */}
      <div
        className="relative text-white py-16 px-6 shadow-lg overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgb(53,26,8) 0%, rgb(83,46,24) 60%, rgb(120,72,40) 100%)",
        }}
      >
        {/* Decorative Glow Effects */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-300 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-amber-200 opacity-10 rounded-full blur-3xl"></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-10"></div>

        {/* Hero Content */}
        <div className="relative max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-3xl font-bold mb-3 flex items-center gap-3">
            <Ticket size={30} className="text-amber-200" />
            My Bookings
          </h1>
          <p className="text-lg text-amber-100 max-w-2xl">
            View and manage all your event reservations in one place. Keep track
            of your upcoming experiences with ease.
          </p>
        </div>
      </div>

      {/* ================= Bookings Section ================= */}
      <div className="max-w-7xl mx-auto py-12 px-6">
        {bookings.length === 0 ? (
          /* Empty State */
          <div className="bg-white p-12 rounded-3xl shadow text-center">
            <Ticket size={50} className="mx-auto text-amber-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No Bookings Yet
            </h2>
            <p className="text-gray-500 mb-6">
              You haven't booked any events yet. Start exploring exciting events
              now!
            </p>
            <Link
              to="/events"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-semibold transition"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          /* Booking Cards */
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-3xl shadow-md overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition duration-300"
              >
                {/* Event Image */}
                <div className="relative">
                  <img
                    src={
                      booking.event?.thumbnail ||
                      "https://via.placeholder.com/400x250?text=Event"
                    }
                    alt={booking.event?.title}
                    className="h-56 w-full object-cover"
                  />

                  {/* Booking Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        booking.bookingStatus
                      )}`}
                    >
                      {booking.bookingStatus?.toUpperCase()}
                    </span>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Event Title */}
                  <h2 className="absolute bottom-4 left-4 text-white text-xl font-bold">
                    {booking.event?.title || "Event Title"}
                  </h2>
                </div>

                {/* Booking Details */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar size={16} />
                    {formatDate(booking.event?.date)}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin size={16} />
                    {booking.event?.location || "Location TBA"}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Users size={16} />
                    Seats: {booking.numberOfSeats}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    {/* View Event Button */}
                    {booking.event?._id && (
                      <Link
                        to={`/events/${booking.event._id}`}
                        className="flex-1 block text-center bg-[rgb(53,26,8)] hover:bg-[rgb(83,46,24)] text-white py-2 rounded-full font-medium transition"
                      >
                        View Event
                      </Link>
                    )}

                    {/* Cancel Booking Button */}
                    {booking.bookingStatus !== "cancelled" && (
                      <button
                        onClick={() => setConfirmBookingId(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="flex items-center justify-center gap-1 px-4 py-2 rounded-full border border-red-400 text-red-500 hover:bg-red-50 font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingId === booking._id ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <X size={14} />
                            Cancel
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;