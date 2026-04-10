// src/pages/admin/AdminUsers.jsx
import { useState, useEffect } from "react";
import {
  Search, Shield, Mail, Edit2, Trash2, X, Save, BookOpen, Calendar, Plus, UserCheck, UserX, Users
} from "lucide-react";
import api from "../../services/api";

const avatarColors = ["#8b5e3c","#4a6e5a","#7a5a2a","#6b4c35","#a05030","#5a6a3a"];
const initials = name => name?.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || "?";

const AdminUsers = () => {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [toast, setToast]           = useState(null);
  const [editUser, setEditUser]     = useState(null);
  const [editForm, setEditForm]     = useState({});

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2600);
  };

  // ── Fetch users from MongoDB ──
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/users");
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.users)
          ? res.data.users
          : [];
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ── Delete user from MongoDB ──
  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/auth/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      showToast(`${name} deleted`);
    } catch (err) {
      showToast("Failed to delete user", "error");
    }
  };

  // ── Update user role ──
  const toggleRole = async (id, currentRole, name) => {
    const newRole = currentRole === "user" ? "admin" : "user";
    try {
      await api.put(`/auth/users/${id}`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
      showToast(`${name} is now ${newRole}`);
    } catch (err) {
      showToast("Failed to update role", "error");
    }
  };

  // ── Save edit ──
  const saveEdit = async () => {
    if (!editForm.name?.trim() || !editForm.email?.trim()) {
      showToast("Name and email are required", "error"); return;
    }
    try {
      await api.put(`/auth/users/${editUser._id}`, editForm);
      setUsers(prev => prev.map(u => u._id === editUser._id ? { ...u, ...editForm } : u));
      showToast(`${editForm.name} updated ✓`);
      setEditUser(null);
    } catch (err) {
      showToast("Failed to update user", "error");
    }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    const matchRole   = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", color: "#2c1a0e", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Jost:wght@400;500;600;700&display=swap');
        .au-card { transition: transform 0.2s, box-shadow 0.2s; }
        .au-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(139,94,60,0.13) !important; }
        .au-btn { transition: opacity 0.15s, transform 0.15s; }
        .au-btn:hover { opacity: 0.82; transform: scale(1.04); }
        @keyframes slideIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to { transform: rotate(360deg); } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "success" ? "#1a7a4a" : "#8b3a2a", color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 700, fontSize: "0.88rem", boxShadow: "0 8px 24px rgba(0,0,0,0.18)", animation: "slideIn 0.3s ease", pointerEvents: "none" }}>
          {toast.msg}
        </div>
      )}



      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(155px,1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Users", value: users.length,                              color: "#8b5e3c" },
          { label: "Admins",      value: users.filter(u=>u.role==="admin").length,  color: "#6b2fa0" },
          { label: "Regular",     value: users.filter(u=>u.role==="user").length,   color: "#1a7a4a" },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
            style={{ width: "100%", padding: "8px 12px 8px 34px", borderRadius: 9, border: "1px solid rgba(139,94,60,0.18)", fontSize: "0.84rem", color: "#2c1a0e", background: "#f5ece0", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all","user","admin"].map(f => (
            <button key={f} onClick={() => setFilterRole(f)}
              style={{ padding: "7px 14px", borderRadius: 9, border: "1px solid rgba(139,94,60,0.18)", background: filterRole === f ? "#8b5e3c" : "#f5ece0", color: filterRole === f ? "#fff" : "#6b4c35", fontWeight: 700, fontSize: "0.76rem", cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit" }}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#a88972" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #8b5e3c", borderTopColor: "transparent", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontWeight: 600 }}>Loading users...</p>
        </div>
      )}

      {/* Users Grid */}
      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {filtered.map((u, idx) => {
            const color = avatarColors[idx % avatarColors.length];
            return (
              <div key={u._id} className="au-card" style={{ background: "#faf4ec", borderRadius: 16, border: "1px solid rgba(139,94,60,0.12)", boxShadow: "0 4px 16px rgba(139,94,60,0.07)", overflow: "hidden" }}>
                <div style={{ height: 4, background: color }} />
                <div style={{ padding: "18px 20px" }}>

                  {/* Avatar + name */}
                  <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1rem", color: "#fff", flexShrink: 0 }}>
                      {initials(u.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 4 }}>
                        <h3 style={{ fontWeight: 700, fontSize: "0.94rem", color: "#2c1a0e", margin: 0 }}>{u.name}</h3>
                        {u.role === "admin" && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: "#f3eaff", color: "#6b2fa0", fontSize: "0.6rem", fontWeight: 700, padding: "2px 7px", borderRadius: 999 }}>
                            <Shield size={9} /> Admin
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: "0.74rem", color: "#a88972", margin: 0 }}>{u.email}</p>
                    </div>
                  </div>

                  {/* Joined */}
                  <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.74rem", color: "#a88972", marginBottom: 14 }}>
                    <Calendar size={12} color="#c4945a" />
                    Joined {new Date(u.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </p>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, paddingTop: 12, borderTop: "1px solid rgba(139,94,60,0.1)" }}>
                    {/* Edit */}
                    <button className="au-btn" onClick={() => { setEditUser(u); setEditForm({ name: u.name, email: u.email, role: u.role }); }}
                      style={{ flex: 1, padding: "8px", borderRadius: 9, background: "#f5ece0", border: "1px solid rgba(139,94,60,0.15)", color: "#8b5e3c", fontWeight: 700, fontSize: "0.77rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "inherit" }}>
                      <Edit2 size={12} /> Edit
                    </button>

                    {/* Role toggle */}
                    <button className="au-btn" onClick={() => toggleRole(u._id, u.role, u.name)} title={u.role === "user" ? "Promote to Admin" : "Demote to User"}
                      style={{ width: 34, height: 34, borderRadius: 9, background: u.role === "admin" ? "#f3eaff" : "#f5ece0", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: u.role === "admin" ? "#6b2fa0" : "#a88972" }}>
                      <Shield size={14} />
                    </button>

                    {/* Delete */}
                    <button className="au-btn" onClick={() => deleteUser(u._id, u.name)}
                      style={{ width: 34, height: 34, borderRadius: 9, background: "#fdecea", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b3a2a" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "72px 24px", color: "#a88972" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(139,94,60,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
            <Users size={36} style={{ color: "#c4945a", opacity: 0.6 }} />
          </div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "#6b4c35", marginBottom: 6 }}>No Users Found</h3>
          <p style={{ fontSize: "0.86rem" }}>Try adjusting your search or filter.</p>
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div onClick={() => setEditUser(null)} style={{ position: "fixed", inset: 0, background: "rgba(44,26,14,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#faf4ec", borderRadius: 22, width: "100%", maxWidth: 440, boxShadow: "0 24px 64px rgba(44,26,14,0.22)", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg,#3d1f0a,#2c1506)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontWeight: 700, color: "#f5ece0", margin: 0 }}>Edit — {editUser.name}</h2>
              <button onClick={() => setEditUser(null)} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.12)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5ece0" }}><X size={16} /></button>
            </div>
            <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Full Name",  key: "name",  type: "text" },
                { label: "Email",      key: "email", type: "email" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6b4c35", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, display: "block" }}>{f.label}</label>
                  <input type={f.type} value={editForm[f.key] || ""} onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: "100%", padding: "9px 13px", borderRadius: 9, border: "1px solid rgba(139,94,60,0.22)", fontSize: "0.86rem", color: "#2c1a0e", background: "#fff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6b4c35", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, display: "block" }}>Role</label>
                <select value={editForm.role || "user"} onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))}
                  style={{ width: "100%", padding: "9px 13px", borderRadius: 9, border: "1px solid rgba(139,94,60,0.22)", fontSize: "0.86rem", color: "#2c1a0e", background: "#fff", outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={saveEdit} style={{ flex: 1, padding: "11px", borderRadius: 11, background: "linear-gradient(135deg,#c4945a,#8b5e3c)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "inherit" }}>
                  <Save size={16} /> Save Changes
                </button>
                <button onClick={() => setEditUser(null)} style={{ padding: "11px 20px", borderRadius: 11, background: "#f5ece0", color: "#6b4c35", fontWeight: 700, fontSize: "0.88rem", border: "1px solid rgba(139,94,60,0.18)", cursor: "pointer", fontFamily: "inherit" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;