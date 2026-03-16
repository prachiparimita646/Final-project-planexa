import React from 'react';
// import { FaCalendarAlt, FaUsers, FaTrophy, FaSmile } from 'react-icons/fa';
import './StatsSection.css';

const StatsSection = () => {
  const stats = [
    // { icon: <FaCalendarAlt />, value: '500+', label: 'Events Organized' },
    // { icon: <FaUsers />, value: '10,000+', label: 'Happy Attendees' },
    // { icon: <FaTrophy />, value: '50+', label: 'Awards Won' },
    // { icon: <FaSmile />, value: '200+', label: 'Satisfied Clients' }
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-box">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;