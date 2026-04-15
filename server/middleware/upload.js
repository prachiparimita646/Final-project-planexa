const multer = require("multer");

// Store file in memory (buffer)
const storage = multer.memoryStorage();

// Optional: file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpg, png, webp allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;