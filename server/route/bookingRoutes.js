const express = require("express");
const router = express.Router();

const {
    bookEvent,
    getMyBookings,
    updateBookingStatus,
    getAllBookings
} = require("../controller/bookingController");

const { protect, adminOnly } = require("../middleware/authMiddleware");


router.get("/", protect, adminOnly, getAllBookings);
// Book an event
router.post("/", protect, bookEvent);

// Get logged in user's bookings
router.get("/my-bookings", protect, getMyBookings);

router.put(
  "/:id/status",
  protect,
  adminOnly, // make sure this middleware exists
  updateBookingStatus
);

module.exports = router;