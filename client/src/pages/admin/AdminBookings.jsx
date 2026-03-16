import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const res = await api.get("/bookings");
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

    const updateStatus = async (id, bookingStatus, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/status`, {
                bookingStatus,
                paymentStatus,
            });

            fetchBookings(); // refresh
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading bookings...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">

                <h1 className="text-3xl font-bold mb-8">
                    Admin - All Bookings
                </h1>

                <div className="bg-white rounded-2xl shadow overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Event</th>
                                <th className="p-4">Seats</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Booking Status</th>
                                <th className="p-4">Payment</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {bookings.map((booking) => (
                                <tr
                                    key={booking._id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-4">
                                        <div>
                                            <p className="font-semibold">
                                                {booking.user?.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {booking.user?.email}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <p className="font-medium">
                                            {booking.event?.title}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {booking.event?.date?.substring(0, 10)}
                                        </p>
                                    </td>

                                    <td className="p-4">
                                        {booking.numberOfSeats}
                                    </td>

                                    <td className="p-4 font-semibold text-green-600">
                                        ₹ {booking.totalAmount}
                                    </td>

                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.bookingStatus === "confirmed"
                                                    ? "bg-green-100 text-green-600"
                                                    : booking.bookingStatus === "cancelled"
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-yellow-100 text-yellow-600"
                                                }`}
                                        >
                                            {booking.bookingStatus}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.paymentStatus === "paid"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-yellow-100 text-yellow-600"
                                                }`}
                                        >
                                            {booking.paymentStatus}
                                        </span>
                                    </td>

                                    <td className="p-4 flex gap-2 flex-wrap">

                                        {booking.bookingStatus !== "confirmed" && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        booking._id,
                                                        "confirmed",
                                                        booking.paymentStatus
                                                    )
                                                }
                                                className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                                            >
                                                Confirm
                                            </button>
                                        )}

                                        {booking.bookingStatus !== "cancelled" && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        booking._id,
                                                        "cancelled",
                                                        booking.paymentStatus
                                                    )
                                                }
                                                className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                                            >
                                                Cancel
                                            </button>
                                        )}

                                        {booking.paymentStatus !== "paid" && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        booking._id,
                                                        booking.bookingStatus,
                                                        "paid"
                                                    )
                                                }
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                                            >
                                                Mark Paid
                                            </button>
                                        )}

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default AdminBookings;