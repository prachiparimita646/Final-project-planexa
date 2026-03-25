import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, Clock, Tag, CheckCircle, AlertCircle } from "lucide-react";
import api from "../../services/api";

const catColor = {
  Music: "#8b5e3c", Tech: "#4a6e5a", Food: "#7a5a2a", Business: "#6b4c35",
  Party: "#a05030", Comedy: "#5a6a3a", Gala: "#8a4a5a", Wellness: "#4a7a5a", Art: "#7a4a2a",
};

const EventDetail = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [event, setEvent]                   = useState(null);
  const [loading, setLoading]               = useState(true);
  const [seats, setSeats]                   = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage]               = useState({ text: "", type: "" });

  useEffect(() => {
    setLoading(true);
    setSeats(1);
    setMessage({ text: "", type: "" });

    api.get(`/events/${id}`)
      .then(res => { setEvent(res.data); setLoading(false); })
      .catch(() => { setEvent(null); setLoading(false); });
  }, [id]);

  // ── REAL booking API call ──
   const handleBooking = async () => {
    if (!seats || seats <= 0) {
      setMessage({ text: "Please select a valid number of seats.", type: "error" }); return;
    }
    if (seats > event.availableSeats) {
      setMessage({ text: "Not enough seats available.", type: "error" }); return;
    }
    try {
      setBookingLoading(true);
      setMessage({ text: "", type: "" });

      // Real API call
      await api.post("/bookings", {
        eventId:       event._id,
        numberOfSeats: seats,
        totalAmount:   seats * event.price,
      });

      setEvent(prev => ({ ...prev, availableSeats: prev.availableSeats - seats }));
      setMessage({
        text: `🎉 Booking confirmed! ${seats} seat${seats > 1 ? "s" : ""} reserved. Check My Bookings to view.`,
        type: "success",
      });
      setSeats(1);
    } catch (err) {
      const msg = err.response?.data?.message || "Booking failed. Please try again.";
      // If not logged in
      if (err.response?.status === 401) {
        setMessage({ text: "Please login to book an event.", type: "error" });
        setTimeout(() => navigate("/login"), 1500);
        return;
      }
      setMessage({ text: msg, type: "error" });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div style={{ fontFamily: "'Jost', sans-serif", minHeight: "100vh", background: "#ecdcc8", display: "flex", alignItems: "center", justifyContent: "center", color: "#a88972" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #8b5e3c", borderTopColor: "transparent", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontWeight: 600 }}>Loading event details...</p>
      </div>
    </div>
  );

  if (!event) return (
    <div style={{ fontFamily: "'Jost', sans-serif", minHeight: "100vh", background: "#ecdcc8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#a88972", gap: 14 }}>
      <AlertCircle size={50} style={{ opacity: 0.35 }} />
      <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "#6b4c35" }}>Event not found.</p>
      <button onClick={() => navigate("/events")} style={{ background: "linear-gradient(135deg,#c4945a,#8b5e3c)", color: "#fff", padding: "10px 22px", borderRadius: 11, border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>
        Back to Events
      </button>
    </div>
  );

  const isFull       = event.availableSeats === 0;
  const cc           = catColor[event.category] || "#8b5e3c";
  const totalPrice   = seats * event.price;
  const totalSeats   = event.totalSeats || event.capacity || 0;
  const occupancyPct = totalSeats ? Math.round(((totalSeats - event.availableSeats) / totalSeats) * 100) : 0;

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", minHeight: "100vh", background: "#ecdcc8", color: "#6b4c35" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Jost:wght@300;400;500;600;700&display=swap');
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .ed-fade { animation: fadeUp 0.5s ease both; }
        @media(max-width:768px){ .ed-grid{ grid-template-columns:1fr !important; } }
      `}</style>

      {/* Back bar */}
      <div style={{ background: "linear-gradient(135deg,#3d1f0a,#2c1506)", padding: "14px 24px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <button onClick={() => navigate(-1)}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", color: "#f5ece0", border: "1px solid rgba(255,255,255,0.2)", padding: "7px 16px", borderRadius: 10, fontWeight: 600, fontSize: "0.84rem", cursor: "pointer", fontFamily: "inherit" }}>
            <ArrowLeft size={15} /> Back to Events
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "28px 24px 72px" }}>
        <div className="ed-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 26, alignItems: "start" }}>

          {/* LEFT */}
          <div className="ed-fade">
            {/* Hero image */}
            <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 22, position: "relative", boxShadow: "0 8px 32px rgba(139,94,60,0.15)" }}>
              <img src={event.thumbnail} alt={event.title}
                style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }}
                onError={e => e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"} />
              <span style={{ position: "absolute", top: 14, left: 14, background: "rgba(250,244,236,0.93)", color: cc, fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 999 }}>
                {event.category}
              </span>
              {isFull && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(44,26,14,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ background: "#8b5e3c", color: "#fff", fontWeight: 700, fontSize: "1rem", padding: "10px 28px", borderRadius: 999, letterSpacing: "0.12em" }}>SOLD OUT</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 700, color: "#2c1a0e", lineHeight: 1.18, marginBottom: 18 }}>
              {event.title}
            </h1>

            {/* Meta pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {[
                { icon: <Calendar size={13} />, text: new Date(event.date).toDateString() },
                { icon: <Clock size={13} />,    text: event.time },
                { icon: <MapPin size={13} />,   text: event.location },
                { icon: <Users size={13} />,    text: isFull ? "Sold Out" : `${event.availableSeats} seats left` },
              ].map((m, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#faf4ec", border: "1px solid rgba(139,94,60,0.15)", borderRadius: 999, padding: "6px 14px", fontSize: "0.78rem", color: "#6b4c35", fontWeight: 600 }}>
                  <span style={{ color: cc }}>{m.icon}</span>{m.text}
                </span>
              ))}
            </div>

            {/* Price tag */}
            <div style={{ background: "#faf4ec", borderRadius: 14, padding: "14px 18px", border: "1px solid rgba(139,94,60,0.14)", marginBottom: 22, display: "inline-flex", alignItems: "center", gap: 10 }}>
              <Tag size={17} color={cc} />
              <div>
                <p style={{ fontSize: "0.66rem", color: "#a88972", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Ticket Price</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.45rem", fontWeight: 700, color: "#8b5e3c", margin: 0, lineHeight: 1 }}>
                  ₹{event.price?.toLocaleString()}<span style={{ fontSize: "0.76rem", color: "#a88972", fontWeight: 600 }}> / seat</span>
                </p>
              </div>
            </div>

            {/* Description */}
            <div style={{ background: "#faf4ec", borderRadius: 16, padding: "22px", border: "1px solid rgba(139,94,60,0.13)" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontWeight: 700, color: "#2c1a0e", marginBottom: 10 }}>About This Event</h2>
              <p style={{ fontSize: "0.88rem", color: "#6b4c35", lineHeight: 1.8, margin: 0 }}>{event.description}</p>
            </div>
          </div>

          {/* RIGHT: Booking card */}
          <div className="ed-fade" style={{ animationDelay: "0.15s", position: "sticky", top: 24 }}>
            <div style={{ background: "#faf4ec", borderRadius: 20, border: "1px solid rgba(139,94,60,0.15)", boxShadow: "0 8px 32px rgba(139,94,60,0.10)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#3d1f0a,#2c1506)", padding: "18px 22px" }}>
                <p style={{ fontSize: "0.62rem", color: "rgba(245,236,224,0.55)", letterSpacing: "0.16em", textTransform: "uppercase", margin: "0 0 3px" }}>SECURE YOUR SPOT</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 700, color: "#f5ece0", margin: 0 }}>Book Your Seat</h2>
              </div>

              <div style={{ padding: "20px" }}>
                {isFull ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <AlertCircle size={36} color="#8b5e3c" style={{ opacity: 0.5, marginBottom: 10 }} />
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "#8b5e3c", marginBottom: 6 }}>Sold Out</h3>
                    <p style={{ fontSize: "0.82rem", color: "#a88972", marginBottom: 14 }}>All seats have been booked.</p>
                    <button onClick={() => navigate("/events")}
                      style={{ width: "100%", padding: "10px", borderRadius: 11, background: "rgba(139,94,60,0.10)", color: "#8b5e3c", fontWeight: 700, border: "1px solid rgba(139,94,60,0.2)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.86rem" }}>
                      Browse Other Events
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Seat counter */}
                    <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6b4c35", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Number of Seats</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ecdcc8", borderRadius: 12, padding: "5px", border: "1px solid rgba(139,94,60,0.18)", marginBottom: 5 }}>
                      <button onClick={() => seats > 1 && setSeats(s => s - 1)} disabled={seats <= 1}
                        style={{ width: 36, height: 36, borderRadius: 9, background: seats > 1 ? "#faf4ec" : "#e8d8c4", border: "none", cursor: seats > 1 ? "pointer" : "not-allowed", fontWeight: 700, fontSize: "1.1rem", color: seats > 1 ? "#8b5e3c" : "#c4b0a0", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                      <input type="number" min="1" max={event.availableSeats} value={seats}
                        onChange={e => setSeats(Math.max(1, Math.min(event.availableSeats, Number(e.target.value))))}
                        style={{ width: 52, textAlign: "center", background: "transparent", border: "none", outline: "none", fontWeight: 700, fontSize: "1.05rem", color: "#2c1a0e", fontFamily: "inherit" }} />
                      <button onClick={() => seats < event.availableSeats && setSeats(s => s + 1)} disabled={seats >= event.availableSeats}
                        style={{ width: 36, height: 36, borderRadius: 9, background: seats < event.availableSeats ? "#faf4ec" : "#e8d8c4", border: "none", cursor: seats < event.availableSeats ? "pointer" : "not-allowed", fontWeight: 700, fontSize: "1.1rem", color: seats < event.availableSeats ? "#8b5e3c" : "#c4b0a0", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                    <p style={{ fontSize: "0.7rem", color: "#a88972", textAlign: "right", marginBottom: 14 }}>Max {event.availableSeats} seats</p>

                    {/* Price breakdown */}
                    <div style={{ background: "#ecdcc8", borderRadius: 12, padding: "12px 14px", marginBottom: 14, border: "1px solid rgba(139,94,60,0.12)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                        <span style={{ fontSize: "0.8rem", color: "#a88972" }}>₹{event.price?.toLocaleString()} × {seats} seat{seats > 1 ? "s" : ""}</span>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2c1a0e" }}>₹{(event.price * seats).toLocaleString()}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px dashed rgba(139,94,60,0.18)" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2c1a0e" }}>Total</span>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 700, color: "#8b5e3c" }}>₹{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Confirm button */}
                    <button onClick={handleBooking} disabled={bookingLoading}
                      style={{ width: "100%", padding: "12px", borderRadius: 12, background: bookingLoading ? "#dfc9af" : "linear-gradient(135deg,#c4945a,#8b5e3c)", color: "#fff", fontWeight: 700, fontSize: "0.93rem", border: "none", cursor: bookingLoading ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: bookingLoading ? "none" : "0 4px 16px rgba(139,94,60,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.18s" }}>
                      {bookingLoading
                        ? <><div style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} /> Booking...</>
                        : "Confirm Booking"}
                    </button>

                    {/* Message */}
                    {message.text && (
                      <div style={{ marginTop: 12, padding: "10px 13px", borderRadius: 10, background: message.type === "success" ? "#e8f7ef" : "#fdecea", border: `1px solid ${message.type === "success" ? "rgba(26,122,74,0.2)" : "rgba(192,57,26,0.2)"}`, display: "flex", alignItems: "flex-start", gap: 7 }}>
                        {message.type === "success"
                          ? <CheckCircle size={15} color="#1a7a4a" style={{ flexShrink: 0, marginTop: 1 }} />
                          : <AlertCircle size={15} color="#c0391a" style={{ flexShrink: 0, marginTop: 1 }} />}
                        <p style={{ fontSize: "0.8rem", fontWeight: 600, color: message.type === "success" ? "#1a7a4a" : "#c0391a", margin: 0, lineHeight: 1.5 }}>{message.text}</p>
                      </div>
                    )}

                    {/* Seats left bar */}
                    <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 5, borderRadius: 999, background: "#e8d8c4", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${occupancyPct}%`, background: "linear-gradient(90deg,#8b5e3c,#c4945a)", borderRadius: 999 }} />
                      </div>
                      <span style={{ fontSize: "0.68rem", color: "#a88972", fontWeight: 600, flexShrink: 0 }}>{event.availableSeats} left</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Event details card */}
            <div style={{ background: "#faf4ec", borderRadius: 16, padding: "16px 18px", marginTop: 14, border: "1px solid rgba(139,94,60,0.13)" }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", fontWeight: 700, color: "#2c1a0e", marginBottom: 10 }}>Event Details</h3>
              {[
                { label: "Date",     value: new Date(event.date).toDateString() },
                { label: "Time",     value: event.time },
                { label: "Venue",    value: event.location },
                { label: "Category", value: event.category },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < 3 ? "1px solid rgba(139,94,60,0.08)" : "none" }}>
                  <span style={{ fontSize: "0.74rem", color: "#a88972", fontWeight: 600 }}>{r.label}</span>
                  <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#2c1a0e", textAlign: "right", maxWidth: 170 }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;