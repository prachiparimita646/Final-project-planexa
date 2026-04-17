require('dotenv').config();

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const fs       = require('fs');

const app = express();

console.log("ENV CHECK:", process.env.MONGO_URI);

// ── DEBUG (to check your route folder) ──
try {
  console.log("📂 route folder files:", fs.readdirSync('./route'));
} catch (err) {
  console.log("❌ route folder not found");
}

// ── Middleware ──
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// ✅ FIXED MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/planexa";

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err.message));

// ── Routes ──
app.use('/api/auth', require('./route/authRoutes'));
app.use('/api/events', require('./route/eventRoutes'));
app.use('/api/bookings', require('./route/bookingRoutes'));
app.use('/api/contact', require('./route/contactRoutes'));

// ── Test route ──
app.get('/', (req, res) => {
  res.json({ message: '🚀 Planexa API is running!' });
});

// ── Start server ──
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});