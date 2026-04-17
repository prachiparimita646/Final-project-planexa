import { useState, useEffect } from "react";
import {
  Search, CheckCircle, XCircle, AlertCircle, Clock,
  Download, Eye, Trash2, X, Calendar, User, Mail, Phone, Ticket
} from "lucide-react";
import api from "../../services/api";

const statusConfig = {
  confirmed: { bg: "#dfeee6", color: "#1a7a4a", icon: <CheckCircle size={13} />, label: "Confirmed" },
  pending:   { bg: "#f5ecd6", color: "#7a5a00", icon: <AlertCircle size={13} />, label: "Pending" },
  cancelled: { bg: "#f6dddd", color: "#7a2f2f", icon: <XCircle size={13} />, label: "Cancelled" },
};

const Badge = ({ status }) => {
  const s = statusConfig[status] || statusConfig.pending;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: "0.7rem",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
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

  // Fetch bookings from backend
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings");
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

  // Update booking status
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

  // Delete booking
  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking? This action cannot be undone.")) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(b => b.id !== id));
      if (viewBooking?.id === id) setViewBooking(null);
      showToast(`Booking deleted`, "error");
    } catch (err) {
      showToast("Failed to delete booking", "error");
    }
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ["ID", "Customer", "Email", "Event", "Date", "Tickets", "Amount", "Status", "Booked On"];
    const rows = bookings.map(b =>
      [b.id, b.user, b.email, b.event, b.date, b.tickets, `₹${b.amount}`, b.status, b.booked].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported");
  };

  // Filter logic
  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch =
      b.user.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q)   ||
      b.event.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Stats
  const totalBookings = bookings.length;
  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;
  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const cancelledCount = bookings.filter(b => b.status === "cancelled").length;
  const totalRevenue = bookings
    .filter(b => b.status === "confirmed")
    .reduce((sum, b) => sum + b.amount, 0);

  const actionBtn = (bg, color) => ({
    width: 32,
    height: 32,
    borderRadius: 8,
    background: bg,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color,
    transition: "opacity 0.15s, transform 0.15s",
  });

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", backgroundColor: "#f5ece0", minHeight: "100vh", color: "#2c1a0e", padding: "24px 28px 48px", boxSizing: "border-box" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Jost:wght@400;500;600;700&display=swap');
        .ab-action-btn:hover { opacity: 0.82; transform: scale(1.08); }
        .ab-tr:hover td { background: #e8d5b8 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Toast notification */}
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

      {/* Summary Cards + Export Button */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24, alignItems: "stretch" }}>
        {[
          { label: "Total",     value: totalBookings,    color: "#8b5e3c" },
          { label: "Confirmed", value: confirmedCount,   color: "#1a7a4a" },
          { label: "Pending",   value: pendingCount,     color: "#7a5a00" },
          { label: "Cancelled", value: cancelledCount,   color: "#7a2f2f" },
          { label: "Revenue",   value: `₹${(totalRevenue / 1000).toFixed(1)}K`, color: "#1a7a4a" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#eddfc8", borderRadius: 14, padding: "20px", border: "1px solid rgba(139,94,60,0.15)", boxShadow: "0 4px 16px rgba(139,94,60,0.08)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color }} />
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2c1a0e", marginBottom: 4 }}>{s.value}</p>
            <p style={{ fontSize: "0.75rem", color: "#6b4c35", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{s.label}</p>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button onClick={exportCSV} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#c4945a,#8b5e3c)", color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 700, fontSize: "0.86rem", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(139,94,60,0.28)", fontFamily: "inherit" }}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "#eddfc8", borderRadius: 14, padding: "14px 18px", border: "1px solid rgba(139,94,60,0.15)", boxShadow: "0 4px 16px rgba(139,94,60,0.08)", marginBottom: 18, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b4c35" }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ID, event..."
            style={{ width: "100%", padding: "8px 12px 8px 34px", borderRadius: 9, border: "1px solid rgba(139,94,60,0.2)", fontSize: "0.84rem", color: "#2c1a0e", background: "#f5ece0", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["all", "confirmed", "pending", "cancelled"].map(f => (
            <button key={f} onClick={() => setFilterStatus(f)} style={{ padding: "7px 14px", borderRadius: 9, border: "1px solid rgba(139,94,60,0.2)", background: filterStatus === f ? "#8b5e3c" : "#f5ece0", color: filterStatus === f ? "#fff" : "#6b4c35", fontWeight: 700, fontSize: "0.76rem", cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit" }}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#a88972" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #8b5e3c", borderTopColor: "transparent", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontWeight: 600 }}>Loading bookings...</p>
        </div>
      )}

      {/* Bookings Table */}
      {!loading && (
        <div style={{ background: "#eddfc8", borderRadius: 16, border: "1px solid rgba(139,94,60,0.15)", boxShadow: "0 4px 16px rgba(139,94,60,0.08)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
              <thead>
                <tr style={{ background: "#e8d5b8" }}>
                  {["Booking ID", "Customer", "Event", "Date", "Tickets", "Amount", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#6b4c35", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap", borderBottom: "1px solid rgba(139,94,60,0.15)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b.id} className="ab-tr" style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(139,94,60,0.1)" : "none", transition: "background 0.15s" }}>
                    <td style={{ padding: "13px 16px", fontWeight: 700, color: "#8b5e3c", whiteSpace: "nowrap", fontSize: "0.75rem" }}>{b.id.slice(-8).toUpperCase()}</td>
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <div style={{ fontWeight: 700, color: "#2c1a0e" }}>{b.user}</div>
                      <div style={{ fontSize: "0.72rem", color: "#a88972" }}>{b.email}</div>
                    </td>
                    <td style={{ padding: "13px 16px", color: "#6b4c35", maxWidth: 160, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.event}</td>
                    <td style={{ padding: "13px 16px", color: "#a88972", whiteSpace: "nowrap" }}>{b.date}</td>
                    <td style={{ padding: "13px 16px", textAlign: "center", fontWeight: 700, color: "#2c1a0e" }}>{b.tickets}</td>
                    <td style={{ padding: "13px 16px", fontWeight: 700, color: "#1a7a4a", whiteSpace: "nowrap" }}>₹{b.amount.toLocaleString()}</td>
                    <td style={{ padding: "13px 16px" }}><Badge status={b.status} /></td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="ab-action-btn" title="View details" onClick={() => setViewBooking(b)} style={actionBtn("#e7f3ff", "#0e6eb8")}><Eye size={14} /></button>
                        {b.status === "pending" && (
                          <button className="ab-action-btn" title="Approve" onClick={() => updateStatus(b.id, "confirmed")} style={actionBtn("#dfeee6", "#1a7a4a")}><CheckCircle size={14} /></button>
                        )}
                        {(b.status === "pending" || b.status === "confirmed") && (
                          <button className="ab-action-btn" title="Cancel" onClick={() => updateStatus(b.id, "cancelled")} style={actionBtn("#f5ecd6", "#7a5a00")}><XCircle size={14} /></button>
                        )}
                        <button className="ab-action-btn" title="Delete" onClick={() => deleteBooking(b.id)} style={actionBtn("#f6dddd", "#8b3a2a")}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 24px", color: "#a88972" }}>
              <Clock size={40} style={{ opacity: 0.3, margin: "0 auto 10px" }} />
              <p style={{ fontWeight: 600 }}>No bookings found</p>
            </div>
          )}
        </div>
      )}

      {/* View Booking Modal */}
      {viewBooking && (
        <div onClick={() => setViewBooking(null)} style={{ position: "fixed", inset: 0, background: "rgba(44,26,14,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#f5ece0", borderRadius: 22, width: "100%", maxWidth: 520, boxShadow: "0 24px 64px rgba(44,26,14,0.22)", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg,#3d1f0a,#2c1506)", padding: "22px 26px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.65)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 3 }}>BOOKING DETAILS</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff" }}>#{viewBooking.id.slice(-8).toUpperCase()}</h2>
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
                  <div key={i} style={{ background: "#e8d5b8", borderRadius: 11, padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>{r.icon}<span style={{ fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b4c35" }}>{r.label}</span></div>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#2c1a0e" }}>{r.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "#e8d5b8", borderRadius: 12, padding: "14px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "0.68rem", color: "#6b4c35", fontWeight: 600, textTransform: "uppercase", marginBottom: 3 }}>Event</p>
                  <p style={{ fontWeight: 700, color: "#2c1a0e", fontSize: "0.92rem" }}>{viewBooking.event}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.68rem", color: "#6b4c35", fontWeight: 600, textTransform: "uppercase", marginBottom: 3 }}>Amount</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: "#8b5e3c", fontSize: "1.3rem" }}>₹{viewBooking.amount.toLocaleString()}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {viewBooking.status === "pending" && (
                  <button onClick={() => updateStatus(viewBooking.id, "confirmed")} style={{ flex: 1, padding: "11px", borderRadius: 11, background: "#1a7a4a", color: "#fff", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "inherit" }}>
                    <CheckCircle size={16} /> Approve
                  </button>
                )}
                {(viewBooking.status === "pending" || viewBooking.status === "confirmed") && (
                  <button onClick={() => updateStatus(viewBooking.id, "cancelled")} style={{ flex: 1, padding: "11px", borderRadius: 11, background: "#f5ecd6", color: "#7a5a00", fontWeight: 700, fontSize: "0.88rem", border: "1px solid rgba(122,90,0,0.25)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "inherit" }}>
                    <XCircle size={16} /> Cancel
                  </button>
                )}
                <button onClick={() => deleteBooking(viewBooking.id)} style={{ width: 44, height: 44, padding: 0, borderRadius: 11, background: "#f6dddd", color: "#8b3a2a", fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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