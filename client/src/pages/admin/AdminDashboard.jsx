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
    {
      label: "Total Users",
      value: stats.users,
      icon: <Users size={22} />,
      color: "#7a4f2a",
      link: "/admin/users",
    },
    {
      label: "Total Events",
      value: stats.events,
      icon: <Calendar size={22} />,
      color: "#1a5c3a",
      link: "/admin/events",
    },
    {
      label: "Total Bookings",
      value: stats.bookings,
      icon: <BookOpen size={22} />,
      color: "#6b3f2a",
      link: "/admin/bookings",
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      icon: <CheckCircle size={22} />,
      color: "#1a7a4a",
      link: "/admin/bookings",
    },
    {
      label: "Revenue",
      value: `₹${(stats.revenue / 1000).toFixed(1)}K`,
      icon: <DollarSign size={22} />,
      color: "#1a5c3a",
      link: "/admin/bookings",
    },
    {
      label: "Messages",
      value: stats.messages,
      icon: <MessageSquare size={22} />,
      color: "#7a5a00",
      link: "/admin/contact",
    },
  ];

  // Quick Actions
  const quickActions = [
    {
      title: "Manage Events",
      desc: "Create, edit or remove events. Update seats, pricing and thumbnails.",
      icon: <Calendar size={28} />,
      color: "#1a5c3a",
      actions: [
        { label: "View All Events", link: "/admin/events", icon: <Eye size={13} /> },
        { label: "Add New Event", link: "/admin/events/new", icon: <Plus size={13} /> },
      ],
    },
    {
      title: "View Bookings",
      desc: "Review all reservations, confirm or cancel bookings and export CSV.",
      icon: <BookOpen size={28} />,
      color: "#6b3f2a",
      actions: [
        { label: "All Bookings", link: "/admin/bookings", icon: <Eye size={13} /> },
        { label: "Confirmed Only", link: "/admin/bookings", icon: <CheckCircle size={13} /> },
      ],
    },
    {
      title: "Manage Users",
      desc: "View registered users, update roles and remove inactive accounts.",
      icon: <Users size={28} />,
      color: "#7a4f2a",
      actions: [
        { label: "View All Users", link: "/admin/users", icon: <Eye size={13} /> },
      ],
    },
    {
      title: "View Messages",
      desc: "Read and reply to contact form messages. Track unread and replied.",
      icon: <MessageSquare size={28} />,
      color: "#7a5a00",
      badge: stats.unread > 0 ? `${stats.unread} unread` : null,
      actions: [
        { label: "Open Inbox", link: "/admin/contact", icon: <Eye size={13} /> },
      ],
    },
  ];

  // Booking Status Styles
  const statusStyles = {
    confirmed: { bg: "#dfeee6", color: "#1a7a4a" },
    pending: { bg: "#f5ecd6", color: "#7a5a00" },
    cancelled: { bg: "#f6dddd", color: "#7a2f2f" },
  };

  return (
    <div
      style={{
        fontFamily: "'Jost', sans-serif",
        backgroundColor: "#f5ece0",
        color: "#1f1208",
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      {/* Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Jost:wght@400;500;600;700&display=swap');
        .ad-stat { transition: transform 0.2s, box-shadow 0.2s; }
        .ad-stat:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
        .ad-qa { transition: transform 0.2s, box-shadow 0.2s; }
        .ad-qa:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(0,0,0,0.12); }
        .ad-qa-btn { transition: all 0.2s; }
        .ad-qa-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .ab-tr:hover td { background: #efe2d3 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#6b4c35" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "3px solid #7a4f2a",
              borderTopColor: "transparent",
              margin: "0 auto 12px",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ fontWeight: 600 }}>Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
              gap: 16,
              marginBottom: 36,
            }}
          >
            {statCards.map((s, i) => (
              <Link key={i} to={s.link} style={{ textDecoration: "none" }}>
                <div
                  className="ad-stat"
                  style={{
                    background: "#f3e7d9",
                    borderRadius: 16,
                    padding: "20px 18px",
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                    position: "relative",
                    overflow: "hidden",
                    animation: `fadeUp 0.4s ease ${i * 0.06}s both`,
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 11,
                        background: `${s.color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: s.color,
                      }}
                    >
                      {s.icon}
                    </div>
                    <ChevronRight size={15} style={{ color: "#6b4c35" }} />
                  </div>
                  <p style={{ fontSize: "1.9rem", fontWeight: 700, marginBottom: 4 }}>
                    {s.value}
                  </p>
                  <p
                    style={{
                      fontSize: "0.68rem",
                      color: "#6b4c35",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom: 36 }}>
            <p
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                fontWeight: 700,
                color: "#7a4f2a",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              QUICK ACTIONS
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              Manage Your Platform
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 18,
              }}
            >
              {quickActions.map((qa, i) => (
                <div
                  key={i}
                  className="ad-qa"
                  style={{
                    background: "#f3e7d9",
                    borderRadius: 18,
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                    animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
                  }}
                >
                  <div style={{ height: 4, background: qa.color }} />
                  <div style={{ padding: "20px 22px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 14,
                          background: `${qa.color}20`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: qa.color,
                        }}
                      >
                        {qa.icon}
                      </div>
                      <div>
                        <h3
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            margin: 0,
                          }}
                        >
                          {qa.title}
                        </h3>
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
                              marginTop: 4,
                            }}
                          >
                            {qa.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#6b4c35",
                        lineHeight: 1.6,
                        marginBottom: 16,
                      }}
                    >
                      {qa.desc}
                    </p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {qa.actions.map((a, j) => (
                        <Link
                          key={j}
                          to={a.link}
                          className="ad-qa-btn"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 14px",
                            borderRadius: 10,
                            background: j === 0 ? qa.color : "transparent",
                            color: j === 0 ? "#fff" : qa.color,
                            fontSize: "0.78rem",
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

          {/* Recent Bookings */}
          <div
            style={{
              background: "#f3e7d9",
              borderRadius: 18,
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "18px 22px",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Clock size={16} style={{ color: "#7a4f2a" }} />
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  Recent Bookings
                </h2>
              </div>
              <Link
                to="/admin/bookings"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#7a4f2a",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>

            {recent.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 24px", color: "#6b4c35" }}>
                <BookOpen
                  size={36}
                  style={{ opacity: 0.3, margin: "0 auto 10px", display: "block" }}
                />
                <p style={{ fontWeight: 600 }}>No bookings yet</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.85rem",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#efe2d3" }}>
                      {["Customer", "Event", "Booked On", "Seats", "Amount", "Status"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "#6b4c35",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
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
                      const bookedOn = b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—";

                      return (
                        <tr
                          key={b._id}
                          className="ab-tr"
                          style={{
                            borderBottom:
                              i < recent.length - 1
                                ? "1px solid rgba(0,0,0,0.06)"
                                : "none",
                          }}
                        >
                          <td style={{ padding: "12px 16px" }}>
                            <p style={{ fontWeight: 700, margin: 0 }}>
                              {b.user?.name || "—"}
                            </p>
                            <p
                              style={{
                                fontSize: "0.72rem",
                                color: "#6b4c35",
                                margin: 0,
                              }}
                            >
                              {b.user?.email || "—"}
                            </p>
                          </td>
                          <td style={{ padding: "12px 16px", color: "#6b4c35" }}>
                            {b.event?.title || "—"}
                          </td>
                          <td style={{ padding: "12px 16px", color: "#6b4c35" }}>
                            {bookedOn}
                          </td>
                          <td
                            style={{
                              padding: "12px 16px",
                              textAlign: "center",
                              fontWeight: 700,
                            }}
                          >
                            {b.numberOfSeats}
                          </td>
                          <td
                            style={{
                              padding: "12px 16px",
                              fontWeight: 700,
                              color: "#1a7a4a",
                            }}
                          >
                            ₹{Number(b.totalAmount || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <span
                              style={{
                                background: s.bg,
                                color: s.color,
                                padding: "4px 12px",
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
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;