const Booking = require("../model/Booking");
const Event = require("../model/Event");

exports.bookEvent = async (req, res) => {
    try {
        const { eventId, numberOfSeats } = req.body;

        const userId = req.user._id; 

        if (!numberOfSeats || numberOfSeats <= 0) {
            return res.status(400).json({
                message: "Invalid number of seats",
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
            });
        }

        // Check seat availability
        if (event.availableSeats < numberOfSeats) {
            return res.status(400).json({
                message: "Not enough seats available",
            });
        }

        const totalAmount = event.price * numberOfSeats;

        // Create booking
        const booking = await Booking.create({
            user: userId,
            event: eventId,
            numberOfSeats,
            totalAmount,
            bookingStatus: "confirmed",
            paymentStatus: "pending",
        });

        // Reduce available seats
        event.availableSeats -= numberOfSeats;
        await event.save();

        res.status(201).json({
            success: true,
            message: "Event booked successfully",
            booking,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};



// GET USER BOOKINGS 
exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.user._id;

        const bookings = await Booking.find({ user: userId })
            .populate("event")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            bookings,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// ADMIN UPDATE BOOKING STATUS
exports.updateBookingStatus = async (req, res) => {
    try {
        const { bookingStatus, paymentStatus } = req.body;

        const booking = await Booking.findById(req.params.id).populate("event");

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }

        // If cancelling booking → restore seats
        if (
            bookingStatus === "cancelled" &&
            booking.bookingStatus !== "cancelled"
        ) {
            booking.event.availableSeats += booking.numberOfSeats;
            await booking.event.save();
        }

        // Update status fields if provided
        if (bookingStatus) {
            booking.bookingStatus = bookingStatus;
        }

        if (paymentStatus) {
            booking.paymentStatus = paymentStatus;
        }

        await booking.save();

        res.json({
            success: true,
            message: "Booking status updated successfully",
            booking,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// GET ALL BOOKINGS (ADMIN)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("event", "title date location")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            bookings,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};