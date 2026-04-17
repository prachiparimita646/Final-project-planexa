import { Link } from "react-router-dom";
import { MessageCircle, Mail, Phone, Check } from "lucide-react";
import { useState } from "react";

const CONTACT_EMAIL = "supportplanexa@gmail.com";
const CONTACT_PHONE = "+919876543210";
const WHATSAPP_NUMBER = "919800100001";

const Footer = () => {
  const [copiedField, setCopiedField] = useState(null);

  // Copy to clipboard with fallback support
  const copyToClipboard = async (text, field) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <footer
      style={{
        fontFamily: "'Jost', sans-serif",
        background: "#351a08",
        color: "#f5ece0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Jost:wght@300;400;500;600;700&display=swap');

        .ft-social { transition: all 0.18s; }
        .ft-social:hover { transform: translateY(-2px) scale(1.08) !important; }

        .ft-link { transition: color 0.15s; }
        .ft-link:hover { color: #e8c98a !important; }

        .ft-fb:hover {
          background: #e8c98a !important;
          color: #351a08 !important;
          border-color: #e8c98a !important;
        }

        .contact-item { cursor: pointer; transition: all 0.2s; }
        .contact-item:hover { opacity: 0.85; }

        .toast-copy {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: #e8c98a;
          color: #351a08;
          padding: 8px 16px;
          border-radius: 40px;
          font-size: 0.8rem;
          font-weight: 600;
          z-index: 9999;
          animation: fadeInUp 0.2s ease;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Toast notification */}
      {copiedField && (
        <div className="toast-copy">
          <Check size={14} />
          {copiedField === "email"
            ? "Email copied!"
            : "Phone number copied!"}
        </div>
      )}

      {/* Top gold accent */}
      <div
        style={{
          height: 2,
          background:
            "linear-gradient(90deg,#8b5e3c,#c4945a,#e8c98a,#c4945a,#8b5e3c)",
        }}
      />

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 32px" }}>
        {/* Main Row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 28,
            marginBottom: 22,
          }}
        >
          {/* Brand Section */}
          <div style={{ minWidth: 180 }}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.05rem",
                fontWeight: 700,
                margin: 0,
              }}
            >
              The Event Utsava
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.8rem",
                fontStyle: "italic",
                color: "#e8c98a",
                margin: "2px 0 10px",
              }}
            >
              by Planexa
            </p>
            <p
              style={{
                fontSize: "0.76rem",
                color: "rgba(245,236,224,0.55)",
                lineHeight: 1.7,
                maxWidth: 200,
              }}
            >
              India's premier event management platform.
            </p>

            {/* Social Icons */}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ft-social"
                style={socialStyle("#25D366")}
              >
                <MessageCircle size={15} />
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/planexa"
                target="_blank"
                rel="noopener noreferrer"
                className="ft-social"
                style={socialStyle("#1877F2")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/planexa"
                target="_blank"
                rel="noopener noreferrer"
                className="ft-social"
                style={socialStyle("#E1306C")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <FooterLinks
            title="Navigation"
            links={[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/events", label: "Events" },
              { to: "/contact", label: "Contact" },
            ]}
          />

          {/* Account */}
          <FooterLinks
            title="Account"
            links={[
              { to: "/login", label: "Login" },
              { to: "/register", label: "Register" },
              { to: "/my-bookings", label: "My Bookings" },
              { to: "/feedback", label: "Feedback" },
            ]}
          />

          {/* Contact Section */}
          <div>
            <SectionTitle title="Contact" />

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Email */}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="contact-item"
                onClick={() => copyToClipboard(CONTACT_EMAIL, "email")}
                style={contactItemStyle}
              >
                <IconBox>
                  {copiedField === "email" ? (
                    <Check size={13} />
                  ) : (
                    <Mail size={13} />
                  )}
                </IconBox>
                <span style={contactTextStyle}>{CONTACT_EMAIL}</span>
              </a>

              {/* Phone */}
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="contact-item"
                onClick={() => copyToClipboard(CONTACT_PHONE, "phone")}
                style={contactItemStyle}
              >
                <IconBox>
                  {copiedField === "phone" ? (
                    <Check size={13} />
                  ) : (
                    <Phone size={13} />
                  )}
                </IconBox>
                <span style={contactTextStyle}>{CONTACT_PHONE}</span>
              </a>
              
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(232,201,138,0.15)",
            marginBottom: 18,
          }}
        />

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <p style={{ fontSize: "0.72rem", color: "rgba(245,236,224,0.4)" }}>
            © 2026 The Event Utsava by Planexa. All rights reserved.
          </p>

          <Link to="/feedback" className="ft-fb" style={feedbackButtonStyle}>
            <MessageCircle size={13} /> Feedback
          </Link>

          <p
            style={{
              fontSize: "0.68rem",
              color: "rgba(232,201,138,0.6)",
              fontStyle: "italic",
            }}
          >
            "Craft moments that last forever"
          </p>
        </div>
      </div>
    </footer>
  );
};

/* ---------------- Helper Components & Styles ---------------- */

const SectionTitle = ({ title }) => (
  <p
    style={{
      fontSize: "0.6rem",
      letterSpacing: "0.16em",
      fontWeight: 700,
      color: "#e8c98a",
      textTransform: "uppercase",
      marginBottom: 14,
    }}
  >
    {title}
  </p>
);

const FooterLinks = ({ title, links }) => (
  <div>
    <SectionTitle title={title} />
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {links.map((link, index) => (
        <Link key={index} to={link.to} className="ft-link" style={footerLinkStyle}>
          <span style={dotStyle} />
          {link.label}
        </Link>
      ))}
    </div>
  </div>
);

const IconBox = ({ children }) => (
  <div
    style={{
      width: 28,
      height: 28,
      borderRadius: 8,
      background: "rgba(232,201,138,0.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#e8c98a",
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);

/* ---------------- Styles ---------------- */

const socialStyle = (color) => ({
  width: 32,
  height: 32,
  borderRadius: 9,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  background: `${color}20`,
  border: `1px solid ${color}50`,
  color,
});

const footerLinkStyle = {
  fontSize: "0.82rem",
  color: "rgba(245,236,224,0.55)",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const dotStyle = {
  width: 4,
  height: 4,
  borderRadius: "50%",
  background: "#e8c98a",
  display: "inline-block",
};

const contactItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  textDecoration: "none",
  cursor: "pointer",
};

const contactTextStyle = {
  fontSize: "0.78rem",
  color: "rgba(245,236,224,0.55)",
};

const feedbackButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  color: "#e8c98a",
  fontSize: "0.76rem",
  fontWeight: 600,
  textDecoration: "none",
  padding: "6px 14px",
  borderRadius: 8,
  border: "1px solid rgba(232,201,138,0.3)",
  background: "rgba(232,201,138,0.08)",
  transition: "all 0.18s",
};

export default Footer;