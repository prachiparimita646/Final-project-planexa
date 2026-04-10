// server/route/contactRoutes.js
const express = require("express");
const router  = express.Router();
const {
  addContact, getContacts, updateStatus, deleteContact,
} = require("../controller/contactController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/add",             addContact);
router.get("/get",              protect, adminOnly, getContacts);
router.put("/status/:id",       protect, adminOnly, updateStatus);
router.delete("/delete/:id",    protect, adminOnly, deleteContact);

module.exports = router;