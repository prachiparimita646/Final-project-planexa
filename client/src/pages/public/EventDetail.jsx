import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [seats, setSeats] = useState(1);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [message, setMessage] = useState("");

    // ================= FETCH EVENT =================
    const fetchEvent = async () => {
        try {
            const res = await api.get(`/events/${id}`);
            setEvent(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [id]);

    // ================= HANDLE BOOKING =================
    const handleBooking = async () => {
        if (seats <= 0) {
            return setMessage("Please select valid number of seats.");
        }

        if (seats > event.availableSeats) {
            return setMessage("Not enough seats available.");
        }

        try {
            setBookingLoading(true);
            setMessage("");

            const res = await api.post("/bookings", {
                eventId: event._id,
                numberOfSeats: seats,
            });

            setMessage("Booking successful 🎉");

            // Refresh event data to update available seats
            fetchEvent();

        } catch (error) {
            setMessage(
                error.response?.data?.message || "Booking failed"
            );
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-20 text-gray-500">
                Loading event details...
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center mt-20 text-red-500">
                Event not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">

            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-blue-600 font-medium"
            >
                ← Back
            </button>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                <img
                    src={event.thumbnail}
                    alt={event.title}
                    className="w-full h-80 object-cover"
                />

                <div className="p-8">

                    <h1 className="text-3xl font-bold text-gray-800">
                        {event.title}
                    </h1>

                    <div className="mt-4 space-y-2 text-gray-600">
                        <p>📅 {event.date?.substring(0, 10)}</p>
                        <p>⏰ {event.time}</p>
                        <p>📍 {event.location}</p>
                        <p>💺 Available Seats: {event.availableSeats}</p>
                        <p className="text-xl font-bold text-green-600">
                            ₹ {event.price}
                        </p>
                    </div>

                    {/* Description */}
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">
                            About Event
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {event.description}
                        </p>
                    </div>

                    {/* Booking Section */}
                    {event.availableSeats > 0 && (
                        <div className="mt-8 bg-gray-100 p-6 rounded-xl">
                            <h2 className="text-xl font-semibold mb-4">
                                Book Your Seat
                            </h2>

                            <div className="mb-6 bg-white p-5 rounded-2xl shadow-md border">

                                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                                    Select Seats
                                </h3>

                                <div className="flex items-center justify-between">

                                    {/* Seat Counter */}
                                    <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden shadow-sm">

                                        <button
                                            type="button"
                                            onClick={() => seats > 1 && setSeats(seats - 1)}
                                            className="px-4 py-2 text-lg font-bold text-gray-700 hover:bg-gray-200 transition"
                                        >
                                            −
                                        </button>

                                        <input
                                            type="number"
                                            min="1"
                                            max={event.availableSeats}
                                            value={seats}
                                            onChange={(e) =>
                                                setSeats(Number(e.target.value))
                                            }
                                            className="w-16 text-center bg-transparent outline-none font-semibold text-lg"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                seats < event.availableSeats && setSeats(seats + 1)
                                            }
                                            className="px-4 py-2 text-lg font-bold text-gray-700 hover:bg-gray-200 transition"
                                        >
                                            +
                                        </button>

                                    </div>

                                    {/* Total Price */}
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                            Total Amount
                                        </p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ₹ {seats * event.price}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={bookingLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold transition"
                            >
                                {bookingLoading ? "Booking..." : "Confirm Booking"}
                            </button>

                            {message && (
                                <p className="mt-4 text-center text-sm text-red-500">
                                    {message}
                                </p>
                            )}
                        </div>
                    )}

                    {event.availableSeats === 0 && (
                        <button
                            className="mt-8 w-full bg-gray-400 text-white py-3 rounded-xl text-lg font-semibold"
                            disabled
                        >
                            Sold Out
                        </button>
                    )}

                </div>
            </div>
        </div>
    );
};

export default EventDetail;