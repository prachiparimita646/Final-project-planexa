import React from 'react';
import './AboutHero.css';

const AboutHero = () => {
  return (
    <section className="about-hero">
      <div className="hero-content">
        <h1>Creating Unforgettable Experiences</h1>
        <p className="hero-subtitle">
          We are passionate event professionals dedicated to transforming your vision into reality. 
          With years of experience and a creative approach, we ensure every event is memorable.
        </p>
        <div className="hero-stats">
          <div className="stat-item">
            <h3>500+</h3>
            <p>Events Organized</p>
          </div>
          <div className="stat-item">
            <h3>98%</h3>
            <p>Client Satisfaction</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Team Members</p>
          </div>
          <div className="stat-item">
            <h3>10+</h3>
            <p>Years Experience</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;