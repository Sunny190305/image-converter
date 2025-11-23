import React, { useEffect, useRef, useState } from 'react';

const CursorEffects = () => {
  const cursorGlowRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const cursorBgGlowRef = useRef(null);
  const parallaxRef = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const isMovingRef = useRef(false);
  const isClickingRef = useRef(false);
  const isHoveringRef = useRef(false);
  const movingTimeoutRef = useRef(null);

  useEffect(() => {
    // Check if device supports hover (desktop only)
    const hasHover = window.matchMedia('(hover: hover)').matches;
    const isTouchDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    setIsMobile(isTouchDevice || !hasHover);

    if (isTouchDevice || !hasHover) return;

    const cursorGlow = cursorGlowRef.current;
    const cursorDot = cursorDotRef.current;
    const cursorRing = cursorRingRef.current;
    const cursorBgGlow = cursorBgGlowRef.current;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    // Smooth cursor follow with easing
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update cursor position instantly via transform
      if (cursorDot) {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
      }
      if (cursorRing) {
        cursorRing.style.left = `${e.clientX}px`;
        cursorRing.style.top = `${e.clientY}px`;
      }
      if (cursorBgGlow) {
        cursorBgGlow.style.left = `${e.clientX}px`;
        cursorBgGlow.style.top = `${e.clientY}px`;
      }

      // Handle moving state
      if (!isMovingRef.current) {
        isMovingRef.current = true;
        if (cursorRing) {
          cursorRing.style.transform = 'translate(-50%, -50%) scale(1.1)';
        }
      }

      // Clear existing timeout
      if (movingTimeoutRef.current) {
        clearTimeout(movingTimeoutRef.current);
      }

      // Set timeout to detect when mouse stops
      movingTimeoutRef.current = setTimeout(() => {
        isMovingRef.current = false;
        if (cursorRing && !isHoveringRef.current && !isClickingRef.current) {
          cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
        }
      }, 100);

      // Check if hovering over interactive elements
      const target = e.target;
      const isInteractive = target.closest('button, a, [data-hover], input, select, .cursor-pointer, .glass-panel');
      const wasHovering = isHoveringRef.current;
      isHoveringRef.current = !!isInteractive;

      if (isHoveringRef.current !== wasHovering && cursorRing) {
        if (isHoveringRef.current) {
          cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
          cursorRing.style.opacity = '0.8';
          cursorRing.style.borderWidth = '3px';
        } else {
          cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
          cursorRing.style.opacity = '1';
          cursorRing.style.borderWidth = '2px';
        }
      }

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
      isClickingRef.current = true;
      if (cursorDot) {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
      }
      if (cursorRing) {
        cursorRing.style.transform = 'translate(-50%, -50%) scale(0.8)';
      }
    };

    // Mouse up handler
    const handleMouseUp = () => {
      isClickingRef.current = false;
      if (cursorDot) {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      }
      if (cursorRing) {
        const scale = isHoveringRef.current ? 1.5 : isMovingRef.current ? 1.1 : 1;
        cursorRing.style.transform = `translate(-50%, -50%) scale(${scale})`;
      }
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
        ref={cursorDotRef}
        className="custom-cursor-dot"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Custom Cursor Ring */}
      <div
        ref={cursorRingRef}
        className="custom-cursor-ring"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Mouse-move Background Glow */}
      <div
        ref={cursorBgGlowRef}
        className="cursor-bg-glow"
      />
    </>
  );
};

export default CursorEffects;
