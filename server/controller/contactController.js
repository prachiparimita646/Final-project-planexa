// server/controller/contactController.js
const Contact = require("../model/Contact");

// ── Add contact message ──
exports.addContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ status: false, message: "Name, email and message are required" });
    }
    const contact = await Contact.create({ name, email, phone, message, status: "unread" });
    res.status(201).json({ status: true, message: "Message sent successfully", contact });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ── Get all contacts (admin) ──
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ status: true, contact: contacts });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ── Update status — READ or REPLIED ──
// ✅ This is the key fix: findByIdAndUpdate with { new: true } saves to MongoDB
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["unread", "read", "replied"].includes(status)) {
      return res.status(400).json({ status: false, message: "Invalid status value" });
    }
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!contact) return res.status(404).json({ status: false, message: "Message not found" });
    res.json({ status: true, message: "Status updated", contact });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ── Delete contact ──
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ status: false, message: "Message not found" });
    res.json({ status: true, message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};