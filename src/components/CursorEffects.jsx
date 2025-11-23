import React, { useEffect, useRef, useState } from 'react';

const CursorEffects = () => {
  const cursorGlowRef = useRef(null);
  const parallaxRef = useRef({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const movingTimeoutRef = useRef(null);

  useEffect(() => {
    // Check if device supports hover (desktop only)
    const hasHover = window.matchMedia('(hover: hover)').matches;
    const isTouchDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    setIsMobile(isTouchDevice || !hasHover);

    if (isTouchDevice || !hasHover) return;

    const cursorGlow = cursorGlowRef.current;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    // Smooth cursor follow with easing
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update cursor position for custom cursor
      setCursorPosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);

      // Clear existing timeout
      if (movingTimeoutRef.current) {
        clearTimeout(movingTimeoutRef.current);
      }

      // Set timeout to detect when mouse stops
      movingTimeoutRef.current = setTimeout(() => {
        setIsMoving(false);
      }, 150);

      // Check if hovering over interactive elements
      const target = e.target;
      const isInteractive = target.closest('button, a, [data-hover], input, select, .cursor-pointer, .glass-panel');
      setIsHovering(!!isInteractive);

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

    // Mouse down handler
    const handleMouseDown = () => {
      setIsClicking(true);
    };

    // Mouse up handler
    const handleMouseUp = () => {
      setIsClicking(false);
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
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    animate();

    // Add tilt effect to interactive elements
    const interactiveElements = document.querySelectorAll('.glass-panel, .neon-button, button, a[class*="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mousemove', handleCardHover);
      el.addEventListener('mouseleave', handleCardLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      interactiveElements.forEach(el => {
        el.removeEventListener('mousemove', handleCardHover);
        el.removeEventListener('mouseleave', handleCardLeave);
      });
      if (movingTimeoutRef.current) {
        clearTimeout(movingTimeoutRef.current);
      }
    };
  }, []);

  // Don't render custom cursor on mobile
  if (isMobile) {
    return null;
  }

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

      {/* Custom Cursor Dot */}
      <div
        className="custom-cursor-dot"
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.5 : 1})`,
        }}
      />

      {/* Custom Cursor Ring */}
      <div
        className="custom-cursor-ring"
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : isHovering ? 1.5 : isMoving ? 1.1 : 1})`,
          opacity: isHovering ? 0.8 : 1,
          borderWidth: isHovering ? '3px' : '2px',
        }}
      />

      {/* Mouse-move Background Glow */}
      <div
        className="cursor-bg-glow"
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
        }}
      />
    </>
  );
};

export default CursorEffects;
