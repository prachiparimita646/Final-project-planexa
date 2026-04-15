import { useState, useEffect } from "react";
import {
  Search, CheckCircle, XCircle, AlertCircle, Clock,
  Download, Eye, Trash2, X, Calendar, MapPin, User, Mail, Phone, Ticket
} from "lucide-react";
import api from "../../services/api";

const statusConfig = {
  confirmed: { bg: "#e8f7ef", color: "#1a7a4a", icon: <CheckCircle size={13} />, label: "Confirmed" },
  pending:   { bg: "#fff8e1", color: "#b5860d", icon: <AlertCircle size={13} />, label: "Pending"   },
  cancelled: { bg: "#fdecea", color: "#c0391a", icon: <XCircle size={13} />,     label: "Cancelled" },
};

const Badge = ({ status }) => {
  const s = statusConfig[status] || statusConfig.pending;
  return (
    <span style={{ background: s.bg, color: s.color, display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700, whiteSpace: "nowrap" }}>
      {s.icon} {s.label}
    </span>
  );
};

const AdminBooking = () => {
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

  // ── Fetch real bookings from MongoDB ──
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res  = await api.get("/bookings");
      const data = Array.isArray(res.data) ? res.data : res.data?.bookings || [];

      // Map backend fields → component shape
      const mapped = data.map(b => ({
        id:      b._id,
        user:    b.user?.name  || "—",
        email:   b.user?.email || "—",
        phone:   b.user?.phone || "—",
        event:   b.event?.title || "—",
        date:    b.event?.date
                   ? new Date(b.event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                   : "—",
        amount:  b.totalAmount   || 0,
        tickets: b.numberOfSeats || 0,
        status:  b.bookingStatus || "pending",
        booked:  b.createdAt
                   ? new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                   : "—",
      }));
      setBookings(mapped);
    } catch (err) {
      console.error("Failed to fetch bookings:", err.message);
      showToast("Failed to load bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // ── Update status via API ──
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { bookingStatus: status });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      setViewBooking(prev => prev?.id === id ? { ...prev, status } : prev);
      showToast(
        status === "confirmed" ? `Booking approved ✓` : `Booking cancelled`,
        status === "confirmed" ? "success" : "error"
      );
    } catch (err) {
      showToast("Failed to update status", "error");
    }
  };

  // ── Delete via API ──
  const deleteBooking = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(b => b.id !== id));
      if (viewBooking?.id === id) setViewBooking(null);
      showToast(`Booking deleted`, "error");
    } catch (err) {
      showToast("Failed to delete booking", "error");
    }
  };

  const exportCSV = () => {
    const headers = ["ID", "Customer", "Email", "Event", "Date", "Tickets", "Amount", "Status", "Booked On"];
    const rows = bookings.map(b =>
      [b.id, b.user, b.email, b.event, b.date, b.tickets, `₹${b.amount}`, b.status, b.booked].join(",")
    );
    const csv  = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "bookings.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported successfully");
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch =
      b.user.toLowerCase().includes(q)  ||
      b.id.toLowerCase().includes(q)    ||
      b.event.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const actionBtn = (bg, color) => ({
    width: 32, height: 32, borderRadius: 8,
    background: bg, border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    color, transition: "opacity 0.15s, transform 0.15s",
  });

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", color: "#2e1106", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito:wght@400;500;600;700&display=swap');
        .ab-action-btn:hover { opacity: 0.82; transform: scale(1.08); }
        .ab-tr:hover td { background: #fffaf6; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 9999,
          background: toast.type === "success" ? "#1a7a4a" : "#c0391a",
          color: "#fff", padding: "12px 20px", borderRadius: 12,
          fontWeight: 700, fontSize: "0.88rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Export button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <button onClick={exportCSV} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#c4945a,#8b5e3c)", color: "#fff", padding: "11px 22px", borderRadius: 12, fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(139,94,60,0.3)", fontFamily: "inherit" }}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px,1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Bookings", value: bookings.length,                                   color: "#c0451a", bg: "#fff0ea" },
          { label: "Confirmed",      value: bookings.filter(b=>b.status==="confirmed").length, color: "#1a7a4a", bg: "#e8f7ef" },
          { label: "Pending",        value: bookings.filter(b=>b.status==="pending").length,   color: "#b5860d", bg: "#fff8e1" },
          { label: "Cancelled",      value: bookings.filter(b=>b.status==="cancelled").length, color: "#c0391a", bg: "#fdecea" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid rgba(192,69,26,0.11)", boxShadow: "0 3px 12px rgba(192,69,26,0.07)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color }} />
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2e1106", lineHeight: 1, marginBottom: 3 }}>{s.value}</p>
            <p style={{ fontSize: "0.7rem", color: "#b07b65", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "14px 18px", border: "1px solid rgba(192,69,26,0.11)", boxShadow: "0 3px 12px rgba(192,69,26,0.06)", marginBottom: 18, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#b07b65" }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ID, event..."
            style={{ width: "100%", padding: "8px 12px 8px 34px", borderRadius: 9, border: "1px solid rgba(192,69,26,0.18)", fontSize: "0.84rem", color: "#2e1106", background: "#fff3e8", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["all", "confirmed", "pending", "cancelled"].map(f => (
            <button key={f} onClick={() => setFilterStatus(f)}
              style={{ padding: "7px 14px", borderRadius: 9, border: "1px solid rgba(192,69,26,0.18)", background: filterStatus === f ? "#c0451a" : "#fff3e8", color: filterStatus === f ? "#fff" : "#6b3a25", fontWeight: 700, fontSize: "0.76rem", cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit" }}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#b07b65" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #c0451a", borderTopColor: "transparent", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontWeight: 600 }}>Loading bookings...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(192,69,26,0.11)", boxShadow: "0 4px 16px rgba(192,69,26,0.07)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
              <thead>
                <tr style={{ background: "linear-gradient(135deg,#fff0ea,#fff3e8)" }}>
                  {["Booking ID","Customer","Event","Date","Tickets","Amount","Status","Actions"].map(h => (
                    <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#6b3a25", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap", borderBottom: "1px solid rgba(192,69,26,0.1)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b.id} className="ab-tr" style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(192,69,26,0.06)" : "none", transition: "background 0.15s" }}>
                    <td style={{ padding: "13px 16px", fontWeight: 700, color: "#c0451a", whiteSpace: "nowrap", fontSize: "0.75rem" }}>{b.id.slice(-8).toUpperCase()}</td>
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <div style={{ fontWeight: 700, color: "#2e1106" }}>{b.user}</div>
                      <div style={{ fontSize: "0.72rem", color: "#b07b65" }}>{b.email}</div>
                    </td>
                    <td style={{ padding: "13px 16px", color: "#6b3a25", maxWidth: 160, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.event}</td>
                    <td style={{ padding: "13px 16px", color: "#b07b65", whiteSpace: "nowrap" }}>{b.date}</td>
                    <td style={{ padding: "13px 16px", textAlign: "center", fontWeight: 700, color: "#2e1106" }}>{b.tickets}</td>
                    <td style={{ padding: "13px 16px", fontWeight: 700, color: "#1a7a4a", whiteSpace: "nowrap" }}>₹{b.amount.toLocaleString()}</td>
                    <td style={{ padding: "13px 16px" }}><Badge status={b.status} /></td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="ab-action-btn" title="View details" onClick={() => setViewBooking(b)} style={actionBtn("#e7f3ff", "#0e6eb8")}><Eye size={14} /></button>
                        {b.status === "pending" && (
                          <button className="ab-action-btn" title="Approve" onClick={() => updateStatus(b.id, "confirmed")} style={actionBtn("#e8f7ef", "#1a7a4a")}><CheckCircle size={14} /></button>
                        )}
                        {(b.status === "pending" || b.status === "confirmed") && (
                          <button className="ab-action-btn" title="Cancel" onClick={() => updateStatus(b.id, "cancelled")} style={actionBtn("#fff8e1", "#b5860d")}><XCircle size={14} /></button>
                        )}
                        <button className="ab-action-btn" title="Delete" onClick={() => { if (window.confirm(`Delete this booking? This cannot be undone.`)) deleteBooking(b.id); }} style={actionBtn("#fdecea", "#c0391a")}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 24px", color: "#b07b65" }}>
              <Clock size={40} style={{ opacity: 0.3, margin: "0 auto 10px" }} />
              <p style={{ fontWeight: 600 }}>No bookings found</p>
            </div>
          )}
        </div>
      )}

      {/* View Modal */}
      {viewBooking && (
        <div onClick={() => setViewBooking(null)} style={{ position: "fixed", inset: 0, background: "rgba(46,17,6,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 22, width: "100%", maxWidth: 520, boxShadow: "0 24px 64px rgba(46,17,6,0.22)", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg,#c0451a,#a03010)", padding: "22px 26px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.65)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 3 }}>BOOKING DETAILS</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff" }}>#{viewBooking.id.slice(-8).toUpperCase()}</h2>
              </div>
              <button onClick={() => setViewBooking(null)} style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.18)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <X size={17} />
              </button>
            </div>
            <div style={{ padding: "24px 26px" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
                <Badge status={viewBooking.status} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                {[
                  { icon: <User size={15} />,    label: "Customer",  value: viewBooking.user    },
                  { icon: <Mail size={15} />,    label: "Email",     value: viewBooking.email   },
                  { icon: <Phone size={15} />,   label: "Phone",     value: viewBooking.phone || "—" },
                  { icon: <Calendar size={15} />,label: "Event Date",value: viewBooking.date    },
                  { icon: <Ticket size={15} />,  label: "Tickets",   value: viewBooking.tickets },
                  { icon: <Calendar size={15} />,label: "Booked On", value: viewBooking.booked  },
                ].map((r, i) => (
                  <div key={i} style={{ background: "#fff3e8", borderRadius: 11, padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>{r.icon}<span style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#b07b65" }}>{r.label}</span></div>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#2e1106" }}>{r.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff0ea", borderRadius: 12, padding: "14px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "0.68rem", color: "#b07b65", fontWeight: 600, textTransform: "uppercase", marginBottom: 3 }}>Event</p>
                  <p style={{ fontWeight: 700, color: "#2e1106", fontSize: "0.92rem" }}>{viewBooking.event}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.68rem", color: "#b07b65", fontWeight: 600, textTransform: "uppercase", marginBottom: 3 }}>Amount</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#c0451a", fontSize: "1.3rem" }}>₹{viewBooking.amount.toLocaleString()}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {viewBooking.status === "pending" && (
                  <button onClick={() => updateStatus(viewBooking.id, "confirmed")} style={{ flex: 1, padding: "11px", borderRadius: 11, background: "#1a7a4a", color: "#fff", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "inherit" }}>
                    <CheckCircle size={16} /> Approve
                  </button>
                )}
                {(viewBooking.status === "pending" || viewBooking.status === "confirmed") && (
                  <button onClick={() => updateStatus(viewBooking.id, "cancelled")} style={{ flex: 1, padding: "11px", borderRadius: 11, background: "#fff8e1", color: "#b5860d", fontWeight: 700, fontSize: "0.88rem", border: "1px solid rgba(181,134,13,0.25)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "inherit" }}>
                    <XCircle size={16} /> Cancel
                  </button>
                )}
                <button onClick={() => { if (window.confirm("Delete this booking?")) deleteBooking(viewBooking.id); }} style={{ width: 44, height: 44, padding: 0, borderRadius: 11, background: "#fdecea", color: "#c0391a", fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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

export default AdminBooking;
