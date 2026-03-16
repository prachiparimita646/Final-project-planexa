import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Event = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchEvents = async () => {
        try {
            const res = await api.get("/events");
            setEvents(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">

            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800">
                    Upcoming Events
                </h1>
                <p className="text-gray-500 mt-2">
                    Discover and join amazing events
                </p>
            </div>

            {loading && (
                <p className="text-center text-gray-500">Loading events...</p>
            )}

            {!loading && events.length === 0 && (
                <p className="text-center text-gray-500">
                    No events available right now.
                </p>
            )}

            <div className="grid md:grid-cols-3 gap-8">
                {events.map((event) => (
                    <div
                        key={event._id}
                        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
                    >
                        <img
                            src={event.thumbnail}
                            alt={event.title}
                            className="h-48 w-full object-cover"
                        />

                        <div className="p-5">
                            <h2 className="text-xl font-bold text-gray-800">
                                {event.title}
                            </h2>

                            <p className="text-sm text-gray-500 mt-2">
                                📅 {event.date?.substring(0, 10)}
                            </p>

                            <p className="text-sm text-gray-500">
                                📍 {event.location}
                            </p>

                            <p className="text-sm mt-2">
                                💺 Available Seats:{" "}
                                <span className="font-semibold">
                                    {event.availableSeats}
                                </span>
                            </p>

                            <p className="text-lg font-bold text-green-600 mt-2">
                                ₹ {event.price}
                            </p>

                            <button
                                onClick={() => navigate(`/events/${event._id}`)}
                                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Event;