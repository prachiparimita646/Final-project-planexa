const Event = require("../model/Event");

// ── Get all events ──
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Get single event ──
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Create event (admin) ──
exports.createEvent = async (req, res) => {
  try {
    const {
      title, description, category, date, time,
      location, price, totalSeats, availableSeats, thumbnail,
    } = req.body;

    if (!title || !date || !location || !price || !totalSeats) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const event = await Event.create({
      title,
      description,
      category:       category || "Other",
      date,
      time,
      location,
      price:          Number(price),
      totalSeats:     Number(totalSeats),
      availableSeats: availableSeats !== undefined ? Number(availableSeats) : Number(totalSeats),
      thumbnail:      thumbnail || "",
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Update event (admin) ──
exports.updateEvent = async (req, res) => {
  try {
    const {
      title, description, category, date, time,
      location, price, totalSeats, availableSeats, thumbnail,
    } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (title)          event.title          = title;
    if (description)    event.description    = description;
    if (category)       event.category       = category;
    if (date)           event.date           = date;
    if (time)           event.time           = time;
    if (location)       event.location       = location;
    if (price)          event.price          = Number(price);
    if (totalSeats)     event.totalSeats     = Number(totalSeats);
    if (availableSeats !== undefined) event.availableSeats = Number(availableSeats);
    if (thumbnail !== undefined)      event.thumbnail      = thumbnail;

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Delete event (admin) ──
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};