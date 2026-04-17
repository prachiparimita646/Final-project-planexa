import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Mail,
  Shield,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Camera,
} from "lucide-react";

const BG = "#ecdcc8"; // Updated background color
const CARD = "#eddfc8";
const BORDER = "rgba(139,94,60,0.15)";
const SHADOW = "0 10px 30px rgba(139,94,60,0.15)";
const ACCENT = "#8b5e3c";
const TEXT = "#2c1a0e";

const Profile = () => {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    password: "********", // Placeholder for display
  });

  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // Handle save profile (API integration can be added here)
  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  const roleStyles =
    user?.role === "admin"
      ? { bg: "#f6dddd", color: "#8b3a2a", label: "Administrator" }
      : { bg: "#dfeee6", color: "#1a7a4a", label: "User" };

  return (
    <div
      style={{
        fontFamily: "'Jost', sans-serif",
        backgroundColor: BG,
        minHeight: "100vh",
        padding: "40px 20px",
        color: TEXT,
      }}
    >
      {/* Google Fonts & Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Jost:wght@400;500;600;700&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-card {
          animation: fadeUp 0.5s ease;
        }

        .btn-hover:hover {
          transform: scale(1.05);
          transition: all 0.2s ease;
        }
      `}</style>

      <div
        className="profile-card"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: CARD,
          borderRadius: "22px",
          border: `1px solid ${BORDER}`,
          boxShadow: SHADOW,
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            background: `linear-gradient(135deg, ${ACCENT}, #c4945a)`,
            padding: "32px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          {/* Avatar */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: 700,
                color: ACCENT,
                overflow: "hidden",
              }}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                getInitials(formData.name)
              )}
            </div>

            {/* Upload Button */}
            <label
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                background: ACCENT,
                borderRadius: "50%",
                padding: 6,
                cursor: "pointer",
              }}
            >
              <Camera size={16} color="#fff" />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </label>
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2rem",
              marginTop: 12,
            }}
          >
            {formData.name}
          </h2>
          <p style={{ opacity: 0.9 }}>{user?.email}</p>

          {/* Role Badge */}
          <span
            style={{
              background: roleStyles.bg,
              color: roleStyles.color,
              padding: "4px 12px",
              borderRadius: 999,
              fontSize: "0.75rem",
              fontWeight: 700,
              marginTop: 8,
              display: "inline-block",
            }}
          >
            {roleStyles.label}
          </span>
        </div>

        {/* Profile Details */}
        <div style={{ padding: 24 }}>
          {/* Header with Edit Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h3 style={{ fontWeight: 700, color: TEXT }}>
              Personal Information
            </h3>
            {isEditing ? (
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleSaveProfile}
                  className="btn-hover"
                  style={primaryBtn}
                >
                  <Save size={16} /> Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-hover"
                  style={secondaryBtn}
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-hover"
                style={primaryBtn}
              >
                <Edit3 size={16} /> Edit
              </button>
            )}
          </div>

          {/* Name */}
          <div style={fieldWrapper}>
            <User size={16} />
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                style={inputStyle}
              />
            ) : (
              <span>{formData.name}</span>
            )}
          </div>

          {/* Email */}
          <div style={fieldWrapper}>
            <Mail size={16} />
            <span>{user?.email}</span>
          </div>

          {/* Password with Show/Hide */}
          <div style={fieldWrapper}>
            <Shield size={16} />
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              readOnly
              style={inputStyle}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={iconBtn}
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Reusable Styles */
const fieldWrapper = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "#f8f1e6",
  padding: "10px 14px",
  borderRadius: 10,
  marginTop: 10,
};

const inputStyle = {
  flex: 1,
  border: "none",
  background: "transparent",
  outline: "none",
  fontSize: "0.9rem",
  color: "#2c1a0e",
};

const primaryBtn = {
  background: "linear-gradient(135deg,#c4945a,#8b5e3c)",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const secondaryBtn = {
  background: "#f0e3d0",
  color: "#6b4c35",
  border: "none",
  padding: "10px 16px",
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const iconBtn = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#8b5e3c",
};

export default Profile;