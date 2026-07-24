'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  return (
    <motion.div
      className="cursor-glow"
      animate={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.1 }}
    />
  );
}
