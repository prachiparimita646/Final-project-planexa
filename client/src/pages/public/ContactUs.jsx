import { useState } from "react";
import { Mail, Phone, MapPin, User, MessageSquare, Send, CheckCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const ContactUs = () => {
  const [form, setForm]       = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/contact/add", form);
      if (res.data.status) {
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", message: "" });
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp = (extra = {}) => ({
    width: "100%",
    padding: "12px 14px 12px 44px",
    borderRadius: 12,
    border: "1px solid rgba(139,94,60,0.22)",
    fontSize: "0.9rem",
    color: "#2c1a0e",
    background: "#faf4ec",
    outline: "none",
    fontFamily: "'Jost', sans-serif",
    boxSizing: "border-box",
    transition: "border-color 0.18s, box-shadow 0.18s",
    ...extra,
  });

  // Contact data with clickable links
  const contactLinks = {
    email: { value: "supportplanexa@gmail.com", href: "mailto:supportplanexa@gmail.com" },
    phone: { value: "+91 98765 43210", href: "tel:+919876543210" },
    location: { value: "Bhubaneswar, Odisha", href: "https://maps.google.com/?q=Bhubaneswar+Odisha" }
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", background: "#ecdcc8", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Jost:wght@300;400;500;600;700&display=swap');
        .ct-inp:focus { border-color: #8b5e3c !important; box-shadow: 0 0 0 3px rgba(139,94,60,0.10) !important; outline: none; }
        .ct-btn { transition: all 0.2s; }
        .ct-btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(139,94,60,0.38) !important; }
        .ct-info-item { transition: transform 0.18s; }
        .ct-info-item:hover { transform: translateX(4px); }
        .ct-info-card { transition: transform 0.2s, box-shadow 0.2s; }
        .ct-info-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(139,94,60,0.13) !important; }
        .clickable-link { text-decoration: none; transition: opacity 0.2s; cursor: pointer; }
        .clickable-link:hover { opacity: 0.8; text-decoration: underline; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatOrb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes spin { to{transform:rotate(360deg)} }

        @media (max-width: 768px) {
          .ct-main-grid { grid-template-columns: 1fr !important; }
          .ct-left-panel { border-radius: 0 !important; }
          .ct-name-email { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ══ HERO BANNER ══ */}
      <div style={{
        background: "linear-gradient(135deg,#3d1f0a 0%,#2c1506 55%,#3d1f0a 100%)",
        padding: "72px 24px 100px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -80, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(196,148,90,0.07)", animation: "floatOrb 8s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(139,94,60,0.08)", animation: "floatOrb 10s ease-in-out infinite 2s", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 35% 50%, rgba(196,148,90,0.10) 0%, transparent 60%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <p style={{ fontSize: "0.62rem", letterSpacing: "0.26em", fontWeight: 600, color: "#c4945a", textTransform: "uppercase", marginBottom: 16 }}>✦ GET IN TOUCH ✦</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.4rem,5.5vw,3.6rem)", fontWeight: 700, color: "#f5ece0", lineHeight: 1.1, marginBottom: 18, letterSpacing: "-0.01em" }}>
            We'd Love to{" "}
            <em style={{ fontStyle: "italic", background: "linear-gradient(90deg,#e8c98a,#c4945a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Hear From You
            </em>
          </h1>
          <p style={{ color: "rgba(245,236,224,0.62)", fontSize: "0.95rem", fontWeight: 300, lineHeight: 1.8 }}>
            Questions about bookings, events, or partnerships —<br />our team is always ready to help.
          </p>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div style={{ flex: 1, maxWidth: 1060, margin: "0 auto", width: "100%", padding: "0 24px 72px" }}>

        <div className="ct-main-grid" style={{
          background: "#faf4ec",
          borderRadius: 24,
          border: "1px solid rgba(139,94,60,0.13)",
          boxShadow: "0 12px 48px rgba(139,94,60,0.12)",
          marginTop: -48,
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          animation: "fadeUp 0.5s ease both",
        }}>

          {/* LEFT PANEL - clickable contact info */}
          <div className="ct-left-panel" style={{ background: "linear-gradient(160deg,#3d1f0a 0%,#2c1506 60%,#1a0d06 100%)", padding: "44px 32px", display: "flex", flexDirection: "column", gap: 28, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", bottom: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(196,148,90,0.06)", pointerEvents: "none" }} />

            <div>
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "#c4945a", textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>PLANEXA</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.65rem", fontWeight: 700, color: "#f5ece0", lineHeight: 1.25, marginBottom: 12 }}>
                Let's Create Something <em style={{ fontStyle: "italic", color: "#e8c98a" }}>Memorable</em>
              </h2>
              <p style={{ fontSize: "0.83rem", color: "rgba(245,236,224,0.52)", lineHeight: 1.8, fontWeight: 300 }}>
                Whether it's a grand gala, corporate summit or intimate gathering — we're here to make it extraordinary.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(196,148,90,0.2)" }} />
              <span style={{ color: "#c4945a", fontSize: "0.7rem" }}>✦</span>
              <div style={{ flex: 1, height: 1, background: "rgba(196,148,90,0.2)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Email */}
              <div className="ct-info-item" style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(196,148,90,0.12)", border: "1px solid rgba(196,148,90,0.22)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c4945a", flexShrink: 0 }}>
                  <Mail size={16} />
                </div>
                <div>
                  <p style={{ fontSize: "0.6rem", color: "rgba(245,236,224,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, margin: 0 }}>Email</p>
                  <a href={contactLinks.email.href} className="clickable-link" style={{ fontSize: "0.84rem", color: "rgba(245,236,224,0.8)", fontWeight: 500, margin: "2px 0 0", display: "inline-block" }}>
                    {contactLinks.email.value}
                  </a>
                </div>
              </div>
              {/* Phone */}
              <div className="ct-info-item" style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(196,148,90,0.12)", border: "1px solid rgba(196,148,90,0.22)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c4945a", flexShrink: 0 }}>
                  <Phone size={16} />
                </div>
                <div>
                  <p style={{ fontSize: "0.6rem", color: "rgba(245,236,224,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, margin: 0 }}>Phone</p>
                  <a href={contactLinks.phone.href} className="clickable-link" style={{ fontSize: "0.84rem", color: "rgba(245,236,224,0.8)", fontWeight: 500, margin: "2px 0 0", display: "inline-block" }}>
                    {contactLinks.phone.value}
                  </a>
                </div>
              </div>
              {/* Location */}
              <div className="ct-info-item" style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(196,148,90,0.12)", border: "1px solid rgba(196,148,90,0.22)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c4945a", flexShrink: 0 }}>
                  <MapPin size={16} />
                </div>
                <div>
                  <p style={{ fontSize: "0.6rem", color: "rgba(245,236,224,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, margin: 0 }}>Location</p>
                  <a href={contactLinks.location.href} target="_blank" rel="noopener noreferrer" className="clickable-link" style={{ fontSize: "0.84rem", color: "rgba(245,236,224,0.8)", fontWeight: 500, margin: "2px 0 0", display: "inline-block" }}>
                    {contactLinks.location.value}
                  </a>
                </div>
              </div>
            </div>

            <p style={{ fontSize: "0.72rem", color: "rgba(245,236,224,0.28)", fontStyle: "italic", letterSpacing: "0.04em", marginTop: "auto" }}>
              "Craft moments that last forever"
            </p>
          </div>

          {/* RIGHT PANEL — form (unchanged) */}
          <div style={{ padding: "44px 40px" }}>
            {success ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: 18, padding: "40px 0", animation: "fadeUp 0.4s ease both" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#e8f5ee,#c8f0dc)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(26,122,74,0.18)" }}>
                  <CheckCircle size={40} color="#1a7a4a" />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", fontWeight: 700, color: "#2c1a0e" }}>Message Sent!</h3>
                <p style={{ fontSize: "0.9rem", color: "#a88972", maxWidth: 300, lineHeight: 1.7 }}>
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                  <button onClick={() => setSuccess(false)}
                    style={{ padding: "11px 24px", borderRadius: 12, background: "linear-gradient(135deg,#c4945a,#8b5e3c)", color: "#fff", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(139,94,60,0.28)" }}>
                    Send Another Message
                  </button>
                  <Link to="/events"
                    style={{ padding: "11px 24px", borderRadius: 12, background: "rgba(139,94,60,0.08)", color: "#8b5e3c", fontWeight: 700, fontSize: "0.88rem", border: "1px solid rgba(139,94,60,0.2)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    Browse Events <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: "0.62rem", letterSpacing: "0.2em", fontWeight: 600, color: "#c4945a", textTransform: "uppercase", marginBottom: 6 }}>SEND A MESSAGE</p>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", fontWeight: 700, color: "#2c1a0e", lineHeight: 1.15 }}>How Can We Help?</h2>
                </div>

                {error && (
                  <div style={{ background: "#fdecea", border: "1px solid rgba(139,60,60,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: "0.84rem", color: "#8b2020", fontWeight: 600, marginBottom: 18 }}>
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="ct-name-email" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#6b4c35", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7, display: "block" }}>Full Name *</label>
                      <div style={{ position: "relative" }}>
                        <User size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#a88972", pointerEvents: "none" }} />
                        <input className="ct-inp" type="text" name="name" placeholder="Priya Sharma"
                          value={form.name} onChange={handleChange} required style={inp()} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#6b4c35", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7, display: "block" }}>Email Address *</label>
                      <div style={{ position: "relative" }}>
                        <Mail size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#a88972", pointerEvents: "none" }} />
                        <input className="ct-inp" type="email" name="email" placeholder="you@email.com"
                          value={form.email} onChange={handleChange} required style={inp()} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#6b4c35", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7, display: "block" }}>Phone Number</label>
                    <div style={{ position: "relative" }}>
                      <Phone size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#a88972", pointerEvents: "none" }} />
                      <input className="ct-inp" type="text" name="phone" placeholder="+91 98765 43210"
                        value={form.phone} onChange={handleChange} style={inp()} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "#6b4c35", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7, display: "block" }}>Your Message *</label>
                    <div style={{ position: "relative" }}>
                      <MessageSquare size={15} style={{ position: "absolute", left: 14, top: 14, color: "#a88972", pointerEvents: "none" }} />
                      <textarea className="ct-inp" name="message" placeholder="Tell us how we can help you..." rows={5}
                        value={form.message} onChange={handleChange} required
                        style={inp({ paddingTop: 12, resize: "vertical", lineHeight: 1.7 })} />
                    </div>
                  </div>

                  <button type="submit" className="ct-btn" disabled={loading}
                    style={{ width: "100%", padding: "14px", borderRadius: 13, background: loading ? "#dfc9af" : "linear-gradient(135deg,#c4945a,#8b5e3c)", color: "#fff", fontWeight: 700, fontSize: "0.95rem", border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, boxShadow: loading ? "none" : "0 5px 18px rgba(139,94,60,0.32)", fontFamily: "inherit", marginTop: 4 }}>
                    {loading
                      ? <><div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} /> Sending...</>
                      : <><Send size={16} /> Send Message</>}
                  </button>

                  <p style={{ fontSize: "0.72rem", color: "#a88972", textAlign: "center" }}>
                    * Required fields. We respect your privacy.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>

        {/* INFO CARDS - clickable */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18, marginTop: 28 }}>
          <div className="ct-info-card" style={{ background: "#faf4ec", borderRadius: 16, padding: "22px 20px", border: "1px solid rgba(139,94,60,0.13)", boxShadow: "0 4px 16px rgba(139,94,60,0.07)", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: "#8b5e3c18", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5e3c", flexShrink: 0, border: "1px solid #8b5e3c22" }}>
              <Mail size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 700, color: "#2c1a0e", marginBottom: 3 }}>Email Us</h3>
              <a href={contactLinks.email.href} className="clickable-link" style={{ fontSize: "0.84rem", color: "#6b4c35", fontWeight: 600, marginBottom: 2, display: "inline-block" }}>
                {contactLinks.email.value}
              </a>
              <p style={{ fontSize: "0.74rem", color: "#a88972" }}>We reply within 24 hours</p>
            </div>
          </div>
          <div className="ct-info-card" style={{ background: "#faf4ec", borderRadius: 16, padding: "22px 20px", border: "1px solid rgba(139,94,60,0.13)", boxShadow: "0 4px 16px rgba(139,94,60,0.07)", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: "#4a6e5a18", display: "flex", alignItems: "center", justifyContent: "center", color: "#4a6e5a", flexShrink: 0, border: "1px solid #4a6e5a22" }}>
              <Phone size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 700, color: "#2c1a0e", marginBottom: 3 }}>Call Us</h3>
              <a href={contactLinks.phone.href} className="clickable-link" style={{ fontSize: "0.84rem", color: "#6b4c35", fontWeight: 600, marginBottom: 2, display: "inline-block" }}>
                {contactLinks.phone.value}
              </a>
              <p style={{ fontSize: "0.74rem", color: "#a88972" }}>Mon–Sat, 9AM – 7PM IST</p>
            </div>
          </div>
          <div className="ct-info-card" style={{ background: "#faf4ec", borderRadius: 16, padding: "22px 20px", border: "1px solid rgba(139,94,60,0.13)", boxShadow: "0 4px 16px rgba(139,94,60,0.07)", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: "#6b4c3518", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b4c35", flexShrink: 0, border: "1px solid #6b4c3522" }}>
              <MapPin size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 700, color: "#2c1a0e", marginBottom: 3 }}>Visit Us</h3>
              <a href={contactLinks.location.href} target="_blank" rel="noopener noreferrer" className="clickable-link" style={{ fontSize: "0.84rem", color: "#6b4c35", fontWeight: 600, marginBottom: 2, display: "inline-block" }}>
                {contactLinks.location.value}
              </a>
              <p style={{ fontSize: "0.74rem", color: "#a88972" }}>By appointment only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;