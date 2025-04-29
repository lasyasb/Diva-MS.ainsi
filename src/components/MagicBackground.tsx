
import React, { useEffect, useRef } from "react";

const MagicBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Create particles
    const createParticle = () => {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      
      // Random size between 3px and 8px
      const size = Math.random() * 5 + 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random position
      const posX = Math.random() * window.innerWidth;
      const posY = Math.random() * window.innerHeight;
      particle.style.left = `${posX}px`;
      particle.style.bottom = `${posY}px`;
      
      // Random color
      const colors = [
        "rgba(124, 58, 237, 0.6)", // purple
        "rgba(13, 148, 136, 0.6)",  // teal
        "rgba(234, 179, 8, 0.6)",   // gold
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.backgroundColor = color;
      
      // Random animation duration
      const duration = Math.random() * 5 + 3;
      particle.style.animationDuration = `${duration}s`;
      
      // Random animation delay
      const delay = Math.random() * 5;
      particle.style.animationDelay = `${delay}s`;
      
      container.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      }, (duration + delay) * 1000);
    };
    
    // Create particles periodically
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        createParticle();
      }
    }, 1000);
    
    // Initial particles
    for (let i = 0; i < 10; i++) {
      createParticle();
    }
    
    return () => clearInterval(interval);
  }, []);
  
  return <div ref={containerRef} className="particles-container" aria-hidden="true" />;
};

export default MagicBackground;
