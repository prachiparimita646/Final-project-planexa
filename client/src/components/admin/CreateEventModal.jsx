import React, { useState, useEffect } from "react";
import api from "../../services/api";

const CreateEventModal = ({ isOpen, onClose, fetchEvents, editEvent }) => {

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        price: 0,
        totalSeats: 0,
        availableSeats: 0,
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [images, setImages] = useState([]);

    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);

    // ================= PREFILL WHEN EDITING =================
    useEffect(() => {
        if (editEvent) {
            setFormData({
                title: editEvent.title || "",
                description: editEvent.description || "",
                date: editEvent.date?.substring(0, 10) || "",
                time: editEvent.time || "",
                location: editEvent.location || "",
                price: editEvent.price || 0,
                totalSeats: editEvent.totalSeats || 0,
                availableSeats: editEvent.availableSeats || 0,
            });

            // Existing images
            setThumbnailPreview(editEvent.thumbnail || null);
            setImagePreviews(editEvent.images || []);
        } else {
            resetForm();
        }
    }, [editEvent]);

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            date: "",
            time: "",
            location: "",
            price: 0,
            totalSeats: 0,
            availableSeats: 0,
        });
        setThumbnail(null);
        setImages([]);
        setThumbnailPreview(null);
        setImagePreviews([]);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ================= THUMBNAIL PREVIEW =================
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);

        if (file) {
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    // ================= MULTIPLE IMAGE PREVIEW =================
    const handleImagesChange = (e) => {
        const files = [...e.target.files];
        setImages(files);

        const previews = files.map((file) =>
            URL.createObjectURL(file)
        );
        setImagePreviews(previews);
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        // Only append if new thumbnail selected
        if (thumbnail) {
            data.append("thumbnail", thumbnail);
        }

        // Append new gallery images
        images.forEach((img) => {
            data.append("images", img);
        });

        try {
            if (editEvent) {
                await api.put(`/events/${editEvent._id}`, data);
            } else {
                await api.post(`/events`, data);
            }

            fetchEvents();
            onClose();
            resetForm();
        } catch (error) {
            console.log(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white w-[800px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editEvent ? "Update Event" : "Create New Event"}
                    </h2>
                    <button
                        onClick={() => {
                            onClose();
                            resetForm();
                        }}
                        className="text-gray-500 hover:text-red-500 text-xl"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-2 gap-6">

                        {/* LEFT SIDE */}
                        <div className="space-y-4">

                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Title"
                                className="w-full border p-2 rounded-lg"
                            />

                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full border p-2 rounded-lg"
                            />

                            <input
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                placeholder="Time"
                                className="w-full border p-2 rounded-lg"
                            />

                            <input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Location"
                                className="w-full border p-2 rounded-lg"
                            />
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="space-y-4">

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Price"
                                className="w-full border p-2 rounded-lg"
                            />

                            <input
                                type="number"
                                name="totalSeats"
                                value={formData.totalSeats}
                                onChange={handleChange}
                                placeholder="Total Seats"
                                className="w-full border p-2 rounded-lg"
                            />

                            <input
                                type="number"
                                name="availableSeats"
                                value={formData.availableSeats}
                                onChange={handleChange}
                                placeholder="Available Seats"
                                className="w-full border p-2 rounded-lg"
                            />

                            {/* Thumbnail Upload */}
                            <div>
                                <label className="text-sm font-medium">Thumbnail</label>
                                <input
                                    type="file"
                                    onChange={handleThumbnailChange}
                                    className="w-full mt-1 text-sm"
                                />

                                {thumbnailPreview && (
                                    <img
                                        src={thumbnailPreview}
                                        alt="Preview"
                                        className="mt-2 h-32 w-full object-cover rounded-lg"
                                    />
                                )}
                            </div>

                            {/* Gallery Upload */}
                            <div>
                                <label className="text-sm font-medium">Gallery Images</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleImagesChange}
                                    className="w-full mt-1 text-sm"
                                />

                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        {imagePreviews.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt=""
                                                className="h-24 w-full object-cover rounded-lg"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Description */}
                    <textarea
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="w-full border p-2 rounded-lg"
                    />

                    {/* Footer */}
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                resetForm();
                            }}
                            className="px-5 py-2 rounded-lg bg-gray-400 text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg bg-blue-600 text-white"
                        >
                            {editEvent ? "Update Event" : "Create Event"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateEventModal;