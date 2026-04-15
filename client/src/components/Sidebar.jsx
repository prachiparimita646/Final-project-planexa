// src/components/Sidebar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, Calendar,
  BookOpen, MessageSquare, LogOut, Zap, X
} from "lucide-react";
import api from "../services/api";

const Sidebar = () => {
  const { logout }              = useAuth();
  const location                = useLocation();
  const [unread, setUnread]     = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch unread count on route change
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get("/contact/get");
        const msgs = res.data?.contact || [];
        setUnread(msgs.filter(m => !m.status || m.status === "unread").length);
      } catch {}
    };
    fetchUnread();
  }, [location]);

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
    <>
      {/* ── Logout confirmation modal ── */}
      {showConfirm && (
        <div onClick={() => setShowConfirm(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(44,26,14,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#faf4ec", borderRadius: 20, width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(44,26,14,0.25)", overflow: "hidden", fontFamily: "'Jost', sans-serif" }}>
            {/* Modal header */}
            <div style={{ background: "linear-gradient(135deg,#3d1f0a,#2c1506)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontWeight: 700, color: "#f5ece0", margin: 0 }}>Confirm Logout</h2>
              <button onClick={() => setShowConfirm(false)}
                style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.12)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5ece0" }}>
                <X size={15} />
              </button>
            </div>
            {/* Modal body */}
            <div style={{ padding: "24px" }}>
              <p style={{ fontSize: "0.9rem", color: "#6b4c35", lineHeight: 1.7, marginBottom: 24 }}>
                Are you sure you want to logout from the admin panel?
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={logout}
                  style={{ flex: 1, padding: "11px", borderRadius: 11, background: "linear-gradient(135deg,#8b3a2a,#6b2a1a)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "inherit" }}>
                  <LogOut size={15} /> Yes, Logout
                </button>
                <button onClick={() => setShowConfirm(false)}
                  style={{ flex: 1, padding: "11px", borderRadius: 11, background: "#f5ece0", color: "#6b4c35", fontWeight: 700, fontSize: "0.9rem", border: "1px solid rgba(139,94,60,0.2)", cursor: "pointer", fontFamily: "inherit" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          .sb-logout:hover { background: rgba(139,58,42,0.85) !important; }
        `}</style>

        {/* ── Logo — Star/Zap icon style ── */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, padding: "22px 20px", borderBottom: "1px solid rgba(196,148,90,0.12)", textDecoration: "none" }}>
          {/* Star-like icon badge */}
          <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,#c4945a,#8b5e3c)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 14px rgba(196,148,90,0.35)" }}>
            <Zap size={22} color="#fff" fill="#fff" />
          </div>
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "0.88rem", color: "#f5ece0", margin: 0, lineHeight: 1.15 }}>The Event Utsava</p>
            <p style={{ fontSize: "0.58rem", color: "rgba(196,148,90,0.55)", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin Panel</p>
          </div>
        </Link>

        {/* ── Section label ── */}
        <div style={{ padding: "16px 20px 6px" }}>
          <p style={{ fontSize: "0.58rem", fontWeight: 700, color: "rgba(196,148,90,0.42)", textTransform: "uppercase", letterSpacing: "0.16em", margin: 0 }}>Main Menu</p>
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
                  color: active ? "#f5ece0" : "rgba(245,236,224,0.55)",
                  borderLeft: active ? "3px solid #c4945a" : "3px solid transparent",
                }}>
                <span style={{ color: active ? "#c4945a" : "rgba(245,236,224,0.36)", display: "flex", flexShrink: 0 }}>
                  {link.icon}
                </span>
                <span style={{ flex: 1 }}>{link.label}</span>
                {link.badge > 0 && (
                  <span style={{ background: "#8b3a2a", color: "#fff", fontSize: "0.6rem", fontWeight: 700, padding: "2px 6px", borderRadius: 999, minWidth: 18, textAlign: "center" }}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Logout ── */}
        <div style={{ padding: "12px 12px 20px", borderTop: "1px solid rgba(196,148,90,0.1)" }}>
          <button onClick={() => setShowConfirm(true)} className="sb-logout"
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px", borderRadius: 11, background: "rgba(139,58,42,0.5)", color: "#f5ece0", fontWeight: 700, fontSize: "0.88rem", border: "1px solid rgba(139,58,42,0.4)", cursor: "pointer", fontFamily: "inherit" }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;