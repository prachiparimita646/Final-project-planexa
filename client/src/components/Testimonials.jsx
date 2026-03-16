import React, { useState, useEffect } from 'react';

import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'Jennifer Martinez',
    company: 'TechCorp International',
    role: 'Marketing Director',
    content: 'The team transformed our annual conference into an unforgettable experience. Their attention to detail and creative approach exceeded all expectations.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    name: 'Robert Johnson',
    company: 'Global Finance Group',
    role: 'CEO',
    content: 'Our product launch was a massive success thanks to their exceptional planning and execution. They handled everything flawlessly.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    name: 'Sophia Williams',
    company: 'HealthFirst Org',
    role: 'Event Coordinator',
    content: 'Professional, creative, and reliable. They managed our charity gala with such grace and made the entire process stress-free.',
    rating: 5,
    image: 'https://unsplash.com/photos/woman-in-blue-button-up-shirt-RkynP9OGAtU'
  },
  {
    id: 4,
    name: 'Michael Thompson',
    company: 'Innovate Summit',
    role: 'Conference Chair',
    content: 'The best event management team we\'ve worked with. Their innovative ideas and flawless execution made our summit the talk of the industry.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }
];

const Testimonials = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false);

//   const nextSlide = () => {
//     if (!isTransitioning) {
//       setIsTransitioning(true);
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
//       setTimeout(() => setIsTransitioning(false), 500);
//     }
//   };

//   const prevSlide = () => {
//     if (!isTransitioning) {
//       setIsTransitioning(true);
//       setCurrentIndex((prevIndex) => 
//         prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
//       );
//       setTimeout(() => setIsTransitioning(false), 500);
//     }
//   };

//   const goToSlide = (index) => {
//     if (!isTransitioning && index !== currentIndex) {
//       setIsTransitioning(true);
//       setCurrentIndex(index);
//       setTimeout(() => setIsTransitioning(false), 500);
//     }
//   };

//   // Auto slide every 5 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       nextSlide();
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [currentIndex, isTransitioning]);

// //   const renderStars = (rating) => {
// //     return Array.from({ length: 5 }, (_, index) => (
// //       <FaStar 
// //         key={index} 
// //         className={index < rating ? 'star filled' : 'star'} 
// //       />
// //     ));
// //   };

// //   return (
// //     <section className="testimonials-section">
// //       <div className="container">
// //         <h2 className="section-title">What Our Clients Say</h2>
// //         <p className="section-subtitle">
// //           Don't just take our word for it - hear from our satisfied clients
// //         </p>

// //         <div className="testimonials-container">
// //           <button 
// //             className="nav-button prev-button" 
// //             onClick={prevSlide}
// //             aria-label="Previous testimonial"
// //           >
// //             <FaChevronLeft />
// //           </button>

// //           <div className="testimonials-slider">
// //             <div 
// //               className={`testimonial-card ${isTransitioning ? 'transitioning' : ''}`}
// //               key={currentIndex}
// //             >
// //               <div className="quote-icon">
               
// //               </div>
              
// //               <div className="testimonial-content">
// //                 <p className="testimonial-text">
// //                   "{testimonials[currentIndex].content}"
// //                 </p>
                
// //                 <div className="rating">
// //                   {renderStars(testimonials[currentIndex].rating)}
// //                 </div>
// //               </div>

// //               <div className="client-info">
// //                 <div className="client-image">
// //                   <img 
// //                     src={testimonials[currentIndex].image} 
// //                     alt={testimonials[currentIndex].name} 
// //                   />
// //                 </div>
// //                 <div className="client-details">
// //                   <h4>{testimonials[currentIndex].name}</h4>
// //                   <p className="client-company">{testimonials[currentIndex].company}</p>
// //                   <p className="client-role">{testimonials[currentIndex].role}</p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           <button 
// //             className="nav-button next-button" 
// //             onClick={nextSlide}
// //             aria-label="Next testimonial"
// //           >
// //             <FaChevronRight />
// //           </button>
// //         </div>

// //         {/* Dots indicator */}
// //         <div className="dots-container">
// //           {testimonials.map((_, index) => (
// //             <button
// //               key={index}
// //               className={`dot ${index === currentIndex ? 'active' : ''}`}
// //               onClick={() => goToSlide(index)}
// //               aria-label={`Go to testimonial ${index + 1}`}
// //             />
// //           ))}
// //         </div>

// //         {/* All testimonials grid for larger screens */}
// //         <div className="testimonials-grid">
// //           {testimonials.map((testimonial) => (
// //             <div key={testimonial.id} className="testimonial-grid-card">
// //               <div className="quote-icon-small">
// //                 <FaQuoteLeft />
// //               </div>
// //               <p className="testimonial-grid-text">"{testimonial.content}"</p>
// //               <div className="rating">
// //                 {renderStars(testimonial.rating)}
// //               </div>
// //               <div className="client-info-grid">
// //                 <div className="client-image-small">
// //                   <img src={testimonial.image} alt={testimonial.name} />
// //                 </div>
// //                 <div className="client-details-grid">
// //                   <h5>{testimonial.name}</h5>
// //                   <p>{testimonial.company}</p>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
};

export default Testimonials;