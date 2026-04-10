const Booking = require("../model/Booking");
const Event   = require("../model/Event");

exports.bookEvent = async (req, res) => {
  try {
    const { eventId, numberOfSeats } = req.body;
    const userId = req.user._id;
    if (!numberOfSeats || numberOfSeats <= 0) return res.status(400).json({ message: "Invalid number of seats" });
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.availableSeats < numberOfSeats) return res.status(400).json({ message: "Not enough seats available" });
    const totalAmount = event.price * numberOfSeats;
    const booking = await Booking.create({ user: userId, event: eventId, numberOfSeats, totalAmount, bookingStatus: "confirmed", paymentStatus: "pending" });
    event.availableSeats -= numberOfSeats;
    await event.save();
    res.status(201).json({ success: true, message: "Event booked successfully", booking });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("event").sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id).populate("event");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (bookingStatus === "cancelled" && booking.bookingStatus !== "cancelled") {
      booking.event.availableSeats += booking.numberOfSeats;
      await booking.event.save();
    }
    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    await booking.save();
    res.json({ success: true, message: "Booking status updated", booking });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("event", "title date location")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ── Delete booking (admin) ──
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("event");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    // Restore seats if booking was confirmed
    if (booking.bookingStatus === "confirmed" && booking.event) {
      booking.event.availableSeats += booking.numberOfSeats;
      await booking.event.save();
    }
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Booking deleted" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};