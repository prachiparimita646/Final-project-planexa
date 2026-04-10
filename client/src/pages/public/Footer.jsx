import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const Footer = () => (
  <footer style={{
    background: "#e2d0bc",
    borderTop: "1px solid rgba(139,94,60,0.15)",
    padding: "28px 32px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: 16,
    fontFamily: "'Jost', sans-serif",
  }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", fontWeight: 700, color: "#2c1a0e", margin: 0 }}>
        The Event Utsava by Planexa
      </p>
      <p style={{ fontSize: "0.74rem", color: "#a88972", margin: 0 }}>© 2026 All rights reserved.</p>
    </div>

    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      {/* WhatsApp */}
      <a href="https://wa.me/919800100001" target="_blank" rel="noopener noreferrer"
        style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", border: "1px solid rgba(139,94,60,0.15)", background: "#e8f5e9", color: "#25D366", transition: "all 0.18s" }}
        onMouseEnter={e => { e.currentTarget.style.background = "#25D366"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#e8f5e9"; e.currentTarget.style.color = "#25D366"; }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      {/* Facebook */}
      <a href="https://facebook.com/planexa" target="_blank" rel="noopener noreferrer"
        style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", border: "1px solid rgba(139,94,60,0.15)", background: "#e8f0fe", color: "#1877F2", transition: "all 0.18s" }}
        onMouseEnter={e => { e.currentTarget.style.background = "#1877F2"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#e8f0fe"; e.currentTarget.style.color = "#1877F2"; }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </a>
      {/* Instagram */}
      <a href="https://instagram.com/planexa" target="_blank" rel="noopener noreferrer"
        style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", border: "1px solid rgba(139,94,60,0.15)", background: "#fce4ec", color: "#E1306C", transition: "all 0.18s" }}
        onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#fce4ec"; e.currentTarget.style.color = "#E1306C"; }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
      </a>
    </div>

    <Link to="/feedback"
      style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#8b5e3c", fontSize: "0.84rem", fontWeight: 600, textDecoration: "none", padding: "8px 18px", borderRadius: 9, border: "1px solid rgba(139,94,60,0.15)", background: "rgba(139,94,60,0.06)", transition: "all 0.18s" }}
      onMouseEnter={e => { e.currentTarget.style.background = "#8b5e3c"; e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(139,94,60,0.06)"; e.currentTarget.style.color = "#8b5e3c"; }}>
      <MessageCircle size={15} /> Feedback
    </Link>
  </footer>
);

export default Footer;