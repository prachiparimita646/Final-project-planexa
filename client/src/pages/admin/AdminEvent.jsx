import React, { useEffect, useState } from "react";
import CreateEventModal from "../../components/admin/CreateEventModal";
import api from "../../services/api";

const AdminEvent = () => {
    const [events, setEvents] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [editEvent, setEditEvent] = useState(null);
    const [viewEvent, setViewEvent] = useState(null);

    // ================= FETCH EVENTS =================
    const fetchEvents = async () => {
        try {
            const res = await api.get(`/events`);
            setEvents(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // ================= DELETE EVENT =================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this event?"
        );
        if (!confirmDelete) return;

        try {
            await api.delete(`/events/${id}`);
            fetchEvents();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Manage Events
                </h1>

                <button
                    onClick={() => {
                        setEditEvent(null);
                        setOpenModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
                >
                    + Create Event
                </button>
            </div>

            {/* Events Grid */}
            {events.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">
                    No events created yet.
                </p>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div
                            key={event._id}
                            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
                        >
                            {/* Thumbnail */}
                            <img
                                src={event.thumbnail}
                                alt={event.title}
                                className="h-48 w-full object-cover"
                            />

                            {/* Content */}
                            <div className="p-5">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {event.title}
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    📍 {event.location}
                                </p>

                                <p className="text-sm text-gray-500">
                                    📅 {event.date?.substring(0, 10)}
                                </p>

                                <p className="text-sm mt-2">
                                    💺 Seats:{" "}
                                    <span className="font-semibold">
                                        {event.availableSeats}
                                    </span>
                                </p>

                                <p className="text-sm text-green-600 font-semibold mt-1">
                                    ₹ {event.price}
                                </p>

                                {/* Buttons */}
                                <div className="flex gap-2 mt-4">

                                    <button
                                        onClick={() => setViewEvent(event)}
                                        className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-1 rounded-lg"
                                    >
                                        View
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEditEvent(event);
                                            setOpenModal(true);
                                        }}
                                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded-lg"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(event._id)}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded-lg"
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create / Edit Modal */}
            <CreateEventModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                fetchEvents={fetchEvents}
                editEvent={editEvent}
            />

            {/* ================= VIEW MODAL ================= */}
            {viewEvent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl">

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">
                                {viewEvent.title}
                            </h2>
                            <button
                                onClick={() => setViewEvent(null)}
                                className="text-gray-500 hover:text-red-500 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <img
                            src={viewEvent.thumbnail}
                            alt=""
                            className="w-full h-60 object-cover rounded-lg"
                        />

                        <div className="mt-4 space-y-2 text-gray-700">
                            <p><strong>Date:</strong> {viewEvent.date?.substring(0, 10)}</p>
                            <p><strong>Time:</strong> {viewEvent.time}</p>
                            <p><strong>Location:</strong> {viewEvent.location}</p>
                            <p><strong>Price:</strong> ₹ {viewEvent.price}</p>
                            <p><strong>Total Seats:</strong> {viewEvent.totalSeats}</p>
                            <p><strong>Available Seats:</strong> {viewEvent.availableSeats}</p>
                            <p className="mt-3"><strong>Description:</strong></p>
                            <p className="text-sm">{viewEvent.description}</p>
                        </div>

                        {/* Gallery */}
                        {viewEvent.images?.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mt-5">
                                {viewEvent.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt=""
                                        className="h-32 w-full object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEvent;