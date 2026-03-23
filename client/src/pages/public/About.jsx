// src/pages/public/About.jsx
// All components merged: AboutHero + MissionVision + ProcessTimeline + StatsSection + Testimonials
// Single CSS file: About.css

import React, { useState, useEffect } from 'react';
import {
  FaBullseye, FaEye, FaHandshake,
  FaLightbulb, FaClipboardList, FaUsers,
  FaCalendarCheck, FaMagic, FaGlassCheers,
  FaCalendarAlt, FaTrophy, FaSmile,
  FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight,
} from 'react-icons/fa';
import './About.css';

// ══════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════

const processSteps = [
  {
    id: 1, icon: <FaLightbulb />, title: 'Discovery & Concept',
    description: 'We begin by understanding your vision, goals, and requirements through detailed consultations.',
    details: ['Initial consultation', 'Objective setting', 'Theme development', 'Budget planning'],
  },
  {
    id: 2, icon: <FaClipboardList />, title: 'Planning & Design',
    description: 'Our team creates a comprehensive event plan with detailed timelines and creative designs.',
    details: ['Venue selection', 'Vendor coordination', 'Creative design', 'Timeline development'],
  },
  {
    id: 3, icon: <FaUsers />, title: 'Coordination',
    description: 'We coordinate all vendors, logistics, and team members to ensure seamless execution.',
    details: ['Vendor management', 'Guest list handling', 'Logistics planning', 'Team briefings'],
  },
  {
    id: 4, icon: <FaCalendarCheck />, title: 'Preparation',
    description: 'Final preparations including rehearsals, technical setups, and last-minute adjustments.',
    details: ['Technical rehearsals', 'Final approvals', 'Emergency planning', 'Team coordination'],
  },
  {
    id: 5, icon: <FaMagic />, title: 'Execution',
    description: 'Our team executes the event flawlessly, managing every detail in real-time.',
    details: ['On-site management', 'Guest experience', 'Problem solving', 'Quality control'],
  },
  {
    id: 6, icon: <FaGlassCheers />, title: 'Follow-up & Review',
    description: 'Post-event follow-up, feedback collection, and performance analysis.',
    details: ['Guest feedback', 'Performance review', 'Media collection', 'Future planning'],
  },
];

const stats = [
  { icon: <FaCalendarAlt />, value: '500+',    label: 'Events Organized',  delay: 0 },
  { icon: <FaUsers />,       value: '10,000+', label: 'Happy Attendees',   delay: 1 },
  { icon: <FaTrophy />,      value: '50+',     label: 'Awards Won',        delay: 2 },
  { icon: <FaSmile />,       value: '200+',    label: 'Satisfied Clients', delay: 3 },
];

const testimonials = [
  {
    id: 1, name: 'Jennifer Martinez', company: 'TechCorp International', role: 'Marketing Director', rating: 5,
    content: 'The team transformed our annual conference into an unforgettable experience. Their attention to detail and creative approach exceeded all expectations.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 2, name: 'Robert Johnson', company: 'Global Finance Group', role: 'CEO', rating: 5,
    content: 'Our product launch was a massive success thanks to their exceptional planning and execution. They handled everything flawlessly.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 3, name: 'Sophia Williams', company: 'HealthFirst Org', role: 'Event Coordinator', rating: 5,
    content: 'Professional, creative, and reliable. They managed our charity gala with such grace and made the entire process stress-free.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 4, name: 'Michael Thompson', company: 'Innovate Summit', role: 'Conference Chair', rating: 5,
    content: "The best event management team we've worked with. Their innovative ideas and flawless execution made our summit the talk of the industry.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  },
];

// ══════════════════════════════════════════
//  ABOUT PAGE
// ══════════════════════════════════════════
const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transition = (cb) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    cb();
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const nextSlide = () => transition(() => setCurrentIndex(i => (i + 1) % testimonials.length));
  const prevSlide = () => transition(() => setCurrentIndex(i => i === 0 ? testimonials.length - 1 : i - 1));
  const goToSlide = (i) => { if (i !== currentIndex) transition(() => setCurrentIndex(i)); };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning]);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < rating ? 'star filled' : 'star'} />
    ));

  return (
    <div className="about">

      {/* ══ 1. HERO ══ */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>Creating Unforgettable Experiences</h1>
          <p className="hero-subtitle">
            We are passionate event professionals dedicated to transforming your vision into reality.
            With years of experience and a creative approach, we ensure every event is memorable.
          </p>
          <div className="hero-stats">
            {[
              { num: '500+', label: 'Events Organized'  },
              { num: '98%',  label: 'Client Satisfaction'},
              { num: '50+',  label: 'Team Members'       },
              { num: '10+',  label: 'Years Experience'   },
            ].map((s, i) => (
              <div key={i} className="stat-item">
                <h3>{s.num}</h3>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 2. MISSION / VISION ══ */}
      <section className="mission-vision">
        <div className="container">
          <h2 className="section-title">Our Philosophy</h2>
          <p className="section-subtitle">The values and vision that drive everything we do</p>
          <div className="cards-container">
            <div className="card">
              <div className="card-icon"><FaBullseye /></div>
              <h3>Our Mission</h3>
              <p>To deliver exceptional event experiences through innovation, attention to detail, and seamless execution. We strive to exceed expectations and create lasting memories.</p>
            </div>
            <div className="card">
              <div className="card-icon"><FaEye /></div>
              <h3>Our Vision</h3>
              <p>To be the leading event management company recognized globally for creativity, reliability, and transforming ordinary gatherings into extraordinary experiences.</p>
            </div>
            <div className="card">
              <div className="card-icon"><FaHandshake /></div>
              <h3>Our Values</h3>
              <p>Integrity, creativity, collaboration, and excellence guide everything we do. We believe in building lasting relationships based on trust and outstanding results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. PROCESS TIMELINE ══ */}
      <section className="process-section">
        <div className="container">
          <h2 className="section-title">Our Event Process</h2>
          <p className="section-subtitle">A structured approach to ensure every event is executed flawlessly</p>

          {/* Desktop */}
          <div className="process-timeline">
            {processSteps.map((step, index) => (
              <div key={step.id} className={`process-step ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="step-content">
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-number">0{step.id}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                  <div className="step-details">
                    <h4>Key Activities:</h4>
                    <ul>{step.details.map((d, i) => <li key={i}>{d}</li>)}</ul>
                  </div>
                </div>
              </div>
            ))}
            <div className="timeline-line" />
          </div>

          {/* Mobile */}
          <div className="process-timeline-mobile">
            {processSteps.map(step => (
              <div key={step.id} className="process-step-mobile">
                <div className="step-icon-mobile">{step.icon}</div>
                <div className="step-content-mobile">
                  <div className="step-header">
                    <div className="step-number-mobile">0{step.id}</div>
                    <h3 className="step-title-mobile">{step.title}</h3>
                  </div>
                  <p className="step-description-mobile">{step.description}</p>
                  <div className="step-details-mobile">
                    <h4>Key Activities:</h4>
                    <ul>{step.details.map((d, i) => <li key={i}>{d}</li>)}</ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. STATS ══ */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-box" style={{ '--delay': s.delay }}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-content">
                  <h3>{s.value}</h3>
                  <p>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. TESTIMONIALS ══ */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">Don't just take our word for it — hear from our satisfied clients</p>

          {/* Slider (mobile) */}
          <div className="testimonials-container">
            <button className="nav-button prev-button" onClick={prevSlide} aria-label="Previous">
              <FaChevronLeft />
            </button>
            <div className="testimonials-slider">
              <div className={`testimonial-card ${isTransitioning ? 'transitioning' : ''}`} key={currentIndex}>
                <div className="quote-icon"><FaQuoteLeft /></div>
                <p className="testimonial-text">"{testimonials[currentIndex].content}"</p>
                <div className="rating">{renderStars(testimonials[currentIndex].rating)}</div>
                <div className="client-info">
                  <div className="client-image">
                    <img src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} />
                  </div>
                  <div className="client-details">
                    <h4>{testimonials[currentIndex].name}</h4>
                    <p className="client-company">{testimonials[currentIndex].company}</p>
                    <p className="client-role">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </div>
            </div>
            <button className="nav-button next-button" onClick={nextSlide} aria-label="Next">
              <FaChevronRight />
            </button>
          </div>

          {/* Dots */}
          <div className="dots-container">
            {testimonials.map((_, i) => (
              <button key={i} className={`dot ${i === currentIndex ? 'active' : ''}`} onClick={() => goToSlide(i)} />
            ))}
          </div>

          {/* Grid (desktop) */}
          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t.id} className="testimonial-grid-card">
                <div className="quote-icon-small"><FaQuoteLeft /></div>
                <p className="testimonial-grid-text">"{t.content}"</p>
                <div className="rating">{renderStars(t.rating)}</div>
                <div className="client-info-grid">
                  <div className="client-image-small">
                    <img src={t.image} alt={t.name} />
                  </div>
                  <div className="client-details-grid">
                    <h5>{t.name}</h5>
                    <p>{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. CTA ══ */}
      <section className="cta-section">
        <h2>Ready to Create Something Extraordinary?</h2>
        <p>Let's bring your vision to life with our expert event management team.</p>
        <button className="cta-button" onClick={() => window.location.href = '/contact'}>
          Get In Touch
        </button>
      </section>

    </div>
  );
};

export default About;