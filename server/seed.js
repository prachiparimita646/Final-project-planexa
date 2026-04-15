require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs'); 

const Event   = require('./model/Event');
const User    = require('./model/User');
const Booking = require('./model/Booking');
const Contact = require('./model/Contact');

//  EVENTS DATA
const eventsData = [
  {
    title: "Rock Concert 2025", description: "An electrifying rock concert featuring top artists from around the world. Experience the ultimate live music extravaganza with stunning light shows and jaw-dropping performances.",
    date: new Date("2025-06-15"), time: "07:00 PM", location: "Madison Square Garden, New York",
    price: 490, totalSeats: 500, availableSeats: 180,
    thumbnail: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Tech Conference 2025", description: "Join the brightest minds in tech for three days of keynotes, workshops, and networking. Topics include AI, blockchain, Web3 and the future of software development.",
    date: new Date("2025-07-10"), time: "09:00 AM", location: "Moscone Center, San Francisco",
    price: 2990, totalSeats: 300, availableSeats: 120,
    thumbnail: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Food Festival", description: "A celebration of world cuisines featuring 80+ food stalls, live cooking demonstrations, cocktail bars and live music throughout the day.",
    date: new Date("2025-08-05"), time: "11:00 AM", location: "Grant Park, Chicago",
    price: 250, totalSeats: 500, availableSeats: 0,
    thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Annual Business Summit", description: "The premier annual gathering for business leaders, entrepreneurs and investors. Keynote speeches, panel discussions and an exclusive networking dinner.",
    date: new Date("2025-09-20"), time: "10:00 AM", location: "JW Marriott, Los Angeles",
    price: 790, totalSeats: 200, availableSeats: 112,
    thumbnail: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Comedy Night Live", description: "A night of non-stop laughter featuring stand-up sets from nationally acclaimed comedians. Two-drink minimum included with entry.",
    date: new Date("2025-09-20"), time: "08:30 PM", location: "Laugh Factory, Los Angeles",
    price: 390, totalSeats: 200, availableSeats: 105,
    thumbnail: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Winter Gala 2025", description: "The most glamorous gala of the year. A black-tie affair with a five-course dinner, live orchestra, charity auction and a glittering awards ceremony.",
    date: new Date("2025-12-10"), time: "07:30 PM", location: "Grand Hyatt, New York City",
    price: 1500, totalSeats: 250, availableSeats: 238,
    thumbnail: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Startup Summit India", description: "India's most anticipated startup ecosystem event. Pitch competitions, VC matchmaking and masterclasses from billion-dollar founders.",
    date: new Date("2025-11-01"), time: "09:30 AM", location: "HICC, Hyderabad",
    price: 1200, totalSeats: 400, availableSeats: 170,
    thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Yoga & Wellness Retreat", description: "A 3-day wellness retreat on the banks of the Ganga. Sunrise yoga, meditation workshops, Ayurvedic meals and sound healing sessions.",
    date: new Date("2025-10-12"), time: "06:00 AM", location: "Rishikesh, Uttarakhand",
    price: 3500, totalSeats: 60, availableSeats: 22,
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Art & Culture Fest", description: "A vibrant celebration of Indian art and culture. Live painting, folk performances, craft bazaars and interactive workshops for all age groups.",
    date: new Date("2025-10-25"), time: "10:00 AM", location: "India Habitat Centre, Delhi",
    price: 199, totalSeats: 800, availableSeats: 530,
    thumbnail: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Classical Music Night", description: "An enchanting evening of classical masterpieces performed by a world-renowned orchestra. Beethoven, Mozart and Debussy at Carnegie Hall.",
    date: new Date("2025-11-22"), time: "06:30 PM", location: "Carnegie Hall, New York",
    price: 850, totalSeats: 300, availableSeats: 300,
    thumbnail: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=800&q=80",
  },
  {
    title:"New Year Party 2026",
    description:"Celebrate the new year with music, food and fireworks.",
    date:new Date("2026-01-01"),
    time:"09:00 PM",
    location:"Gateway of India, Mumbai",
    price:999,
    totalSeats: 300,
    availableSeats:300,
    thumbnail:"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
  },
  {
    title:"Holi Festival Celebration",
    description:"Play Holi with colors, music and organic gulal. Food and drinks included.",
    date: new Date("2026-03-14"),
    time:"10:00 AM",
    location:"Lodhi Garden, Delhi",  price: 399,
    totalSeats:500,
    availableSeats:500,
    thumbnail:"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
];

//  USERS DATA
const usersData = [
  { name: "Admin User",     email: "admin@planexa.com",  password: "admin123",   role: "admin" },
  { name: "Priya Sharma",   email: "priya@email.com",    password: "password123", role: "user"  },
  { name: "Arjun Mehta",    email: "arjun@email.com",    password: "password123", role: "user"  },
  { name: "Sneha Rao",      email: "sneha@email.com",    password: "password123", role: "user"  },
  { name: "Rahul Verma",    email: "rahul@email.com",    password: "password123", role: "user"  },
  { name: "Divya Nair",     email: "divya@email.com",    password: "password123", role: "user"  },
  { name: "Karan Singh",    email: "karan@email.com",    password: "password123", role: "user"  },
  { name: "Meera Pillai",   email: "meera@email.com",    password: "password123", role: "user"  },
  { name: "Vikram Joshi",   email: "vikram@email.com",   password: "password123", role: "admin" },
  { name: "Anita Das",      email: "anita@email.com",    password: "password123", role: "user"  },
  { name: "Rohan Bose",     email: "rohan@email.com",    password: "password123", role: "user"  },
  { name: "Pooja Iyer",     email: "pooja@email.com",    password: "password123", role: "user"  },
];


//  CONTACTS DATA
const contactsData = [
  { name: "Priya Sharma",  email: "priya@email.com",  phone: "+91 98001 00001", message: "Hi, I booked tickets for the Rock Concert 2025 but need to cancel due to a family emergency. Could you help me with the refund process?" },
  { name: "Arjun Mehta",   email: "arjun@email.com",  phone: "+91 98001 00002", message: "I have a standard ticket for the Tech Conference. Is there an option to upgrade to a VIP seat? Please let me know the available options." },
  { name: "Sneha Rao",     email: "sneha@email.com",  phone: "+91 98001 00003", message: "Hello, I represent a local events company and would love to explore a partnership opportunity with Planexa." },
  { name: "Rahul Verma",   email: "rahul@email.com",  phone: "+91 98001 00004", message: "I tried booking tickets for the Comedy Night multiple times and my payment keeps failing but the amount has been deducted. Please resolve urgently." },
  { name: "Divya Nair",    email: "divya@email.com",  phone: "+91 98001 00005", message: "Just wanted to share how amazing the Beach Party event was! The organization was superb and the music was fantastic." },
  { name: "Karan Singh",   email: "karan@email.com",  phone: "+91 98001 00006", message: "We are a group of 25 people planning to attend the Annual Meetings event. Do you offer group discounts for bookings above 10 people?" },
  { name: "Meera Pillai",  email: "meera@email.com",  phone: "+91 98001 00007", message: "I successfully booked for the Rock Concert but the booking is not showing in My Bookings section. I have the payment confirmation email." },
  { name: "Vikram Joshi",  email: "vikram@email.com", phone: "+91 98001 00008", message: "Our company is looking to host a corporate event for 150 employees. Can Planexa help us organize this? Budget is flexible." },
];


//  MAIN SEED FUNCTION
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Connected to:', process.env.MONGO_URI);
    console.log('');

    // ── 1. Seed Events ──
    await Event.deleteMany({});
    const events = await Event.insertMany(eventsData);
    console.log(`Inserted ${events.length} events`);

    // ── 2. Seed Users (hash passwords) ──
    await User.deleteMany({});
    const hashedUsers = await Promise.all(
      usersData.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10),
      }))
    );
    const users = await User.insertMany(hashedUsers);
    console.log(`Inserted ${users.length} users`);
    console.log(`  Admin login → email: admin@planexa.com | password: admin123`);

    // ── 3. Seed Bookings (link real user + event IDs) ──
    await Booking.deleteMany({});
    const bookingsData = [
      { user: users[1]._id, event: events[0]._id, numberOfSeats: 1, totalAmount: 490,  bookingStatus: "confirmed", paymentStatus: "paid"    },
      { user: users[2]._id, event: events[1]._id, numberOfSeats: 2, totalAmount: 5980, bookingStatus: "confirmed", paymentStatus: "pending"  },
      { user: users[3]._id, event: events[2]._id, numberOfSeats: 1, totalAmount: 250,  bookingStatus: "confirmed", paymentStatus: "paid"    },
      { user: users[4]._id, event: events[4]._id, numberOfSeats: 1, totalAmount: 390,  bookingStatus: "cancelled", paymentStatus: "pending"  },
      { user: users[5]._id, event: events[0]._id, numberOfSeats: 2, totalAmount: 980,  bookingStatus: "confirmed", paymentStatus: "paid"    },
      { user: users[6]._id, event: events[3]._id, numberOfSeats: 1, totalAmount: 790,  bookingStatus: "confirmed", paymentStatus: "pending"  },
      { user: users[7]._id, event: events[0]._id, numberOfSeats: 2, totalAmount: 980,  bookingStatus: "confirmed", paymentStatus: "paid"    },
      { user: users[8]._id, event: events[5]._id, numberOfSeats: 1, totalAmount: 1500, bookingStatus: "confirmed", paymentStatus: "paid"    },
      { user: users[9]._id, event: events[1]._id, numberOfSeats: 1, totalAmount: 2990, bookingStatus: "cancelled", paymentStatus: "pending"  },
      { user: users[10]._id, event: events[7]._id, numberOfSeats: 2, totalAmount: 7000, bookingStatus: "confirmed", paymentStatus: "paid"   },
    ];
    const bookings = await Booking.insertMany(bookingsData);
    console.log(` Inserted ${bookings.length} bookings`);

    // ── 4. Seed Contacts ──
    await Contact.deleteMany({});
    const contacts = await Contact.insertMany(contactsData);
    console.log(`Inserted ${contacts.length} contacts`);

    console.log('');
    console.log(' All collections seeded successfully!');
    console.log('   Open MongoDB Compass ');
    console.log('   → events, users, bookings, contacts');
    console.log('');
    console.log('   Admin login credentials:');
    console.log('   Email:admin@planexa.com');
    console.log('   Password:admin123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();