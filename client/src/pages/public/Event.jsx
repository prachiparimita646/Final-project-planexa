// src/pages/public/Event.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import api from "../../services/api";

// ── Category config ────────────────────────────────────────────────────────
const CAT_CONFIG = {
  Music:    { color: "#7a4a2a", bg: "#f5e6d8", emoji: "🎵" },
  Tech:     { color: "#2a5a4a", bg: "#d8f0e8", emoji: "💻" },
  Food:     { color: "#6a4010", bg: "#f5e8d0", emoji: "🍽️" },
  Business: { color: "#4a3a6a", bg: "#e8e0f5", emoji: "💼" },
  Party:    { color: "#7a3020", bg: "#f5ddd8", emoji: "🎉" },
  Comedy:   { color: "#4a5a2a", bg: "#e8f0d8", emoji: "😄" },
  Gala:     { color: "#6a2a4a", bg: "#f0d8e8", emoji: "✨" },
  Wellness: { color: "#2a5a3a", bg: "#d8f0e0", emoji: "🧘" },
  Art:      { color: "#5a3a1a", bg: "#f0e4d0", emoji: "🎨" },
};

const getCat = (cat) => CAT_CONFIG[cat] || { color: "#8b5e3c", bg: "#f5ece0", emoji: "📅" };

const Event = () => {
  const [events, setEvents]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filterCat, setFilterCat]       = useState("All");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters]   = useState(false);
  const navigate                        = useNavigate();

  const fetchEvents = async () => {
    try {
      const res  = await api.get("/events");
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.events)
          ? res.data.events
          : [];
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events:", err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const categories = ["All", ...Array.from(new Set(events.map(e => e.category).filter(Boolean)))];

  const filtered = events.filter(ev => {
    const q           = search.toLowerCase();
    const matchSearch = ev.title?.toLowerCase().includes(q) || ev.location?.toLowerCase().includes(q);
    const matchCat    = filterCat === "All" || ev.category === filterCat;
    const isFull      = ev.availableSeats === 0 || ev.status === "full";
    const matchStatus = filterStatus === "all" ||
      (filterStatus === "upcoming" && !isFull) ||
      (filterStatus === "full"     &&  isFull);
    return matchSearch && matchCat && matchStatus;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const hasActiveFilter = filterCat !== "All" || filterStatus !== "all" || search;

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", minHeight: "100vh", background: "#ecdcc8", color: "#6b4c35" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Jost:wght@300;400;500;600;700&display=swap');

        /* Card */
        .ev-card {
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s;
          animation: evFadeUp 0.5s ease both;
        }
        .ev-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 20px 48px rgba(139,94,60,0.18) !important;
        }
        .ev-card:hover .ev-img { transform: scale(1.08); }
        .ev-img { transition: transform 0.6s cubic-bezier(.25,.46,.45,.94); }

        /* Stagger animation for cards */
        .ev-card:nth-child(1)  { animation-delay: 0.05s; }
        .ev-card:nth-child(2)  { animation-delay: 0.10s; }
        .ev-card:nth-child(3)  { animation-delay: 0.15s; }
        .ev-card:nth-child(4)  { animation-delay: 0.20s; }
        .ev-card:nth-child(5)  { animation-delay: 0.25s; }
        .ev-card:nth-child(6)  { animation-delay: 0.30s; }
        .ev-card:nth-child(7)  { animation-delay: 0.35s; }
        .ev-card:nth-child(8)  { animation-delay: 0.40s; }
        .ev-card:nth-child(9)  { animation-delay: 0.45s; }
        .ev-card:nth-child(10) { animation-delay: 0.50s; }
        .ev-card:nth-child(11) { animation-delay: 0.55s; }
        .ev-card:nth-child(12) { animation-delay: 0.60s; }

        @keyframes evFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ev-btn { transition: all 0.18s; }
        .ev-btn:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 6px 18px rgba(139,94,60,0.35) !important; }

        .ev-pill { transition: all 0.15s; }
        .ev-pill:hover { opacity: 0.85; transform: translateY(-1px); }

        .ev-search:focus { border-color: rgba(196,148,90,0.6) !important; box-shadow: 0 0 0 3px rgba(196,148,90,0.15) !important; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      {/* ══ HERO ══ */}
      <div style={{ background: "linear-gradient(135deg,#3d1f0a 0%,#2c1506 60%,#3d1f0a 100%)", padding: "48px 24px 72px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Decorative orbs */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(196,148,90,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(139,94,60,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(196,148,90,0.10) 0%, transparent 55%), radial-gradient(ellipse at 70% 30%, rgba(139,94,60,0.08) 0%, transparent 55%)", pointerEvents: "none" }} />

        <p style={{ fontSize: "0.62rem", letterSpacing: "0.28em", fontWeight: 600, color: "#c4945a", textTransform: "uppercase", marginBottom: 14, position: "relative" }}>
          ✦ DISCOVER & BOOK ✦
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem,5.5vw,3.6rem)", fontWeight: 700, color: "#f5ece0", marginBottom: 14, lineHeight: 1.1, position: "relative", letterSpacing: "-0.01em" }}>
          Upcoming{" "}
          <em style={{ fontStyle: "italic", background: "linear-gradient(90deg,#e8c98a,#c4945a,#e8c98a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Events
          </em>
        </h1>
        <p style={{ color: "rgba(245,236,224,0.65)", fontSize: "0.94rem", fontWeight: 300, maxWidth: 460, margin: "0 auto 32px", position: "relative", lineHeight: 1.7 }}>
          Concerts, conferences, workshops, parties and more —<br/>curated experiences worth every memory.
        </p>

        {/* Search bar */}
        <div style={{ maxWidth: 580, margin: "0 auto", position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "#a88972", pointerEvents: "none" }} />
          <input
            className="ev-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events, locations..."
            style={{ width: "100%", padding: "14px 48px 14px 48px", borderRadius: 16, border: "1px solid rgba(196,148,90,0.3)", fontSize: "0.92rem", color: "#2c1a0e", background: "#faf4ec", outline: "none", fontFamily: "inherit", boxSizing: "border-box", boxShadow: "0 8px 28px rgba(0,0,0,0.18)", transition: "border-color 0.18s, box-shadow 0.18s" }}
          />
          {search && (
            <button onClick={() => setSearch("")}
              style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#a88972", display: "flex", padding: 4 }}>
              <X size={15} />
            </button>
          )}
        </div>

        {/* Live event count badge */}
        {!loading && (
          <div style={{ marginTop: 18, position: "relative" }}>
            <span style={{ display: "inline-block", background: "rgba(196,148,90,0.18)", border: "1px solid rgba(196,148,90,0.35)", color: "#e8c98a", fontSize: "0.72rem", fontWeight: 600, padding: "4px 14px", borderRadius: 999, letterSpacing: "0.08em" }}>
              {filtered.length} event{filtered.length !== 1 ? "s" : ""} {hasActiveFilter ? "match your filters" : "available"}
            </span>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ══ FILTER BAR ══ */}
        <div style={{ background: "#faf4ec", borderRadius: 18, padding: "16px 22px", border: "1px solid rgba(139,94,60,0.14)", boxShadow: "0 8px 32px rgba(139,94,60,0.10)", marginTop: -32, marginBottom: 36, position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>

            {/* Category pills */}
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", flex: 1, alignItems: "center" }}>
              <span style={{ fontSize: "0.66rem", fontWeight: 700, color: "#a88972", textTransform: "uppercase", letterSpacing: "0.1em", marginRight: 4, whiteSpace: "nowrap" }}>Category</span>
              {categories.map(c => {
                const cfg = c === "All" ? null : getCat(c);
                const isActive = filterCat === c;
                return (
                  <button key={c} onClick={() => setFilterCat(c)} className="ev-pill"
                    style={{ padding: "5px 13px", borderRadius: 999, border: `1px solid ${isActive ? (cfg?.color || "#8b5e3c") : "rgba(139,94,60,0.18)"}`, background: isActive ? (cfg?.color || "#8b5e3c") : "#f5ece0", color: isActive ? "#fff" : "#6b4c35", fontWeight: 600, fontSize: "0.72rem", cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {cfg?.emoji && <span>{cfg.emoji}</span>}
                    {c}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 28, background: "rgba(139,94,60,0.15)", flexShrink: 0 }} />

            {/* Status pills */}
            <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
              <span style={{ fontSize: "0.66rem", fontWeight: 700, color: "#a88972", textTransform: "uppercase", letterSpacing: "0.1em", marginRight: 4 }}>Status</span>
              {[
                { key: "all",      label: "All"      },
                { key: "upcoming", label: "Available" },
                { key: "full",     label: "Sold Out"  },
              ].map(s => (
                <button key={s.key} onClick={() => setFilterStatus(s.key)} className="ev-pill"
                  style={{ padding: "5px 13px", borderRadius: 999, border: `1px solid ${filterStatus === s.key ? "#2c1a0e" : "rgba(139,94,60,0.18)"}`, background: filterStatus === s.key ? "#2c1a0e" : "#f5ece0", color: filterStatus === s.key ? "#fff" : "#6b4c35", fontWeight: 600, fontSize: "0.72rem", cursor: "pointer", fontFamily: "inherit" }}>
                  {s.label}
                </button>
              ))}
            </div>

            {/* Clear filters */}
            {hasActiveFilter && (
              <button onClick={() => { setSearch(""); setFilterCat("All"); setFilterStatus("all"); }}
                style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 999, background: "rgba(139,60,60,0.08)", border: "1px solid rgba(139,60,60,0.18)", color: "#8b3a2a", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Loading skeleton ── */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 22 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: "#faf4ec", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(139,94,60,0.1)", animation: "pulse 1.5s ease infinite", animationDelay: `${i * 0.1}s` }}>
                <div style={{ height: 200, background: "#e8d8c4" }} />
                <div style={{ padding: "18px 20px" }}>
                  <div style={{ height: 12, background: "#e8d8c4", borderRadius: 6, marginBottom: 10, width: "80%" }} />
                  <div style={{ height: 10, background: "#e8d8c4", borderRadius: 6, marginBottom: 6, width: "60%" }} />
                  <div style={{ height: 10, background: "#e8d8c4", borderRadius: 6, width: "70%" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(139,94,60,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Calendar size={36} style={{ color: "#c4945a", opacity: 0.6 }} />
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#6b4c35", marginBottom: 8 }}>No Events Found</h3>
            <p style={{ fontSize: "0.88rem", color: "#a88972", marginBottom: 20 }}>Try adjusting your search or filters.</p>
            <button onClick={() => { setSearch(""); setFilterCat("All"); setFilterStatus("all"); }}
              style={{ background: "linear-gradient(135deg,#c4945a,#8b5e3c)", color: "#fff", padding: "10px 24px", borderRadius: 12, fontWeight: 600, fontSize: "0.86rem", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              Clear All Filters
            </button>
          </div>
        )}

        {/* ══ EVENTS GRID ══ */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
            {filtered.map((ev, idx) => {
              const isFull  = ev.availableSeats === 0 || ev.status === "full";
              const cfg     = getCat(ev.category);
              const pct     = ev.totalSeats ? Math.round(((ev.totalSeats - ev.availableSeats) / ev.totalSeats) * 100) : 0;

              return (
                <div key={ev._id} className="ev-card"
                  style={{ background: "#faf4ec", borderRadius: 20, border: "1px solid rgba(139,94,60,0.12)", boxShadow: "0 4px 20px rgba(139,94,60,0.08)", overflow: "hidden", display: "flex", flexDirection: "column" }}>

                  {/* ── Image ── */}
                  <div style={{ position: "relative", overflow: "hidden", height: 210, flexShrink: 0 }}>
                    <img
                      src={ev.thumbnail}
                      alt={ev.title}
                      className="ev-img"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => { e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"; }}
                    />

                    {/* Category badge */}
                    <span style={{ position: "absolute", top: 12, left: 12, background: cfg.bg, color: cfg.color, fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 11px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 4, border: `1px solid ${cfg.color}30` }}>
                      {cfg.emoji} {ev.category}
                    </span>

                    {/* Price badge top-right */}
                    <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(44,26,14,0.82)", color: "#e8c98a", fontSize: "0.82rem", fontWeight: 700, padding: "4px 12px", borderRadius: 999, fontFamily: "'Cormorant Garamond', serif" }}>
                      ₹{Number(ev.price).toLocaleString()}
                    </span>

                    {/* Sold out overlay */}
                    {isFull && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(44,26,14,0.62)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ background: "#8b5e3c", color: "#fff", fontWeight: 700, fontSize: "0.82rem", padding: "8px 22px", borderRadius: 999, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                          Sold Out
                        </span>
                      </div>
                    )}

                    {/* Bottom gradient fade */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(to top, rgba(44,26,14,0.35), transparent)", pointerEvents: "none" }} />
                  </div>

                  {/* ── Card body ── */}
                  <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>

                    {/* Title */}
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.18rem", fontWeight: 700, color: "#2c1a0e", marginBottom: 10, lineHeight: 1.3, flex: 0 }}>
                      {ev.title}
                    </h2>

                    {/* Meta info */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14, flex: 1 }}>
                      <p style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.78rem", color: "#a88972", margin: 0 }}>
                        <Calendar size={13} color="#c4945a" style={{ flexShrink: 0 }} />
                        {formatDate(ev.date)}{ev.time ? ` · ${ev.time}` : ""}
                      </p>
                      <p style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.78rem", color: "#a88972", margin: 0 }}>
                        <MapPin size={13} color="#c4945a" style={{ flexShrink: 0 }} />
                        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ev.location}</span>
                      </p>
                      <p style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.78rem", margin: 0, color: isFull ? "#8b5e3c" : "#3a6a4a", fontWeight: 600 }}>
                        <Users size={13} style={{ flexShrink: 0 }} />
                        {isFull ? "No seats available" : `${ev.availableSeats} seats left`}
                      </p>
                    </div>

                    {/* Occupancy bar */}
                    {ev.totalSeats > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: "0.66rem", color: "#a88972", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Occupancy</span>
                          <span style={{ fontSize: "0.66rem", color: pct >= 90 ? "#8b3a2a" : "#3a6a4a", fontWeight: 700 }}>{pct}%</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 999, background: "#e8d8c4", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, borderRadius: 999, background: pct >= 90 ? "linear-gradient(90deg,#8b3a2a,#c0451a)" : "linear-gradient(90deg,#8b5e3c,#c4945a)", transition: "width 0.6s ease" }} />
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid rgba(139,94,60,0.1)" }}>
                      <div>
                        <p style={{ fontSize: "0.62rem", color: "#a88972", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 1 }}>Price</p>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", fontWeight: 700, color: "#8b5e3c", lineHeight: 1 }}>
                          ₹{Number(ev.price).toLocaleString()}
                        </span>
                      </div>
                      <button className="ev-btn"
                        onClick={() => !isFull && navigate(`/events/${ev._id}`)}
                        disabled={isFull}
                        style={{ background: isFull ? "rgba(139,94,60,0.10)" : "linear-gradient(135deg,#c4945a,#8b5e3c)", color: isFull ? "#a88972" : "#fff", padding: "9px 20px", borderRadius: 12, fontWeight: 600, fontSize: "0.8rem", border: isFull ? "1px solid rgba(139,94,60,0.18)" : "none", cursor: isFull ? "not-allowed" : "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6, boxShadow: isFull ? "none" : "0 4px 14px rgba(139,94,60,0.28)" }}>
                        {isFull ? "Sold Out" : <>View Details <ChevronRight size={14} /></>}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;