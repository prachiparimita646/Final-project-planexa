import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Calendar,
  BookOpen, MessageSquare, LogOut,
  ArrowLeft, Zap
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: "/admin",          label: "Dashboard", icon: <LayoutDashboard size={18} />, exact: true  },
    { to: "/admin/events",   label: "Events",    icon: <Calendar size={18} />,        exact: false },
    { to: "/admin/users",    label: "Users",     icon: <Users size={18} />,           exact: false },
    { to: "/admin/bookings", label: "Bookings",  icon: <BookOpen size={18} />,        exact: false },
    { to: "/admin/contact",  label: "Messages",  icon: <MessageSquare size={18} />,   exact: false },
  ];

  const isActive = (link) => {
    if (link.exact) return location.pathname === link.to;
    return location.pathname.startsWith(link.to);
  };

  return (
    <div style={{
      width: 240, minHeight: "100vh", flexShrink: 0,
      background: "linear-gradient(180deg, #2e1106 0%, #1a0a04 100%)",
      display: "flex", flexDirection: "column",
      fontFamily: "'Nunito', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito:wght@400;600;700&display=swap');
        .sb-link { transition: background 0.18s, transform 0.15s; }
        .sb-link:hover { background: rgba(192,69,26,0.25) !important; transform: translateX(3px); }
        .sb-logout:hover { background: rgba(192,57,26,0.85) !important; }
      `}</style>

      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#c0451a,#a03010)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={18} color="#fff" />
          </div>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: "#fff", margin: 0, lineHeight: 1.2 }}>Planexa</p>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.45)", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="sb-link"
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 14px", borderRadius: 11,
              textDecoration: "none", fontWeight: 600, fontSize: "0.88rem",
              background: isActive(link) ? "rgba(192,69,26,0.35)" : "transparent",
              color: isActive(link) ? "#fff" : "rgba(255,255,255,0.65)",
              borderLeft: isActive(link) ? "3px solid #c0451a" : "3px solid transparent",
            }}
          >
            <span style={{ color: isActive(link) ? "#e87c3e" : "rgba(255,255,255,0.45)", display: "flex" }}>
              {link.icon}
            </span>
            {link.label}
          </Link>
        ))}

        {/* Divider */}
        <div style={{ margin: "8px 0", borderTop: "1px solid rgba(255,255,255,0.07)" }} />

        {/* Back to Site */}
        <Link
          to="/"
          className="sb-link"
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 11, textDecoration: "none", fontWeight: 600, fontSize: "0.88rem", color: "rgba(255,255,255,0.4)", borderLeft: "3px solid transparent" }}
        >
          <span style={{ display: "flex", color: "rgba(255,255,255,0.3)" }}><ArrowLeft size={18} /></span>
          Back to Site
        </Link>
      </nav>

      {/* Logout */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button
          onClick={logout}
          className="sb-logout"
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px", borderRadius: 11, background: "rgba(192,57,26,0.6)", color: "#fff", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", fontFamily: "inherit", transition: "background 0.18s" }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;