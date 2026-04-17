import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  BookOpen,
  DollarSign,
  ChevronRight,
  Clock,
  MessageSquare,
  Plus,
  CheckCircle,
  Eye,
} from "lucide-react";
import api from "../../services/api";

// 🎨 Theme Colors (Same as AdminBookings)
const BG = "#f5ece0";
const CARD = "#eddfc8";
const CARD2 = "#e8d5b8";
const BORDER = "rgba(139,94,60,0.15)";
const SHADOW = "0 4px 16px rgba(139,94,60,0.08)";

const statusStyles = {
  confirmed: { bg: "#dfeee6", color: "#1a7a4a" },
  pending: { bg: "#f5ecd6", color: "#7a5a00" },
  cancelled: { bg: "#f6dddd", color: "#7a2f2f" },
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    bookings: 0,
    confirmed: 0,
    revenue: 0,
    messages: 0,
    unread: 0,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [uR, eR, bR, mR] = await Promise.all([
          api.get("/auth/users"),
          api.get("/events"),
          api.get("/bookings"),
          api.get("/contact/get"),
        ]);

        const users = Array.isArray(uR.data)
          ? uR.data
          : uR.data?.users || [];
        const events = Array.isArray(eR.data)
          ? eR.data
          : eR.data?.events || [];
        const bookings = Array.isArray(bR.data)
          ? bR.data
          : bR.data?.bookings || [];
        const msgs = mR.data?.contact || [];

        const confirmed = bookings.filter(
          (b) => b.bookingStatus === "confirmed"
        ).length;

        const revenue = bookings
          .filter((b) => b.bookingStatus === "confirmed")
          .reduce((a, b) => a + (b.totalAmount || 0), 0);

        const unread = msgs.filter(
          (m) => !m.status || m.status === "unread"
        ).length;

        setStats({
          users: users.length,
          events: events.length,
          bookings: bookings.length,
          confirmed,
          revenue,
          messages: msgs.length,
          unread,
        });

        setRecent(bookings.slice(0, 6));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Stat Cards
  const statCards = [
    { label: "Total Users", value: stats.users, icon: <Users size={20} />, color: "#8b5e3c", link: "/admin/users" },
    { label: "Total Events", value: stats.events, icon: <Calendar size={20} />, color: "#1a7a4a", link: "/admin/events" },
    { label: "Total Bookings", value: stats.bookings, icon: <BookOpen size={20} />, color: "#8b5e3c", link: "/admin/bookings" },
    { label: "Confirmed", value: stats.confirmed, icon: <CheckCircle size={20} />, color: "#1a7a4a", link: "/admin/bookings" },
    { label: "Revenue", value: `₹${(stats.revenue / 1000).toFixed(1)}K`, icon: <DollarSign size={20} />, color: "#1a7a4a", link: "/admin/bookings" },
    { label: "Messages", value: stats.messages, icon: <MessageSquare size={20} />, color: "#7a5a00", link: "/admin/contact" },
  ];

  // Quick Actions
  const quickActions = [
    {
      title: "Manage Events",
      desc: "Create, edit or remove events.",
      icon: <Calendar size={24} />,
      color: "#1a7a4a",
      actions: [
        { label: "View All", link: "/admin/events", icon: <Eye size={13} /> },
        { label: "Add Event", link: "/admin/events/new", icon: <Plus size={13} /> },
      ],
    },
    {
      title: "View Bookings",
      desc: "Review and manage reservations.",
      icon: <BookOpen size={24} />,
      color: "#8b5e3c",
      actions: [
        { label: "All Bookings", link: "/admin/bookings", icon: <Eye size={13} /> },
        { label: "Confirmed", link: "/admin/bookings", icon: <CheckCircle size={13} /> },
      ],
    },
    {
      title: "Manage Users",
      desc: "View and manage registered users.",
      icon: <Users size={24} />,
      color: "#8b5e3c",
      actions: [
        { label: "View Users", link: "/admin/users", icon: <Eye size={13} /> },
      ],
    },
    {
      title: "View Messages",
      desc: "Read and respond to contact messages.",
      icon: <MessageSquare size={24} />,
      color: "#7a5a00",
      badge: stats.unread > 0 ? `${stats.unread} unread` : null,
      actions: [
        { label: "Open Inbox", link: "/admin/contact", icon: <Eye size={13} /> },
      ],
    },
  ];

  return (
    <div
      style={{
        fontFamily: "'Jost', sans-serif",
        backgroundColor: BG,
        minHeight: "100vh",
        color: "#2c1a0e",
        padding: "24px 28px 48px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Jost:wght@400;500;600;700&display=swap');
        html,body,#root{ background:${BG}!important; }
        .ad-stat:hover { transform: translateY(-4px); box-shadow: ${SHADOW}; }
        .ad-qa:hover { transform: translateY(-3px); box-shadow: ${SHADOW}; }
        .ab-tr:hover td { background:${CARD2}!important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* 🔹 STAT CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {statCards.map((s, i) => (
          <Link key={i} to={s.link} style={{ textDecoration: "none" }}>
            <div
              className="ad-stat"
              style={{
                background: CARD,
                borderRadius: 14,
                padding: "26px",
                border: `1px solid ${BORDER}`,
                boxShadow: SHADOW,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: s.color,
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ color: s.color }}>{s.icon}</div>
                <ChevronRight size={14} style={{ color: "#6b4c35" }} />
              </div>
              <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
                {s.value}
              </p>
              <p
                style={{
                  fontSize: "0.72rem",
                  color: "#6b4c35",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginTop: 4,
                }}
              >
                {s.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* 🔹 QUICK ACTIONS */}
      <div style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.4rem",
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Manage Your Platform
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18,
          }}
        >
          {quickActions.map((qa, i) => (
            <div
              key={i}
              className="ad-qa"
              style={{
                background: CARD,
                borderRadius: 16,
                border: `1px solid ${BORDER}`,
                boxShadow: SHADOW,
                overflow: "hidden",
              }}
            >
              <div style={{ height: 4, background: qa.color }} />
              <div style={{ padding: "18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ color: qa.color }}>{qa.icon}</div>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      margin: 0,
                      fontSize: "1.1rem",
                    }}
                  >
                    {qa.title}
                  </h3>
                </div>

                {qa.badge && (
                  <span
                    style={{
                      display: "inline-block",
                      background: "#f6dddd",
                      color: "#7a2f2f",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      padding: "3px 9px",
                      borderRadius: 999,
                      marginTop: 6,
                    }}
                  >
                    {qa.badge}
                  </span>
                )}

                <p style={{ fontSize: "0.85rem", color: "#6b4c35", marginTop: 10 }}>
                  {qa.desc}
                </p>

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  {qa.actions.map((a, j) => (
                    <Link
                      key={j}
                      to={a.link}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "7px 12px",
                        borderRadius: 8,
                        background: j === 0 ? qa.color : "transparent",
                        color: j === 0 ? "#fff" : qa.color,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        border: j === 0 ? "none" : `1px solid ${qa.color}60`,
                      }}
                    >
                      {a.icon} {a.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 RECENT BOOKINGS */}
      <div
        style={{
          background: CARD,
          borderRadius: 16,
          border: `1px solid ${BORDER}`,
          boxShadow: SHADOW,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${BORDER}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.2rem",
              margin: 0,
            }}
          >
            Recent Bookings
          </h2>
          <Link
            to="/admin/bookings"
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#8b5e3c",
              textDecoration: "none",
            }}
          >
            View All
          </Link>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
            <thead>
              <tr style={{ background: CARD2 }}>
                {["Customer", "Event", "Booked On", "Seats", "Amount", "Status"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "13px 16px",
                      textAlign: "left",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "#6b4c35",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      borderBottom: `1px solid ${BORDER}`,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((b, i) => {
                const s = statusStyles[b.bookingStatus] || statusStyles.pending;
                return (
                  <tr
                    key={b._id}
                    className="ab-tr"
                    style={{
                      borderBottom:
                        i < recent.length - 1 ? `1px solid ${BORDER}` : "none",
                    }}
                  >
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ fontWeight: 700 }}>{b.user?.name || "—"}</div>
                      <div style={{ fontSize: "0.72rem", color: "#a88972" }}>
                        {b.user?.email || "—"}
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px" }}>{b.event?.title || "—"}</td>
                    <td style={{ padding: "13px 16px" }}>
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                    <td style={{ padding: "13px 16px", textAlign: "center", fontWeight: 700 }}>
                      {b.numberOfSeats}
                    </td>
                    <td style={{ padding: "13px 16px", fontWeight: 700, color: "#1a7a4a" }}>
                      ₹{Number(b.totalAmount || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span
                        style={{
                          background: s.bg,
                          color: s.color,
                          padding: "3px 10px",
                          borderRadius: 999,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          textTransform: "capitalize",
                        }}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;