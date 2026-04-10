const express = require('express');
const router  = express.Router();
const {
  bookEvent, getMyBookings, updateBookingStatus, getAllBookings, deleteBooking,
} = require('../controller/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',             protect, adminOnly, getAllBookings);
router.post('/',            protect, bookEvent);
router.get('/my-bookings',  protect, getMyBookings);
router.put('/:id/status',   protect, adminOnly, updateBookingStatus);
router.delete('/:id',       protect, adminOnly, deleteBooking);

module.exports = router;