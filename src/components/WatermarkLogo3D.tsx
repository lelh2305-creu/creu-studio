'use client';

import { useEffect, useRef } from 'react';

export default function WatermarkLogo3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let targetRotateY = 0;
    let currentRotateY = 0;
    let animFrameId: number;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Calculate 3D Y-axis rotation based on scroll velocity (clamp ±40deg)
      const rawTarget = deltaY * 0.5;
      targetRotateY = Math.max(-40, Math.min(40, rawTarget));
    };

    const updateAnimation = () => {
      // Smooth lerp + inertia decay
      currentRotateY += (targetRotateY - currentRotateY) * 0.09;
      targetRotateY *= 0.91; // Decay velocity to 0 when scroll stops

      if (containerRef.current) {
        containerRef.current.style.transform = `translate(-50%, -50%) perspective(800px) rotateY(${currentRotateY.toFixed(2)}deg)`;
      }

      animFrameId = requestAnimationFrame(updateAnimation);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animFrameId = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="watermark-logo-3d"
      className="fixed top-1/2 left-1/2 pointer-events-none w-[80vw] max-w-[900px] opacity-25 dark:opacity-35 transition-opacity duration-300"
      style={{
        zIndex: 0,
        transformOrigin: 'center center',
        transform: 'translate(-50%, -50%) perspective(800px) rotateY(0deg)',
        willChange: 'transform',
      }}
    >
      <svg
        viewBox="0 0 405.16 198.08"
        className="w-full h-auto drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="creuWatermarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="25%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="75%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>

        <g>
          {/* Path 1: Logo Main Symbol */}
          <path
            fill="url(#creuWatermarkGrad)"
            d="M185.9,76.66c-3.77,6.39-10.1,10.22-17.13,11.62l22.02,19.45c6.59,5.82,15.4,6.96,22.88,2.49l8.29-6.25-6.32-5.38c-8.5-7.24-8.82-18.35-1.32-25.94l22.64-22.93c7.26-7.35,21.4-8.85,30.34-1.45,4.77,3.96,7.75,9.64,8.5,15.73l-33.77,32.01-11.2,9.81,12.54,8.08c4.81,3.1,9.81,5.35,15.62,4.27,4.71-.87,8.48-3.42,11.96-6.69l22.11-20.78c6.37-5.99,16.03-6.69,23.44-2.66,2.76,1.5,4.6,3.44,7.04,5.42l-.5-5.88-.02-68.07h7.98s.1,67.21.1,67.21c.02,11.8,6.38,22.08,16.84,27.31,10.33,5.16,22.45,5.16,32.82-.04,9.99-5,16.87-14.95,16.9-26.41l.16-64.63,7.32-4.6-.24,69.44c-.05,15.08-10.04,27.9-23.91,32.95-11.65,4.25-24.08,3.79-35.54-.75-10.11-4.01-17.19-11.42-23-20.47-5.22-8.14-16.48-10.49-23.82-3.62l-25.9,24.2c-8.67,7.37-20.52,7.45-29.47.85l-16.15-12.93-14.07,8.13c-9.83,5.68-21.66,3.55-30.14-3.94-7.66-6.77-14.93-13.58-23-19.9l-10.91-7.33,9.01-.31c4.89-.17,9.39-1.29,13.61-3.89,9.55-5.9,11.92-19.49,4.34-28.03-3.95-4.45-9.82-6.75-15.8-7.1-7.61-.45-14.94-.47-22.48,0-5.16.32-9.2,4.72-9.2,9.9l-.06,58.25-8.31,5.03v-62.84c0-9.73,7.86-15.85,17.92-15.84l22.14.02c5.88,0,11.5,1.29,16.57,3.94,12,6.24,16.12,20.78,9.15,32.6ZM225.5,101.12l43.34-40.94c-.72-2-1.78-3.79-3.51-5.26-6.25-5.34-16.16-5.97-22.25.11l-21.21,21.21c-5.77,5.76-6.9,13.88-1.3,20.15l4.93,4.73Z"
          />
          {/* Path 2: Big Letter C */}
          <path
            fill="url(#creuWatermarkGrad)"
            d="M61.77,113.9c19.17,2.4,36.79-2.59,53.64-11.58v4.02c-22.43,12.56-49.03,17.27-73.6,8.46-12.01-4.3-22.38-11.57-30.07-21.53C-2.88,74.35-3.93,48.97,9.07,28.87,29.29-2.41,73.26-7.47,105.24,9.8l-.06,7.6c-5.84-4.73-11.64-7.87-18.57-9.99C58.32-1.24,27.25,11,15.3,38.26c-7.92,18.08-4.81,38.86,7.56,54.25,9.62,11.97,23.6,19.47,38.91,21.38Z"
          />
        </g>
      </svg>
    </div>
  );
}
