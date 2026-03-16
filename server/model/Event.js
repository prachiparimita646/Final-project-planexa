const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        date: {
            type: Date,
            required: true,
        },

        time: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            default: 0,
        },

        totalSeats: {
            type: Number,
            required: true,
        },

        availableSeats: {
            type: Number,
            required: true,
        },

        thumbnail: {
            type: String,
        },

        images: [
            {
                type: String,
            },
        ],

    },
    { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);