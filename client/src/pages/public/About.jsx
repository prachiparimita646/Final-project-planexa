import React from "react";
import AboutHero from "../../components/AboutHero";
import MissionVision from '../../components/MissionVision';
import StatsSection from '../../components/StatsSection';
import Testimonials from '../../components/Testimonials';
import ProcessTimeline from '../../components/ProcessTimeline';

const About  = () => {
  return (
    <div className="about-page">
      <AboutHero />
      <MissionVision />
      <ProcessTimeline />
      <StatsSection />
      <Testimonials />
      
    </div>
  );
};

export default About;
