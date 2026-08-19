'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/translations';

// Dynamically import CatPlayground with SSR disabled for WebGL safety
const CatPlayground = dynamic(() => import('./playground/CatPlayground'), {
  ssr: false,
  loading: () => null,
});

interface HeroProps {
  onPlayShowreel: () => void;
  onNavigate: (tab: string) => void;
  heroTitle?: string;
  heroDesc?: string;
  isDark?: boolean;
  heroBgImage?: string;
}

export default function Hero({
  onPlayShowreel,
  onNavigate,
  heroTitle,
  heroDesc,
  isDark = false,
  heroBgImage,
}: HeroProps) {
  const { lang } = useLang();
  const [isCat3DEnabled, setIsCat3DEnabled] = useState<boolean>(true);
  const [isCanvasMounted, setIsCanvasMounted] = useState<boolean>(true);
  const [is3DReady, setIs3DReady] = useState<boolean>(false);

  useEffect(() => {
    setIsCanvasMounted(true);
    setIsCat3DEnabled(true);
  }, []);

  const containerVars: Variants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVars: Variants = {
    hidden: { opacity: 1, y: 0 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' },
    },
  };

  const descriptionText =
    lang === 'en' ? t('hero.desc', lang) : heroDesc || t('hero.desc', lang);

  return (
    <section className="hero relative z-10 w-full min-h-[100svh] flex items-center overflow-hidden bg-zinc-950 pt-20 pb-12 sm:pt-0 sm:pb-0">
      {/* ========== PHASE 1: IMMEDIATE STATIC LIGHTWEIGHT BACKGROUND (319KB WebP) ========== */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <img
          src="/images/living-room-bg.webp"
          alt="CREU Living Room Studio"
          className="w-full h-full object-cover object-center opacity-90"
        />
      </div>

      {/* ========== PHASE 2 & 3: PROGRESSIVE 3D CAT PLAYGROUND CANVAS ========== */}
      {isCat3DEnabled && (
        <div className="absolute inset-0 z-1 w-full h-full">
          <CatPlayground onReady={() => setIs3DReady(true)} />
        </div>
      )}

      {/* ========== SOFT GRADIENT OVERLAY FOR TEXT LEGIBILITY ========== */}
      <div
        className="absolute inset-0 z-5 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(8,12,22,0.92) 0%, rgba(8,12,22,0.65) 35%, rgba(8,12,22,0.2) 65%, transparent 100%)',
        }}
      />

      {/* ========== CONTENT OVERLAY (Responsive Left Column) ========== */}
      <div className="shell relative z-10 pointer-events-auto px-4 sm:px-6 md:px-8 w-full">
        <motion.div
          className="max-w-[340px] sm:max-w-[460px] md:max-w-[540px] bg-zinc-950/60 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none p-5 sm:p-0 rounded-2xl border border-white/10 sm:border-none shadow-2xl sm:shadow-none"
          variants={containerVars}
          initial="hidden"
          animate="show"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVars} className="eyebrow text-xs sm:text-sm tracking-wider uppercase font-semibold text-purple-300 mb-2 sm:mb-3">
            {t('hero.eyebrow', lang)}
          </motion.div>

          {/* Main Heading */}
          <motion.h1 variants={itemVars} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] sm:leading-[1.08] text-white mb-3 sm:mb-4">
            {lang === 'en' ? (
              <>
                <span className="text-white">Ideas</span>
                <br />
                <span className="text-white">become</span>
                <br />
                <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-amber-200">
                  visuals.
                </em>
              </>
            ) : (
              <>
                <span className="text-white">Ý tưởng</span>
                <br />
                <span className="text-white">thành</span>
                <br />
                <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-amber-200">
                  hình ảnh.
                </em>
              </>
            )}
          </motion.h1>

          {/* Description */}
          <motion.p variants={itemVars} className="desc text-xs sm:text-sm md:text-base text-zinc-300 leading-relaxed mb-6 max-w-[320px] sm:max-w-[420px]">
            {descriptionText}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVars} className="actions flex flex-wrap items-center gap-3 sm:gap-4">
            <motion.button
              className="primary px-5 py-2.5 sm:px-6 sm:py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
              onClick={onPlayShowreel}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span>{t('hero.showreel', lang)}</span>
              <span>↗</span>
            </motion.button>

            <motion.button
              className="link px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              onClick={() => onNavigate('work')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{t('hero.explore', lang)}</span>
              <span className="ml-1">↓</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
