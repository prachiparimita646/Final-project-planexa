// src/pages/admin/AdminEvent.jsx
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Calendar, Users, DollarSign,
  Save, Tag, FileText, Image,
  CheckCircle, AlertCircle, X, Link2
} from "lucide-react";
import api from "../../services/api";

const AdminEvent = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isNew    = !id || id === "new";

  const [form, setForm] = useState({
    title:          "",
    description:    "",
    category:       "Music",
    date:           "",
    time:           "",
    location:       "",
    price:          "",
    totalSeats:     "",
    availableSeats: "",
    thumbnail:      "",
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch existing event when editing ──
  useEffect(() => {
    if (isNew) return;
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/events/${id}`);
        const ev  = res.data;
        setForm({
          title:          ev.title          || "",
          description:    ev.description    || "",
          category:       ev.category       || "Music",
          date:           ev.date ? ev.date.substring(0, 10) : "",
          time:           ev.time           || "",
          location:       ev.location       || "",
          price:          ev.price          || "",
          totalSeats:     ev.totalSeats     || "",
          availableSeats: ev.availableSeats || "",
          thumbnail:      ev.thumbnail      || "",
        });
      } catch (err) {
        showToast("Failed to load event details.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    if (!form.title.trim())       { showToast("Event title is required.", "error");  return false; }
    if (!form.description.trim()) { showToast("Description is required.", "error");  return false; }
    if (!form.date)               { showToast("Event date is required.", "error");   return false; }
    if (!form.time.trim())        { showToast("Event time is required.", "error");   return false; }
    if (!form.location.trim())    { showToast("Location is required.", "error");     return false; }
    if (!form.price || Number(form.price) <= 0)           { showToast("Enter a valid price.", "error");   return false; }
    if (!form.totalSeats || Number(form.totalSeats) <= 0) { showToast("Enter total seats.", "error");    return false; }
    if (form.availableSeats === "" || Number(form.availableSeats) < 0) { showToast("Enter available seats.", "error"); return false; }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      const payload = {
        title:          form.title,
        description:    form.description,
        category:       form.category,
        date:           form.date,
        time:           form.time,
        location:       form.location,
        price:          Number(form.price),
        totalSeats:     Number(form.totalSeats),
        availableSeats: Number(form.availableSeats),
        thumbnail:      form.thumbnail,
      };

      if (isNew) {
        await api.post("/events", payload);
        showToast("Event created successfully! ✓");
      } else {
        await api.put(`/events/${id}`, payload);
        showToast("Event updated successfully! ✓");
      }
      setTimeout(() => navigate("/admin/events"), 1200);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const categories = ["Music","Tech","Food","Business","Party","Comedy","Gala","Wellness","Art","Sports","Other"];

  const inp = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: "1px solid rgba(139,94,60,0.22)", fontSize: "0.88rem",
    color: "#2c1a0e", background: "#fff", outline: "none",
    fontFamily: "inherit", boxSizing: "border-box",
  };
  const lbl = {
    fontSize: "0.72rem", fontWeight: 700, color: "#6b4c35",
    textTransform: "uppercase", letterSpacing: "0.08em",
    marginBottom: 7, display: "block",
  };

  if (loading) return (
    <div style={{ fontFamily: "'Jost', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, color: "#a88972" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #8b5e3c", borderTopColor: "transparent", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontWeight: 600 }}>Loading event...</p>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", color: "#2c1a0e", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Jost:wght@400;500;600;700&display=swap');
        .aev-inp:focus { border-color: #8b5e3c !important; box-shadow: 0 0 0 3px rgba(139,94,60,0.10); }
        @keyframes slideIn { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @media(max-width:768px){ .aev-grid{ grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "success" ? "#1a7a4a" : "#8b3a2a", color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 700, fontSize: "0.88rem", boxShadow: "0 8px 24px rgba(0,0,0,0.18)", animation: "slideIn 0.3s ease", display: "flex", alignItems: "center", gap: 10, maxWidth: 340 }}>
          {toast.type === "success" ? <CheckCircle size={17} style={{ flexShrink: 0 }} /> : <AlertCircle size={17} style={{ flexShrink: 0 }} />}
          <span style={{ flex: 1 }}>{toast.msg}</span>
          <button onClick={() => setToast(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 0, display: "flex" }}><X size={15} /></button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <Link to="/admin/events" style={{ width: 38, height: 38, borderRadius: 10, background: "#faf4ec", border: "1px solid rgba(139,94,60,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5e3c", textDecoration: "none", flexShrink: 0 }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p style={{ fontSize: "0.66rem", letterSpacing: "0.18em", fontWeight: 700, color: "#c4945a", textTransform: "uppercase", marginBottom: 2 }}>
            {isNew ? "CREATE NEW EVENT" : "EDIT EVENT"}
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 700, color: "#2c1a0e", margin: 0 }}>
            {isNew ? "New Event" : form.title || "Edit Event"}
          </h1>
        </div>
      </div>

      <div className="aev-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 22, alignItems: "start" }}>

        {/* ── LEFT ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Basic Info */}
          <div style={{ background: "#faf4ec", borderRadius: 16, border: "1px solid rgba(139,94,60,0.13)", boxShadow: "0 4px 16px rgba(139,94,60,0.07)", padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "#2c1a0e", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={17} color="#8b5e3c" /> Basic Information
            </h2>
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={lbl}>Event Title *</label>
                <input className="aev-inp" value={form.title} onChange={e => set("title", e.target.value)} placeholder="Enter event title" style={inp} />
              </div>
              <div>
                <label style={lbl}>Category</label>
                <select className="aev-inp" value={form.category} onChange={e => set("category", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Description *</label>
                <textarea className="aev-inp" value={form.description} onChange={e => set("description", e.target.value)} placeholder="Describe the event..." rows={4} style={{ ...inp, resize: "vertical", lineHeight: 1.7 }} />
              </div>
            </div>
          </div>

          {/* Date & Location */}
          <div style={{ background: "#faf4ec", borderRadius: 16, border: "1px solid rgba(139,94,60,0.13)", boxShadow: "0 4px 16px rgba(139,94,60,0.07)", padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "#2c1a0e", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <Calendar size={17} color="#8b5e3c" /> Date & Location
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={lbl}>Date *</label>
                <input className="aev-inp" type="date" value={form.date} onChange={e => set("date", e.target.value)} style={inp} />
              </div>
              <div>
                <label style={lbl}>Time *</label>
                <input className="aev-inp" type="time" value={form.time} onChange={e => set("time", e.target.value)} style={inp} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={lbl}>Location *</label>
                <input className="aev-inp" value={form.location} onChange={e => set("location", e.target.value)} placeholder="Venue name, City, State" style={inp} />
              </div>
            </div>
          </div>

          {/* Tickets & Pricing */}
          <div style={{ background: "#faf4ec", borderRadius: 16, border: "1px solid rgba(139,94,60,0.13)", boxShadow: "0 4px 16px rgba(139,94,60,0.07)", padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "#2c1a0e", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <Tag size={17} color="#8b5e3c" /> Tickets & Pricing
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <div>
                <label style={lbl}>Price (₹) *</label>
                <div style={{ position: "relative" }}>
                  <DollarSign size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#a88972", pointerEvents: "none" }} />
                  <input className="aev-inp" type="number" min="0" value={form.price} onChange={e => set("price", e.target.value)} placeholder="0" style={{ ...inp, paddingLeft: 30 }} />
                </div>
              </div>
              <div>
                <label style={lbl}>Total Seats *</label>
                <div style={{ position: "relative" }}>
                  <Users size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#a88972", pointerEvents: "none" }} />
                  <input className="aev-inp" type="number" min="1" value={form.totalSeats} onChange={e => set("totalSeats", e.target.value)} placeholder="0" style={{ ...inp, paddingLeft: 30 }} />
                </div>
              </div>
              <div>
                <label style={lbl}>Available Seats *</label>
                <div style={{ position: "relative" }}>
                  <Users size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#a88972", pointerEvents: "none" }} />
                  <input className="aev-inp" type="number" min="0" value={form.availableSeats} onChange={e => set("availableSeats", e.target.value)} placeholder="0" style={{ ...inp, paddingLeft: 30 }} />
                </div>
              </div>
            </div>

            {form.price && form.totalSeats && (
              <div style={{ marginTop: 14, padding: "10px 14px", background: "#f5ece0", borderRadius: 10, border: "1px solid rgba(139,94,60,0.12)", display: "flex", gap: 24, flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontSize: "0.64rem", color: "#a88972", fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Ticket Price</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: "#8b5e3c", fontSize: "1.1rem", margin: 0 }}>₹{Number(form.price).toLocaleString()}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.64rem", color: "#a88972", fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Max Revenue</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: "#1a7a4a", fontSize: "1.1rem", margin: 0 }}>₹{(Number(form.price) * Number(form.totalSeats)).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Cover Image — URL input */}
          <div style={{ background: "#faf4ec", borderRadius: 16, border: "1px solid rgba(139,94,60,0.13)", boxShadow: "0 4px 16px rgba(139,94,60,0.07)", padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "#2c1a0e", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <Image size={17} color="#8b5e3c" /> Cover Image
            </h2>

            {/* Preview */}
            {form.thumbnail ? (
              <div style={{ position: "relative", marginBottom: 14 }}>
                <img src={form.thumbnail} alt="preview"
                  style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10, display: "block" }}
                  onError={e => { e.target.style.display = "none"; }} />
                <button onClick={() => set("thumbnail", "")}
                  style={{ position: "absolute", top: 8, right: 8, width: 26, height: 26, borderRadius: 7, background: "rgba(44,26,14,0.7)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  <X size={13} />
                </button>
              </div>
            ) : (
              <div style={{ width: "100%", height: 120, borderRadius: 10, background: "#f5ece0", border: "1px dashed rgba(139,94,60,0.28)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, color: "#a88972", fontSize: "0.82rem", fontWeight: 600 }}>
                No image yet
              </div>
            )}

            <label style={lbl}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Link2 size={12} /> Image URL</span>
            </label>
            <input className="aev-inp" value={form.thumbnail} onChange={e => set("thumbnail", e.target.value)}
              placeholder="https://images.unsplash.com/..."
              style={{ ...inp, fontSize: "0.8rem" }} />
            <p style={{ fontSize: "0.68rem", color: "#a88972", marginTop: 7, lineHeight: 1.5 }}>
              Paste any public image URL.<br />
              Tip: Use <a href="https://unsplash.com" target="_blank" rel="noreferrer" style={{ color: "#8b5e3c" }}>unsplash.com</a> for free images.
            </p>
          </div>

          {/* Save button */}
          <button onClick={handleSave} disabled={saving}
            style={{ width: "100%", padding: "13px", borderRadius: 12, background: saving ? "#dfc9af" : "linear-gradient(135deg,#c4945a,#8b5e3c)", color: "#fff", fontWeight: 700, fontSize: "0.92rem", border: "none", cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: saving ? "none" : "0 4px 14px rgba(139,94,60,0.3)", fontFamily: "inherit", transition: "all 0.18s" }}>
            {saving
              ? <><div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} /> Saving...</>
              : <><Save size={17} /> {isNew ? "Create Event" : "Save Changes"}</>}
          </button>

          {/* Cancel */}
          <Link to="/admin/events"
            style={{ width: "100%", padding: "11px", borderRadius: 12, background: "#f5ece0", color: "#6b4c35", fontWeight: 700, fontSize: "0.88rem", border: "1px solid rgba(139,94,60,0.2)", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", boxSizing: "border-box" }}
            onMouseEnter={e => e.currentTarget.style.background = "#ecdcc8"}
            onMouseLeave={e => e.currentTarget.style.background = "#f5ece0"}>
            Cancel
          </Link>

          <p style={{ fontSize: "0.72rem", color: "#a88972", textAlign: "center" }}>* Required fields</p>
        </div>
      </div>
    </div>
  );
};

export default AdminEvent;