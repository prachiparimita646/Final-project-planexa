import { useState } from "react";
import {
  Search, UserCheck, UserX, Shield, User, Mail, Phone,
  Edit2, Trash2, Plus, X, Save, BookOpen, Calendar
} from "lucide-react";

/* ─────────────────────────────────────────────
   Modal defined OUTSIDE AdminUsers so it never
   remounts on parent re-render — fixes focus loss
───────────────────────────────────────────── */
const UserModal = ({ title, form, onChange, onSave, onClose, saveLabel }) => {
  const inp = {
    width: "100%", padding: "9px 13px", borderRadius: 9,
    border: "1px solid rgba(192,69,26,0.22)", fontSize: "0.86rem",
    color: "#2e1106", background: "#fff", outline: "none",
    fontFamily: "'Nunito', sans-serif", boxSizing: "border-box",
    transition: "border-color 0.15s",
  };
  const lbl = {
    fontSize: "0.7rem", fontWeight: 700, color: "#6b3a25",
    textTransform: "uppercase", letterSpacing: "0.08em",
    marginBottom: 5, display: "block",
  };

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(46,17,6,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 22, width: "100%", maxWidth: 460, boxShadow: "0 24px 64px rgba(46,17,6,0.22)", overflow: "hidden" }}
      >
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#c0451a,#a03010)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#fff", margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.18)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={lbl}>Full Name</label>
            <input
              value={form.name}
              onChange={e => onChange("name", e.target.value)}
              placeholder="e.g. Priya Sharma"
              style={inp}
              onFocus={e => e.target.style.borderColor = "#c0451a"}
              onBlur={e => e.target.style.borderColor = "rgba(192,69,26,0.22)"}
            />
          </div>
          <div>
            <label style={lbl}>Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={e => onChange("email", e.target.value)}
              placeholder="email@example.com"
              style={inp}
              onFocus={e => e.target.style.borderColor = "#c0451a"}
              onBlur={e => e.target.style.borderColor = "rgba(192,69,26,0.22)"}
            />
          </div>
          <div>
            <label style={lbl}>Phone Number</label>
            <input
              value={form.phone}
              onChange={e => onChange("phone", e.target.value)}
              placeholder="+91 98001 00000"
              style={inp}
              onFocus={e => e.target.style.borderColor = "#c0451a"}
              onBlur={e => e.target.style.borderColor = "rgba(192,69,26,0.22)"}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={lbl}>Role</label>
              <select
                value={form.role}
                onChange={e => onChange("role", e.target.value)}
                style={{ ...inp, cursor: "pointer" }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Status</label>
              <select
                value={form.status}
                onChange={e => onChange("status", e.target.value)}
                style={{ ...inp, cursor: "pointer" }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button
              onClick={onSave}
              style={{ flex: 1, padding: "11px", borderRadius: 11, background: "linear-gradient(135deg,#c0451a,#a03010)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: "0 4px 14px rgba(192,69,26,0.3)", fontFamily: "inherit" }}
            >
              <Save size={16} /> {saveLabel}
            </button>
            <button
              onClick={onClose}
              style={{ padding: "11px 20px", borderRadius: 11, background: "#fff3e8", color: "#6b3a25", fontWeight: 700, fontSize: "0.88rem", border: "1px solid rgba(192,69,26,0.18)", cursor: "pointer", fontFamily: "inherit" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Data & constants
───────────────────────────────────────────── */
const initialUsers = [
  { id: 1,  name: "Priya Sharma",  email: "priya@email.com",  phone: "+91 98001 00001", role: "user",  status: "active",   joined: "Jan 2025", bookings: 5  },
  { id: 2,  name: "Arjun Mehta",   email: "arjun@email.com",  phone: "+91 98001 00002", role: "user",  status: "active",   joined: "Feb 2025", bookings: 3  },
  { id: 3,  name: "Sneha Rao",     email: "sneha@email.com",  phone: "+91 98001 00003", role: "admin", status: "active",   joined: "Dec 2024", bookings: 12 },
  { id: 4,  name: "Rahul Verma",   email: "rahul@email.com",  phone: "+91 98001 00004", role: "user",  status: "inactive", joined: "Mar 2025", bookings: 1  },
  { id: 5,  name: "Divya Nair",    email: "divya@email.com",  phone: "+91 98001 00005", role: "user",  status: "active",   joined: "Jan 2025", bookings: 7  },
  { id: 6,  name: "Karan Singh",   email: "karan@email.com",  phone: "+91 98001 00006", role: "user",  status: "active",   joined: "Apr 2025", bookings: 2  },
  { id: 7,  name: "Meera Pillai",  email: "meera@email.com",  phone: "+91 98001 00007", role: "user",  status: "active",   joined: "Feb 2025", bookings: 9  },
  { id: 8,  name: "Vikram Joshi",  email: "vikram@email.com", phone: "+91 98001 00008", role: "admin", status: "active",   joined: "Nov 2024", bookings: 15 },
  { id: 9,  name: "Anita Das",     email: "anita@email.com",  phone: "+91 98001 00009", role: "user",  status: "inactive", joined: "Mar 2025", bookings: 0  },
  { id: 10, name: "Rohan Bose",    email: "rohan@email.com",  phone: "+91 98001 00010", role: "user",  status: "active",   joined: "May 2025", bookings: 4  },
  { id: 11, name: "Pooja Iyer",    email: "pooja@email.com",  phone: "+91 98001 00011", role: "user",  status: "active",   joined: "Jan 2025", bookings: 6  },
  { id: 12, name: "Siddharth Roy", email: "sid@email.com",    phone: "+91 98001 00012", role: "user",  status: "active",   joined: "Apr 2025", bookings: 2  },
];

const avatarColors = ["#c0451a","#0e6eb8","#1a7a4a","#6b2fa0","#b5860d","#1a6e7a"];
const initials = name => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const emptyForm = { name: "", email: "", phone: "", role: "user", status: "active" };

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
const AdminUsers = () => {
  const [users, setUsers]           = useState(initialUsers);
  const [search, setSearch]         = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [toast, setToast]           = useState(null);

  // Edit modal state
  const [editId, setEditId]         = useState(null);   // which user id is being edited
  const [editForm, setEditForm]     = useState({});

  // Add modal state
  const [addOpen, setAddOpen]       = useState(false);
  const [addForm, setAddForm]       = useState(emptyForm);

  /* ── toast ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2600);
  };

  /* ── actions ── */
  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      const next = u.status === "active" ? "inactive" : "active";
      showToast(`${u.name} ${next === "active" ? "enabled ✓" : "disabled"}`, next === "active" ? "success" : "warn");
      return { ...u, status: next };
    }));
  };

  const toggleRole = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      const next = u.role === "user" ? "admin" : "user";
      showToast(`${u.name} is now ${next}`, "success");
      return { ...u, role: next };
    }));
  };

  const deleteUser = (id) => {
    const u = users.find(u => u.id === id);
    if (!window.confirm(`Delete "${u?.name}"? This cannot be undone.`)) return;
    setUsers(prev => prev.filter(u => u.id !== id));
    if (editId === id) setEditId(null);
    showToast(`${u?.name} deleted`, "error");
  };

  // Open edit: snapshot current values into editForm
  const openEdit = (u) => {
    setEditForm({ name: u.name, email: u.email, phone: u.phone, role: u.role, status: u.status });
    setEditId(u.id);
  };

  // Field-level onChange for edit form — key + value, no object spread issue
  const onEditChange = (key, val) => {
    setEditForm(prev => ({ ...prev, [key]: val }));
  };

  const saveEdit = () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      showToast("Name and email are required", "error"); return;
    }
    setUsers(prev => prev.map(u => u.id === editId ? { ...u, ...editForm } : u));
    showToast(`${editForm.name} updated ✓`);
    setEditId(null);
  };

  // Field-level onChange for add form
  const onAddChange = (key, val) => {
    setAddForm(prev => ({ ...prev, [key]: val }));
  };

  const saveAdd = () => {
    if (!addForm.name.trim() || !addForm.email.trim()) {
      showToast("Name and email are required", "error"); return;
    }
    const newUser = {
      ...addForm,
      id: Date.now(),
      joined: new Date().toLocaleString("en-IN", { month: "short", year: "numeric" }),
      bookings: 0,
    };
    setUsers(prev => [newUser, ...prev]);
    showToast(`${addForm.name} added ✓`);
    setAddOpen(false);
    setAddForm(emptyForm);
  };

  /* ── filter ── */
  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole   = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  /* ── render ── */
  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", color: "#2e1106", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito:wght@400;500;600;700&display=swap');
        .au-card { transition: transform 0.2s, box-shadow 0.2s; }
        .au-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(192,69,26,0.13) !important; }
        .au-btn:hover { opacity: 0.82; transform: scale(1.04); }
        @keyframes slideIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "success" ? "#1a7a4a" : toast.type === "warn" ? "#b5860d" : "#c0391a", color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 700, fontSize: "0.88rem", boxShadow: "0 8px 24px rgba(0,0,0,0.18)", animation: "slideIn 0.3s ease", pointerEvents: "none" }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.18em", fontWeight: 700, color: "#e87c3e", textTransform: "uppercase", marginBottom: 4 }}>MANAGEMENT</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 700, color: "#2e1106" }}>Users</h1>
        </div>
        <button
          className="au-btn"
          onClick={() => { setAddForm(emptyForm); setAddOpen(true); }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#c0451a,#a03010)", color: "#fff", padding: "11px 22px", borderRadius: 12, fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(192,69,26,0.3)", fontFamily: "inherit", transition: "opacity 0.15s, transform 0.15s" }}
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Summary — reads live from state */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px,1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Users", value: users.length,                                  color: "#c0451a" },
          { label: "Active",      value: users.filter(u=>u.status==="active").length,   color: "#1a7a4a" },
          { label: "Inactive",    value: users.filter(u=>u.status==="inactive").length, color: "#b5860d" },
          { label: "Admins",      value: users.filter(u=>u.role==="admin").length,      color: "#6b2fa0" },
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
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{ width: "100%", padding: "8px 12px 8px 34px", borderRadius: 9, border: "1px solid rgba(192,69,26,0.18)", fontSize: "0.84rem", color: "#2e1106", background: "#fff3e8", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all","user","admin"].map(f => (
            <button key={f} onClick={() => setFilterRole(f)}
              style={{ padding: "7px 14px", borderRadius: 9, border: "1px solid rgba(192,69,26,0.18)", background: filterRole === f ? "#c0451a" : "#fff3e8", color: filterRole === f ? "#fff" : "#6b3a25", fontWeight: 700, fontSize: "0.76rem", cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit" }}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 16 }}>
        {filtered.map(u => {
          const color = avatarColors[u.id % avatarColors.length];
          return (
            <div key={u.id} className="au-card" style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(192,69,26,0.11)", boxShadow: "0 4px 16px rgba(192,69,26,0.07)", overflow: "hidden" }}>
              <div style={{ height: 4, background: color }} />
              <div style={{ padding: "18px 20px" }}>

                {/* Avatar + name */}
                <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1rem", color: "#fff", flexShrink: 0 }}>
                    {initials(u.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 4 }}>
                      <h3 style={{ fontWeight: 700, fontSize: "0.94rem", color: "#2e1106", margin: 0 }}>{u.name}</h3>
                      {u.role === "admin" && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: "#f3eaff", color: "#6b2fa0", fontSize: "0.6rem", fontWeight: 700, padding: "2px 7px", borderRadius: 999 }}>
                          <Shield size={9} /> Admin
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: u.status === "active" ? "#1a7a4a" : "#b07b65", background: u.status === "active" ? "#e8f7ef" : "#f3f3f3", padding: "2px 9px", borderRadius: 999 }}>
                      {u.status === "active" ? "● Active" : "○ Inactive"}
                    </span>
                  </div>
                </div>

                {/* Contact */}
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                  <p style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.77rem", color: "#b07b65", margin: 0 }}><Mail size={12} color={color} />{u.email}</p>
                  <p style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.77rem", color: "#b07b65", margin: 0 }}><Phone size={12} color={color} />{u.phone}</p>
                </div>

                {/* Stats */}
                <div style={{ display: "flex", borderTop: "1px solid rgba(192,69,26,0.07)", paddingTop: 12, marginBottom: 14 }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 2 }}>
                      <BookOpen size={13} color={color} />
                      <p style={{ fontWeight: 700, fontSize: "1rem", color: "#2e1106", margin: 0 }}>{u.bookings}</p>
                    </div>
                    <p style={{ fontSize: "0.65rem", color: "#b07b65", fontWeight: 600, textTransform: "uppercase", margin: 0 }}>Bookings</p>
                  </div>
                  <div style={{ width: 1, background: "rgba(192,69,26,0.08)" }} />
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 2 }}>
                      <Calendar size={13} color={color} />
                      <p style={{ fontWeight: 700, fontSize: "0.86rem", color: "#2e1106", margin: 0 }}>{u.joined}</p>
                    </div>
                    <p style={{ fontSize: "0.65rem", color: "#b07b65", fontWeight: 600, textTransform: "uppercase", margin: 0 }}>Joined</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  {/* Edit */}
                  <button
                    className="au-btn"
                    onClick={() => openEdit(u)}
                    style={{ flex: 1, padding: "8px", borderRadius: 9, background: "#fff0ea", border: "1px solid rgba(192,69,26,0.15)", color: "#c0451a", fontWeight: 700, fontSize: "0.77rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "inherit", transition: "opacity 0.15s, transform 0.15s" }}
                  >
                    <Edit2 size={12} /> Edit
                  </button>

                  {/* Enable / Disable */}
                  <button
                    className="au-btn"
                    onClick={() => toggleStatus(u.id)}
                    style={{ flex: 1, padding: "8px", borderRadius: 9, background: u.status === "active" ? "#fdecea" : "#e8f7ef", border: "none", color: u.status === "active" ? "#c0391a" : "#1a7a4a", fontWeight: 700, fontSize: "0.77rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "inherit", transition: "opacity 0.15s, transform 0.15s" }}
                  >
                    {u.status === "active"
                      ? <><UserX size={12} /> Disable</>
                      : <><UserCheck size={12} /> Enable</>}
                  </button>

                  {/* Role toggle */}
                  <button
                    className="au-btn"
                    onClick={() => toggleRole(u.id)}
                    title={u.role === "user" ? "Promote to Admin" : "Demote to User"}
                    style={{ width: 34, height: 34, borderRadius: 9, background: u.role === "admin" ? "#f3eaff" : "#f3f3f3", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: u.role === "admin" ? "#6b2fa0" : "#aaa", transition: "opacity 0.15s, transform 0.15s" }}
                  >
                    <Shield size={14} />
                  </button>

                  {/* Delete */}
                  <button
                    className="au-btn"
                    onClick={() => deleteUser(u.id)}
                    style={{ width: 34, height: 34, borderRadius: 9, background: "#fdecea", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#c0391a", transition: "opacity 0.15s, transform 0.15s" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 24px", color: "#b07b65" }}>
          <User size={48} style={{ opacity: 0.3, margin: "0 auto 12px" }} />
          <p style={{ fontWeight: 600 }}>No users found</p>
        </div>
      )}

      {/* Edit Modal */}
      {editId !== null && (
        <UserModal
          title={`Edit — ${users.find(u => u.id === editId)?.name || ""}`}
          form={editForm}
          onChange={onEditChange}
          onSave={saveEdit}
          onClose={() => setEditId(null)}
          saveLabel="Save Changes"
        />
      )}

      {/* Add User Modal */}
      {addOpen && (
        <UserModal
          title="Add New User"
          form={addForm}
          onChange={onAddChange}
          onSave={saveAdd}
          onClose={() => setAddOpen(false)}
          saveLabel="Add User"
        />
      )}
    </div>
  );
};

export default AdminUsers;