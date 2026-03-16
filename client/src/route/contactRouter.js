const express = require("express");
const { AddContact } = require("../controller/contactController");
const { getContacts } = require("../../../server/controller/contactController");
const router = express.Router();
router.post("/add", AddContact);
router.get("/get", getContacts);

module.exports = router;