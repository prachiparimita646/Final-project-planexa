// src/pages/public/About.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Target, Eye, Handshake, Lightbulb, ClipboardList,
  Users, CalendarCheck, Wand2, GlassWater, Calendar,
  Trophy, Smile, Quote, ChevronLeft, ChevronRight, ChevronRight as Arrow,
} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────
const processSteps = [
  { id: 1, icon: <Lightbulb size={28} />,      title: 'Discovery & Concept',   desc: 'We begin by understanding your vision, goals and requirements through detailed consultations.',     details: ['Initial consultation', 'Objective setting', 'Theme development', 'Budget planning']     },
  { id: 2, icon: <ClipboardList size={28} />,  title: 'Planning & Design',     desc: 'Our team creates a comprehensive event plan with detailed timelines and creative designs.',          details: ['Venue selection', 'Vendor coordination', 'Creative design', 'Timeline development']    },
  { id: 3, icon: <Users size={28} />,          title: 'Coordination',          desc: 'We coordinate all vendors, logistics and team members to ensure seamless execution.',               details: ['Vendor management', 'Guest list handling', 'Logistics planning', 'Team briefings']    },
  { id: 4, icon: <CalendarCheck size={28} />,  title: 'Preparation',           desc: 'Final preparations including rehearsals, technical setups and last-minute adjustments.',              details: ['Technical rehearsals', 'Final approvals', 'Emergency planning', 'Team coordination']  },
  { id: 5, icon: <Wand2 size={28} />,          title: 'Execution',             desc: 'Our team executes the event flawlessly, managing every detail in real-time.',                        details: ['On-site management', 'Guest experience', 'Problem solving', 'Quality control']         },
  { id: 6, icon: <GlassWater size={28} />,     title: 'Follow-up & Review',    desc: 'Post-event follow-up, feedback collection and performance analysis for continuous improvement.',     details: ['Guest feedback', 'Performance review', 'Media collection', 'Future planning']          },
];

const statsData = [
  { icon: <Calendar size={32} />,  value: 500,   suffix: '+', label: 'Events Organized',  color: '#8b5e3c' },
  { icon: <Users size={32} />,     value: 10000, suffix: '+', label: 'Happy Attendees',   color: '#4a6e5a' },
  { icon: <Trophy size={32} />,    value: 50,    suffix: '+', label: 'Awards Won',         color: '#6b4c35' },
  { icon: <Smile size={32} />,     value: 200,   suffix: '+', label: 'Satisfied Clients',  color: '#8b6a2a' },
];

const testimonials = [
  { id: 1, name: 'Jennifer Martinez', company: 'TechCorp International', role: 'Marketing Director', rating: 5, content: 'The team transformed our annual conference into an unforgettable experience. Their attention to detail and creative approach exceeded all expectations.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80' },
  { id: 2, name: 'Robert Johnson',    company: 'Global Finance Group',    role: 'CEO',                rating: 5, content: 'Our product launch was a massive success thanks to their exceptional planning and execution. They handled everything flawlessly.',                      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80' },
  { id: 3, name: 'Sophia Williams',   company: 'HealthFirst Org',         role: 'Event Coordinator',  rating: 5, content: 'Professional, creative, and reliable. They managed our charity gala with such grace and made the entire process completely stress-free.',           image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=80' },
  { id: 4, name: 'Michael Thompson',  company: 'Innovate Summit',         role: 'Conference Chair',   rating: 5, content: "The best event management team we've worked with. Their innovative ideas and flawless execution made our summit the talk of the industry.",         image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80' },
];

// ── CountUp hook ─────────────────────────────────────────────────────────
const CountUp = ({ target, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let v = 0;
        const step = target / 80;
        const t = setInterval(() => {
          v += step;
          if (v >= target) { setCount(target); clearInterval(t); }
          else setCount(Math.floor(v));
        }, 20);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// ── Main Component ────────────────────────────────────────────────────────
const About = () => {
  const [slide, setSlide] = useState(0);
  const revealRefs = useRef([]);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('ab-revealed'); });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);
  const addRef = el => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

  // Auto-slide
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", background: '#ecdcc8', color: '#6b4c35', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Jost:wght@300;400;500;600;700&display=swap');

        /* scroll reveal */
        .ab-reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .ab-reveal.ab-revealed { opacity: 1; transform: translateY(0); }
        .ab-reveal-l { opacity: 0; transform: translateX(-32px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .ab-reveal-l.ab-revealed { opacity: 1; transform: translateX(0); }
        .ab-reveal-r { opacity: 0; transform: translateX(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .ab-reveal-r.ab-revealed { opacity: 1; transform: translateX(0); }

        /* delays */
        .ab-d1 { transition-delay: 0.08s !important; }
        .ab-d2 { transition-delay: 0.16s !important; }
        .ab-d3 { transition-delay: 0.24s !important; }
        .ab-d4 { transition-delay: 0.32s !important; }

        /* hovers */
        .ab-mv-card:hover { transform: translateY(-8px) !important; box-shadow: 0 20px 48px rgba(139,94,60,0.18) !important; }
        .ab-step:hover { transform: scale(1.02); box-shadow: 0 16px 40px rgba(139,94,60,0.14) !important; }
        .ab-stat:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.25) !important; }
        .ab-tc:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(139,94,60,0.14) !important; }
        .ab-navbtn:hover { background: #8b5e3c !important; color: #fff !important; }

        /* slow zoom bg */
        @keyframes slowZoom { 0%{transform:scale(1)} 100%{transform:scale(1.12)} }
        @keyframes floatOrb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes fadeSlide { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        .ab-fade-slide { animation: fadeSlide 0.45s ease both; }
      `}</style>

      {/* ══ 1. HERO ══ */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'linear-gradient(135deg,#3d1f0a 0%,#2c1506 100%)', overflow: 'hidden' }}>
        {/* Parallax bg image */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2070&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.18, animation: 'slowZoom 22s infinite alternate', pointerEvents: 'none' }} />
        {/* Radial glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(196,148,90,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />
        {/* Orbs */}
        <div style={{ position: 'absolute', top: -80, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(196,148,90,0.06)', animation: 'floatOrb 9s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(139,94,60,0.07)', animation: 'floatOrb 11s ease-in-out infinite 2s', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 860, padding: '0 24px' }}>
          <p className="ab-reveal" ref={addRef} style={{ fontSize: '0.62rem', letterSpacing: '0.26em', fontWeight: 600, color: '#c4945a', textTransform: 'uppercase', marginBottom: 16 }}>✦ WHO WE ARE ✦</p>
          <h1 className="ab-reveal ab-d1" ref={addRef} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.6rem,7vw,4.6rem)', fontWeight: 700, color: '#f5ece0', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.02em' }}>
            Creating{' '}
            <em style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,#e8c98a,#c4945a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Unforgettable</em>
            <br />Experiences
          </h1>
          <p className="ab-reveal ab-d2" ref={addRef} style={{ fontSize: '1rem', color: 'rgba(245,236,224,0.72)', maxWidth: 620, margin: '0 auto 52px', lineHeight: 1.8, fontWeight: 300 }}>
            We are passionate event professionals dedicated to transforming your vision into reality. With years of experience and a creative approach, we ensure every event is truly memorable.
          </p>

          {/* Hero stats */}
          <div className="ab-reveal ab-d3" ref={addRef} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 18 }}>
            {[
              { num: '500+', label: 'Events Organized'   },
              { num: '98%',  label: 'Client Satisfaction' },
              { num: '50+',  label: 'Team Members'        },
              { num: '10+',  label: 'Years Experience'    },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(196,148,90,0.28)', borderRadius: 18, padding: '16px 26px', transition: 'all 0.25s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,148,90,0.22)'; e.currentTarget.style.borderColor = '#c4945a'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.35)'; e.currentTarget.style.borderColor = 'rgba(196,148,90,0.28)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.9rem', fontWeight: 700, color: '#c4945a', margin: 0, lineHeight: 1 }}>{s.num}</p>
                <p style={{ fontSize: '0.72rem', color: 'rgba(245,236,224,0.65)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '6px 0 0' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 2. MISSION / VISION ══ */}
      <section style={{ padding: '88px 24px', background: '#faf4ec' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p className="ab-reveal" ref={addRef} style={{ fontSize: '0.62rem', letterSpacing: '0.22em', fontWeight: 600, color: '#c4945a', textTransform: 'uppercase', textAlign: 'center', marginBottom: 10 }}>OUR PHILOSOPHY</p>
          <h2 className="ab-reveal ab-d1" ref={addRef} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.9rem,4vw,2.8rem)', fontWeight: 700, color: '#2c1a0e', textAlign: 'center', marginBottom: 10 }}>The Values That Drive Us</h2>
          <p className="ab-reveal ab-d2" ref={addRef} style={{ textAlign: 'center', color: '#a88972', fontSize: '0.94rem', marginBottom: 52 }}>The values and vision that guide everything we do</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24 }}>
            {[
              { icon: <Target size={32} />,    title: 'Our Mission', color: '#8b5e3c', desc: 'To deliver exceptional event experiences through innovation, attention to detail, and seamless execution. We strive to exceed expectations and create lasting memories.' },
              { icon: <Eye size={32} />,       title: 'Our Vision',  color: '#4a6e5a', desc: 'To be the leading event management company recognized globally for creativity, reliability, and transforming ordinary gatherings into extraordinary experiences.' },
              { icon: <Handshake size={32} />, title: 'Our Values',  color: '#6b4c35', desc: 'Integrity, creativity, collaboration and excellence guide everything we do. We believe in building lasting relationships based on trust and outstanding results.' },
            ].map((c, i) => (
              <div key={i} className={`ab-reveal ab-d${i + 1} ab-mv-card`} ref={addRef}
                style={{ background: '#fff', borderRadius: 24, padding: '36px 28px', textAlign: 'center', border: '1px solid rgba(139,94,60,0.1)', boxShadow: '0 4px 20px rgba(139,94,60,0.07)', transition: 'all 0.25s', cursor: 'default' }}>
                <div style={{ width: 68, height: 68, borderRadius: 20, background: `${c.color}14`, border: `1px solid ${c.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, margin: '0 auto 20px' }}>
                  {c.icon}
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 700, color: '#2c1a0e', marginBottom: 12 }}>{c.title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#6b4c35', lineHeight: 1.75 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. PROCESS TIMELINE ══ */}
      <section style={{ padding: '88px 24px', background: '#ecdcc8' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <p className="ab-reveal" ref={addRef} style={{ fontSize: '0.62rem', letterSpacing: '0.22em', fontWeight: 600, color: '#c4945a', textTransform: 'uppercase', textAlign: 'center', marginBottom: 10 }}>HOW WE WORK</p>
          <h2 className="ab-reveal ab-d1" ref={addRef} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.9rem,4vw,2.8rem)', fontWeight: 700, color: '#2c1a0e', textAlign: 'center', marginBottom: 10 }}>Our Event Process</h2>
          <p className="ab-reveal ab-d2" ref={addRef} style={{ textAlign: 'center', color: '#a88972', fontSize: '0.94rem', marginBottom: 56 }}>A structured approach to ensure every event is executed flawlessly</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 22 }}>
            {processSteps.map((step, i) => (
              <div key={step.id} className={`ab-reveal ab-d${(i % 3) + 1} ab-step`} ref={addRef}
                style={{ background: '#faf4ec', borderRadius: 20, padding: '28px 24px', border: '1px solid rgba(139,94,60,0.13)', boxShadow: '0 4px 16px rgba(139,94,60,0.07)', position: 'relative', transition: 'all 0.22s', cursor: 'default', overflow: 'hidden' }}>
                {/* Top accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#8b5e3c,#c4945a)' }} />
                {/* Step number */}
                <div style={{ position: 'absolute', top: 18, right: 18, width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#c4945a,#8b5e3c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.78rem' }}>
                  0{step.id}
                </div>
                <div style={{ color: '#8b5e3c', marginBottom: 14 }}>{step.icon}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', fontWeight: 700, color: '#2c1a0e', marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: '0.83rem', color: '#6b4c35', lineHeight: 1.7, marginBottom: 14 }}>{step.desc}</p>
                <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {step.details.map((d, j) => (
                    <li key={j} style={{ fontSize: '0.78rem', color: '#a88972' }}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. STATS ══ */}
      <section style={{ background: 'linear-gradient(135deg,#2c1506 0%,#3d1f0a 50%,#2c1506 100%)', padding: '88px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(196,148,90,0.10) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative' }}>
          <p className="ab-reveal" ref={addRef} style={{ fontSize: '0.62rem', letterSpacing: '0.22em', fontWeight: 600, color: '#c4945a', textTransform: 'uppercase', textAlign: 'center', marginBottom: 10 }}>BY THE NUMBERS</p>
          <h2 className="ab-reveal ab-d1" ref={addRef} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.9rem,4vw,2.8rem)', fontWeight: 700, color: '#f5ece0', textAlign: 'center', marginBottom: 52 }}>Our Track Record</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 22 }}>
            {statsData.map((s, i) => (
              <div key={i} className={`ab-reveal ab-d${i + 1} ab-stat`} ref={addRef}
                style={{ background: 'rgba(0,0,0,0.32)', border: '1px solid rgba(196,148,90,0.22)', borderRadius: 20, padding: '28px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12, transition: 'all 0.25s', cursor: 'default' }}>
                <div style={{ width: 58, height: 58, borderRadius: 16, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c4945a' }}>
                  {s.icon}
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.4rem', fontWeight: 700, color: '#f5ece0', lineHeight: 1, margin: 0 }}>
                  <CountUp target={s.value} suffix={s.suffix} />
                </p>
                <p style={{ fontSize: '0.72rem', color: 'rgba(245,236,224,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. TESTIMONIALS ══ */}
      <section style={{ padding: '88px 24px', background: '#faf4ec' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p className="ab-reveal" ref={addRef} style={{ fontSize: '0.62rem', letterSpacing: '0.22em', fontWeight: 600, color: '#c4945a', textTransform: 'uppercase', textAlign: 'center', marginBottom: 10 }}>CLIENT STORIES</p>
          <h2 className="ab-reveal ab-d1" ref={addRef} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.9rem,4vw,2.8rem)', fontWeight: 700, color: '#2c1a0e', textAlign: 'center', marginBottom: 10 }}>What Our Clients Say</h2>
          <p className="ab-reveal ab-d2" ref={addRef} style={{ textAlign: 'center', color: '#a88972', fontSize: '0.94rem', marginBottom: 52 }}>Don't just take our word for it — hear from our satisfied clients</p>

          {/* Desktop grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 22 }}>
            {testimonials.map((t, i) => (
              <div key={t.id} className={`ab-reveal ab-d${i + 1} ab-tc`} ref={addRef}
                style={{ background: '#fff', borderRadius: 22, padding: '28px', border: '1px solid rgba(139,94,60,0.10)', boxShadow: '0 4px 16px rgba(139,94,60,0.07)', transition: 'all 0.25s', cursor: 'default' }}>
                <Quote size={22} style={{ color: '#c4945a', opacity: 0.5, marginBottom: 14 }} />
                <p style={{ fontSize: '0.87rem', color: '#3d2a1a', lineHeight: 1.8, marginBottom: 18 }}>"{t.content}"</p>
                {/* Stars */}
                <div style={{ display: 'flex', gap: 3, marginBottom: 18 }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} style={{ color: j < t.rating ? '#c4945a' : '#dfc9af', fontSize: '0.9rem' }}>★</span>
                  ))}
                </div>
                {/* Client */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={t.image} alt={t.name} style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', border: '2px solid #c4945a', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#2c1a0e', margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: '0.74rem', color: '#a88972', margin: '2px 0 0' }}>{t.role} · {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. CTA ══ */}
      <section style={{ padding: '88px 24px', background: 'linear-gradient(135deg,#f5ece0,#ecdcc8)', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <p className="ab-reveal" ref={addRef} style={{ fontSize: '0.62rem', letterSpacing: '0.22em', fontWeight: 600, color: '#c4945a', textTransform: 'uppercase', marginBottom: 12 }}>LET'S WORK TOGETHER</p>
          <h2 className="ab-reveal ab-d1" ref={addRef} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.9rem,4vw,2.8rem)', fontWeight: 700, color: '#2c1a0e', marginBottom: 14, lineHeight: 1.2 }}>
            Ready to Create Something <em style={{ fontStyle: 'italic', color: '#8b5e3c' }}>Extraordinary?</em>
          </h2>
          <p className="ab-reveal ab-d2" ref={addRef} style={{ fontSize: '0.95rem', color: '#6b4c35', marginBottom: 36, lineHeight: 1.7 }}>
            Let's bring your vision to life with our expert event management team.
          </p>
          <div className="ab-reveal ab-d3" ref={addRef} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#c4945a,#8b5e3c)', color: '#fff', fontWeight: 700, fontSize: '0.92rem', padding: '13px 30px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 6px 22px rgba(139,94,60,0.32)', transition: 'all 0.18s', fontFamily: "'Jost', sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'none'; }}>
              Get In Touch <Arrow size={16} />
            </Link>
            <Link to="/events"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#8b5e3c', fontWeight: 700, fontSize: '0.92rem', padding: '13px 30px', borderRadius: 12, textDecoration: 'none', border: '1.5px solid rgba(139,94,60,0.35)', transition: 'all 0.18s', fontFamily: "'Jost', sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,94,60,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
              Browse Events
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;