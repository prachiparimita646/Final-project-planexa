const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
} = require("../controller/eventController");

const upload = require("../middleware/upload");

// CREATE EVENT
router.post(
  "/",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  createEvent
);

// GET ALL EVENTS
router.get("/", getAllEvents);

// GET SINGLE EVENT
router.get("/:id", getSingleEvent);

// UPDATE EVENT
router.put(
  "/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateEvent
);

// DELETE EVENT
router.delete("/:id", deleteEvent);

module.exports = router;