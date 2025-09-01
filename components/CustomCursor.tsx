import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mousePos = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });
  // FIX: `useRef` must be initialized with a value.
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check for common interactive elements
      if (target.closest('a, button, [role="button"], input, label, [aria-expanded], [onclick]')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, label, [aria-expanded], [onclick]')) {
        setIsHovering(false);
      }
    };
    
    const handleMouseLeave = () => setIsVisible(false);

    const animate = () => {
      const { x: mouseX, y: mouseY } = mousePos.current;
      const { x: trailX, y: trailY } = trailPos.current;
      
      const dx = mouseX - trailX;
      const dy = mouseY - trailY;
      
      trailPos.current = {
        x: trailX + dx * 0.15, // Easing factor for smooth trailing
        y: trailY + dy * 0.15,
      };

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
      if (outlineRef.current) {
        outlineRef.current.style.transform = `translate(${trailPos.current.x}px, ${trailPos.current.y}px)`;
      }
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    
    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <>
      <div
        ref={outlineRef}
        style={{
          position: 'fixed',
          top: '-20px', // Offset by half of width/height
          left: '-20px',
          width: '40px',
          height: '40px',
          border: '2px solid rgba(139, 92, 246, 0.7)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
          transition: 'transform 0.2s ease-out, opacity 0.3s ease-out',
          opacity: isVisible ? 1 : 0,
          transform: `scale(${isHovering ? 1.5 : 1})`,
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: '-4px', // Offset by half of width/height
          left: '-4px',
          width: '8px',
          height: '8px',
          backgroundColor: 'rgba(139, 92, 246, 0.9)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
          transition: 'opacity 0.3s ease-out',
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
};

export default CustomCursor;
