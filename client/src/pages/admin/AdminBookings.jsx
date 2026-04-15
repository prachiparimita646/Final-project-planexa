import { useState, useEffect } from "react";
import {
  Search, CheckCircle, XCircle, AlertCircle, Clock,
  Download, Eye, Trash2, X, Calendar, User, Mail, Ticket
} from "lucide-react";
import api from "../../services/api";

const statusConfig = {
  confirmed: { bg: "#e8f5ee", color: "#1a7a4a", icon: <CheckCircle size={13} />, label: "Confirmed" },
  pending:   { bg: "#fff8e1", color: "#8b6a0a", icon: <AlertCircle size={13} />, label: "Pending"   },
  cancelled: { bg: "#fdecea", color: "#8b3a2a", icon: <XCircle size={13} />,     label: "Cancelled" },
};

const Badge = ({ status }) => {
  const s = statusConfig[status] || statusConfig.pending;
  return (
    <span style={{ background: s.bg, color: s.color, display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700, whiteSpace: "nowrap" }}>
      {s.icon} {s.label}
    </span>
  );
};

const AdminBookings = () => {
  const [bookings, setBookings]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewBooking, setViewBooking]   = useState(null);
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  // ── Fetch from real MongoDB ──
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings");
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.bookings)
          ? res.data.bookings
          : [];
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err.message);
      showToast("Failed to load bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // ── Update booking status ──
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { bookingStatus: status });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, bookingStatus: status } : b));
      setViewBooking(prev => prev?._id === id ? { ...prev, bookingStatus: status } : prev);
      showToast(status === "confirmed" ? "Booking confirmed ✓" : "Booking cancelled", status === "confirmed" ? "success" : "error");
    } catch (err) {
      showToast("Failed to update status", "error");
    }
  };

  // ── Delete booking ──
  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking? This cannot be undone.")) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(b => b._id !== id));
      if (viewBooking?._id === id) setViewBooking(null);
      showToast("Booking deleted");
    } catch (err) {
      showToast("Failed to delete booking", "error");
    }
  };

  // ── Export CSV ──
  const exportCSV = () => {
    const headers = ["Customer", "Email", "Event", "Booked On", "Seats", "Amount", "Status"];
    const rows = bookings.map(b => [
      b.user?.name || "—",
      b.user?.email || "—",
      b.event?.title || "—",
      b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-IN") : "—",
      b.numberOfSeats,
      `₹${b.totalAmount}`,
      b.bookingStatus,
    ].join(","));
    const csv  = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "bookings.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported");
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch =
      b.user?.name?.toLowerCase().includes(q)  ||
      b.user?.email?.toLowerCase().includes(q) ||
      b.event?.title?.toLowerCase().includes(q)||
      b._id?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || b.bookingStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = bookings
    .filter(b => b.bookingStatus === "confirmed")
    .reduce((a, b) => a + (b.totalAmount || 0), 0);

  const actionBtn = (bg, color) => ({
    width: 32, height: 32, borderRadius: 8, background: bg, border: "none",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    color, transition: "opacity 0.15s, transform 0.15s",
  });

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", color: "#2c1a0e", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Jost:wght@400;500;600;700&display=swap');
        .ab-action-btn:hover { opacity: 0.82; transform: scale(1.08); }
        .ab-tr:hover td { background: #faf4ec !important; }
        @keyframes slideIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to { transform: rotate(360deg); } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "success" ? "#1a7a4a" : "#8b3a2a", color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 700, fontSize: "0.88rem", boxShadow: "0 8px 24px rgba(0,0,0,0.18)", animation: "slideIn 0.3s ease", pointerEvents: "none" }}>
          {toast.msg}
        </div>
      )}

      {/* Header - Export only */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <button onClick={exportCSV} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#c4945a,#8b5e3c)", color: "#fff", padding: "11px 22px", borderRadius: 12, fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(139,94,60,0.3)", fontFamily: "inherit" }}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(155px,1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total",     value: bookings.length,                                          color: "#8b5e3c" },
          { label: "Confirmed", value: bookings.filter(b=>b.bookingStatus==="confirmed").length, color: "#1a7a4a" },
          { label: "Pending",   value: bookings.filter(b=>b.bookingStatus==="pending").length,   color: "#8b6a0a" },
          { label: "Cancelled", value: bookings.filter(b=>b.bookingStatus==="cancelled").length, color: "#8b3a2a" },
          { label: "Revenue",   value: `₹${(totalRevenue/1000).toFixed(1)}K`,                   color: "#1a7a4a" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#faf4ec", borderRadius: 14, padding: "16px 18px", border: "1px solid rgba(139,94,60,0.14)", boxShadow: "0 3px 12px rgba(139,94,60,0.07)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color }} />
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2c1a0e", lineHeight: 1, marginBottom: 3 }}>{s.value}</p>
            <p style={{ fontSize: "0.7rem", color: "#a88972", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: "#faf4ec", borderRadius: 14, padding: "14px 18px", border: "1px solid rgba(139,94,60,0.14)", marginBottom: 18, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#a88972" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, event..."
            style={{ width: "100%", padding: "8px 12px 8px 34px", borderRadius: 9, border: "1px solid rgba(139,94,60,0.18)", fontSize: "0.84rem", color: "#2c1a0e", background: "#f5ece0", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["all","confirmed","pending","cancelled"].map(f => (
            <button key={f} onClick={() => setFilterStatus(f)}
              style={{ padding: "7px 14px", borderRadius: 9, border: "1px solid rgba(139,94,60,0.18)", background: filterStatus === f ? "#8b5e3c" : "#f5ece0", color: filterStatus === f ? "#fff" : "#6b4c35", fontWeight: 700, fontSize: "0.76rem", cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit" }}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#a88972" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #8b5e3c", borderTopColor: "transparent", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontWeight: 600 }}>Loading bookings...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div style={{ background: "#faf4ec", borderRadius: 16, border: "1px solid rgba(139,94,60,0.14)", boxShadow: "0 4px 16px rgba(139,94,60,0.07)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
              <thead>
                <tr style={{ background: "linear-gradient(135deg,#f5ece0,#ecdcc8)" }}>
                  {["Customer","Event","Booked On","Seats","Amount","Status","Actions"].map(h => (
                    <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#6b4c35", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap", borderBottom: "1px solid rgba(139,94,60,0.12)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "48px", textAlign: "center", color: "#a88972" }}>
                      <Clock size={40} style={{ opacity: 0.3, margin: "0 auto 10px", display: "block" }} />
                      <p style={{ fontWeight: 600 }}>No bookings found</p>
                    </td>
                  </tr>
                ) : filtered.map((b, i) => (
                  <tr key={b._id} className="ab-tr" style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(139,94,60,0.07)" : "none", transition: "background 0.15s" }}>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ fontWeight: 700, color: "#2c1a0e" }}>{b.user?.name || "—"}</div>
                      <div style={{ fontSize: "0.72rem", color: "#a88972" }}>{b.user?.email || "—"}</div>
                    </td>
                    <td style={{ padding: "13px 16px", color: "#6b4c35", maxWidth: 160, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.event?.title || "—"}</td>
                    <td style={{ padding: "13px 16px", color: "#a88972", whiteSpace: "nowrap" }}>
                      {b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td style={{ padding: "13px 16px", textAlign: "center", fontWeight: 700, color: "#2c1a0e" }}>{b.numberOfSeats}</td>
                    <td style={{ padding: "13px 16px", fontWeight: 700, color: "#1a7a4a", whiteSpace: "nowrap" }}>₹{Number(b.totalAmount || 0).toLocaleString()}</td>
                    <td style={{ padding: "13px 16px" }}><Badge status={b.bookingStatus} /></td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="ab-action-btn" title="View" onClick={() => setViewBooking(b)} style={actionBtn("#f5ece0","#8b5e3c")}><Eye size={14} /></button>
                        {b.bookingStatus === "pending" && (
                          <button className="ab-action-btn" title="Confirm" onClick={() => updateStatus(b._id,"confirmed")} style={actionBtn("#e8f5ee","#1a7a4a")}><CheckCircle size={14} /></button>
                        )}
                        {(b.bookingStatus === "pending" || b.bookingStatus === "confirmed") && (
                          <button className="ab-action-btn" title="Cancel" onClick={() => updateStatus(b._id,"cancelled")} style={actionBtn("#fff8e1","#8b6a0a")}><XCircle size={14} /></button>
                        )}
                        <button className="ab-action-btn" title="Delete" onClick={() => deleteBooking(b._id)} style={actionBtn("#fdecea","#8b3a2a")}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewBooking && (
        <div onClick={() => setViewBooking(null)} style={{ position: "fixed", inset: 0, background: "rgba(44,26,14,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#faf4ec", borderRadius: 22, width: "100%", maxWidth: 520, boxShadow: "0 24px 64px rgba(44,26,14,0.22)", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg,#3d1f0a,#2c1506)", padding: "22px 26px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.64rem", color: "rgba(245,236,224,0.6)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 3 }}>BOOKING DETAILS</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 700, color: "#f5ece0", margin: 0 }}>{viewBooking.event?.title || "Booking"}</h2>
              </div>
              <button onClick={() => setViewBooking(null)} style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.12)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5ece0" }}><X size={17} /></button>
            </div>
            <div style={{ padding: "24px 26px" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}><Badge status={viewBooking.bookingStatus} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                {[
                  { label: "Customer",    value: viewBooking.user?.name || "—" },
                  { label: "Email",       value: viewBooking.user?.email || "—" },
                  { label: "Seats",       value: viewBooking.numberOfSeats },
                  { label: "Total",       value: `₹${Number(viewBooking.totalAmount || 0).toLocaleString()}` },
                  { label: "Payment",     value: viewBooking.paymentStatus || "pending" },
                  { label: "Booked On",   value: viewBooking.createdAt ? new Date(viewBooking.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—" },
                ].map((r, i) => (
                  <div key={i} style={{ background: "#f5ece0", borderRadius: 10, padding: "11px 14px" }}>
                    <p style={{ fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#a88972", marginBottom: 3 }}>{r.label}</p>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#2c1a0e", margin: 0 }}>{r.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {viewBooking.bookingStatus === "pending" && (
                  <button onClick={() => updateStatus(viewBooking._id,"confirmed")} style={{ flex: 1, padding: "11px", borderRadius: 11, background: "#1a7a4a", color: "#fff", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "inherit" }}>
                    <CheckCircle size={16} /> Confirm
                  </button>
                )}
                {(viewBooking.bookingStatus === "pending" || viewBooking.bookingStatus === "confirmed") && (
                  <button onClick={() => updateStatus(viewBooking._id,"cancelled")} style={{ flex: 1, padding: "11px", borderRadius: 11, background: "#fff8e1", color: "#8b6a0a", fontWeight: 700, fontSize: "0.88rem", border: "1px solid rgba(139,106,10,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "inherit" }}>
                    <XCircle size={16} /> Cancel
                  </button>
                )}
                <button onClick={() => deleteBooking(viewBooking._id)} style={{ width: 44, height: 44, borderRadius: 11, background: "#fdecea", color: "#8b3a2a", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;