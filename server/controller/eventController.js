const Event = require("../model/Event");

// CREATE EVENT 
exports.createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            date,
            time,
            location,
            price,
            totalSeats,
            availableSeats,
        } = req.body;

        // Thumbnail (required)
        const thumbnailUrl = req.files?.thumbnail
            ? req.files.thumbnail[0].path
            : null;

        // Multiple images
        const imageUrls = req.files?.images
            ? req.files.images.map((file) => file.path)
            : [];

        const event = await Event.create({
            title,
            description,
            date,
            time,
            location,
            price,
            totalSeats,
            availableSeats,
            thumbnail: thumbnailUrl,
            images: imageUrls,
        });

        res.status(201).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



//  GET ALL EVENTS 
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



//  GET SINGLE EVENT 
exports.getSingleEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event)
            return res.status(404).json({ message: "Event not found" });

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



//  UPDATE EVENT
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Update text fields
        event.title = req.body.title || event.title;
        event.description = req.body.description || event.description;
        event.date = req.body.date || event.date;
        event.time = req.body.time || event.time;
        event.location = req.body.location || event.location;
        event.price = req.body.price || event.price;
        event.totalSeats = req.body.totalSeats || event.totalSeats;
        event.availableSeats =
            req.body.availableSeats || event.availableSeats;

        // If new thumbnail uploaded
        if (req.files?.thumbnail) {
            event.thumbnail = req.files.thumbnail[0].path;
        }

        // If new images uploaded
        if (req.files?.images) {
            event.images = req.files.images.map((file) => file.path);
        }

        await event.save();

        res.json({
            success: true,
            message: "Event updated successfully",
            event,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



//  DELETE EVENT
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event)
            return res.status(404).json({ message: "Event not found" });

        await event.deleteOne();

        res.json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};