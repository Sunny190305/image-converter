import React, { useEffect, useRef } from 'react';

const CursorEffects = () => {
  const cursorGlowRef = useRef(null);
  const parallaxRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if device supports hover (desktop only)
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return;

    const cursorGlow = cursorGlowRef.current;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    // Smooth cursor follow with easing
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Update parallax values
      parallaxRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      };

      // Apply parallax to background elements
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      parallaxElements.forEach(el => {
        const speed = el.dataset.parallax || 0.5;
        el.style.transform = `translate(${parallaxRef.current.x * speed}px, ${parallaxRef.current.y * speed}px)`;
      });
    };

    // Smooth animation loop for cursor glow
    const animate = () => {
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      
      currentX += dx * 0.1; // Easing factor
      currentY += dy * 0.1;
      
      if (cursorGlow) {
        cursorGlow.style.left = `${currentX}px`;
        cursorGlow.style.top = `${currentY}px`;
      }
      
      requestAnimationFrame(animate);
    };

    // Card tilt effect on hover
    const handleCardHover = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    };

    const handleCardLeave = (e) => {
      e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    };

    // Attach event listeners
    document.addEventListener('mousemove', handleMouseMove);
    animate();

    // Add tilt effect to interactive elements
    const interactiveElements = document.querySelectorAll('.glass-panel, .neon-button, button, a[class*="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mousemove', handleCardHover);
      el.addEventListener('mouseleave', handleCardLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mousemove', handleCardHover);
        el.removeEventListener('mouseleave', handleCardLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Cursor Follow Glow */}
      <div 
        ref={cursorGlowRef}
        className="cursor-glow"
        style={{
          position: 'fixed',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 30%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'screen',
          transition: 'opacity 0.3s ease'
        }}
      />
    </>
  );
};

export default CursorEffects;
