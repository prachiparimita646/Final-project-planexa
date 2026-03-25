import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Users, Calendar, BookOpen, MessageSquare,
  DollarSign, Star, Clock, ChevronRight, CheckCircle,
  AlertCircle, XCircle, Zap, Activity, ExternalLink
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Total Users",       value: "1,250", change: "+12%", icon: <Users size={22} />,         color: "#c0451a", bg: "#fff0ea" },
    { label: "Total Events",      value: "84",    change: "+5%",  icon: <Calendar size={22} />,      color: "#b5860d", bg: "#fff8e1" },
    { label: "Total Bookings",    value: "3,482", change: "+18%", icon: <BookOpen size={22} />,      color: "#1a7a4a", bg: "#e8f7ef" },
    { label: "Revenue",           value: "₹2.4L", change: "+9%",  icon: <DollarSign size={22} />,    color: "#6b2fa0", bg: "#f3eaff" },
    { label: "Active Sessions",   value: "45",    change: "+3%",  icon: <Activity size={22} />,      color: "#0e6eb8", bg: "#e7f3ff" },
    { label: "Pending Approvals", value: "12",    change: "-2",   icon: <Clock size={22} />,         color: "#c05c1a", bg: "#fff3e8" },
    { label: "Avg. Rating",       value: "4.8",   change: "+0.2", icon: <Star size={22} />,          color: "#b5860d", bg: "#fff8e1" },
    { label: "Messages",          value: "28",    change: "+6",   icon: <MessageSquare size={22} />, color: "#1a6e7a", bg: "#e8f6f7" },
  ];

  const recentBookings = [
    { id: "BK001", user: "Priya Sharma", event: "Rock Concert 2025", date: "Jun 15", amount: "₹490",  status: "confirmed" },
    { id: "BK002", user: "Arjun Mehta",  event: "Tech Conference",   date: "Jul 10", amount: "₹2990", status: "pending"   },
    { id: "BK003", user: "Sneha Rao",    event: "Food Festival",     date: "Aug 5",  amount: "₹250",  status: "confirmed" },
    { id: "BK004", user: "Rahul Verma",  event: "Comedy Night",      date: "Sep 20", amount: "₹390",  status: "cancelled" },
    { id: "BK005", user: "Divya Nair",   event: "Beach Party",       date: "Sep 20", amount: "₹450",  status: "confirmed" },
  ];

  const recentEvents = [
    { name: "Rock Concert 2025",     date: "Jun 15, 2025",  seats: "320/500", status: "upcoming", category: "Music"    },
    { name: "Tech Conference",       date: "Jul 10, 2025",  seats: "180/300", status: "upcoming", category: "Tech"     },
    { name: "Food Festival",         date: "Aug 5, 2025",   seats: "500/500", status: "full",     category: "Food"     },
    { name: "Comedy Night",          date: "Sep 20, 2025",  seats: "95/200",  status: "upcoming", category: "Comedy"   },
    { name: "Winter Gala",           date: "Dec 10, 2025",  seats: "12/250",  status: "upcoming", category: "Gala"     },
    { name: "Beach Party",           date: "Sep 20, 2025",  seats: "150/150", status: "full",     category: "Party"    },
    { name: "Annual Meetings",       date: "Sep 20, 2025",  seats: "88/200",  status: "upcoming", category: "Business" },
    { name: "Birthday Bash",         date: "Oct 5, 2025",   seats: "45/100",  status: "upcoming", category: "Party"    },
    { name: "Startup Summit",        date: "Nov 1, 2025",   seats: "230/400", status: "upcoming", category: "Tech"     },
    { name: "Classical Music Night", date: "Nov 22, 2025",  seats: "0/300",   status: "upcoming", category: "Music"    },
  ];

  // Quick links
  
  const quickLinks = [
    { label: "Manage Events", to: "/admin/events",   icon: <Calendar size={20} />,      color: "#c0451a" },
    { label: "View Events",   to: "/events",          icon: <ExternalLink size={20} />,  color: "#1a6e7a" },
    { label: "Manage Users",  to: "/admin/users",    icon: <Users size={20} />,          color: "#0e6eb8" },
    { label: "View Bookings", to: "/admin/bookings", icon: <BookOpen size={20} />,       color: "#1a7a4a" },
    { label: "Messages",      to: "/admin/contact",  icon: <MessageSquare size={20} />,  color: "#6b2fa0" },
  ];

  const statusConfig = {
    confirmed: { bg: "#e8f7ef", color: "#1a7a4a", icon: <CheckCircle size={11} />, label: "Confirmed" },
    pending:   { bg: "#fff8e1", color: "#b5860d", icon: <AlertCircle size={11} />, label: "Pending"   },
    cancelled: { bg: "#fdecea", color: "#c0391a", icon: <XCircle size={11} />,     label: "Cancelled" },
    upcoming:  { bg: "#e7f3ff", color: "#0e6eb8", icon: <Clock size={11} />,       label: "Upcoming"  },
    full:      { bg: "#fdecea", color: "#c0391a", icon: <Zap size={11} />,         label: "Full"      },
  };

  const Badge = ({ status }) => {
    const s = statusConfig[status] || statusConfig.pending;
    return (
      <span style={{ background: s.bg, color: s.color, display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700 }}>
        {s.icon} {s.label}
      </span>
    );
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", color: "#2e1106" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito:wght@400;500;600;700&display=swap');
        .db-stat-card { transition: transform 0.2s, box-shadow 0.2s; }
        .db-stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(192,69,26,0.13) !important; }
        .db-ql { transition: all 0.18s; }
        .db-ql:hover { transform: translateY(-2px); }
        .db-row { transition: background 0.15s; }
        .db-row:hover { background: #fffaf6 !important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: "0.68rem", letterSpacing: "0.18em", fontWeight: 700, color: "#e87c3e", textTransform: "uppercase", marginBottom: 4 }}>CONTROL CENTER</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 700, color: "#2e1106", marginBottom: 4 }}>
          Welcome back, {user?.name || "Admin"} 👋
        </h1>
        <p style={{ color: "#b07b65", fontSize: "0.88rem" }}>Here's what's happening with your events platform today.</p>
      </div>

      {/* ── Stats Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 14, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i} className="db-stat-card" style={{ background: "#fff", borderRadius: 16, padding: "18px 18px 16px", border: "1px solid rgba(192,69,26,0.11)", boxShadow: "0 4px 16px rgba(192,69,26,0.07)", position: "relative", overflow: "hidden", cursor: "default" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                {s.icon}
              </div>
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: s.change.startsWith("+") ? "#1a7a4a" : "#c0391a", background: s.change.startsWith("+") ? "#e8f7ef" : "#fdecea", padding: "2px 8px", borderRadius: 999 }}>
                {s.change}
              </span>
            </div>
            <p style={{ fontSize: "1.6rem", fontWeight: 700, color: "#2e1106", lineHeight: 1, marginBottom: 3 }}>{s.value}</p>
            <p style={{ fontSize: "0.72rem", color: "#b07b65", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Quick Links ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        {quickLinks.map((q, i) => (
          <Link
            key={i}
            to={q.to}
            className="db-ql"
            style={{
              background: "#fff",
              borderRadius: 13,
              padding: "14px 18px",
              border: `1px solid rgba(192,69,26,0.14)`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: "#2e1106",
              fontWeight: 700,
              fontSize: "0.86rem",
              boxShadow: "0 2px 10px rgba(192,69,26,0.06)",
              borderLeft: `3px solid ${q.color}`,
            }}
          >
            <span style={{ color: q.color, display: "flex", flexShrink: 0 }}>{q.icon}</span>
            <span style={{ flex: 1 }}>{q.label}</span>
            <ChevronRight size={14} style={{ color: "#b07b65", flexShrink: 0 }} />
          </Link>
        ))}
      </div>

      {/* ──  bookings + events ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

        {/* Recent Bookings */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(192,69,26,0.11)", boxShadow: "0 4px 16px rgba(192,69,26,0.07)", overflow: "hidden" }}>
          <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid rgba(192,69,26,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: "0.62rem", letterSpacing: "0.18em", fontWeight: 700, color: "#e87c3e", textTransform: "uppercase", marginBottom: 2 }}>LATEST</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#2e1106" }}>Recent Bookings</h2>
            </div>
            <Link to="/admin/bookings" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#c0451a", textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
              View All <ChevronRight size={12} />
            </Link>
          </div>
          {recentBookings.map((b, i) => (
            <div key={i} className="db-row" style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 22px", borderBottom: i < recentBookings.length - 1 ? "1px solid rgba(192,69,26,0.06)" : "none" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "#fff0ea", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.76rem", color: "#c0451a", flexShrink: 0 }}>
                {b.user.split(" ").map(w => w[0]).join("")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "#2e1106", marginBottom: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.user}</p>
                <p style={{ fontSize: "0.72rem", color: "#b07b65", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.event}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "#2e1106", marginBottom: 3 }}>{b.amount}</p>
                <Badge status={b.status} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Events  */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(192,69,26,0.11)", boxShadow: "0 4px 16px rgba(192,69,26,0.07)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid rgba(192,69,26,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <p style={{ fontSize: "0.62rem", letterSpacing: "0.18em", fontWeight: 700, color: "#e87c3e", textTransform: "uppercase", marginBottom: 2 }}>ALL EVENTS</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#2e1106" }}>Events Overview</h2>
            </div>
            {/* Manage Events  */}
            <Link to="/admin/events" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#c0451a", textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
              View All <ChevronRight size={12} />
            </Link>
          </div>
          <div style={{ overflowY: "auto", maxHeight: 360 }}>
            {recentEvents.map((ev, i) => (
              <div key={i} className="db-row" style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 22px", borderBottom: i < recentEvents.length - 1 ? "1px solid rgba(192,69,26,0.06)" : "none" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "#fff0ea", display: "flex", alignItems: "center", justifyContent: "center", color: "#c0451a", flexShrink: 0 }}>
                  <Calendar size={15} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "#2e1106", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>{ev.name}</p>
                    <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#c0451a", background: "#fff0ea", padding: "1px 7px", borderRadius: 999, flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{ev.category}</span>
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "#b07b65", margin: 0 }}>{ev.date} · {ev.seats} seats</p>
                </div>
                <Badge status={ev.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Platform Health Banner ── */}
      <div style={{ background: "linear-gradient(135deg, #c0451a 0%, #a03010 100%)", borderRadius: 18, padding: "26px 30px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
        <div>
          <p style={{ fontSize: "0.66rem", letterSpacing: "0.18em", fontWeight: 700, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", marginBottom: 5 }}>PLATFORM STATUS</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff", marginBottom: 5 }}>All Systems Operational ✓</h2>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.84rem" }}>Payment gateway, booking engine and notifications running smoothly.</p>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {[{ label: "Uptime", value: "99.9%" }, { label: "Avg Load", value: "1.2s" }, { label: "Errors", value: "0" }].map((m, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>{m.value}</p>
              <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.62)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;