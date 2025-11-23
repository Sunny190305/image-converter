import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isMoving, setIsMoving] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const movingTimeoutRef = useRef(null);

    useEffect(() => {
        // Detect if device is mobile/touch
        const checkMobile = () => {
            const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
            setIsMobile(mobile);
        };

        checkMobile();

        if (isMobile) return; // Don't initialize cursor on mobile

        // Mouse move handler
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
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
            const isInteractive = target.closest('button, a, [data-hover], input, select, .cursor-pointer');
            setIsHovering(!!isInteractive);
        };

        // Mouse down handler
        const handleMouseDown = () => {
            setIsClicking(true);
        };

        // Mouse up handler
        const handleMouseUp = () => {
            setIsClicking(false);
        };

        // Add event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        // Hide default cursor
        document.body.style.cursor = 'none';
        document.querySelectorAll('*').forEach(el => {
            el.style.cursor = 'none';
        });

        // Cleanup
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            if (movingTimeoutRef.current) {
                clearTimeout(movingTimeoutRef.current);
            }
            document.body.style.cursor = 'auto';
        };
    }, [isMobile]);

    // Don't render on mobile
    if (isMobile) return null;

    return (
        <>
            {/* Cursor Dot */}
            <div
                className="custom-cursor-dot"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: `translate(-50%, -50%) scale(${isClicking ? 0.5 : 1})`,
                }}
            />

            {/* Cursor Ring */}
            <div
                className="custom-cursor-ring"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : isHovering ? 1.5 : isMoving ? 1.1 : 1})`,
                    opacity: isHovering ? 0.8 : 1,
                    borderWidth: isHovering ? '3px' : '2px',
                }}
            />

            {/* Mouse-move background glow */}
            <div
                className="cursor-bg-glow"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                }}
            />
        </>
    );
};

export default CustomCursor;
