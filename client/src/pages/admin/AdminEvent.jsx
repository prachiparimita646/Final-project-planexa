import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Calendar, Users, DollarSign,
  Save, Tag, FileText, Image,
  CheckCircle, AlertCircle, X
} from "lucide-react";
import api from "../../services/api";

const AdminEvent = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isNew    = !id || id === "new";

  const [form, setForm] = useState({
    title:          "",
    description:    "",
    date:           "",
    time:           "",
    location:       "",
    price:          "",
    totalSeats:     "",
    availableSeats: "",
    thumbnailUrl:   "", 
  });

  const [thumbnailFile, setThumbnailFile] = useState(null); 
  const [previewUrl, setPreviewUrl]       = useState("");    
  const [loading, setLoading]             = useState(!isNew); 
  const [saving, setSaving]               = useState(false);
  const [toast, setToast]                 = useState(null);

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
          date:           ev.date ? ev.date.substring(0, 10) : "",
          time:           ev.time           || "",
          location:       ev.location       || "",
          price:          ev.price          || "",
          totalSeats:     ev.totalSeats     || "",
          availableSeats: ev.availableSeats || "",
          thumbnailUrl:   ev.thumbnail      || "",
        });

        if (ev.thumbnail) setPreviewUrl(ev.thumbnail);
      } catch (err) {
        showToast("Failed to load event details.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // ── Field setter ──
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  // ── Handle thumbnail file selection ──
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnailFile(file);
    setPreviewUrl(URL.createObjectURL(file)); 
  };

  // ── Validate ──
  const validate = () => {
    if (!form.title.trim())         { showToast("Event title is required.", "error");      return false; }
    if (!form.description.trim())   { showToast("Description is required.", "error");      return false; }
    if (!form.date)                 { showToast("Event date is required.", "error");        return false; }
    if (!form.time.trim())          { showToast("Event time is required.", "error");        return false; }
    if (!form.location.trim())      { showToast("Location is required.", "error");          return false; }
    if (!form.price || Number(form.price) <= 0)          { showToast("Enter a valid price.", "error");     return false; }
    if (!form.totalSeats || Number(form.totalSeats) <= 0) { showToast("Enter total seats.", "error");      return false; }
    if (form.availableSeats === "" || Number(form.availableSeats) < 0) { showToast("Enter available seats.", "error"); return false; }
    return true;
  };

  // POST /api/events        (create)
  // PUT  /api/events/:id    (update)
  const handleSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("title",          form.title);
      formData.append("description",    form.description);
      formData.append("date",           form.date);
      formData.append("time",           form.time);
      formData.append("location",       form.location);
      formData.append("price",          Number(form.price));
      formData.append("totalSeats",     Number(form.totalSeats));
      formData.append("availableSeats", Number(form.availableSeats));

      // Only append thumbnail if a new file was selected
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      if (isNew) {
        // CREATE — POST /api/events
        await api.post("/events", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Event created successfully! ✓", "success");
      } else {
        await api.put(`/events/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Event updated successfully! ✓", "success");
      }

      // Navigate back after short delay so toast is visible
      setTimeout(() => navigate("/admin/events"), 1200);

    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to save. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const inp = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: "1px solid rgba(192,69,26,0.2)", fontSize: "0.88rem",
    color: "#2e1106", background: "#fff", outline: "none",
    fontFamily: "inherit", boxSizing: "border-box",
  };
  const lbl = {
    fontSize: "0.75rem", fontWeight: 700, color: "#6b3a25",
    textTransform: "uppercase", letterSpacing: "0.08em",
    marginBottom: 6, display: "block",
  };

  // ── Loading state (fetching event for edit) ──
  if (loading) return (
    <div style={{ fontFamily: "'Nunito', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, color: "#b07b65" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #c0451a", borderTopColor: "transparent", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontWeight: 600 }}>Loading event...</p>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", color: "#2e1106", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito:wght@400;500;600;700&display=swap');
        .aev-inp:focus { border-color: #c0451a !important; box-shadow: 0 0 0 3px rgba(192,69,26,0.08); }
        @keyframes slideIn { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @media(max-width:768px){ .aev-grid{ grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "success" ? "#1a7a4a" : "#c0391a", color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 700, fontSize: "0.88rem", boxShadow: "0 8px 24px rgba(0,0,0,0.18)", animation: "slideIn 0.3s ease", display: "flex", alignItems: "center", gap: 10, maxWidth: 340 }}>
          {toast.type === "success" ? <CheckCircle size={17} style={{ flexShrink: 0 }} /> : <AlertCircle size={17} style={{ flexShrink: 0 }} />}
          <span style={{ flex: 1 }}>{toast.msg}</span>
          <button onClick={() => setToast(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 0, display: "flex" }}><X size={15} /></button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <Link to="/admin/events" style={{ width: 38, height: 38, borderRadius: 10, background: "#fff", border: "1px solid rgba(192,69,26,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c0451a", textDecoration: "none", flexShrink: 0 }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.18em", fontWeight: 700, color: "#e87c3e", textTransform: "uppercase", marginBottom: 2 }}>
            {isNew ? "CREATE NEW EVENT" : "EDIT EVENT"}
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#2e1106", margin: 0 }}>
            {isNew ? "New Event" : form.title || "Edit Event"}
          </h1>
        </div>
      </div>

      <div className="aev-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 22, alignItems: "start" }}>

        {/* ── LEFT: Main form ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Basic Info */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(192,69,26,0.11)", boxShadow: "0 4px 16px rgba(192,69,26,0.07)", padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "#2e1106", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={17} color="#c0451a" /> Basic Information
            </h2>
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={lbl}>Event Title *</label>
                <input className="aev-inp" value={form.title} onChange={e => set("title", e.target.value)} placeholder="Enter event title" style={inp} />
              </div>
              <div>
                <label style={lbl}>Description *</label>
                <textarea className="aev-inp" value={form.description} onChange={e => set("description", e.target.value)} placeholder="Describe the event..." rows={4} style={{ ...inp, resize: "vertical", lineHeight: 1.7 }} />
              </div>
            </div>
          </div>

          {/* Date & Location */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(192,69,26,0.11)", boxShadow: "0 4px 16px rgba(192,69,26,0.07)", padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "#2e1106", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <Calendar size={17} color="#c0451a" /> Date & Location
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
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(192,69,26,0.11)", boxShadow: "0 4px 16px rgba(192,69,26,0.07)", padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "#2e1106", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <Tag size={17} color="#c0451a" /> Tickets & Pricing
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <div>
                <label style={lbl}>Price (₹) *</label>
                <div style={{ position: "relative" }}>
                  <DollarSign size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#b07b65", pointerEvents: "none" }} />
                  <input className="aev-inp" type="number" min="0" value={form.price} onChange={e => set("price", e.target.value)} placeholder="0" style={{ ...inp, paddingLeft: 30 }} />
                </div>
              </div>
              <div>
                <label style={lbl}>Total Seats *</label>
                <div style={{ position: "relative" }}>
                  <Users size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#b07b65", pointerEvents: "none" }} />
                  <input className="aev-inp" type="number" min="1" value={form.totalSeats} onChange={e => set("totalSeats", e.target.value)} placeholder="0" style={{ ...inp, paddingLeft: 30 }} />
                </div>
              </div>
              <div>
                <label style={lbl}>Available Seats *</label>
                <div style={{ position: "relative" }}>
                  <Users size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#b07b65", pointerEvents: "none" }} />
                  <input className="aev-inp" type="number" min="0" value={form.availableSeats} onChange={e => set("availableSeats", e.target.value)} placeholder="0" style={{ ...inp, paddingLeft: 30 }} />
                </div>
              </div>
            </div>

            {/* Live price preview */}
            {form.price && form.totalSeats && (
              <div style={{ marginTop: 14, padding: "10px 14px", background: "#fff3e8", borderRadius: 10, border: "1px solid rgba(192,69,26,0.1)", display: "flex", gap: 24, flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontSize: "0.66rem", color: "#b07b65", fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Ticket Price</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#c0451a", fontSize: "1.1rem", margin: 0 }}>₹{Number(form.price).toLocaleString()}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.66rem", color: "#b07b65", fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Max Revenue</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#1a7a4a", fontSize: "1.1rem", margin: 0 }}>₹{(Number(form.price) * Number(form.totalSeats)).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Cover Image — file upload */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(192,69,26,0.11)", boxShadow: "0 4px 16px rgba(192,69,26,0.07)", padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "#2e1106", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <Image size={17} color="#c0451a" /> Cover Image
            </h2>

            {/* Preview */}
            {previewUrl ? (
              <img src={previewUrl} alt="preview" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10, marginBottom: 12, display: "block" }}
                onError={e => { e.target.style.display = "none"; }} />
            ) : (
              <div style={{ width: "100%", height: 120, borderRadius: 10, background: "#fff3e8", border: "1px dashed rgba(192,69,26,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, color: "#b07b65", fontSize: "0.82rem", fontWeight: 600 }}>
                No image yet
              </div>
            )}

            {/* File input */}
            <label style={{ ...lbl, marginBottom: 8 }}>Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ width: "100%", fontSize: "0.82rem", color: "#6b3a25", fontFamily: "inherit", cursor: "pointer" }}
            />
            <p style={{ fontSize: "0.68rem", color: "#b07b65", marginTop: 6 }}>JPG, PNG or WEBP. Max 5MB.</p>
          </div>

          {/* Save button */}
          <button onClick={handleSave} disabled={saving}
            style={{ width: "100%", padding: "13px", borderRadius: 12, background: saving ? "#e0c8b8" : "linear-gradient(135deg,#c0451a,#a03010)", color: "#fff", fontWeight: 700, fontSize: "0.92rem", border: "none", cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: saving ? "none" : "0 4px 14px rgba(192,69,26,0.3)", fontFamily: "inherit", transition: "all 0.18s" }}>
            {saving ? (
              <><div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} /> Saving...</>
            ) : (
              <><Save size={17} /> {isNew ? "Create Event" : "Save Changes"}</>
            )}
          </button>

          {/* Cancel */}
          <Link to="/admin/events" style={{ width: "100%", padding: "11px", borderRadius: 12, background: "#fff", color: "#6b3a25", fontWeight: 700, fontSize: "0.88rem", border: "1px solid rgba(192,69,26,0.2)", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", boxSizing: "border-box" }}
            onMouseEnter={e => e.currentTarget.style.background = "#fff3e8"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
            Cancel
          </Link>

          <p style={{ fontSize: "0.72rem", color: "#b07b65", textAlign: "center" }}>* Required fields</p>
        </div>
      </div>
    </div>
  );
};

export default AdminEvent;