import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar, MapPin, Plus, Search,
  Edit2, Trash2, Eye, Users, DollarSign, ExternalLink
} from "lucide-react";
import api from "../../services/api";

const BG     = "#f5ece0";
const CARD   = "#eddfc8";
const CARD2  = "#e8d5b8";
const BORDER = "rgba(139,94,60,0.15)";
const SHADOW = "0 4px 16px rgba(139,94,60,0.08)";

const AdminEvents = () => {
  const navigate = useNavigate();

  const [events, setEvents]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events");
      setEvents(res.data);
    } catch {
      showToast("Failed to load events.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const deleteEvent = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
      showToast(`"${name}" deleted`, "error");
    } catch {
      showToast("Failed to delete event.", "error");
    }
  };

  const filtered = events.filter(ev => {
    const q = search.toLowerCase();
    const matchSearch  = ev.title?.toLowerCase().includes(q) || ev.location?.toLowerCase().includes(q);
    const matchStatus  =
      filterStatus === "all" ||
      (filterStatus === "full"     && ev.availableSeats === 0) ||
      (filterStatus === "upcoming" && ev.availableSeats > 0);
    return matchSearch && matchStatus;
  });

  const pct = (ev) => {
    if (!ev.totalSeats) return 0;
    return Math.round(((ev.totalSeats - ev.availableSeats) / ev.totalSeats) * 100);
  };

  const statusStyle = (ev) => ev.availableSeats === 0
    ? { bg:"#f6dddd", color:"#7a2f2f", label:"Full"     }
    : { bg:"#dfeee6", color:"#1a7a4a", label:"Upcoming" };

  return (
    <div style={{ fontFamily:"'Jost', sans-serif", backgroundColor:BG, minHeight:"100vh", color:"#2c1a0e", padding:"24px 28px 48px", boxSizing:"border-box" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Jost:wght@400;500;600;700&display=swap');
        html,body,#root{ background:#f5ece0!important; }
        [class*="admin"]{ background:#f5ece0!important; }
        .ae-card { transition: transform 0.2s, box-shadow 0.2s; }
        .ae-card:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(139,94,60,0.14)!important; }
        .ae-card:hover .ae-img { transform:scale(1.06); }
        .ae-img { transition: transform 0.5s; }
        .ae-btn { transition: opacity 0.15s, transform 0.15s; border:none; cursor:pointer; }
        .ae-btn:hover { opacity:0.82; transform:scale(1.08); }
        @keyframes slideIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:24, right:24, zIndex:9999, background:toast.type==="success"?"#1a7a4a":"#7a2f2f", color:"#fff", padding:"12px 20px", borderRadius:12, fontWeight:700, fontSize:"0.88rem", boxShadow:"0 8px 24px rgba(0,0,0,0.16)", animation:"slideIn 0.3s ease", pointerEvents:"none" }}>
          {toast.msg}
        </div>
      )}

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:17, marginBottom:24, animation:"fadeUp 0.4s ease" }}>
        {[
          { label:"Total Events",  value: events.length,                                                               color:"#8b5e3c" },
          { label:"Upcoming",      value: events.filter(e=>e.availableSeats>0).length,                                 color:"#1a7a4a" },
          { label:"Fully Booked",  value: events.filter(e=>e.availableSeats===0).length,                               color:"#7a2f2f" },
          { label:"Total Seats",   value: events.reduce((a,e)=>a+(e.totalSeats||0),0).toLocaleString(),                color:"#7a4f2a" },
          
        ].map((s,i)=>(
          <div key={i} style={{ background:CARD, borderRadius:14, padding:"30px 18px", border:`1px solid ${BORDER}`, boxShadow:SHADOW, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:s.color }} />
            <p style={{ fontSize:"1.5rem", fontWeight:700, color:"#2c1a0e", lineHeight:1, marginBottom:3 }}>{s.value}</p>
            <p style={{ fontSize:"0.7rem", color:"#6b4c35", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", margin:0 }}>{s.label}</p>
            
          </div>
          
        ))}
        <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
            <Link to="/events"
              style={{ display:"inline-flex", alignItems:"center", gap:7, background:CARD, border:`1px solid ${BORDER}`, color:"#8b5e3c", padding:"9px 16px", borderRadius:11, fontWeight:700, fontSize:"0.83rem", textDecoration:"none" }}>
              <ExternalLink size={14}/> Public Events
            </Link>
            <Link to="/admin/events/new"
              style={{ display:"inline-flex", alignItems:"center", gap:8, background:"linear-gradient(135deg,#c4945a,#8b5e3c)", color:"#fff", padding:"9px 20px", borderRadius:11, fontWeight:700, fontSize:"0.86rem", textDecoration:"none", boxShadow:"0 4px 14px rgba(139,94,60,0.28)" }}>
              <Plus size={16}/> Add Event
            </Link>
          </div>
        </div>
      </div>
      </div>

      {/* Filters */}
      <div style={{ background:CARD, borderRadius:14, padding:"14px 18px", border:`1px solid ${BORDER}`, marginBottom:14, display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative", flex:1, minWidth:200 }}>
          <Search size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#a88972" }} />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search events..."
            style={{ width:"100%", padding:"8px 12px 8px 34px", borderRadius:9, border:`1px solid ${BORDER}`, fontSize:"0.84rem", color:"#2c1a0e", background:BG, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {["all","upcoming","full"].map(f=>(
            <button key={f} onClick={()=>setFilterStatus(f)}
              style={{ padding:"7px 14px", borderRadius:9, border:`1px solid ${BORDER}`, background:filterStatus===f?"#8b5e3c":BG, color:filterStatus===f?"#fff":"#6b4c35", fontWeight:700, fontSize:"0.76rem", cursor:"pointer", textTransform:"capitalize", fontFamily:"inherit" }}>
              {f==="all"?"All":f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <p style={{ fontSize:"0.76rem", color:"#a88972", fontWeight:600, marginBottom:16 }}>
        Showing <strong style={{ color:"#8b5e3c" }}>{filtered.length}</strong> of {events.length} events
      </p>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign:"center", padding:"60px 24px", color:"#a88972" }}>
          <div style={{ width:36, height:36, borderRadius:"50%", border:"3px solid #8b5e3c", borderTopColor:"transparent", margin:"0 auto 12px", animation:"spin 0.8s linear infinite" }} />
          <p style={{ fontWeight:600 }}>Loading events...</p>
        </div>
      )}

      {/* Events Grid */}
      {!loading && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px,1fr))", gap:18 }}>
          {filtered.map(ev=>{
            const s         = statusStyle(ev);
            const occupancy = pct(ev);
            return (
              <div key={ev._id} className="ae-card" style={{ background:CARD, borderRadius:16, border:`1px solid ${BORDER}`, boxShadow:SHADOW, overflow:"hidden" }}>
                {ev.thumbnail && (
                  <div style={{ overflow:"hidden", height:150 }}>
                    <img src={ev.thumbnail} alt={ev.title} className="ae-img"
                      style={{ width:"100%", height:"100%", objectFit:"cover" }}
                      onError={e=>e.target.style.display="none"} />
                  </div>
                )}
                <div style={{ height:4, background:"linear-gradient(90deg,#8b5e3c,#c4945a)" }} />
                <div style={{ padding:"16px 18px" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                    <h3 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1rem", fontWeight:700, color:"#2c1a0e", lineHeight:1.3, flex:1, paddingRight:8, margin:0 }}>{ev.title}</h3>
                    <span style={{ background:s.bg, color:s.color, fontSize:"0.66rem", fontWeight:700, padding:"3px 10px", borderRadius:999, flexShrink:0 }}>{s.label}</span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:12 }}>
                    <p style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.76rem", color:"#a88972", margin:0 }}>
                      <Calendar size={12} color="#8b5e3c"/>
                      {ev.date?new Date(ev.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"—"}
                      {ev.time?` · ${ev.time}`:""}
                    </p>
                    <p style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.76rem", color:"#a88972", margin:0 }}>
                      <MapPin size={12} color="#8b5e3c"/>{ev.location}
                    </p>
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:"0.7rem", color:"#a88972", fontWeight:600 }}>Occupancy</span>
                      <span style={{ fontSize:"0.7rem", fontWeight:700, color:occupancy>=90?"#7a2f2f":"#1a7a4a" }}>
                        {ev.totalSeats-ev.availableSeats}/{ev.totalSeats} ({occupancy}%)
                      </span>
                    </div>
                    <div style={{ height:5, borderRadius:999, background:CARD2, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${occupancy}%`, borderRadius:999, background:occupancy>=90?"#7a2f2f":"linear-gradient(90deg,#8b5e3c,#c4945a)", transition:"width 0.4s" }} />
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"1.1rem", fontWeight:700, color:"#8b5e3c" }}>
                      ₹{ev.price?.toLocaleString()}
                    </span>
                    <div style={{ display:"flex", gap:7 }}>
                      <button className="ae-btn" title="View public page" onClick={()=>navigate(`/events/${ev._id}`)}
                        style={{ width:32, height:32, borderRadius:8, background:CARD2, display:"flex", alignItems:"center", justifyContent:"center", color:"#6b4c35" }}>
                        <Eye size={14}/>
                      </button>
                      <button className="ae-btn" title="Edit event" onClick={()=>navigate(`/admin/events/${ev._id}/edit`)}
                        style={{ width:32, height:32, borderRadius:8, background:"#f5ecd6", display:"flex", alignItems:"center", justifyContent:"center", color:"#7a5a00" }}>
                        <Edit2 size={14}/>
                      </button>
                      <button className="ae-btn" title="Delete event" onClick={()=>deleteEvent(ev._id,ev.title)}
                        style={{ width:32, height:32, borderRadius:8, background:"#f6dddd", display:"flex", alignItems:"center", justifyContent:"center", color:"#7a2f2f" }}>
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading&&filtered.length===0&&(
        <div style={{ textAlign:"center", padding:"60px 24px", color:"#a88972" }}>
          <Calendar size={48} style={{ opacity:0.25, margin:"0 auto 12px", display:"block" }} />
          <p style={{ fontWeight:600 }}>No events found</p>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;