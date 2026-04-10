import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users, Calendar, BookOpen, DollarSign,
  ChevronRight, Clock, MessageSquare, Plus,
  TrendingUp, CheckCircle, AlertCircle, Eye,
} from "lucide-react";
import api from "../../services/api";

const AdminDashboard = () => {
  const [stats,   setStats]   = useState({ users: 0, events: 0, bookings: 0, revenue: 0, messages: 0, unread: 0 });
  const [recent,  setRecent]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, eventsRes, bookingsRes, messagesRes] = await Promise.all([
          api.get("/auth/users"),
          api.get("/events"),
          api.get("/bookings"),
          api.get("/contact/get"),
        ]);

        const users    = Array.isArray(usersRes.data)    ? usersRes.data    : usersRes.data?.users    || [];
        const events   = Array.isArray(eventsRes.data)   ? eventsRes.data   : eventsRes.data?.events  || [];
        const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : bookingsRes.data?.bookings || [];
        const msgs     = messagesRes.data?.contact || [];

        const revenue = bookings
          .filter(b => b.bookingStatus === "confirmed")
          .reduce((a, b) => a + (b.totalAmount || 0), 0);

        const unread = msgs.filter(m => !m.status || m.status === "unread").length;

        setStats({ users: users.length, events: events.length, bookings: bookings.length, revenue, messages: msgs.length, unread });
        setRecent(bookings.slice(0, 6));
      } catch (err) {
        console.error("Dashboard fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statCards = [
    { label: "Total Users",    value: stats.users,    icon: <Users size={22} />,        color: "#8b5e3c", link: "/admin/users"    },
    { label: "Total Events",   value: stats.events,   icon: <Calendar size={22} />,     color: "#4a6e5a", link: "/admin/events"   },
    { label: "Total Bookings", value: stats.bookings, icon: <BookOpen size={22} />,     color: "#6b4c35", link: "/admin/bookings" },
    { label: "Revenue",        value: `₹${(stats.revenue/1000).toFixed(1)}K`, icon: <DollarSign size={22} />, color: "#1a7a4a", link: "/admin/bookings" },
    { label: "Messages",       value: stats.messages, icon: <MessageSquare size={22} />, color: "#8b6a0a", link: "/admin/contact"  },
    { label: "Unread Messages",value: stats.unread,   icon: <AlertCircle size={22} />,  color: "#8b3a2a", link: "/admin/contact"  },
  ];

  // Quick action panels
  const quickActions = [
    {
      title: "Manage Events",
      desc:  "Create, edit or remove events. Update seats, pricing and thumbnails.",
      icon:  <Calendar size={28} />,
      color: "#4a6e5a",
      link:  "/admin/events",
      actions: [
        { label: "View All Events", link: "/admin/events",     icon: <Eye size={13} />  },
        { label: "Add New Event",   link: "/admin/events/new", icon: <Plus size={13} /> },
      ],
    },
    {
      title: "View Bookings",
      desc:  "Review all reservations, confirm or cancel bookings and export CSV.",
      icon:  <BookOpen size={28} />,
      color: "#6b4c35",
      link:  "/admin/bookings",
      actions: [
        { label: "All Bookings",   link: "/admin/bookings", icon: <Eye size={13} />          },
        { label: "Confirmed Only", link: "/admin/bookings", icon: <CheckCircle size={13} />  },
      ],
    },
    {
      title: "Manage Users",
      desc:  "View registered users, update roles and remove inactive accounts.",
      icon:  <Users size={28} />,
      color: "#8b5e3c",
      link:  "/admin/users",
      actions: [
        { label: "View All Users", link: "/admin/users", icon: <Eye size={13} />  },
      ],
    },
    {
      title: "View Messages",
      desc:  "Read and reply to contact form messages. Track unread and replied status.",
      icon:  <MessageSquare size={28} />,
      color: "#8b6a0a",
      link:  "/admin/contact",
      badge: stats.unread > 0 ? `${stats.unread} unread` : null,
      actions: [
        { label: "Open Inbox", link: "/admin/contact", icon: <Eye size={13} /> },
      ],
    },
  ];

  const statusStyle = {
    confirmed: { bg: "#e8f5ee", color: "#1a7a4a" },
    pending:   { bg: "#fff8e1", color: "#8b6a0a" },
    cancelled: { bg: "#fdecea", color: "#8b3a2a" },
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", color: "#2c1a0e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Jost:wght@400;500;600;700&display=swap');
        .ad-stat { transition: transform 0.2s, box-shadow 0.2s; }
        .ad-stat:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(139,94,60,0.14) !important; }
        .ad-qa { transition: transform 0.2s, box-shadow 0.2s; }
        .ad-qa:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(139,94,60,0.13) !important; }
        .ad-qa-btn { transition: background 0.15s, color 0.15s; }
        .ad-qa-btn:hover { filter: brightness(1.08); }
        .ab-tr:hover td { background: #f5ece0 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: 32, animation: "fadeUp 0.4s ease both" }}>
        <p style={{ fontSize: "0.68rem", letterSpacing: "0.18em", fontWeight: 700, color: "#c4945a", textTransform: "uppercase", marginBottom: 4 }}>OVERVIEW</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 700, color: "#2c1a0e" }}>Admin Dashboard</h1>
        <p style={{ fontSize: "0.86rem", color: "#a88972", marginTop: 4 }}>Welcome back — here's what's happening with your platform.</p>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#a88972" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #8b5e3c", borderTopColor: "transparent", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontWeight: 600 }}>Loading dashboard...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* ── Stat Cards ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16, marginBottom: 36 }}>
            {statCards.map((s, i) => (
              <Link key={i} to={s.link} style={{ textDecoration: "none" }}>
                <div className="ad-stat" style={{ background: "#faf4ec", borderRadius: 16, padding: "20px 18px", border: "1px solid rgba(139,94,60,0.14)", boxShadow: "0 4px 16px rgba(139,94,60,0.07)", position: "relative", overflow: "hidden", animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                      {s.icon}
                    </div>
                    <ChevronRight size={15} style={{ color: "#a88972" }} />
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.9rem", fontWeight: 700, color: "#2c1a0e", lineHeight: 1, marginBottom: 4 }}>{s.value}</p>
                  <p style={{ fontSize: "0.68rem", color: "#a88972", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* ── Quick Action Panels ── */}
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: "0.62rem", letterSpacing: "0.2em", fontWeight: 700, color: "#c4945a", textTransform: "uppercase", marginBottom: 8 }}>QUICK ACTIONS</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 700, color: "#2c1a0e", marginBottom: 18 }}>Manage Your Platform</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 18 }}>
              {quickActions.map((qa, i) => (
                <div key={i} className="ad-qa"
                  style={{ background: "#faf4ec", borderRadius: 18, border: "1px solid rgba(139,94,60,0.13)", boxShadow: "0 4px 16px rgba(139,94,60,0.07)", overflow: "hidden", animation: `fadeUp 0.4s ease ${i * 0.08}s both` }}>
                  {/* Card top bar */}
                  <div style={{ height: 3, background: qa.color }} />
                  <div style={{ padding: "20px 22px" }}>
                    {/* Icon + title */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: `${qa.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: qa.color, flexShrink: 0 }}>
                          {qa.icon}
                        </div>
                        <div>
                          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.08rem", fontWeight: 700, color: "#2c1a0e", margin: 0, lineHeight: 1.2 }}>{qa.title}</h3>
                          {qa.badge && (
                            <span style={{ display: "inline-block", background: "#fdecea", color: "#8b3a2a", fontSize: "0.62rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, marginTop: 4 }}>
                              {qa.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: "0.80rem", color: "#a88972", lineHeight: 1.65, marginBottom: 16 }}>{qa.desc}</p>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {qa.actions.map((a, j) => (
                        <Link key={j} to={a.link} className="ad-qa-btn"
                          style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 9, background: j === 0 ? qa.color : "transparent", color: j === 0 ? "#fff" : qa.color, fontSize: "0.75rem", fontWeight: 700, textDecoration: "none", border: j === 0 ? "none" : `1px solid ${qa.color}40`, boxShadow: j === 0 ? `0 3px 10px ${qa.color}30` : "none" }}>
                          {a.icon} {a.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent Bookings table ── */}
          <div style={{ background: "#faf4ec", borderRadius: 18, border: "1px solid rgba(139,94,60,0.14)", boxShadow: "0 4px 16px rgba(139,94,60,0.07)", overflow: "hidden" }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(139,94,60,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Clock size={16} style={{ color: "#c4945a" }} />
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontWeight: 700, color: "#2c1a0e", margin: 0 }}>Recent Bookings</h2>
              </div>
              <Link to="/admin/bookings" style={{ fontSize: "0.78rem", fontWeight: 600, color: "#8b5e3c", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                View All <ChevronRight size={13} />
              </Link>
            </div>

            {recent.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 24px", color: "#a88972" }}>
                <BookOpen size={36} style={{ opacity: 0.3, margin: "0 auto 10px", display: "block" }} />
                <p style={{ fontWeight: 600 }}>No bookings yet</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
                  <thead>
                    <tr style={{ background: "rgba(139,94,60,0.06)" }}>
                      {["Customer","Event","Booked On","Seats","Amount","Status"].map(h => (
                        <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, color: "#6b4c35", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((b, i) => {
                      const s = statusStyle[b.bookingStatus] || statusStyle.pending;
                      // ✅ Fix: use createdAt for booking date, NOT event date
                      const bookedOn = b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "—";
                      return (
                        <tr key={b._id} className="ab-tr" style={{ borderBottom: i < recent.length - 1 ? "1px solid rgba(139,94,60,0.07)" : "none", transition: "background 0.15s" }}>
                          <td style={{ padding: "12px 16px" }}>
                            <p style={{ fontWeight: 700, color: "#2c1a0e", margin: 0 }}>{b.user?.name || "—"}</p>
                            <p style={{ fontSize: "0.72rem", color: "#a88972", margin: 0 }}>{b.user?.email || "—"}</p>
                          </td>
                          <td style={{ padding: "12px 16px", color: "#6b4c35", maxWidth: 150, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.event?.title || "—"}</td>
                          <td style={{ padding: "12px 16px", color: "#a88972", whiteSpace: "nowrap" }}>{bookedOn}</td>
                          <td style={{ padding: "12px 16px", fontWeight: 700, color: "#2c1a0e", textAlign: "center" }}>{b.numberOfSeats}</td>
                          <td style={{ padding: "12px 16px", fontWeight: 700, color: "#1a7a4a", whiteSpace: "nowrap" }}>₹{Number(b.totalAmount || 0).toLocaleString()}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                              {b.bookingStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;