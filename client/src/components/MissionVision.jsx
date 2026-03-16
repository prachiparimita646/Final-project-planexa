import React from 'react';

import './MissionVision.css';

const MissionVision = () => {
  return (
    <section className="mission-vision">
      <div className="container">
        <h2 className="section-title">Our Philosophy</h2>
        
        <div className="cards-container">
          <div className="card">
            <div className="card-icon">
              {/* <FaBullseye /> */}
            </div>
            <h3>Our Mission</h3>
            <p>
              To deliver exceptional event experiences through innovation, 
              attention to detail, and seamless execution. We strive to exceed 
              expectations and create lasting memories.
            </p>
          </div>
          
          <div className="card">
            <div className="card-icon">
              {/* <FaEye /> */}
            </div>
            <h3>Our Vision</h3>
            <p>
              To be the leading event management company recognized globally 
              for creativity, reliability, and transforming ordinary gatherings 
              into extraordinary experiences.
            </p>
          </div>
          
          <div className="card">
            <div className="card-icon">
              {/* <FaHandshake /> */}
            </div>
            <h3>Our Values</h3>
            <p>
              Integrity, creativity, collaboration, and excellence guide everything 
              we do. We believe in building lasting relationships based on trust 
              and outstanding results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;