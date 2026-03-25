import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar, MapPin, Plus, Search,
  Edit2, Trash2, Eye, Users, DollarSign, ExternalLink
} from "lucide-react";
import api from "../../services/api";

const AdminEvents = () => {
  const navigate = useNavigate();

  const [events, setEvents]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

   const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events");
      setEvents(res.data); 
    } catch (err) {
      showToast("Failed to load events.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ── Delete event from MongoDB ──
  const deleteEvent = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
      showToast(`"${name}" deleted`, "error");
    } catch (err) {
      showToast("Failed to delete event.", "error");
    }
  };

  // ── Filter events ──
  const filtered = events.filter(ev => {
    const q = search.toLowerCase();
    const matchSearch = ev.title?.toLowerCase().includes(q) ||
                        ev.location?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" ||
                        (filterStatus === "full"     && ev.availableSeats === 0) ||
                        (filterStatus === "upcoming" && ev.availableSeats > 0);
    return matchSearch && matchStatus;
  });

  // ── Occupancy % ──
  const pct = (ev) => {
    if (!ev.totalSeats) return 0;
    return Math.round(((ev.totalSeats - ev.availableSeats) / ev.totalSeats) * 100);
  };

  const statusStyle = (ev) => ev.availableSeats === 0
    ? { bg: "#fdecea", color: "#c0391a", label: "Full"     }
    : { bg: "#e7f3ff", color: "#0e6eb8", label: "Upcoming" };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", color: "#2e1106", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito:wght@400;500;600;700&display=swap');
        .ae-card { transition: transform 0.2s, box-shadow 0.2s; }
        .ae-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(192,69,26,0.12) !important; }
        .ae-card:hover .ae-img { transform: scale(1.06); }
        .ae-img { transition: transform 0.5s; }
        .ae-btn { transition: opacity 0.15s, transform 0.15s; border: none; cursor: pointer; }
        .ae-btn:hover { opacity: 0.82; transform: scale(1.08); }
        @keyframes slideIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to { transform: rotate(360deg); } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "success" ? "#1a7a4a" : "#c0391a", color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 700, fontSize: "0.88rem", boxShadow: "0 8px 24px rgba(0,0,0,0.16)", animation: "slideIn 0.3s ease", pointerEvents: "none" }}>
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.18em", fontWeight: 700, color: "#e87c3e", textTransform: "uppercase", marginBottom: 4 }}>MANAGEMENT</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 700, color: "#2e1106" }}>Events</h1>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/events"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: "1px solid rgba(192,69,26,0.22)", color: "#c0451a", padding: "10px 18px", borderRadius: 12, fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>
            <ExternalLink size={14} /> View Public Events
          </Link>
          <Link to="/admin/events/new"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#c0451a,#a03010)", color: "#fff", padding: "11px 22px", borderRadius: 12, fontWeight: 700, fontSize: "0.88rem", textDecoration: "none", boxShadow: "0 4px 14px rgba(192,69,26,0.3)" }}>
            <Plus size={17} /> Add Event
          </Link>
        </div>
      </div>

      {/* ── Summary Cards — live from API data ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Events",  value: events.length,                                            color: "#c0451a", bg: "#fff0ea", icon: <Calendar size={20} />    },
          { label: "Upcoming",      value: events.filter(e => e.availableSeats > 0).length,          color: "#0e6eb8", bg: "#e7f3ff", icon: <Calendar size={20} />    },
          { label: "Fully Booked",  value: events.filter(e => e.availableSeats === 0).length,        color: "#c0391a", bg: "#fdecea", icon: <Users size={20} />       },
          { label: "Total Seats",   value: events.reduce((a, e) => a + (e.totalSeats || 0), 0).toLocaleString(), color: "#1a7a4a", bg: "#e8f7ef", icon: <DollarSign size={20}/> },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "16px", border: "1px solid rgba(192,69,26,0.11)", boxShadow: "0 3px 12px rgba(192,69,26,0.07)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color }} />
            <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: 10 }}>{s.icon}</div>
            <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "#2e1106", lineHeight: 1, marginBottom: 3 }}>{s.value}</p>
            <p style={{ fontSize: "0.7rem", color: "#b07b65", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid rgba(192,69,26,0.11)", boxShadow: "0 3px 12px rgba(192,69,26,0.06)", marginBottom: 18, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#b07b65" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..."
            style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: 10, border: "1px solid rgba(192,69,26,0.18)", fontSize: "0.86rem", color: "#2e1106", background: "#fff3e8", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "upcoming", "full"].map(f => (
            <button key={f} onClick={() => setFilterStatus(f)}
              style={{ padding: "8px 16px", borderRadius: 9, border: "1px solid rgba(192,69,26,0.18)", background: filterStatus === f ? "#c0451a" : "#fff3e8", color: filterStatus === f ? "#fff" : "#6b3a25", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit" }}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p style={{ fontSize: "0.78rem", color: "#b07b65", fontWeight: 600, marginBottom: 16 }}>
        Showing <strong style={{ color: "#c0451a" }}>{filtered.length}</strong> of {events.length} events
      </p>

      {/* ── Loading ── */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 24px", color: "#b07b65" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #c0451a", borderTopColor: "transparent", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontWeight: 600 }}>Loading events...</p>
        </div>
      )}

      {/* ── Events Grid ── */}
      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 18 }}>
          {filtered.map(ev => {
            const s         = statusStyle(ev);
            const occupancy = pct(ev);
            return (
              <div key={ev._id} className="ae-card" style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(192,69,26,0.11)", boxShadow: "0 4px 16px rgba(192,69,26,0.07)", overflow: "hidden" }}>

                {/* Thumbnail */}
                {ev.thumbnail && (
                  <div style={{ overflow: "hidden", height: 150 }}>
                    <img src={ev.thumbnail} alt={ev.title} className="ae-img"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => e.target.style.display = "none"} />
                  </div>
                )}

                {/* Top accent */}
                <div style={{ height: 4, background: "linear-gradient(90deg,#c0451a,#e87c3e)" }} />

                <div style={{ padding: "16px 18px" }}>
                  {/* Title + status */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#2e1106", lineHeight: 1.3, flex: 1, paddingRight: 8, margin: 0 }}>{ev.title}</h3>
                    <span style={{ background: s.bg, color: s.color, fontSize: "0.66rem", fontWeight: 700, padding: "3px 10px", borderRadius: 999, flexShrink: 0, whiteSpace: "nowrap" }}>{s.label}</span>
                  </div>

                  {/* Meta */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                    <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.76rem", color: "#b07b65", margin: 0 }}>
                      <Calendar size={12} color="#c0451a" />
                      {ev.date ? new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      {ev.time ? ` · ${ev.time}` : ""}
                    </p>
                    <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.76rem", color: "#b07b65", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      <MapPin size={12} color="#c0451a" />{ev.location}
                    </p>
                  </div>

                  {/* Occupancy bar */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: "0.7rem", color: "#b07b65", fontWeight: 600 }}>Occupancy</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: occupancy >= 90 ? "#c0391a" : "#1a7a4a" }}>
                        {ev.totalSeats - ev.availableSeats}/{ev.totalSeats} ({occupancy}%)
                      </span>
                    </div>
                    <div style={{ height: 5, borderRadius: 999, background: "#fff0ea", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${occupancy}%`, borderRadius: 999, background: occupancy >= 90 ? "#c0391a" : "linear-gradient(90deg,#c0451a,#e87c3e)", transition: "width 0.4s" }} />
                    </div>
                  </div>

                  {/* Price + Action buttons */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#c0451a" }}>
                      ₹{ev.price?.toLocaleString()}
                    </span>
                    <div style={{ display: "flex", gap: 7 }}>

                      {/* View — public event detail page with real MongoDB _id */}
                      <button className="ae-btn" title="View public page"
                        onClick={() => navigate(`/events/${ev._id}`)}
                        style={{ width: 32, height: 32, borderRadius: 8, background: "#e7f3ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#0e6eb8" }}>
                        <Eye size={14} />
                      </button>

                      {/* Edit — passes real MongoDB _id to /admin/events/:id/edit */}
                      <button className="ae-btn" title="Edit event"
                        onClick={() => navigate(`/admin/events/${ev._id}/edit`)}
                        style={{ width: 32, height: 32, borderRadius: 8, background: "#fff8e1", display: "flex", alignItems: "center", justifyContent: "center", color: "#b5860d" }}>
                        <Edit2 size={14} />
                      </button>

                      {/*  Delete — calls real API with MongoDB _id */}
                      <button className="ae-btn" title="Delete event"
                        onClick={() => deleteEvent(ev._id, ev.title)}
                        style={{ width: 32, height: 32, borderRadius: 8, background: "#fdecea", display: "flex", alignItems: "center", justifyContent: "center", color: "#c0391a" }}>
                        <Trash2 size={14} />
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 24px", color: "#b07b65" }}>
          <Calendar size={48} style={{ opacity: 0.25, margin: "0 auto 12px", display: "block" }} />
          <p style={{ fontWeight: 600 }}>No events found</p>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;