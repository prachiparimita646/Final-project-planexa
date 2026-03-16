import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import herovideo from "../../assets/herovideo.mp4";
import logo from "../../assets/logo.png";
import { useState, useEffect } from "react";
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  Users, 
  Zap, 
  Shield, 
  ChevronRight,
  MessageCircle,
  Smartphone,
  Gift,
  Clock,
  Award,
  CreditCard,
  ThumbsUp
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();

  const featuredEvents = [
    {
      id: 1,
      name: "Rock Concert 2025",
      date: "June 15, 2025",
      location: "Madison Square Garden, NY",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: "$49",
    },
    {
      id: 2,
      name: "Tech Conference",
      date: "July 10-12, 2025",
      location: "Moscone Center, SF",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: "$299",
    },
    {
      id: 3,
      name: "Food Festival",
      date: "August 5, 2025",
      location: "Grant Park, Chicago",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: "$25",
    },
    {
      id: 4,
      name: "Annual Meetings",
      date: "September 20, 2025",
      location: "Laugh Factory, LA",
      image: "https://plus.unsplash.com/premium_photo-1724753995771-8ee6954e78da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YW5udWFsJTIwbWVldGluZ3xlbnwwfHwwfHx8MA%3D%3D",
      price: "$79",
    },
    {
      id: 5,
      name: "Birthday Party",
      date: "September 20, 2025",
      location: "Laugh Factory, LA",
      image: "https://images.unsplash.com/photo-1741969494307-55394e3e4071?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njh8fGJpcnRoZGF5JTIwcGFydHl8ZW58MHx8MHx8fDA%3D",
      price: "$35",
    },
    {
      id: 6,
      name: "Wedding Night",
      date: "September 20, 2025",
      location: "Laugh Factory, LA",
      image: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aW5kaWFuJTIwd2VkZGluZ3xlbnwwfHwwfHx8MA%3D%3D",
      price: "$150",
    },
    {
      id: 7,
      name: "Beach Party",
      date: "September 20, 2025",
      location: "Laugh Factory, LA",
      image: "https://images.unsplash.com/photo-1560359614-870d1a7ea91d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhY2glMjBwYXJ0eXxlbnwwfHwwfHx8MA%3D%3D",
      price: "$45",
    },
    {
      id: 8,
      name: "Comedy Night",
      date: "September 20, 2025",
      location: "Laugh Factory, LA",
      image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: "$39",
    },
  ];

  // Additional features data
  const moreFeatures = [
    {
      icon: <Smartphone className="text-indigo-600" size={32} />,
      title: "Mobile App",
      description: "Book events on the go with our iOS and Android apps.",
    },
    {
      icon: <Gift className="text-purple-600" size={32} />,
      title: "Rewards Program",
      description: "Earn points with every booking and redeem for discounts.",
    },
    {
      icon: <Clock className="text-green-600" size={32} />,
      title: "24/7 Support",
      description: "Our customer support team is always here to help you.",
    },
    {
      icon: <Award className="text-yellow-600" size={32} />,
      title: "Verified Events",
      description: "All events are vetted to ensure quality and authenticity.",
    },
    {
      icon: <CreditCard className="text-red-500" size={32} />,
      title: "Secure Payments",
      description: "Multiple payment options with bank-level security.",
    },
    {
      icon: <ThumbsUp className="text-blue-600" size={32} />,
      title: "Easy Refunds",
      description: "Hassle-free cancellation and refund policy.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-white relative overflow-x-hidden">
      {/* Decorative floating blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-3000"></div>

      {/* HERO SECTION */}
      <div className="relative h-screen bg-gradient-white flex items-center justify-center overflow-x-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={herovideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <img src={logo}  className="h-12 w-auto object-contain" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30"></div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center text-white">
          
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight animate-fade-in-up">
            Let's Create Amazing Events with <br />
            <span className="text-white bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
             The Event Utsava By Planexa🎉
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto animate-fade-in-up animation-delay-300">
            Explore concerts, conferences, workshops, Weddings and more.
            Book your seats instantly and enjoy unforgettable experiences.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex justify-center gap-4 flex-wrap animate-fade-in-up animation-delay-600">
            {user ? (
              <>
                <Link
                  to="/events"
                  className="group bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition transform hover:scale-105 flex items-center gap-2"
                >
                  Browse Events <ChevronRight className="group-hover:translate-x-1 transition" size={20} />
                </Link>
                <Link
                  to="/my-bookings"
                  className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition transform hover:scale-105"
                >
                  My Bookings
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition transform hover:scale-105 flex items-center gap-2"
                >
                  Get Started <ChevronRight className="group-hover:translate-x-1 transition" size={20} />
                </Link>
                <Link
                  to="/events"
                  className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition transform hover:scale-105"
                >
                  Explore Events
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center py-16 relative z-10 -mt-20">
        <div className="group bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-8 hover:scale-105 transition duration-300 hover:shadow-2xl border border-white/50 hover:border-indigo-200">
          <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-indigo-600 transition-colors">
            <Calendar className="text-indigo-600 group-hover:text-white transition-colors" size={32} />
          </div>
          <h2 className="text-xl font-bold mt-4">Upcoming Events</h2>
          <p className="text-gray-600 mt-2">
            Discover events happening near you.
          </p>
        </div>
        <div className="group bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-8 hover:scale-105 transition duration-300 hover:shadow-2xl border border-white/50 hover:border-indigo-200">
          <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-purple-600 transition-colors">
            <Ticket className="text-purple-600 group-hover:text-white transition-colors" size={32} />
          </div>
          <h2 className="text-xl font-bold mt-4">Easy Booking</h2>
          <p className="text-gray-600 mt-2">
            Book your tickets in just a few clicks.
          </p>
        </div>
        <div className="group bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-8 hover:scale-105 transition duration-300 hover:shadow-2xl border border-white/50 hover:border-indigo-200">
          <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-green-600 transition-colors">
            <Users className="text-green-600 group-hover:text-white transition-colors" size={32} />
          </div>
          <h2 className="text-xl font-bold mt-4">Seat Availability</h2>
          <p className="text-gray-600 mt-2">
            Real-time seat availability updates.
          </p>
        </div>
        <div className="group bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-8 hover:scale-105 transition duration-300 hover:shadow-2xl border border-white/50 hover:border-indigo-200">
          <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-red-600 transition-colors">
            <MapPin className="text-red-500 group-hover:text-white transition-colors" size={32} />
          </div>
          <h2 className="text-xl font-bold mt-4">Multiple Locations</h2>
          <p className="text-gray-600 mt-2">
            Events across different cities & venues.
          </p>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We make event booking simple, secure, and enjoyable for everyone.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-indigo-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold">50K+</h3>
            <p className="text-gray-600">Events Hosted</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-purple-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold">1M+</h3>
            <p className="text-gray-600">Happy Attendees</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-green-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold">100%</h3>
            <p className="text-gray-600">Secure Booking</p>
          </div>
        </div>
      </div>

      {/* OUR EVENTS SECTION */}
      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">Our Events</h2>
          <Link to="/events" className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1">
            View All <ChevronRight size={20} />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="overflow-hidden">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 text-gray-800">{event.name}</h3>
                <p className="text-gray-600 text-sm mb-1 flex items-center gap-1">
                  <Calendar size={14} className="text-indigo-500" /> {event.date}
                </p>
                <p className="text-gray-600 text-sm mb-2 flex items-center gap-1">
                  <MapPin size={14} className="text-indigo-500" /> {event.location}
                </p>
                <p className="text-indigo-600 font-bold">{event.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MORE AMAZING FEATURES*/}
      <div className="bg-purple py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">More Amazing Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {moreFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-white/50 hover:border-indigo-200"
              >
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="bg-white py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white hover:bg-indigo-100 transition-colors shadow-md">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Explore Events</h3>
              <p className="mt-3 text-gray-600">
                Browse through concerts, seminars, and workshops.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white hover:bg-indigo-100 transition-colors shadow-md">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Book Your Seat</h3>
              <p className="mt-3 text-gray-600">
                Select seats and confirm your booking instantly.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white hover:bg-indigo-100 transition-colors shadow-md">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Enjoy the Event</h3>
              <p className="mt-3 text-gray-600">
                Show your booking confirmation and enjoy the experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-300 py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-black-600 font-bold">© 2026 The Event Utsav by Planexa. All rights reserved.</p>
          <Link
            to="/feedback"
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <MessageCircle size={20} />
            Feedback
          </Link>
        </div>
      </footer>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes scroll {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        .animate-scroll {
          animation: scroll 1.5s infinite;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Home;