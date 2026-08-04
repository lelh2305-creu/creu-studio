'use client';
import { useEffect, useRef } from 'react';

export default function WatermarkLogo3D() {
  const logoRef = useRef<HTMLDivElement>(null);
  const rotY = useRef(0);
  const velocity = useRef(0);
  const lastScrollY = useRef(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;
      velocity.current += delta * 0.5;
      velocity.current *= 0.82;
      rotY.current += velocity.current * 0.08;
      rotY.current = Math.max(-40, Math.min(40, rotY.current));
      rotY.current *= 0.96;
      if (logoRef.current) {
        logoRef.current.style.transform = `perspective(900px) rotateY(${rotY.current}deg)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 0,
      pointerEvents: 'none',
      width: '88vw',
      maxWidth: '960px',
      opacity: 0.12,
      mixBlendMode: 'multiply',
    }}>
      <div
        ref={logoRef}
        style={{ transformOrigin: 'center center', willChange: 'transform' }}
      >
        <img
          src="/creu-logo.png"
          alt=""
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>
    </div>
  );
}
