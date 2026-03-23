// src/pages/public/Home.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import herovideo from "../../public/herovideo.mp4";
import {
  Calendar, MapPin, Ticket, Users,
  ChevronRight, MessageCircle, Smartphone,
  Gift, Clock, Award, CreditCard, ThumbsUp,
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();

  const featuredEvents = [
    { id: 1, name: "Rock Concert 2025",  date: "June 15, 2025",      location: "Madison Square Garden, NY", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80", price: "₹490",  tag: "Music"    },
    { id: 2, name: "Tech Conference",    date: "July 10–12, 2025",   location: "Moscone Center, SF",        image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80", price: "₹2990", tag: "Tech"     },
    { id: 3, name: "Food Festival",      date: "August 5, 2025",     location: "Grant Park, Chicago",       image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80", price: "₹250",  tag: "Food"     },
    { id: 4, name: "Annual Summit",      date: "September 20, 2025", location: "JW Marriott, LA",           image: "https://plus.unsplash.com/premium_photo-1724753995771-8ee6954e78da?auto=format&fit=crop&w=800&q=60", price: "₹790",  tag: "Business" },
    { id: 5, name: "Birthday Bash",      date: "September 20, 2025", location: "The Ritz Carlton, LA",      image: "https://images.unsplash.com/photo-1741969494307-55394e3e4071?auto=format&fit=crop&w=800&q=60", price: "₹350",  tag: "Party"    },
    { id: 6, name: "Beach Party",        date: "September 20, 2025", location: "Malibu Beach, CA",          image: "https://images.unsplash.com/photo-1560359614-870d1a7ea91d?auto=format&fit=crop&w=800&q=60", price: "₹450",  tag: "Party"    },
    { id: 7, name: "Comedy Night",       date: "September 20, 2025", location: "Laugh Factory, LA",         image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=800&q=80", price: "₹390",  tag: "Comedy"   },
    { id: 8, name: "Winter Gala 2025",   date: "December 10, 2025",  location: "Grand Hyatt, NYC",          image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80", price: "₹1500", tag: "Gala"     },
  ];

  const moreFeatures = [
    { icon: <Smartphone size={24} />, title: "Mobile App",      desc: "Book events on the go with our iOS and Android apps."     },
    { icon: <Gift size={24} />,       title: "Rewards Program", desc: "Earn points with every booking and redeem for discounts."  },
    { icon: <Clock size={24} />,      title: "24/7 Support",    desc: "Our customer support team is always here to help you."     },
    { icon: <Award size={24} />,      title: "Verified Events", desc: "All events are vetted to ensure quality and authenticity." },
    { icon: <CreditCard size={24} />, title: "Secure Payments", desc: "Multiple payment options with bank-level security."        },
    { icon: <ThumbsUp size={24} />,   title: "Easy Refunds",    desc: "Hassle-free cancellation and refund policy."               },
  ];

  return (
    <div className="h-root">

      {/* ══ HERO ══ */}
      <section className="h-hero">
        <video className="h-video" src={herovideo} autoPlay loop muted playsInline />
        <div className="h-overlay" />
        <div className="h-bottom-fade" />

        <div className="h-logo-wrap">
          <img src={logo} alt="The Event Utsava by Planexa" className="h-logo" />
        </div>

        <div className="h-hero-content">
          <span className="h-eyepill">✦ India's Premier Event Platform</span>
          <h1 className="h-h1">
            Craft Moments That<br />
            <em className="h-h1-em">Last Forever</em>
          </h1>
          <p className="h-hero-sub">
            Concerts, galas, weddings, conferences and more —
            curated experiences worth every memory.
          </p>
          <div className="h-cta-row">
            {user ? (
              <>
                <Link to="/events"      className="h-btn-primary">Explore Events <ChevronRight size={16} /></Link>
                <Link to="/my-bookings" className="h-btn-outline">My Bookings</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="h-btn-primary">Get Started <ChevronRight size={16} /></Link>
                <Link to="/events"   className="h-btn-outline">Browse Events</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ══ BODY ══ */}
      <main className="h-body">

        {/* Stats */}
        <div className="h-stats">
          {[
            { num: "50K+", label: "Events Hosted"   },
            { num: "1M+",  label: "Happy Attendees" },
            { num: "100%", label: "Secure Booking"  },
            { num: "200+", label: "Cities Covered"  },
          ].map((s, i) => (
            <div key={i} className="h-stat">
              <span className="h-stat-num">{s.num}</span>
              <span className="h-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Features */}
        <section className="h-section">
          <p className="h-kicker">WHAT WE OFFER</p>
          <h2 className="h-heading">Everything You Need</h2>
          <div className="h-grid4">
            {[
              { icon: <Calendar size={26} />, title: "Upcoming Events",    desc: "Discover events happening near you." },
              { icon: <Ticket size={26} />,   title: "Easy Booking",       desc: "Book your tickets in just a few clicks." },
              { icon: <Users size={26} />,    title: "Seat Availability",  desc: "Real-time seat availability updates." },
              { icon: <MapPin size={26} />,   title: "Multiple Locations", desc: "Events across cities & venues." },
            ].map((f, i) => (
              <div key={i} className="h-feat-card">
                <div className="h-feat-icon">{f.icon}</div>
                <h3 className="h-feat-title">{f.title}</h3>
                <p className="h-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Events */}
        <section className="h-section" style={{ paddingTop: 0 }}>
          <div className="h-ev-header">
            <div>
              <p className="h-kicker">HANDPICKED FOR YOU</p>
              <h2 className="h-heading" style={{ marginBottom: 0 }}>Our Events</h2>
            </div>
            <Link to="/events" className="h-viewall">View All <ChevronRight size={14} /></Link>
          </div>
          <div className="h-ev-grid">
            {featuredEvents.map(ev => (
              <div key={ev.id} className="h-ev-card">
                <div className="h-ev-imgwrap">
                  <img src={ev.image} alt={ev.name} className="h-ev-img" />
                  <span className="h-ev-tag">{ev.tag}</span>
                </div>
                <div className="h-ev-body">
                  <h3 className="h-ev-name">{ev.name}</h3>
                  <p className="h-ev-meta"><Calendar size={11} /> {ev.date}</p>
                  <p className="h-ev-meta"><MapPin size={11} /> {ev.location}</p>
                  <div className="h-ev-footer">
                    <span className="h-ev-price">{ev.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* More Features */}
        <section className="h-features-band">
          <div className="h-section" style={{ background: "transparent" }}>
            <p className="h-kicker" style={{ textAlign: "center" }}>BUILT FOR YOU</p>
            <h2 className="h-heading" style={{ textAlign: "center" }}>More Amazing Features</h2>
            <div className="h-grid3">
              {moreFeatures.map((f, i) => (
                <div key={i} className="h-more-card">
                  <div className="h-more-icon">{f.icon}</div>
                  <h3 className="h-more-title">{f.title}</h3>
                  <p className="h-more-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="h-section h-how">
          <p className="h-kicker" style={{ textAlign: "center" }}>SIMPLE STEPS</p>
          <h2 className="h-heading" style={{ textAlign: "center" }}>How It Works</h2>
          <div className="h-grid3">
            {[
              { n: "01", title: "Explore Events",  desc: "Browse concerts, seminars, workshops and more." },
              { n: "02", title: "Book Your Seat",  desc: "Select seats and confirm your booking instantly." },
              { n: "03", title: "Enjoy the Event", desc: "Show your confirmation and enjoy the experience." },
            ].map((s, i) => (
              <div key={i} className="h-how-card">
                <span className="h-how-num">{s.n}</span>
                <h3 className="h-how-title">{s.title}</h3>
                <p className="h-how-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="h-cta">
          <div className="h-cta-inner">
            <p className="h-kicker" style={{ color: "rgba(255,255,255,0.55)" }}>JOIN US</p>
            <h2 className="h-cta-title">Ready to Experience<br />Something Extraordinary?</h2>
            <p className="h-cta-sub">Join over a million attendees who trust Planexa for their event bookings.</p>
            <Link to="/register" className="h-btn-light">Start Exploring <ChevronRight size={16} /></Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="h-footer">
          <div className="h-footer-left">
            <p className="h-footer-brand">The Event Utsava by Planexa</p>
            <p className="h-footer-copy">© 2026 All rights reserved.</p>
          </div>
          <div className="h-footer-social">
            <a href="https://wa.me/919800100001" target="_blank" rel="noopener noreferrer" className="h-social-btn h-social-wa" title="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <a href="https://facebook.com/planexa" target="_blank" rel="noopener noreferrer" className="h-social-btn h-social-fb" title="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://instagram.com/planexa" target="_blank" rel="noopener noreferrer" className="h-social-btn h-social-ig" title="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
          <Link to="/feedback" className="h-footer-link">
            <MessageCircle size={15} /> Feedback
          </Link>
        </footer>
      </main>

      {/* ══ ALL STYLES ══ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Jost:wght@300;400;500;600&display=swap');

        /* ── Nude palette variables ── */
        :root {
          --n-bg:     #ecdcc8;
          --n-bg2:    #e2d0bc;
          --n-bg3:    #d6bfaa;
          --n-card:   #f5ece0;
          --n-accent: #8b5e3c;
          --n-gold:   #c4945a;
          --n-light:  #dfc9af;
          --n-head:   #2c1a0e;
          --n-body:   #6b4c35;
          --n-mute:   #a88972;
          --n-border: rgba(139,94,60,0.15);
          --n-shadow: rgba(139,94,60,0.10);
          --r:        18px;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── ROOT — nude throughout ── */
        .h-root {
          font-family: 'Jost', sans-serif;
          background: var(--n-bg);
          color: var(--n-body);
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .h-hero {
          position: relative;
          height: 92vh; min-height: 580px;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .h-video {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
        }
        .h-overlay {
          position: absolute; inset: 0;
          background: rgba(20,10,5,0.52);
          pointer-events: none;
        }
        .h-bottom-fade {
          position: absolute; bottom: 0; left: 0; right: 0; height: 380px;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(236,220,200,0.15) 30%,
            rgba(236,220,200,0.55) 55%,
            rgba(236,220,200,0.88) 75%,
            rgba(236,220,200,1.00) 100%
          );
          pointer-events: none; z-index: 2;
        }

        /* ── LOGO ── */
        .h-logo-wrap {
          position: absolute; top: 3px; left: 50%;
          transform: translateX(-50%); z-index: 30;
          filter: drop-shadow(0 2px 18px rgba(0,0,0,0.55))
                  drop-shadow(0 0 30px rgba(196,148,90,0.3));
        }
        .h-logo { height: 200px; width: auto; display: block; }
        @media(max-width:640px) { .h-logo { height: 110px; } }

        /* ── HERO CONTENT ── */
        .h-hero-content {
          position: relative; z-index: 10;
          max-width: 780px; width: 92%;
          text-align: center; margin-top: 90px;
          animation: hFadeUp 1s ease both;
        }
        @keyframes hFadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .h-eyepill {
          display: inline-block;
          background: rgba(196,148,90,0.22);
          border: 1px solid rgba(196,148,90,0.45);
          color: #e8c98a;
          font-size: 0.65rem; letter-spacing: 0.2em; font-weight: 600;
          text-transform: uppercase; padding: 5px 18px; border-radius: 999px;
          margin-bottom: 20px;
        }
        .h-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem,6vw,4.2rem);
          font-weight: 700; line-height: 1.1; color: #fff;
          text-shadow: 0 2px 24px rgba(0,0,0,0.5);
          margin-bottom: 18px; letter-spacing: -0.01em;
        }
        .h-h1-em {
          font-style: italic;
          background: linear-gradient(90deg,#e8c98a,#c4945a);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .h-hero-sub {
          font-size: 1rem; font-weight: 300;
          color: rgba(255,255,255,0.85); line-height: 1.75;
          max-width: 520px; margin: 0 auto 32px;
          text-shadow: 0 1px 10px rgba(0,0,0,0.4);
          animation: hFadeUp 1s 0.2s ease both;
        }
        .h-cta-row {
          display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;
          animation: hFadeUp 1s 0.4s ease both;
        }

        /* ── BUTTONS ── */
        .h-btn-primary {
          display: inline-flex; align-items: center; gap: 7px;
          background: linear-gradient(135deg,#c4945a,#8b5e3c);
          color: #fff; font-weight: 600; font-size: 0.9rem;
          padding: 13px 28px; border-radius: 12px;
          text-decoration: none; border: none; cursor: pointer;
          box-shadow: 0 6px 22px rgba(139,94,60,0.35);
          transition: transform 0.18s, box-shadow 0.18s, filter 0.18s;
          font-family: 'Jost', sans-serif;
        }
        .h-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(139,94,60,0.45); filter: brightness(1.08); }
        .h-btn-outline {
          display: inline-flex; align-items: center;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.5);
          color: #fff; font-weight: 600; font-size: 0.9rem;
          padding: 13px 28px; border-radius: 12px;
          text-decoration: none; transition: background 0.18s;
          font-family: 'Jost', sans-serif;
        }
        .h-btn-outline:hover { background: rgba(255,255,255,0.28); }

        /* ── BODY — nude base ── */
        .h-body { background: var(--n-bg); }

        /* ── STATS — float over hero, nude card ── */
        .h-stats {
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 18px; max-width: 1100px;
          margin: -56px auto 0; padding: 0 24px;
          position: relative; z-index: 20;
        }
        .h-stat {
          background: var(--n-card);
          border: 1px solid var(--n-border); border-radius: 16px;
          display: flex; flex-direction: column; align-items: center;
          padding: 28px 16px; text-align: center;
          box-shadow: 0 8px 28px var(--n-shadow);
          position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .h-stat::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg,var(--n-accent),var(--n-gold));
        }
        .h-stat:hover { transform: translateY(-4px); box-shadow: 0 14px 36px var(--n-shadow); }
        .h-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem; font-weight: 700; line-height: 1;
          background: linear-gradient(135deg,var(--n-accent),var(--n-gold));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .h-stat-label {
          font-size: 0.68rem; color: var(--n-mute);
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-top: 7px; font-weight: 500;
        }
        @media(max-width:768px) { .h-stats { grid-template-columns: repeat(2,1fr); margin-top: -20px; } }

        /* ── SECTIONS — all nude bg ── */
        .h-section { max-width: 1100px; margin: 0 auto; padding: 80px 24px; background: var(--n-bg); }
        .h-kicker {
          font-size: 0.62rem; letter-spacing: 0.22em; font-weight: 600;
          color: var(--n-gold); text-transform: uppercase; margin-bottom: 8px;
        }
        .h-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem,3.5vw,2.6rem); font-weight: 700;
          color: var(--n-head); margin-bottom: 48px; line-height: 1.15;
        }

        /* ── FEATURE CARDS ── */
        .h-grid4 { display: grid; grid-template-columns: repeat(auto-fit,minmax(210px,1fr)); gap: 18px; }
        .h-feat-card {
          background: var(--n-card); border: 1px solid var(--n-border);
          border-radius: var(--r); padding: 30px 22px;
          position: relative; overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .h-feat-card::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg,var(--n-accent),var(--n-gold));
          transform: scaleX(0); transition: transform 0.28s; transform-origin: left;
        }
        .h-feat-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px var(--n-shadow); }
        .h-feat-card:hover::after { transform: scaleX(1); }
        .h-feat-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: linear-gradient(135deg,#ede0d0,#dfc9af);
          display: flex; align-items: center; justify-content: center;
          color: var(--n-accent); margin-bottom: 14px;
        }
        .h-feat-title { font-size: 0.95rem; font-weight: 600; color: var(--n-head); margin-bottom: 6px; }
        .h-feat-desc  { font-size: 0.82rem; color: var(--n-body); line-height: 1.65; }

        /* ── EVENTS ── */
        .h-ev-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 36px; flex-wrap: wrap; gap: 10px;
        }
        .h-viewall {
          display: inline-flex; align-items: center; gap: 4px;
          color: var(--n-accent); font-weight: 600; font-size: 0.86rem;
          text-decoration: none; transition: color 0.18s;
        }
        .h-viewall:hover { color: var(--n-gold); }
        .h-ev-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(230px,1fr)); gap: 20px; }
        .h-ev-card {
          background: var(--n-card); border: 1px solid var(--n-border);
          border-radius: var(--r); overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .h-ev-card:hover { transform: translateY(-5px); box-shadow: 0 14px 36px var(--n-shadow); }
        .h-ev-imgwrap { position: relative; overflow: hidden; height: 172px; }
        .h-ev-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
        .h-ev-card:hover .h-ev-img { transform: scale(1.07); }
        .h-ev-tag {
          position: absolute; top: 10px; left: 10px;
          background: rgba(245,236,224,0.93);
          color: var(--n-accent); font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 3px 10px; border-radius: 999px;
          border: 1px solid var(--n-border);
        }
        .h-ev-body { padding: 16px 18px 18px; background: var(--n-card); }
        .h-ev-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem; font-weight: 700;
          color: var(--n-head); margin-bottom: 8px; line-height: 1.3;
        }
        .h-ev-meta {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.74rem; color: var(--n-mute); margin-bottom: 3px;
        }
        .h-ev-footer { display: flex; align-items: center; margin-top: 12px; }
        .h-ev-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem; font-weight: 700; color: var(--n-accent);
        }

        /* ── MORE FEATURES — slightly deeper nude bg ── */
        .h-features-band { background: var(--n-bg2); }
        .h-grid3 { display: grid; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); gap: 18px; }
        .h-more-card {
          background: var(--n-card); border: 1px solid var(--n-border);
          border-radius: var(--r); padding: 28px 22px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .h-more-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px var(--n-shadow); }
        .h-more-icon {
          width: 46px; height: 46px; border-radius: 11px;
          background: linear-gradient(135deg,#ede0d0,#dfc9af);
          display: flex; align-items: center; justify-content: center;
          color: var(--n-accent); margin-bottom: 14px;
        }
        .h-more-title { font-size: 0.94rem; font-weight: 600; color: var(--n-head); margin-bottom: 6px; }
        .h-more-desc  { font-size: 0.82rem; color: var(--n-body); line-height: 1.65; }

        /* ── HOW IT WORKS — base nude ── */
        .h-how { background: var(--n-bg); }
        .h-how .h-grid3 { text-align: center; }
        .h-how-card {
          background: var(--n-card); border: 1px solid var(--n-border);
          border-radius: var(--r); padding: 40px 24px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .h-how-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px var(--n-shadow); }
        .h-how-num {
          display: block; font-family: 'Cormorant Garamond', serif;
          font-size: 3rem; font-weight: 700; color: var(--n-light);
          line-height: 1; margin-bottom: 12px;
        }
        .h-how-title { font-size: 1rem; font-weight: 600; color: var(--n-head); margin-bottom: 8px; }
        .h-how-desc  { font-size: 0.82rem; color: var(--n-body); line-height: 1.65; }

        /* ── CTA BANNER — deep espresso contrast ── */
        .h-cta {
          background: linear-gradient(135deg,#3d1f0a 0%,#2c1506 50%,#3d1f0a 100%);
          padding: 96px 24px; position: relative; overflow: hidden;
        }
        .h-cta::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 30% 50%,rgba(196,148,90,0.12) 0%,transparent 60%),
                      radial-gradient(ellipse at 70% 50%,rgba(139,94,60,0.10) 0%,transparent 60%);
          pointer-events: none;
        }
        .h-cta-inner { max-width: 640px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
        .h-cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem,4vw,2.8rem); font-weight: 700;
          color: #f5ece0; margin-bottom: 16px; line-height: 1.2;
        }
        .h-cta-sub { font-size: 0.95rem; color: rgba(245,236,224,0.65); margin-bottom: 36px; font-weight: 300; }
        .h-btn-light {
          display: inline-flex; align-items: center; gap: 7px;
          background: linear-gradient(135deg,#c4945a,#8b5e3c);
          color: #fff; font-weight: 600; font-size: 0.9rem;
          padding: 13px 30px; border-radius: 12px; text-decoration: none;
          box-shadow: 0 6px 22px rgba(196,148,90,0.35);
          transition: transform 0.18s, box-shadow 0.18s;
          font-family: 'Jost', sans-serif;
        }
        .h-btn-light:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(196,148,90,0.45); }

        /* ── FOOTER — deepest nude ── */
        .h-footer {
          background: var(--n-bg2);
          border-top: 1px solid var(--n-border);
          padding: 28px 32px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
        }
        .h-footer-left { display: flex; flex-direction: column; gap: 3px; }
        .h-footer-brand { font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; font-weight: 700; color: var(--n-head); }
        .h-footer-copy  { font-size: 0.74rem; color: var(--n-mute); }
        .h-footer-social { display: flex; gap: 10px; align-items: center; }
        .h-social-btn {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; border: 1px solid var(--n-border);
          transition: transform 0.18s, background 0.18s, color 0.18s, box-shadow 0.18s;
        }
        .h-social-btn:hover { transform: translateY(-3px); box-shadow: 0 6px 16px var(--n-shadow); }
        .h-social-wa { background: #e8f5e9; color: #25D366; }
        .h-social-wa:hover { background: #25D366; color: #fff; }
        .h-social-fb { background: #e8f0fe; color: #1877F2; }
        .h-social-fb:hover { background: #1877F2; color: #fff; }
        .h-social-ig { background: #fce4ec; color: #E1306C; }
        .h-social-ig:hover { background: linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045); color: #fff; }
        .h-footer-link {
          display: inline-flex; align-items: center; gap: 6px;
          color: var(--n-accent); font-size: 0.84rem; font-weight: 600;
          text-decoration: none; padding: 8px 18px; border-radius: 9px;
          border: 1px solid var(--n-border);
          background: rgba(139,94,60,0.06);
          transition: background 0.18s, color 0.18s, transform 0.18s;
        }
        .h-footer-link:hover { background: var(--n-accent); color: #fff; transform: translateY(-1px); }
      `}</style>
    </div>
  );
};

export default Home;