import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, CheckCircle, MessageCircle, Star } from "lucide-react";
import api from "../../services/api";

const Feedback = () => {
  const [form, setForm]       = useState({ name: "", email: "", phone: "", message: "", rating: 0 });
  const [hover, setHover]     = useState(0);
  const [submitting, setSub]  = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]     = useState("");

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())    { setError("Please enter your name.");    return; }
    if (!form.email.trim())   { setError("Please enter your email.");   return; }
    if (!form.message.trim()) { setError("Please write your feedback."); return; }

    try {
      setSub(true);
      setError("");

      // POST /api/contact/add
      await api.post("/contact/add", {
        name:    form.name,
        email:   form.email,
        phone:   form.phone,
        message: form.rating
          ? `[Rating: ${form.rating}/5 ★] ${form.message}`
          : form.message,
      });

      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSub(false);
    }
  };

  const inp = {
    width: "100%", padding: "11px 14px", borderRadius: 11,
    border: "1px solid rgba(139,94,60,0.2)", fontSize: "0.9rem",
    color: "#2c1a0e", background: "#faf4ec", outline: "none",
    fontFamily: "'Jost', sans-serif", boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };
  const lbl = {
    fontSize: "0.72rem", fontWeight: 600, color: "#6b4c35",
    textTransform: "uppercase", letterSpacing: "0.1em",
    marginBottom: 7, display: "block",
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", minHeight: "100vh", background: "#ecdcc8", color: "#2c1a0e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Jost:wght@300;400;500;600&display=swap');
        .fb-inp:focus { border-color: #8b5e3c !important; box-shadow: 0 0 0 3px rgba(139,94,60,0.1); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to { transform: rotate(360deg); } }
        .fb-star { cursor: pointer; transition: transform 0.15s; }
        .fb-star:hover { transform: scale(1.2); }
      `}</style>

      {/* Header bar */}
      <div style={{ background: "linear-gradient(135deg, #3d1f0a, #2c1506)", padding: "16px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <Link to="/" style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", textDecoration: "none" }}>
          <ArrowLeft size={17} />
        </Link>
        <div>
          <p style={{ fontSize: "0.62rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 2 }}>SHARE YOUR THOUGHTS</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff", margin: 0 }}>Feedback</h1>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px 80px", animation: "fadeUp 0.6s ease both" }}>

        {submitted ? (
          /* ── Success state ── */
          <div style={{ background: "#faf4ec", borderRadius: 20, padding: "52px 32px", textAlign: "center", boxShadow: "0 8px 32px rgba(139,94,60,0.12)", border: "1px solid rgba(139,94,60,0.15)" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#e8f7ef", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <CheckCircle size={32} color="#1a7a4a" />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 700, color: "#2c1a0e", marginBottom: 10 }}>
              Thank You, {form.name}!
            </h2>
            <p style={{ color: "#6b4c35", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 28 }}>
              Your feedback has been received. We truly appreciate you taking the time to share your thoughts with us.
            </p>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#c4945a,#8b5e3c)", color: "#fff", padding: "11px 26px", borderRadius: 11, fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", boxShadow: "0 4px 14px rgba(139,94,60,0.3)" }}>
              Back to Home
            </Link>
          </div>
        ) : (
          /* ── Feedback form ── */
          <div style={{ background: "#faf4ec", borderRadius: 20, border: "1px solid rgba(139,94,60,0.15)", boxShadow: "0 8px 32px rgba(139,94,60,0.10)", overflow: "hidden" }}>

            {/* Card header */}
            <div style={{ background: "linear-gradient(135deg, #c4945a, #8b5e3c)", padding: "26px 30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MessageCircle size={22} color="#fff" />
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 700, color: "#fff", margin: 0 }}>Share Your Experience</h2>
                  <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.72)", margin: 0 }}>We read every message carefully</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "28px 30px", display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Star rating */}
              <div>
                <label style={lbl}>Rate Your Experience</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={28}
                      className="fb-star"
                      fill={(hover || form.rating) >= star ? "#c4945a" : "none"}
                      color={(hover || form.rating) >= star ? "#c4945a" : "#a88972"}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => set("rating", star)}
                    />
                  ))}
                  {form.rating > 0 && (
                    <span style={{ fontSize: "0.78rem", color: "#a88972", alignSelf: "center", marginLeft: 4 }}>
                      {["", "Poor", "Fair", "Good", "Great", "Excellent"][form.rating]}
                    </span>
                  )}
                </div>
              </div>

              {/* Name + Email */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={lbl}>Your Name *</label>
                  <input className="fb-inp" value={form.name} onChange={e => set("name", e.target.value)}
                    placeholder="Priya Sharma" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Email Address *</label>
                  <input className="fb-inp" type="email" value={form.email} onChange={e => set("email", e.target.value)}
                    placeholder="you@email.com" style={inp} />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label style={lbl}>Phone <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                <input className="fb-inp" value={form.phone} onChange={e => set("phone", e.target.value)}
                  placeholder="+91 98001 00000" style={inp} />
              </div>

              {/* Message */}
              <div>
                <label style={lbl}>Your Feedback *</label>
                <textarea className="fb-inp" value={form.message} onChange={e => set("message", e.target.value)}
                  placeholder="Tell us about your experience, suggestions, or anything you'd like us to know..."
                  rows={5}
                  style={{ ...inp, resize: "vertical", lineHeight: 1.7 }} />
              </div>

              {/* Error */}
              {error && (
                <div style={{ background: "#fdecea", border: "1px solid rgba(192,57,26,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: "0.84rem", color: "#c0391a", fontWeight: 600 }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={submitting}
                style={{ width: "100%", padding: "13px", borderRadius: 12, background: submitting ? "#dfc9af" : "linear-gradient(135deg,#c4945a,#8b5e3c)", color: "#fff", fontWeight: 600, fontSize: "0.95rem", border: "none", cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, boxShadow: submitting ? "none" : "0 4px 16px rgba(139,94,60,0.3)", transition: "all 0.18s", fontFamily: "'Jost', sans-serif" }}>
                {submitting ? (
                  <><div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} /> Sending...</>
                ) : (
                  <><Send size={16} /> Send Feedback</>
                )}
              </button>

            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;