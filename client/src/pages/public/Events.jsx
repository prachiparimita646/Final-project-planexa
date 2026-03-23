// src/pages/public/Events.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // ← your existing API service
import { Calendar, MapPin, Search, Users, ChevronRight } from "lucide-react";

const EVENTS_DATA = [
  {
    _id: "ev001", title: "Rock Concert 2025", category: "Music",
    date: "2025-06-15", time: "07:00 PM", location: "Madison Square Garden, New York",
    price: 490, capacity: 500, availableSeats: 180, status: "upcoming",
    thumbnail: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80",
    description: "An electrifying rock concert featuring top artists from around the world. Experience the ultimate live music extravaganza with stunning light shows and jaw-dropping performances.",
  },
  {
    _id: "ev002", title: "Tech Conference 2025", category: "Tech",
    date: "2025-07-10", time: "09:00 AM", location: "Moscone Center, San Francisco",
    price: 2990, capacity: 300, availableSeats: 120, status: "upcoming",
    thumbnail: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
    description: "Join the brightest minds in tech for three days of keynotes, workshops, and networking. Topics include AI, blockchain, Web3 and the future of software development.",
  },
  {
    _id: "ev003", title: "Food Festival", category: "Food",
    date: "2025-08-05", time: "11:00 AM", location: "Grant Park, Chicago",
    price: 250, capacity: 500, availableSeats: 0, status: "full",
    thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    description: "A celebration of world cuisines featuring 80+ food stalls, live cooking demos, cocktail bars and live music. Taste everything from street food to gourmet bites.",
  },
  {
    _id: "ev004", title: "Annual Business Summit", category: "Business",
    date: "2025-09-20", time: "10:00 AM", location: "JW Marriott, Los Angeles",
    price: 790, capacity: 200, availableSeats: 112, status: "upcoming",
    thumbnail: "https://plus.unsplash.com/premium_photo-1724753995771-8ee6954e78da?auto=format&fit=crop&w=800&q=60",
    description: "The premier annual gathering for business leaders, entrepreneurs and investors. Keynotes, panels, one-on-one mentorship and an exclusive networking dinner.",
  },
  {
    _id: "ev005", title: "Grand Birthday Bash", category: "Party",
    date: "2025-09-20", time: "08:00 PM", location: "The Ritz Carlton, Los Angeles",
    price: 350, capacity: 100, availableSeats: 55, status: "upcoming",
    thumbnail: "https://images.unsplash.com/photo-1741969494307-55394e3e4071?auto=format&fit=crop&w=800&q=60",
    description: "Celebrate in style at the grandest birthday party of the year. Live DJ sets, gourmet catering, open bar, themed décor and a night you will never forget.",
  },
  {
    _id: "ev006", title: "Malibu Beach Party", category: "Party",
    date: "2025-09-20", time: "04:00 PM", location: "Malibu Beach, California",
    price: 450, capacity: 150, availableSeats: 0, status: "full",
    thumbnail: "https://images.unsplash.com/photo-1560359614-870d1a7ea91d?auto=format&fit=crop&w=800&q=60",
    description: "Sun, sand and music — the ultimate sunset beach party. Top DJs, bonfires, cocktails, beach sports and a sky lantern ceremony at midnight.",
  },
  {
    _id: "ev007", title: "Comedy Night Live", category: "Comedy",
    date: "2025-09-20", time: "08:30 PM", location: "Laugh Factory, Los Angeles",
    price: 390, capacity: 200, availableSeats: 105, status: "upcoming",
    thumbnail: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=800&q=80",
    description: "A night of non-stop laughter with stand-up sets from nationally acclaimed comedians. Two-drink minimum included. Perfect for a fun evening out with friends.",
  },
  {
    _id: "ev008", title: "Winter Gala 2025", category: "Gala",
    date: "2025-12-10", time: "07:30 PM", location: "Grand Hyatt, New York City",
    price: 1500, capacity: 250, availableSeats: 238, status: "upcoming",
    thumbnail: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    description: "The most glamorous gala of the year. A black-tie affair with five-course dinner, live orchestra, charity auction and a glittering awards ceremony.",
  },
  {
    _id: "ev009", title: "Startup Summit India", category: "Tech",
    date: "2025-11-01", time: "09:30 AM", location: "HICC, Hyderabad",
    price: 1200, capacity: 400, availableSeats: 170, status: "upcoming",
    thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
    description: "India's most anticipated startup event. Pitch competitions, VC matchmaking, product showcases and masterclasses from founders who've built billion-dollar companies.",
  },
  {
    _id: "ev010", title: "Classical Music Night", category: "Music",
    date: "2025-11-22", time: "06:30 PM", location: "Carnegie Hall, New York",
    price: 850, capacity: 300, availableSeats: 300, status: "upcoming",
    thumbnail: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=800&q=80",
    description: "An enchanting evening of classical masterpieces by a world-renowned orchestra. Beethoven, Mozart and Debussy in Carnegie Hall's iconic Main Hall.",
  },
  {
    _id: "ev011", title: "Yoga & Wellness Retreat", category: "Wellness",
    date: "2025-10-12", time: "06:00 AM", location: "Rishikesh, Uttarakhand",
    price: 3500, capacity: 60, availableSeats: 22, status: "upcoming",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    description: "A 3-day wellness retreat on the banks of the Ganga. Sunrise yoga, meditation, Ayurvedic meals, sound healing and nature hikes.",
  },
  {
    _id: "ev012", title: "Art & Culture Fest", category: "Art",
    date: "2025-10-25", time: "10:00 AM", location: "India Habitat Centre, Delhi",
    price: 199, capacity: 800, availableSeats: 530, status: "upcoming",
    thumbnail: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80",
    description: "A vibrant celebration of Indian art and culture. Live painting, sculpture exhibitions, folk performances, craft bazaars and interactive workshops for all ages.",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const catColor = {
  Music: "#c0451a", Tech: "#0e6eb8", Food: "#1a7a4a", Business: "#6b2fa0",
  Party: "#b5860d", Comedy: "#1a6e7a", Gala: "#c05c8a", Wellness: "#2a7a5a", Art: "#8a4a1a",
};

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents]           = useState(EVENTS_DATA); // fallback to inline data
  const [loading, setLoading]         = useState(false);
  const [search, setSearch]           = useState("");
  const [filterCat, setFilterCat]     = useState("All");
  const [filterStatus, setFilterStatus] = useState("all");

  // ── API fetch ──────────────────────────────────────────────────────────────
  // This useEffect calls your real backend. While the backend is not ready,
  // events is pre-filled with EVENTS_DATA above so the page still works.
  //
  // Once your backend is live, this will automatically fetch real events.
  // If the API fails, the page silently keeps showing EVENTS_DATA.
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await api.get("/events");  // ← calls your backend
        if (res.data && res.data.length > 0) {
          setEvents(res.data);                 // ← replaces inline data with real data
        }
      } catch (error) {
        // API not ready yet — inline EVENTS_DATA is already loaded, nothing to do
        console.log("Using local event data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);
  // ──────────────────────────────────────────────────────────────────────────

  const categories = ["All", ...Array.from(new Set(events.map(e => e.category)))];

  const filtered = events.filter(ev => {
    const q = search.toLowerCase();
    const matchSearch = ev.title.toLowerCase().includes(q) || ev.location.toLowerCase().includes(q);
    const matchCat    = filterCat === "All" || ev.category === filterCat;
    const matchStatus = filterStatus === "all" || ev.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh", background: "#fff3e8", color: "#2e1106" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Nunito:wght@400;500;600;700&display=swap');
        .ev-card { transition: transform 0.22s, box-shadow 0.22s; }
        .ev-card:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(192,69,26,0.14) !important; }
        .ev-card:hover .ev-img { transform: scale(1.07); }
        .ev-img { transition: transform 0.5s; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(135deg,#c0451a 0%,#a03010 100%)", padding: "52px 24px 68px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <p style={{ fontSize: "0.66rem", letterSpacing: "0.22em", fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: 10 }}>DISCOVER & BOOK</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,5vw,3rem)", fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.15 }}>
          Upcoming <em>Events</em>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.95rem", maxWidth: 500, margin: "0 auto 26px" }}>
          Concerts, conferences, workshops, parties and more. Book your seat in seconds.
        </p>
        <div style={{ maxWidth: 500, margin: "0 auto", position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#b07b65" }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search events or locations..."
            style={{ width: "100%", padding: "13px 16px 13px 42px", borderRadius: 14, border: "none", fontSize: "0.9rem", color: "#2e1106", background: "#fff", outline: "none", fontFamily: "inherit", boxSizing: "border-box", boxShadow: "0 4px 20px rgba(0,0,0,0.14)" }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── Filter bar ── */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "14px 18px", border: "1px solid rgba(192,69,26,0.12)", boxShadow: "0 4px 16px rgba(192,69,26,0.07)", marginTop: -26, marginBottom: 28, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", flex: 1 }}>
            {categories.map(c => (
              <button key={c} onClick={() => setFilterCat(c)}
                style={{ padding: "5px 13px", borderRadius: 999, border: "1px solid rgba(192,69,26,0.18)", background: filterCat === c ? "#c0451a" : "#fff3e8", color: filterCat === c ? "#fff" : "#6b3a25", fontWeight: 700, fontSize: "0.73rem", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 7 }}>
            {["all", "upcoming", "full"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ padding: "5px 13px", borderRadius: 999, border: "1px solid rgba(192,69,26,0.18)", background: filterStatus === s ? "#2e1106" : "#fff3e8", color: filterStatus === s ? "#fff" : "#6b3a25", fontWeight: 700, fontSize: "0.73rem", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading spinner */}
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#b07b65" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #c0451a", borderTopColor: "transparent", margin: "0 auto 10px", animation: "spin 0.8s linear infinite" }} />
            <p style={{ fontWeight: 600, fontSize: "0.88rem" }}>Loading events...</p>
          </div>
        )}

        {/* Count */}
        {!loading && <p style={{ fontSize: "0.8rem", color: "#b07b65", fontWeight: 600, marginBottom: 18 }}>
          Showing <strong style={{ color: "#c0451a" }}>{filtered.length}</strong> event{filtered.length !== 1 ? "s" : ""}
        </p>}

        {/* ── Empty state & grid (only when not loading) ── */}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "72px 24px", color: "#b07b65" }}>
            <Calendar size={50} style={{ opacity: 0.22, margin: "0 auto 14px", display: "block" }} />
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#6b3a25", marginBottom: 6 }}>No Events Found</h3>
            <p style={{ fontSize: "0.86rem" }}>Try adjusting your search or filters.</p>
          </div>
        )}

        {/* ── Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 22 }}>
          {filtered.map(ev => {
            const cc = catColor[ev.category] || "#c0451a";
            const isFull = ev.availableSeats === 0;
            return (
              <div key={ev._id} className="ev-card" style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(192,69,26,0.11)", boxShadow: "0 4px 16px rgba(192,69,26,0.07)", overflow: "hidden" }}>
                <div style={{ position: "relative", overflow: "hidden", height: 196 }}>
                  <img src={ev.thumbnail} alt={ev.title} className="ev-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)", color: cc, fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 999 }}>
                    {ev.category}
                  </span>
                  {isFull && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(46,17,6,0.52)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ background: "#c0391a", color: "#fff", fontWeight: 700, fontSize: "0.82rem", padding: "6px 18px", borderRadius: 999, letterSpacing: "0.1em" }}>SOLD OUT</span>
                    </div>
                  )}
                </div>
                <div style={{ padding: "18px 20px" }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.06rem", fontWeight: 700, color: "#2e1106", marginBottom: 10, lineHeight: 1.3 }}>{ev.title}</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
                    <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.77rem", color: "#b07b65", margin: 0 }}>
                      <Calendar size={12} color="#c0451a" />{new Date(ev.date).toDateString()} · {ev.time}
                    </p>
                    <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.77rem", color: "#b07b65", margin: 0 }}>
                      <MapPin size={12} color="#c0451a" />{ev.location}
                    </p>
                    <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.77rem", margin: 0, color: isFull ? "#c0391a" : "#1a7a4a", fontWeight: 600 }}>
                      <Users size={12} />{isFull ? "No seats available" : `${ev.availableSeats} seats available`}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#c0451a" }}>₹{ev.price.toLocaleString()}</span>
                    <button
                      onClick={() => !isFull && navigate(`/events/${ev._id}`)}
                      disabled={isFull}
                      style={{ background: isFull ? "#e0d0c8" : "linear-gradient(135deg,#c0451a,#a03010)", color: isFull ? "#b07b65" : "#fff", padding: "8px 16px", borderRadius: 10, fontWeight: 700, fontSize: "0.78rem", border: "none", cursor: isFull ? "not-allowed" : "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5, boxShadow: isFull ? "none" : "0 3px 12px rgba(192,69,26,0.28)", transition: "all 0.18s" }}>
                      {isFull ? "Sold Out" : <>View Details <ChevronRight size={13} /></>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Events;