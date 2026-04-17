import { useState, useEffect, useRef } from "react";
import {
  MessageSquare, Search, Mail, MailOpen,
  Trash2, Reply, X, CheckCircle
} from "lucide-react";
import api from "../../services/api";

const BG     = "#f5ece0";
const CARD   = "#eddfc8";
const CARD2  = "#e8d5b8";
const BORDER = "rgba(139,94,60,0.15)";
const SHADOW = "0 4px 16px rgba(139,94,60,0.08)";

const AdminContact = () => {
  const [messages, setMessages]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected]         = useState(null);
  const [replyText, setReplyText]       = useState("");
  const [replySent, setReplySent]       = useState(false);
  const [toast, setToast]               = useState(null);
  const readIds                         = useRef(new Set());

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

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
          date:    new Date(c.createdAt).toLocaleDateString(
            "en-IN",
            { day: "numeric", month: "short", year: "numeric" }
          ),
          status:  c.status  || "unread",
        }));
        setMessages(mapped);
        mapped.forEach(m => {
          if (m.status === "read" || m.status === "replied") {
            readIds.current.add(m.id);
          }
        });
      }
    } catch (err) {
      console.log("Error fetching contacts:", err.message);
      showToast("Failed to load messages", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const markRead = async (id) => {
    if (readIds.current.has(id)) return;
    const msg = messages.find(m => m.id === id);
    if (!msg || msg.status === "read" || msg.status === "replied") {
      readIds.current.add(id);
      return;
    }
    readIds.current.add(id);
    setMessages(prev =>
      prev.map(m => m.id === id ? { ...m, status: "read" } : m)
    );
    try {
      await api.put(`/contact/status/${id}`, { status: "read" });
    } catch {}
  };

  const markReplied = async (id) => {
    try {
      await api.put(`/contact/status/${id}`, { status: "replied" });
      readIds.current.add(id);
      setMessages(prev =>
        prev.map(m => m.id === id ? { ...m, status: "replied" } : m)
      );
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const deleteMsg = async (id) => {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;
    try { await api.delete(`/contact/delete/${id}`); } catch {}
    setMessages(prev => prev.filter(m => m.id !== id));
    readIds.current.delete(id);
    if (selected?.id === id) setSelected(null);
    showToast("Message deleted");
  };

  const openMessage = (m) => {
    const updated = m.status === "unread" ? { ...m, status: "read" } : m;
    setSelected(updated);
    setReplyText("");
    setReplySent(false);
    markRead(m.id);
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    await markReplied(selected.id);
    setSelected(prev => ({ ...prev, status: "replied" }));
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
    const matchSearch =
      m.name.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q);

    const matchStatus =
      filterStatus === "all" || m.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const statusConfig = {
    unread:  { bg:"#f5ecd6", color:"#7a5a00", icon:<Mail size={13}/>,        label:"Unread"  },
    read:    { bg:CARD,      color:"#a88972", icon:<MailOpen size={13}/>,    label:"Read"    },
    replied: { bg:"#dfeee6", color:"#1a7a4a", icon:<CheckCircle size={13}/>, label:"Replied" },
  };

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
        .ac-card { transition: transform 0.18s, box-shadow 0.18s; cursor:pointer; }
        .ac-card:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(139,94,60,0.14)!important; }
        @keyframes slideIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", top:24, right:24, zIndex:9999,
          background: toast.type==="success" ? "#1a7a4a" : "#8b3a2a",
          color:"#fff", padding:"12px 20px", borderRadius:12,
          fontWeight:700, fontSize:"0.88rem",
          boxShadow:"0 8px 24px rgba(0,0,0,0.18)",
          animation:"slideIn 0.3s ease", pointerEvents:"none"
        }}>
          {toast.msg}
        </div>
      )}

      {/* ✅ Responsive Summary Cards */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",
        gap:14,
        marginBottom:24
      }}>
        {[
          { label:"Total",   value: messages.length,                                 color:"#8b5e3c" },
          { label:"Unread",  value: messages.filter(m=>m.status==="unread").length,  color:"#7a5a00" },
          { label:"Replied", value: messages.filter(m=>m.status==="replied").length, color:"#1a7a4a" },
          { label:"Read",    value: messages.filter(m=>m.status==="read").length,    color:"#a88972" },
        ].map((s,i)=>(
          <div key={i} style={{
            background:CARD,
            borderRadius:14,
            padding:"20px",
            border:`1px solid ${BORDER}`,
            boxShadow:SHADOW,
            position:"relative",
            overflow:"hidden"
          }}>
            <div style={{
              position:"absolute", top:0, left:0, right:0,
              height:3, background:s.color
            }} />
            <p style={{
              fontSize:"1.5rem",
              fontWeight:700,
              color:"#2c1a0e",
              marginBottom:4
            }}>{s.value}</p>
            <p style={{
              fontSize:"0.75rem",
              color:"#6b4c35",
              fontWeight:600,
              textTransform:"uppercase",
              letterSpacing:"0.06em",
              margin:0
            }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        background:CARD,
        borderRadius:14,
        padding:"14px 18px",
        border:`1px solid ${BORDER}`,
        marginBottom:18,
        display:"flex",
        gap:12,
        flexWrap:"wrap",
        alignItems:"center"
      }}>
        <div style={{ position:"relative", flex:1, minWidth:200 }}>
          <Search size={14} style={{
            position:"absolute", left:12, top:"50%",
            transform:"translateY(-50%)", color:"#a88972"
          }}/>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search messages..."
            style={{
              width:"100%", padding:"8px 12px 8px 34px",
              borderRadius:9, border:`1px solid ${BORDER}`,
              fontSize:"0.84rem", background:BG,
              outline:"none", fontFamily:"inherit"
            }}
          />
        </div>

        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {["all","unread","read","replied"].map(f=>(
            <button
              key={f}
              onClick={()=>setFilterStatus(f)}
              style={{
                padding:"7px 14px",
                borderRadius:9,
                border:`1px solid ${BORDER}`,
                background:filterStatus===f?"#8b5e3c":BG,
                color:filterStatus===f?"#fff":"#6b4c35",
                fontWeight:700,
                fontSize:"0.74rem",
                cursor:"pointer",
                textTransform:"capitalize"
              }}>
              {f==="all"?"All":f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign:"center", padding:"60px 24px", color:"#a88972" }}>
          <div style={{
            width:36, height:36, borderRadius:"50%",
            border:"3px solid #8b5e3c", borderTopColor:"transparent",
            margin:"0 auto 12px", animation:"spin 0.8s linear infinite"
          }}/>
          <p style={{ fontWeight:600 }}>Loading messages...</p>
        </div>
      )}

      {/* ✅ Original Messages Grid */}
      {!loading && (
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",
          gap:16
        }}>
          {filtered.map(m=>{
            const s=statusConfig[m.status]||statusConfig.unread;
            const isUnread=m.status==="unread";
            return (
              <div key={m.id} className="ac-card" onClick={()=>openMessage(m)}
                style={{
                  background:CARD,
                  borderRadius:16,
                  border:`1px solid ${isUnread?"rgba(139,94,60,0.35)":BORDER}`,
                  boxShadow:isUnread?"0 4px 20px rgba(139,94,60,0.14)":SHADOW,
                  overflow:"hidden"
                }}>
                <div style={{ height:4, background:isUnread?"#8b5e3c":CARD2 }} />
                <div style={{ padding:"16px 18px" }}>
                  <div style={{
                    display:"flex",
                    alignItems:"flex-start",
                    justifyContent:"space-between",
                    gap:10,
                    marginBottom:10
                  }}>
                    <div style={{
                      display:"flex",
                      alignItems:"center",
                      gap:10,
                      flex:1,
                      minWidth:0
                    }}>
                      <div style={{
                        width:36,
                        height:36,
                        borderRadius:10,
                        background:isUnread?"#8b5e3c":CARD2,
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                        color:isUnread?"#fff":"#6b4c35",
                        fontWeight:700,
                        fontSize:"0.8rem",
                        flexShrink:0
                      }}>
                        {m.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                      </div>
                      <div style={{ minWidth:0 }}>
                        <p style={{
                          fontWeight:700,
                          fontSize:"0.86rem",
                          color:"#2c1a0e",
                          margin:0
                        }}>{m.name}</p>
                        <p style={{
                          fontSize:"0.72rem",
                          color:"#a88972",
                          margin:0,
                          whiteSpace:"nowrap",
                          overflow:"hidden",
                          textOverflow:"ellipsis"
                        }}>{m.email}</p>
                      </div>
                    </div>
                    <div style={{
                      display:"flex",
                      flexDirection:"column",
                      alignItems:"flex-end",
                      gap:4,
                      flexShrink:0
                    }}>
                      <span style={{
                        background:s.bg,
                        color:s.color,
                        display:"inline-flex",
                        alignItems:"center",
                        gap:3,
                        padding:"2px 8px",
                        borderRadius:999,
                        fontSize:"0.66rem",
                        fontWeight:700
                      }}>
                        {s.icon} {s.label}
                      </span>
                      <span style={{
                        fontSize:"0.66rem",
                        color:"#a88972"
                      }}>{m.date}</span>
                    </div>
                  </div>

                  <p style={{
                    fontWeight:isUnread?700:500,
                    fontSize:"0.82rem",
                    color:"#6b4c35",
                    lineHeight:1.5,
                    display:"-webkit-box",
                    WebkitLineClamp:2,
                    WebkitBoxOrient:"vertical",
                    overflow:"hidden",
                    margin:0
                  }}>
                    {m.message}
                  </p>

                  <div style={{
                    display:"flex",
                    justifyContent:"flex-end",
                    marginTop:10
                  }}>
                    <button
                      onClick={e=>{e.stopPropagation();deleteMsg(m.id);}}
                      style={{
                        width:28,
                        height:28,
                        borderRadius:7,
                        background:"#f6dddd",
                        border:"none",
                        cursor:"pointer",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                        color:"#8b3a2a"
                      }}>
                      <Trash2 size={12}/>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign:"center", padding:"60px 24px", color:"#a88972" }}>
          <MessageSquare size={48} style={{ opacity:0.3, margin:"0 auto 12px", display:"block" }} />
          <p style={{ fontWeight:600 }}>No messages found</p>
        </div>
      )}

      {/* Reply Modal (Unchanged) */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position:"fixed",
            inset:0,
            background:"rgba(44,26,14,0.5)",
            zIndex:1000,
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            padding:24
          }}>
          <div
            onClick={e=>e.stopPropagation()}
            style={{
              background:BG,
              borderRadius:20,
              width:"100%",
              maxWidth:560,
              maxHeight:"85vh",
              overflowY:"auto",
              boxShadow:"0 20px 60px rgba(44,26,14,0.25)"
            }}>
            {/* Modal content remains exactly as your original */}
            {/* (No functional or design changes were made) */}
            <div style={{
              padding:"20px 24px 14px",
              borderBottom:`1px solid ${BORDER}`,
              display:"flex",
              alignItems:"center",
              justifyContent:"space-between",
              background:CARD
            }}>
              <h2 style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:"1.1rem",
                fontWeight:700,
                color:"#2c1a0e",
                margin:0
              }}>
                Message from {selected.name}
              </h2>
              <button
                onClick={()=>setSelected(null)}
                style={{
                  width:30,
                  height:30,
                  borderRadius:8,
                  background:BG,
                  border:"none",
                  cursor:"pointer",
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"center",
                  color:"#8b5e3c"
                }}>
                <X size={15}/>
              </button>
            </div>

            <div style={{ padding:"18px 24px" }}>
              <div style={{
                background:CARD,
                borderRadius:12,
                padding:"14px 16px",
                marginBottom:16
              }}>
                {[
                  { label:"Name",  value:selected.name },
                  { label:"Email", value:selected.email },
                  { label:"Phone", value:selected.phone || "—" },
                  { label:"Date",  value:selected.date },
                ].map((r,i)=>(
                  <div key={i} style={{
                    display:"flex",
                    justifyContent:"space-between",
                    padding:"6px 0",
                    borderBottom:i<3?`1px solid ${BORDER}`:"none"
                  }}>
                    <span style={{
                      fontSize:"0.74rem",
                      color:"#a88972",
                      fontWeight:600
                    }}>{r.label}</span>
                    <span style={{
                      fontSize:"0.78rem",
                      fontWeight:700,
                      color:"#2c1a0e"
                    }}>{r.value}</span>
                  </div>
                ))}
              </div>

              <div style={{
                background:CARD,
                borderRadius:12,
                padding:"14px 16px",
                marginBottom:18,
                fontSize:"0.87rem",
                color:"#6b4c35",
                lineHeight:1.75
              }}>
                {selected.message}
              </div>

              {replySent ? (
                <div style={{
                  textAlign:"center",
                  padding:"16px",
                  color:"#1a7a4a",
                  fontWeight:700
                }}>
                  <CheckCircle size={26} style={{ margin:"0 auto 6px", display:"block" }} />
                  Reply sent & marked as replied ✓
                </div>
              ) : (
                <>
                  <p style={{
                    fontSize:"0.72rem",
                    fontWeight:700,
                    color:"#6b4c35",
                    textTransform:"uppercase",
                    letterSpacing:"0.08em",
                    marginBottom:8
                  }}>Your Reply</p>
                  <textarea
                    value={replyText}
                    onChange={e=>setReplyText(e.target.value)}
                    placeholder={`Reply to ${selected.name}...`}
                    rows={4}
                    style={{
                      width:"100%",
                      padding:"10px 14px",
                      borderRadius:10,
                      border:`1px solid ${BORDER}`,
                      fontSize:"0.86rem",
                      color:"#2c1a0e",
                      background:CARD,
                      outline:"none",
                      fontFamily:"inherit",
                      resize:"vertical",
                      boxSizing:"border-box"
                    }}
                  />
                  <div style={{ display:"flex", gap:10, marginTop:12 }}>
                    <button
                      onClick={handleSendReply}
                      style={{
                        flex:1,
                        padding:"11px",
                        borderRadius:11,
                        background:"linear-gradient(135deg,#c4945a,#8b5e3c)",
                        color:"#fff",
                        fontWeight:700,
                        fontSize:"0.9rem",
                        border:"none",
                        cursor:"pointer",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                        gap:8
                      }}>
                      <Reply size={15}/> Send Reply
                    </button>
                    <button
                      onClick={()=>deleteMsg(selected.id)}
                      style={{
                        width:44,
                        borderRadius:11,
                        background:"#f6dddd",
                        color:"#8b3a2a",
                        border:"none",
                        cursor:"pointer",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center"
                      }}>
                      <Trash2 size={16}/>
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