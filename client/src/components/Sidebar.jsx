// src/components/Sidebar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, Calendar,
  BookOpen, MessageSquare, LogOut,
  ArrowLeft, Zap
} from "lucide-react";
import api from "../services/api";

const Sidebar = () => {
  const { logout }          = useAuth();
  const location            = useLocation();
  const [unread, setUnread] = useState(0);

  // ── Fetch unread message count ──
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get("/contact/get");
        const msgs = res.data?.contact || [];
        setUnread(msgs.filter(m => !m.status || m.status === "unread").length);
      } catch {}
    };
    fetchUnread();
  }, [location]); // re-fetch when route changes so badge updates after reading

  const navLinks = [
    { to: "/admin",          label: "Dashboard", icon: <LayoutDashboard size={18} />, exact: true  },
    { to: "/admin/events",   label: "Events",    icon: <Calendar size={18} />,        exact: false },
    { to: "/admin/users",    label: "Users",     icon: <Users size={18} />,           exact: false },
    { to: "/admin/bookings", label: "Bookings",  icon: <BookOpen size={18} />,        exact: false },
    { to: "/admin/contact",  label: "Messages",  icon: <MessageSquare size={18} />,   exact: false, badge: unread },
  ];

  const isActive = (link) =>
    link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to);

  return (
    <div style={{
      width: 240, minHeight: "100vh", flexShrink: 0,
      background: "linear-gradient(180deg,#2c1a0e 0%,#1a0d06 100%)",
      display: "flex", flexDirection: "column",
      fontFamily: "'Jost', sans-serif",
      boxShadow: "2px 0 20px rgba(44,26,14,0.25)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Jost:wght@400;500;600;700&display=swap');
        .sb-link { transition: background 0.18s, transform 0.15s; }
        .sb-link:hover { background: rgba(196,148,90,0.15) !important; transform: translateX(3px); }
        .sb-logout { transition: background 0.18s; }
        .sb-logout:hover { background: rgba(139,58,42,0.9) !important; }
      `}</style>

      {/* ── Logo ── */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(196,148,90,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#c4945a,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Zap size={18} color="#fff" />
          </div>
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "0.95rem", color: "#f5ece0", margin: 0, lineHeight: 1.15 }}>The Event Utsava</p>
            <p style={{ fontSize: "0.62rem", color: "rgba(245,236,224,0.45)", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* ── Nav section label ── */}
      <div style={{ padding: "16px 20px 6px" }}>
        <p style={{ fontSize: "0.58rem", fontWeight: 700, color: "rgba(196,148,90,0.5)", textTransform: "uppercase", letterSpacing: "0.16em", margin: 0 }}>Main Menu</p>
      </div>

      {/* ── Nav Links ── */}
      <nav style={{ flex: 1, padding: "4px 12px 16px", display: "flex", flexDirection: "column", gap: 3 }}>
        {navLinks.map((link) => {
          const active = isActive(link);
          return (
            <Link key={link.to} to={link.to} className="sb-link"
              style={{
                display: "flex", alignItems: "center", gap: 11,
                padding: "10px 14px", borderRadius: 11,
                textDecoration: "none", fontWeight: active ? 700 : 500,
                fontSize: "0.88rem",
                background: active ? "rgba(196,148,90,0.18)" : "transparent",
                color: active ? "#f5ece0" : "rgba(245,236,224,0.58)",
                borderLeft: active ? "3px solid #c4945a" : "3px solid transparent",
                position: "relative",
              }}>
              <span style={{ color: active ? "#c4945a" : "rgba(245,236,224,0.38)", display: "flex", flexShrink: 0 }}>
                {link.icon}
              </span>
              <span style={{ flex: 1 }}>{link.label}</span>
              {/* Unread badge */}
              {link.badge > 0 && (
                <span style={{ background: "#8b3a2a", color: "#fff", fontSize: "0.6rem", fontWeight: 700, padding: "2px 6px", borderRadius: 999, minWidth: 18, textAlign: "center" }}>
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div style={{ margin: "10px 4px", borderTop: "1px solid rgba(196,148,90,0.1)" }} />

        {/* Back to Site */}
        <Link to="/" className="sb-link"
          style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 14px", borderRadius: 11, textDecoration: "none", fontWeight: 500, fontSize: "0.88rem", color: "rgba(245,236,224,0.38)", borderLeft: "3px solid transparent" }}>
          <span style={{ display: "flex", color: "rgba(245,236,224,0.28)" }}><ArrowLeft size={18} /></span>
          Back to Site
        </Link>
      </nav>

      {/* ── Logout ── */}
      <div style={{ padding: "12px 12px 20px", borderTop: "1px solid rgba(196,148,90,0.1)" }}>
        <button onClick={logout} className="sb-logout"
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px", borderRadius: 11, background: "rgba(139,58,42,0.55)", color: "#f5ece0", fontWeight: 700, fontSize: "0.88rem", border: "1px solid rgba(139,58,42,0.4)", cursor: "pointer", fontFamily: "inherit" }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;