'use client';

import { motion, Variants } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/translations';

interface HeroProps {
  onPlayShowreel: () => void;
  onNavigate: (tab: string) => void;
  heroTitle?: string;
  heroDesc?: string;
  isDark?: boolean;
  bgImage?: string;
}

export default function Hero({
  onPlayShowreel,
  onNavigate,
  heroTitle,
  heroDesc,
  isDark = false,
  bgImage,
}: HeroProps) {
  const { lang } = useLang();

  const heroBg = bgImage || '/images/hero-29.png';

  const containerVars: Variants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVars: Variants = {
    hidden: { opacity: 1, y: 0 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const descriptionText =
    lang === 'en' ? t('hero.desc', lang) : heroDesc || t('hero.desc', lang);

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden transition-colors duration-500">
      {/* ========== FULL-BLEED 2/9 HERO BACKGROUND IMAGE ========== */}
      <div
        className={`absolute inset-0 z-0 w-full h-full bg-cover bg-center transition-all duration-500 ${
          isDark ? 'brightness-[0.72] contrast-[1.08]' : 'brightness-[1.02] contrast-[1.02]'
        }`}
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundPosition: 'center 45%',
        }}
      />

      {/* ========== SOFT GRADIENT OVERLAY FOR TEXT READABILITY ========== */}
      <div
        className="absolute inset-0 z-5 pointer-events-none transition-all duration-500"
        style={{
          background: isDark
            ? 'linear-gradient(90deg, rgba(8, 12, 22, 0.92) 0%, rgba(8, 12, 22, 0.72) 28%, rgba(8, 12, 22, 0.15) 50%, transparent 68%)'
            : 'linear-gradient(90deg, rgba(255, 255, 255, 0.86) 0%, rgba(255, 255, 255, 0.60) 25%, rgba(255, 255, 255, 0.10) 45%, transparent 65%)',
        }}
      />

      {/* ========== CONTENT OVERLAY (Left Editorial Column) ========== */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-24 sm:pt-28 pb-16">
        <motion.div
          className="max-w-[560px]"
          variants={containerVars}
          initial="hidden"
          animate="show"
        >
          {/* Eyebrow */}
          <motion.div
            variants={itemVars}
            className={`text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-5 sm:mb-7 transition-colors duration-300 ${
              isDark ? 'text-emerald-400' : 'text-[#15803d]'
            }`}
          >
            {t('hero.eyebrow', lang)}
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVars}
            className={`text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] mb-6 sm:mb-8 tracking-tight transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-[#0f172a]'
            }`}
          >
            Ý tưởng
            <br />
            thành
            <br />
            <em
              className={`font-serif italic font-normal transition-colors duration-300 ${
                isDark ? 'text-pink-400' : 'text-[#e11d48]'
              }`}
            >
              hình ảnh.
            </em>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVars}
            className={`text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-[440px] transition-colors duration-300 ${
              isDark ? 'text-zinc-300 font-normal' : 'text-[#334155] font-medium'
            }`}
          >
            {descriptionText}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVars}
            className="flex flex-col sm:flex-row gap-4 sm:gap-5"
          >
            <motion.button
              className={`px-7 py-3.5 font-bold text-sm sm:text-base rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                isDark
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20'
                  : 'bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-slate-900/20'
              }`}
              onClick={onPlayShowreel}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span>{t('hero.showreel', lang)}</span>
              <span className="text-base">↗</span>
            </motion.button>

            <motion.button
              className={`px-7 py-3.5 font-semibold text-sm sm:text-base rounded-full transition-all duration-200 flex items-center justify-center backdrop-blur-md cursor-pointer ${
                isDark
                  ? 'border border-zinc-700/80 hover:border-zinc-500 bg-zinc-900/60 text-zinc-200 hover:text-white'
                  : 'border border-slate-300/90 hover:border-slate-400 bg-white/80 hover:bg-white text-[#0f172a] shadow-sm'
              }`}
              onClick={() => onNavigate('work')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{t('hero.explore', lang)}</span>
              <span className="ml-2 text-base">↓</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


