// src/pages/user/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Ticket,
} from "lucide-react";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Format date to Indian style
  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format currency to INR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
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

  // Payment status badge styles
  const getPaymentBadge = (status) => {
    return status === "paid"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";
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
          <h1 className="text-4xl md:text-5xl font-bold mb-3 flex items-center gap-3">
            <Ticket size={40} className="text-amber-300" />
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

                  {/* Status Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        booking.bookingStatus
                      )}`}
                    >
                      {booking.bookingStatus?.toUpperCase()}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getPaymentBadge(
                        booking.paymentStatus
                      )}`}
                    >
                      {booking.paymentStatus?.toUpperCase()}
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

                  {/* Payment Info */}
                  <div className="pt-4 border-t flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Total Paid</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(booking.totalAmount)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-amber-700 font-semibold">
                      <CreditCard size={18} />
                      {booking.paymentMethod || "Online"}
                    </div>
                  </div>

                  {/* View Event Button */}
                  {booking.event?._id && (
                    <Link
                      to={`/events/${booking.event._id}`}
                      className="block text-center mt-4 bg-[rgb(53,26,8)] hover:bg-[rgb(83,46,24)] text-white py-2 rounded-full font-medium transition"
                    >
                      View Event
                    </Link>
                  )}
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