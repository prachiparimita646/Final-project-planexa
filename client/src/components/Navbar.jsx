import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LayoutDashboard, LogOut, User, BookOpen, ChevronDown } from "lucide-react";

const Navbar = () => {
  const { user, logout }        = useAuth();
  const location                = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef                 = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropOpen(false); }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const navLinks = [
    { to: "/",        label: "Home"    },
    { to: "/about",   label: "About"   },
    { to: "/events",  label: "Events"  },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Jost:wght@400;500;600;700&display=swap');

        .nb-root {
          font-family: 'Jost', sans-serif;
          position: sticky; top: 0; z-index: 1000;
          transition: background 0.3s, box-shadow 0.3s;
        }
        .nb-root.scrolled {
          background: rgba(236,220,200,0.97);
          box-shadow: none;
        }
        .nb-root.top {
          background: rgba(236,220,200,0.75);
          box-shadow: none;
        }

        /* Nav link with animated underline */
        .nb-link {
          position: relative;
          font-size: 0.88rem;
          font-weight: 500;
          color: #6b4c35;
          text-decoration: none;
          padding: 4px 0;
          transition: color 0.18s;
        }
        .nb-link::after {
          content: '';
          position: absolute; bottom: -1px; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #8b5e3c, #c4945a);
          border-radius: 999px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .nb-link:hover, .nb-link.active { color: #2c1a0e; }
        .nb-link:hover::after, .nb-link.active::after { transform: scaleX(1); }

        /* ── Profile trigger button ── */
        .nb-profile-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(139,94,60,0.08);
          border: 1px solid rgba(139,94,60,0.20);
          border-radius: 999px;
          padding: 5px 14px 5px 6px;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.18s, border-color 0.18s, box-shadow 0.18s;
          color: #2c1a0e;
        }
        .nb-profile-btn:hover,
        .nb-profile-btn.open {
          background: rgba(139,94,60,0.14);
          border-color: rgba(139,94,60,0.40);
          box-shadow: 0 2px 10px rgba(139,94,60,0.12);
        }

        .nb-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c4945a, #8b5e3c);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem; font-weight: 700; color: #fff;
          flex-shrink: 0;
          letter-spacing: 0.02em;
        }

        .nb-profile-label {
          font-size: 0.84rem;
          color: #a88972;
          font-weight: 500;
          line-height: 1;
        }
        .nb-profile-label strong {
          display: block;
          font-size: 0.87rem;
          color: #2c1a0e;
          font-weight: 600;
        }

        .nb-chevron {
          color: #8b5e3c;
          transition: transform 0.22s ease;
          flex-shrink: 0;
        }
        .nb-chevron.rotated { transform: rotate(180deg); }

        /* ── Dropdown panel ── */
        .nb-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 210px;
          background: #faf4ec;
          border: 1px solid rgba(139,94,60,0.16);
          border-radius: 14px;
          box-shadow: 0 12px 40px rgba(44,26,14,0.14), 0 2px 8px rgba(44,26,14,0.06);
          padding: 8px;
          animation: dropFade 0.18s ease;
          z-index: 999;
        }
        @keyframes dropFade {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        .nb-drop-header {
          padding: 10px 12px 8px;
          border-bottom: 1px solid rgba(139,94,60,0.10);
          margin-bottom: 6px;
        }
        .nb-drop-name {
          font-size: 0.92rem; font-weight: 700; color: #2c1a0e;
        }
        .nb-drop-role {
          font-size: 0.75rem; color: #a88972; font-weight: 500;
          text-transform: capitalize; margin-top: 1px;
        }

        .nb-drop-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 9px;
          text-decoration: none;
          font-size: 0.86rem;
          font-weight: 500;
          color: #4a3324;
          transition: background 0.15s, color 0.15s;
          cursor: pointer;
          font-family: inherit;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        .nb-drop-item:hover {
          background: rgba(139,94,60,0.09);
          color: #2c1a0e;
        }
        .nb-drop-item.danger { color: #8b3a2a; }
        .nb-drop-item.danger:hover { background: rgba(139,60,60,0.09); color: #7a2a1a; }

        .nb-drop-divider {
          height: 1px;
          background: rgba(139,94,60,0.10);
          margin: 6px 0;
        }

        /* Register button */
        .nb-register {
          display: inline-flex; align-items: center; gap: 6px;
          background: linear-gradient(135deg, #c4945a, #8b5e3c);
          color: #fff;
          font-size: 0.85rem; font-weight: 600;
          padding: 7px 18px; border-radius: 10px;
          text-decoration: none;
          box-shadow: 0 3px 12px rgba(139,94,60,0.28);
          transition: filter 0.18s, transform 0.18s;
        }
        .nb-register:hover { filter: brightness(1.08); transform: translateY(-1px); }

        /* Login link */
        .nb-login {
          font-size: 0.88rem; font-weight: 500;
          color: #6b4c35; text-decoration: none;
          transition: color 0.18s;
        }
        .nb-login:hover { color: #2c1a0e; }

        /* Mobile menu */
        .nb-mobile {
          background: rgba(250,244,236,0.98);
          border-top: 1px solid rgba(139,94,60,0.12);
          padding: 16px 24px 20px;
          display: flex; flex-direction: column; gap: 14px;
          box-shadow: 0 8px 24px rgba(139,94,60,0.10);
        }
        .nb-mobile-link {
          font-size: 0.92rem; font-weight: 500;
          color: #6b4c35; text-decoration: none;
          padding: 6px 0;
          border-bottom: 1px solid rgba(139,94,60,0.08);
          transition: color 0.15s;
        }
        .nb-mobile-link:hover, .nb-mobile-link.active { color: #2c1a0e; font-weight: 600; }

        @media(min-width: 769px) {
          .nb-hamburger { display: none !important; }
          .nb-mobile    { display: none !important; }
        }
        @media(max-width: 768px) {
          .nb-desktop { display: none !important; }
        }
      `}</style>

      <nav className={`nb-root ${scrolled ? "scrolled" : "top"}`}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>

            {/* ── Logo ── */}
            <Link to="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2c1a0e", letterSpacing: "-0.01em" }}>The Event Utsava</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.78rem", fontWeight: 600, color: "#c4945a", fontStyle: "italic", letterSpacing: "0.04em" }}>by Planexa</span>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="nb-desktop" style={{ display: "flex", alignItems: "center", gap: 28 }}>
              {navLinks.map(l => (
                <Link key={l.to} to={l.to} className={`nb-link ${isActive(l.to) ? "active" : ""}`}>
                  {l.label}
                </Link>
              ))}

              {/* Divider */}
              <div style={{ width: 1, height: 20, background: "rgba(139,94,60,0.2)" }} />

              {user ? (
                /* ── Profile dropdown trigger ── */
                <div ref={dropRef} style={{ position: "relative" }}>
                  <button
                    className={`nb-profile-btn ${dropOpen ? "open" : ""}`}
                    onClick={() => setDropOpen(p => !p)}
                  >
                    {/* Avatar initials */}
                    <div className="nb-avatar">
                      {user.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
                    </div>

                    <div className="nb-profile-label">
                      <strong>{user.name?.split(" ")[0]}</strong>
                    </div>

                    <ChevronDown size={15} className={`nb-chevron ${dropOpen ? "rotated" : ""}`} />
                  </button>

                  {/* ── Dropdown ── */}
                  {dropOpen && (
                    <div className="nb-dropdown">
                      {/* Header */}
                      <div className="nb-drop-header">
                        <div className="nb-drop-name">{user.name}</div>
                        <div className="nb-drop-role">{user.role || "Member"}</div>
                      </div>

                      {/* My Profile */}
                      <Link to="/profile" className="nb-drop-item">
                        <User size={15} />
                        My Profile
                      </Link>

                      {/* My Bookings (non-admin) */}
                      {user.role !== "admin" && (
                        <Link to="/my-bookings" className="nb-drop-item">
                          <BookOpen size={15} />
                          My Bookings
                        </Link>
                      )}

                      {/* Admin Panel */}
                      {user.role === "admin" && (
                        <Link to="/admin" className="nb-drop-item">
                          <LayoutDashboard size={15} />
                          Admin Panel
                        </Link>
                      )}

                      <div className="nb-drop-divider" />

                      {/* Logout */}
                      <button onClick={logout} className="nb-drop-item danger">
                        <LogOut size={15} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login"    className="nb-login">Login</Link>
                  <Link to="/register" className="nb-register">Register</Link>
                </>
              )}
            </div>

            {/* ── Hamburger (mobile) ── */}
            <button
              className="nb-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#6b4c35", display: "flex", alignItems: "center", padding: 4 }}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu (unchanged) ── */}
        {menuOpen && (
          <div className="nb-mobile">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className={`nb-mobile-link ${isActive(l.to) ? "active" : ""}`}>
                {l.label}
              </Link>
            ))}

            {user ? (
              <>
                <span style={{ fontSize: "0.82rem", color: "#a88972" }}>
                  <strong style={{ color: "#2c1a0e" }}>{user.name}</strong>
                </span>

                <Link to="/profile" className="nb-mobile-link">My Profile</Link>

                {user.role !== "admin" && (
                  <Link to="/my-bookings" className="nb-mobile-link">My Bookings</Link>
                )}

                {user.role === "admin" && (
                  <Link to="/admin" className="nb-mobile-link" style={{ color: "#8b5e3c", fontWeight: 700 }}>
                    Admin Panel
                  </Link>
                )}

                <button onClick={logout}
                  style={{ background: "rgba(139,60,60,0.08)", color: "#8b3a2a", border: "1px solid rgba(139,60,60,0.18)", borderRadius: 9, padding: "8px 14px", fontWeight: 600, fontSize: "0.86rem", cursor: "pointer", fontFamily: "inherit", textAlign: "left", width: "100%" }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    className="nb-mobile-link">Login</Link>
                <Link to="/register" className="nb-mobile-link" style={{ color: "#8b5e3c", fontWeight: 700 }}>Register</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;