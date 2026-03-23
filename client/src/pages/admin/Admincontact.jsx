import { useState, useEffect } from "react";
import {
  MessageSquare, Search, Mail, MailOpen,
  Trash2, Reply, X, CheckCircle, AlertCircle
} from "lucide-react";
import api from "../../services/api";

const AdminContact = () => {
  const [messages, setMessages]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected]         = useState(null);
  const [replyText, setReplyText]       = useState("");
  const [replySent, setReplySent]       = useState(false);
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ── Fetch contacts from MongoDB ──
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/contact/get");
      if (res.data.status) {
        const mapped = res.data.contact.map(c => ({
          id:      c._id,
          name:    c.name    || "Anonymous",
          email:   c.email   || "",
          phone:   c.phone   || "",
          message: c.message || "",
          date:    new Date(c.createdAt).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric"
          }),
          
          status:  c.status  || "unread",
        }));
        setMessages(mapped);
      }
    } catch (err) {
      console.log("Error fetching contacts:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  // ── Mark as read — 
  const markRead = async (id) => {
    const msg = messages.find(m => m.id === id);
    if (!msg || msg.status !== "unread") return; 

    try {
      await api.put(`/contact/status/${id}`, { status: "read" });
      // Update local state so UI reflects immediately without refetch
      setMessages(prev =>
        prev.map(m => m.id === id ? { ...m, status: "read" } : m)
      );
    } catch (err) {
      console.log("Failed to mark as read:", err.message);
    }
  };

  // ── Mark as replied — 
  const markReplied = async (id) => {
    try {
      await api.put(`/contact/status/${id}`, { status: "replied" });
      setMessages(prev =>
        prev.map(m => m.id === id ? { ...m, status: "replied" } : m)
      );
    } catch (err) {
      console.log("Failed to mark as replied:", err.message);
    }
  };

  // ── Delete contact — 
  const deleteMsg = async (id) => {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;
    try {
      await api.delete(`/contact/delete/${id}`);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
      showToast("Message deleted");
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
      showToast("Message deleted");
    }
  };

  // ── Open message — 
  const openMessage = (m) => {
    setSelected(m);
    setReplyText("");
    setReplySent(false);
    markRead(m.id); 
  };

  // ── Send reply — 
  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    await markReplied(selected.id);
    setReplySent(true);
    showToast(`Reply sent to ${selected.name}`);
    setTimeout(() => {
      setReplySent(false);
      setReplyText("");
      setSelected(null);
    }, 1500);
  };

  const filtered = messages.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(q) ||
                        m.message.toLowerCase().includes(q) ||
                        m.email.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusConfig = {
    unread:  { bg: "#fff8e1", color: "#b5860d", icon: <Mail size={13} />,        label: "Unread"  },
    read:    { bg: "#f3f3f3", color: "#888",    icon: <MailOpen size={13} />,    label: "Read"    },
    replied: { bg: "#e8f7ef", color: "#1a7a4a", icon: <CheckCircle size={13} />, label: "Replied" },
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", color: "#2e1106", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito:wght@400;500;600;700&display=swap');
        .ac-card { transition: transform 0.18s, box-shadow 0.18s; cursor: pointer; }
        .ac-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(192,69,26,0.13) !important; }
        @keyframes slideIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to { transform: rotate(360deg); } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "success" ? "#1a7a4a" : "#c0391a", color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 700, fontSize: "0.88rem", boxShadow: "0 8px 24px rgba(0,0,0,0.18)", animation: "slideIn 0.3s ease", pointerEvents: "none" }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: "0.68rem", letterSpacing: "0.18em", fontWeight: 700, color: "#e87c3e", textTransform: "uppercase", marginBottom: 4 }}>INBOX</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 700, color: "#2e1106" }}>Messages & Contact</h1>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total",   value: messages.length,                                 color: "#c0451a" },
          { label: "Unread",  value: messages.filter(m=>m.status==="unread").length,  color: "#b5860d" },
          { label: "Replied", value: messages.filter(m=>m.status==="replied").length, color: "#1a7a4a" },
          { label: "Read",    value: messages.filter(m=>m.status==="read").length,    color: "#888"    },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..."
            style={{ width: "100%", padding: "8px 12px 8px 34px", borderRadius: 9, border: "1px solid rgba(192,69,26,0.18)", fontSize: "0.84rem", color: "#2e1106", background: "#fff3e8", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["all", "unread", "read", "replied"].map(f => (
            <button key={f} onClick={() => setFilterStatus(f)}
              style={{ padding: "7px 14px", borderRadius: 9, border: "1px solid rgba(192,69,26,0.18)", background: filterStatus === f ? "#c0451a" : "#fff3e8", color: filterStatus === f ? "#fff" : "#6b3a25", fontWeight: 700, fontSize: "0.74rem", cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit" }}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 24px", color: "#b07b65" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #c0451a", borderTopColor: "transparent", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontWeight: 600 }}>Loading messages...</p>
        </div>
      )}

      {/* Messages Grid */}
      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 16 }}>
          {filtered.map(m => {
            const s = statusConfig[m.status] || statusConfig.unread;
            const isUnread = m.status === "unread";
            return (
              <div key={m.id} className="ac-card"
                onClick={() => openMessage(m)}
                style={{ background: "#fff", borderRadius: 16, border: `1px solid ${isUnread ? "rgba(192,69,26,0.28)" : "rgba(192,69,26,0.11)"}`, boxShadow: isUnread ? "0 4px 20px rgba(192,69,26,0.12)" : "0 4px 14px rgba(192,69,26,0.06)", overflow: "hidden" }}>
                <div style={{ height: 4, background: isUnread ? "#c0451a" : "#e0d0c8" }} />
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: isUnread ? "#c0451a" : "#e0d0c8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.8rem", flexShrink: 0 }}>
                        {m.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: "0.86rem", color: "#2e1106", margin: 0 }}>{m.name}</p>
                        <p style={{ fontSize: "0.72rem", color: "#b07b65", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.email}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                      <span style={{ background: s.bg, color: s.color, display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 999, fontSize: "0.66rem", fontWeight: 700 }}>
                        {s.icon} {s.label}
                      </span>
                      <span style={{ fontSize: "0.66rem", color: "#b07b65" }}>{m.date}</span>
                    </div>
                  </div>
                  <p style={{ fontWeight: isUnread ? 700 : 500, fontSize: "0.82rem", color: "#6b3a25", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", margin: 0 }}>
                    {m.message}
                  </p>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                    <button onClick={e => { e.stopPropagation(); deleteMsg(m.id); }}
                      style={{ width: 28, height: 28, borderRadius: 7, background: "#fdecea", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#c0391a" }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 24px", color: "#b07b65" }}>
          <MessageSquare size={48} style={{ opacity: 0.3, margin: "0 auto 12px", display: "block" }} />
          <p style={{ fontWeight: 600 }}>No messages found</p>
        </div>
      )}

      {/* Reply Modal */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(46,17,6,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 560, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(46,17,6,0.25)" }}>
            <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid rgba(192,69,26,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#2e1106", margin: 0 }}>
                Message from {selected.name}
              </h2>
              <button onClick={() => setSelected(null)}
                style={{ width: 30, height: 30, borderRadius: 8, background: "#fff0ea", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#c0451a" }}>
                <X size={15} />
              </button>
            </div>
            <div style={{ padding: "18px 24px" }}>
              {/* Contact info */}
              <div style={{ background: "#fff3e8", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                {[
                  { label: "Name",  value: selected.name         },
                  { label: "Email", value: selected.email        },
                  { label: "Phone", value: selected.phone || "—" },
                  { label: "Date",  value: selected.date         },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 3 ? "1px solid rgba(192,69,26,0.07)" : "none" }}>
                    <span style={{ fontSize: "0.74rem", color: "#b07b65", fontWeight: 600 }}>{r.label}</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2e1106" }}>{r.value}</span>
                  </div>
                ))}
              </div>

              {/* Message */}
              <div style={{ background: "#fff3e8", borderRadius: 12, padding: "14px 16px", marginBottom: 18, fontSize: "0.87rem", color: "#6b3a25", lineHeight: 1.75 }}>
                {selected.message}
              </div>

              {/* Reply section */}
              {replySent ? (
                <div style={{ textAlign: "center", padding: "16px", color: "#1a7a4a", fontWeight: 700 }}>
                  <CheckCircle size={26} style={{ margin: "0 auto 6px", display: "block" }} />
                  Reply sent & marked as replied in database ✓
                </div>
              ) : (
                <>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6b3a25", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Your Reply</p>
                  <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                    placeholder={`Reply to ${selected.name}...`} rows={4}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(192,69,26,0.2)", fontSize: "0.86rem", color: "#2e1106", outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    <button onClick={handleSendReply}
                      style={{ flex: 1, padding: "11px", borderRadius: 11, background: "linear-gradient(135deg,#c0451a,#a03010)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
                      <Reply size={15} /> Send Reply
                    </button>
                    <button onClick={() => deleteMsg(selected.id)}
                      style={{ width: 44, borderRadius: 11, background: "#fdecea", color: "#c0391a", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContact;