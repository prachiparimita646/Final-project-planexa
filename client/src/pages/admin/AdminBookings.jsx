import { useState, useEffect } from "react";
import {
  Search, CheckCircle, XCircle, AlertCircle, Clock,
  Download, Eye, Trash2, X, Calendar, User, Mail, Ticket
} from "lucide-react";
import api from "../../services/api";

const BG      = "#f5ece0";
const CARD    = "#eddfc8";
const CARD2   = "#e8d5b8";
const BORDER  = "rgba(139,94,60,0.15)";
const SHADOW  = "0 4px 16px rgba(139,94,60,0.08)";

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

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res  = await api.get("/bookings");
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.bookings)
        ? res.data.bookings
        : [];
      setBookings(data);
    } catch (err) {
      showToast("Failed to load bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { bookingStatus: status });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, bookingStatus: status } : b));
      setViewBooking(prev => prev?._id === id ? { ...prev, bookingStatus: status } : prev);
      showToast(
        status === "confirmed"
          ? "Booking confirmed ✓"
          : "Booking cancelled",
        status === "confirmed" ? "success" : "error"
      );
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking? This cannot be undone.")) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(b => b._id !== id));
      if (viewBooking?._id === id) setViewBooking(null);
      showToast("Booking deleted");
    } catch {
      showToast("Failed to delete booking", "error");
    }
  };

  const exportCSV = () => {
    const headers = ["Customer","Email","Event","Booked On","Seats","Amount","Status"];
    const rows    = bookings.map(b => [
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
    a.href = url;
    a.download = "bookings.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported");
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch =
      b.user?.name?.toLowerCase().includes(q) ||
      b.user?.email?.toLowerCase().includes(q) ||
      b.event?.title?.toLowerCase().includes(q) ||
      b._id?.toLowerCase().includes(q);
    const matchStatus =
      filterStatus === "all" || b.bookingStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = bookings
    .filter(b => b.bookingStatus === "confirmed")
    .reduce((a, b) => a + (b.totalAmount || 0), 0);

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
    <div
      style={{
        fontFamily: "'Jost', sans-serif",
        backgroundColor: BG,
        minHeight: "100vh",
        color: "#2c1a0e",
        padding: "24px 28px 48px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Jost:wght@400;500;600;700&display=swap');
        html,body,#root{ background:#f5ece0!important; }
        [class*="admin"]{ background:#f5ece0!important; }
        .ab-action-btn:hover { opacity:0.82; transform:scale(1.08); }
        .ab-tr:hover td { background:${CARD2}!important; }
        @keyframes slideIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ✅ Corrected Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
          marginBottom: 24,
          animation: "fadeUp 0.4s ease",
          alignItems: "stretch",
        }}
      >
        {[
          { label:"Total",     value: bookings.length,                                          color:"#8b5e3c" },
          { label:"Confirmed", value: bookings.filter(b=>b.bookingStatus==="confirmed").length, color:"#1a7a4a" },
          { label:"Pending",   value: bookings.filter(b=>b.bookingStatus==="pending").length,   color:"#7a5a00" },
          { label:"Cancelled", value: bookings.filter(b=>b.bookingStatus==="cancelled").length, color:"#7a2f2f" },
          { label:"Revenue",   value: `₹${(totalRevenue/1000).toFixed(1)}K`,                     color:"#1a7a4a" },
        ].map((s,i)=>(
          <div
            key={i}
            style={{
              background:CARD,
              borderRadius:14,
              padding:"30px",
              border:`1px solid ${BORDER}`,
              boxShadow:SHADOW,
              position:"relative",
              overflow:"hidden"
            }}
          >
            <div style={{
              position:"absolute",
              top:0,
              left:0,
              right:0,
              height:3,
              background:s.color
            }} />
            <p style={{
              fontSize:"1.5rem",
              fontWeight:700,
              color:"#2c1a0e",
              marginBottom:4
            }}>
              {s.value}
            </p>
            <p style={{
              fontSize:"0.75rem",
              color:"#6b4c35",
              fontWeight:600,
              textTransform:"uppercase",
              letterSpacing:"0.06em",
              margin:0
            }}>
              {s.label}
            </p>
          </div>
        ))}

        {/* Export CSV Button */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
          <button
            onClick={exportCSV}
            style={{
              display:"inline-flex",
              alignItems:"center",
              gap:8,
              background:"linear-gradient(135deg,#c4945a,#8b5e3c)",
              color:"#fff",
              padding:"12px 20px",
              borderRadius:12,
              fontWeight:700,
              fontSize:"0.86rem",
              border:"none",
              cursor:"pointer",
              boxShadow:"0 4px 14px rgba(139,94,60,0.28)",
              fontFamily:"inherit"
            }}
          >
            <Download size={15}/> Export CSV
          </button>
        </div>
      </div>

      {/* ✅ RECENT BOOKINGS TABLE */}
      {!loading && (
        <div style={{
          background:CARD,
          borderRadius:16,
          border:`1px solid ${BORDER}`,
          boxShadow:SHADOW,
          overflow:"hidden"
        }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.84rem" }}>
              <thead>
                <tr style={{ background:CARD2 }}>
                  {["Customer","Event","Booked On","Seats","Amount","Status","Actions"].map(h => (
                    <th key={h} style={{
                      padding:"13px 16px",
                      textAlign:"left",
                      fontSize:"0.7rem",
                      fontWeight:700,
                      color:"#6b4c35",
                      textTransform:"uppercase",
                      letterSpacing:"0.08em",
                      borderBottom:`1px solid ${BORDER}`
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b,i)=>(
                  <tr key={b._id} style={{ borderBottom: i<filtered.length-1?`1px solid ${BORDER}`:"none" }}>
                    <td style={{ padding:"13px 16px" }}>
                      <div style={{ fontWeight:700 }}>{b.user?.name||"—"}</div>
                      <div style={{ fontSize:"0.72rem", color:"#a88972" }}>{b.user?.email||"—"}</div>
                    </td>
                    <td style={{ padding:"13px 16px" }}>{b.event?.title||"—"}</td>
                    <td style={{ padding:"13px 16px" }}>
                      {b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td style={{ padding:"13px 16px", textAlign:"center", fontWeight:700 }}>
                      {b.numberOfSeats}
                    </td>
                    <td style={{ padding:"13px 16px", fontWeight:700, color:"#1a7a4a" }}>
                      ₹{Number(b.totalAmount||0).toLocaleString()}
                    </td>
                    <td style={{ padding:"13px 16px" }}>
                      <Badge status={b.bookingStatus}/>
                    </td>
                    <td style={{ padding:"13px 16px" }}>
                      <div style={{ display:"flex", gap:6 }}>
                        <button onClick={()=>setViewBooking(b)} style={actionBtn(BG,"#8b5e3c")}><Eye size={14}/></button>
                        {b.bookingStatus==="pending" && (
                          <button onClick={()=>updateStatus(b._id,"confirmed")} style={actionBtn("#dfeee6","#1a7a4a")}><CheckCircle size={14}/></button>
                        )}
                        {(b.bookingStatus==="pending"||b.bookingStatus==="confirmed") && (
                          <button onClick={()=>updateStatus(b._id,"cancelled")} style={actionBtn("#f5ecd6","#7a5a00")}><XCircle size={14}/></button>
                        )}
                        <button onClick={()=>deleteBooking(b._id)} style={actionBtn("#f6dddd","#8b3a2a")}><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ✅ VIEW BOOKING MODAL */}
      {viewBooking && (
        <div
          onClick={()=>setViewBooking(null)}
          style={{
            position:"fixed",
            inset:0,
            background:"rgba(44,26,14,0.5)",
            zIndex:1000,
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            padding:24
          }}
        >
          <div
            onClick={e=>e.stopPropagation()}
            style={{
              background:BG,
              borderRadius:22,
              width:"100%",
              maxWidth:520,
              boxShadow:"0 24px 64px rgba(44,26,14,0.22)",
              overflow:"hidden"
            }}
          >
            <div style={{
              background:"linear-gradient(135deg,#3d1f0a,#2c1506)",
              padding:"22px 26px",
              display:"flex",
              alignItems:"center",
              justifyContent:"space-between"
            }}>
              <h2 style={{ color:"#f5ece0", margin:0 }}>
                {viewBooking.event?.title || "Booking"}
              </h2>
              <button
                onClick={()=>setViewBooking(null)}
                style={{
                  background:"rgba(255,255,255,0.12)",
                  border:"none",
                  color:"#fff",
                  borderRadius:8,
                  cursor:"pointer",
                  width:32,
                  height:32,
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"center"
                }}
              >
                <X size={16}/>
              </button>
            </div>
            <div style={{ padding:"24px 26px" }}>
              <p><strong>Customer:</strong> {viewBooking.user?.name}</p>
              <p><strong>Email:</strong> {viewBooking.user?.email}</p>
              <p><strong>Seats:</strong> {viewBooking.numberOfSeats}</p>
              <p><strong>Total:</strong> ₹{Number(viewBooking.totalAmount||0).toLocaleString()}</p>
              <p><strong>Status:</strong> <Badge status={viewBooking.bookingStatus}/></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;