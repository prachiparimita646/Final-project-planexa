require('dotenv').config();

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app = express();

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

// ── Connect to MongoDB ──
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected to Event_Management_database'))
  .catch(err => console.log('❌ MongoDB connection error:', err.message));

// ── Routes ──
app.use('/api/auth',     require('./route/authRoutes'));
app.use('/api/events',   require('./route/eventRoutes'));
app.use('/api/bookings', require('./route/bookingRoutes'));
app.use('/api/contact',  require('./route/contactRoutes'));

// ── Test route ──
app.get('/', (req, res) => {
  res.json({ message: '🚀 Planexa API is running!' });
});

// ── Start server ──
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});