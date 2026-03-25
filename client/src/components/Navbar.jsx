import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LayoutDashboard, LogOut, User, BookOpen } from "lucide-react";

const Navbar = () => {
  const { user, logout }    = useAuth();
  const location            = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const navLinks = [
    { to: "/",       label: "Home"    },
    { to: "/about",  label: "About"   },
    { to: "/events", label: "Events"  },
    { to: "/contact",label: "Contact" },
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

        /* Admin button */
        .nb-admin {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(139,94,60,0.1);
          color: #8b5e3c;
          font-size: 0.82rem; font-weight: 600;
          padding: 6px 14px; border-radius: 9px;
          text-decoration: none;
          border: 1px solid rgba(139,94,60,0.22);
          transition: background 0.18s, color 0.18s;
        }
        .nb-admin:hover { background: #8b5e3c; color: #fff; }

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

        /* Logout button */
        .nb-logout {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(139,60,60,0.08);
          color: #8b3a2a;
          font-size: 0.82rem; font-weight: 600;
          padding: 6px 14px; border-radius: 9px;
          border: 1px solid rgba(139,60,60,0.18);
          cursor: pointer; font-family: inherit;
          transition: background 0.18s, color 0.18s;
        }
        .nb-logout:hover { background: #8b3a2a; color: #fff; }

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
            <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            
              <div style={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
                <span style={{ width: 20, height: 2, background: "linear-gradient(90deg,#8b5e3c,#c4945a)", borderRadius: 999, display: "block" }} />
                <span style={{ width: 14, height: 2, background: "linear-gradient(90deg,#8b5e3c,#c4945a)", borderRadius: 999, display: "block" }} />
                <span style={{ width: 20, height: 2, background: "linear-gradient(90deg,#8b5e3c,#c4945a)", borderRadius: 999, display: "block" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2c1a0e", letterSpacing: "-0.01em" }}>The Event Utsava</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.78rem", fontWeight: 600, color: "#c4945a", fontStyle: "italic", letterSpacing: "0.04em" }}>by Planexa</span>
              </div>
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
                <>
                  {/* Greeting */}
                  <span style={{ fontSize: "0.84rem", color: "#a88972", fontWeight: 500 }}>
                    Hi, <strong style={{ color: "#2c1a0e" }}>{user.name?.split(" ")[0]}</strong>
                  </span>

                  {/* My Bookings (non-admin only) */}
                  {user.role !== "admin" && (
                    <Link to="/my-bookings" className="nb-link" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <BookOpen size={14} /> My Bookings
                    </Link>
                  )}

                  {/* Admin Panel */}
                  {user.role === "admin" && (
                    <Link to="/admin" className="nb-admin">
                      <LayoutDashboard size={14} /> Admin Panel
                    </Link>
                  )}

                  {/* Logout */}
                  <button onClick={logout} className="nb-logout">
                    <LogOut size={13} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nb-login">Login</Link>
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

        {/* ── Mobile menu ── */}
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
                  Hi, <strong style={{ color: "#2c1a0e" }}>{user.name}</strong>
                </span>

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