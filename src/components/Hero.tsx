'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';

interface HeroProps {
  onPlayShowreel: () => void;
  onNavigate: (tab: string) => void;
  heroTitle?: string;
  heroDesc?: string;
}

export default function Hero({ onPlayShowreel, onNavigate, heroTitle, heroDesc }: HeroProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Controlled, smooth tilt values to prevent jitter/spinning
    setTilt({ x: -y * 6, y: x * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 35 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  const descriptionText = heroDesc || 'CREU biến chiến lược thương hiệu thành hình ảnh, video và trải nghiệm thị giác giàu cảm xúc — từ ý tưởng đến sản phẩm hoàn chỉnh.';

  return (
    <section className="hero">
      <div className="shell">
        <div className="hero-grid">
          {/* Left Column: Hero Text */}
          <motion.div
            className="hero-copy"
            variants={containerVars}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVars} className="eyebrow">
              CREATIVE STUDIO · THỦ ĐỨC
            </motion.div>

            <motion.h1 variants={itemVars}>
              Ideas<br />
              become<br />
              <em>visuals.</em>
            </motion.h1>

            <motion.p variants={itemVars} className="desc">
              {descriptionText}
            </motion.p>

            <motion.div variants={itemVars} className="actions">
              <motion.button
                className="primary"
                onClick={onPlayShowreel}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <span>Play showreel</span>
                <span>↗</span>
              </motion.button>
              <a className="link" onClick={() => onNavigate('work')} style={{ cursor: 'pointer' }}>
                Explore our work ↓
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: 3D Card Container */}
          <motion.div
            className="video-wrap cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
          >
            <div className="orb o1" />
            <div className="orb o2" />
            <div className="orb o3" />

            <motion.div
              className="video-card"
              onClick={onPlayShowreel}
              animate={{
                rotateX: tilt.x,
                rotateY: tilt.y,
                translateY: tilt.x !== 0 ? -4 : 0,
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 140 }}
            >
              <div className="video-visual" />
              <div className="video-shine" />
              <motion.button
                className="play"
                aria-label="Play showreel"
                onClick={onPlayShowreel}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              />
              <div className="video-meta">
                <span>Showreel 2026</span>
                <span>01 / 04</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
