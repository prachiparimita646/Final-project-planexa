import React from 'react';
// import { 
//   FaLightbulb, 
//   FaClipboardList, 
//   FaUsers, 
//   FaCalendarCheck,
//   FaMagic,
//   FaGlassCheers
// } 
// import './ProcessTimeline.css';

const ProcessTimeline = () => {
  const processSteps = [
    {
      id: 1,
      // icon: <FaLightbulb />,
      title: 'Discovery & Concept',
      description: 'We begin by understanding your vision, goals, and requirements through detailed consultations.',
      color: '#667eea',
      details: [
        'Initial consultation',
        'Objective setting',
        'Theme development',
        'Budget planning'
      ]
    },
    {
      id: 2,
      // icon: <FaClipboardList />,
      title: 'Planning & Design',
      description: 'Our team creates a comprehensive event plan with detailed timelines and creative designs.',
      color: '#4c51bf',
      details: [
        'Venue selection',
        'Vendor coordination',
        'Creative design',
        'Timeline development'
      ]
    },
    {
      id: 3,
      // icon: <FaUsers />,
      title: 'Coordination',
      description: 'We coordinate all vendors, logistics, and team members to ensure seamless execution.',
      color: '#5a67d8',
      details: [
        'Vendor management',
        'Guest list handling',
        'Logistics planning',
        'Team briefings'
      ]
    },
    {
      id: 4,
      // icon: <FaCalendarCheck />,
      title: 'Preparation',
      description: 'Final preparations including rehearsals, technical setups, and last-minute adjustments.',
      color: '#7c3aed',
      details: [
        'Technical rehearsals',
        'Final approvals',
        'Emergency planning',
        'Team coordination'
      ]
    },
    {
      id: 5,
      // icon: <FaMagic />,
      title: 'Execution',
      description: 'Our team executes the event flawlessly, managing every detail in real-time.',
      color: '#8b5cf6',
      details: [
        'On-site management',
        'Guest experience',
        'Problem solving',
        'Quality control'
      ]
    },
    {
      id: 6,
      // icon: <FaGlassCheers />,
      title: 'Follow-up & Review',
      description: 'Post-event follow-up, feedback collection, and performance analysis.',
      color: '#a78bfa',
      details: [
        'Guest feedback',
        'Performance review',
        'Media collection',
        'Future planning'
      ]
    }
  ];

  return (
    <section className="process-section">
      <div className="container">
        <h2 className="section-title">Our Event Process</h2>
        <p className="section-subtitle">
          A structured approach to ensure every event is executed flawlessly
        </p>

        <div className="process-timeline">
          {processSteps.map((step, index) => (
            <div 
              key={step.id} 
              className={`process-step ${index % 2 === 0 ? 'left' : 'right'}`}
            >
              <div className="step-content">
                <div 
                  className="step-icon" 
                  style={{ backgroundColor: step.color }}
                >
                  {step.icon}
                </div>
                <div className="step-info">
                  <div className="step-number">0{step.id}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                  
                  <div className="step-details">
                    <h4>Key Activities:</h4>
                    <ul>
                      {step.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Timeline line */}
          <div className="timeline-line"></div>
        </div>

        {/* Mobile Timeline */}
        <div className="process-timeline-mobile">
          {processSteps.map((step) => (
            <div key={step.id} className="process-step-mobile">
              <div 
                className="step-icon-mobile" 
                style={{ backgroundColor: step.color }}
              >
                {step.icon}
              </div>
              <div className="step-content-mobile">
                <div className="step-header">
                  <div className="step-number-mobile">0{step.id}</div>
                  <h3 className="step-title-mobile">{step.title}</h3>
                </div>
                <p className="step-description-mobile">{step.description}</p>
                
                <div className="step-details-mobile">
                  <h4>Key Activities:</h4>
                  <ul>
                    {step.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
