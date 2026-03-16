import React, { useEffect, useState } from "react";
import api from "../../services/api";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const res = await api.get("/bookings/my-bookings");
            setBookings(res.data.bookings);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
                Loading your bookings...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    My Bookings
                </h1>

                {bookings.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-500">
                        You have not booked any events yet.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
                            >

                                {/* Event Image */}
                                <img
                                    src={booking.event?.thumbnail}
                                    alt={booking.event?.title}
                                    className="h-48 w-full object-cover"
                                />

                                <div className="p-6">

                                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                                        {booking.event?.title}
                                    </h2>

                                    <div className="space-y-1 text-gray-600 text-sm">
                                        <p>📅 {booking.event?.date?.substring(0, 10)}</p>
                                        <p>📍 {booking.event?.location}</p>
                                        <p>💺 Seats Booked: {booking.numberOfSeats}</p>
                                    </div>

                                    <div className="mt-4 flex justify-between items-center">

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Total Paid
                                            </p>
                                            <p className="text-lg font-bold text-green-600">
                                                ₹ {booking.totalAmount}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p
                                                className={`text-sm font-semibold ${booking.bookingStatus === "confirmed"
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                    }`}
                                            >
                                                {booking.bookingStatus.toUpperCase()}
                                            </p>

                                            <p
                                                className={`text-xs ${booking.paymentStatus === "paid"
                                                        ? "text-green-500"
                                                        : "text-yellow-500"
                                                    }`}
                                            >
                                                Payment: {booking.paymentStatus}
                                            </p>
                                        </div>

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