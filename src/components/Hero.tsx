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

  const hasBgImage = Boolean(heroBgImage && heroBgImage.trim() !== '');

  const containerVars: Variants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVars: Variants = {
    hidden: { opacity: 1, y: 0 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: 'easeOut' },
    },
  };

  const descriptionText =
    lang === 'en' ? t('hero.desc', lang) : heroDesc || t('hero.desc', lang);

  // =========================================================================
  // MODE A: EVENT FULL-BLEED BACKGROUND IMAGE MODE (Active when heroBgImage is set)
  // =========================================================================
  if (hasBgImage) {
    return (
      <section className="hero relative w-full min-h-screen flex items-center overflow-hidden transition-colors duration-500">
        {/* ========== FULL-BLEED HERO BACKGROUND IMAGE ========== */}
        <div
          className={`absolute inset-0 z-0 w-full h-full bg-cover bg-center transition-all duration-500 ${
            isDark ? 'brightness-[0.72] contrast-[1.08]' : 'brightness-[1.02] contrast-[1.02]'
          }`}
          style={{
            backgroundImage: `url(${heroBgImage})`,
            backgroundPosition: 'center 45%',
          }}
        />

        {/* ========== SOFT GRADIENT OVERLAY FOR TEXT READABILITY ========== */}
        <div
          className="absolute inset-0 z-5 pointer-events-none transition-all duration-500"
          style={{
            background: isDark
              ? 'linear-gradient(90deg, rgba(8, 12, 22, 0.94) 0%, rgba(8, 12, 22, 0.72) 30%, rgba(8, 12, 22, 0.15) 55%, transparent 75%)'
              : 'linear-gradient(90deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.72) 30%, rgba(255, 255, 255, 0.15) 55%, transparent 75%)',
          }}
        />

        {/* ========== CONTENT OVERLAY (Left Editorial Column) ========== */}
        <div className="shell relative z-10 pointer-events-auto">
          <motion.div
            className="max-w-[540px]"
            variants={containerVars}
            initial="hidden"
            animate="show"
          >
            {/* Eyebrow */}
            <motion.div variants={itemVars} className="eyebrow">
              {t('hero.eyebrow', lang)}
            </motion.div>

            {/* Main Heading */}
            <motion.h1 variants={itemVars}>
              {lang === 'en' ? (
                <>
                  Ideas
                  <br />
                  become
                  <br />
                  <em>visuals.</em>
                </>
              ) : (
                <>
                  Ý tưởng
                  <br />
                  thành
                  <br />
                  <em>hình ảnh.</em>
                </>
              )}
            </motion.h1>

            {/* Description */}
            <motion.p variants={itemVars} className="desc">
              {descriptionText}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVars} className="actions">
              <motion.button
                className="primary"
                onClick={onPlayShowreel}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <span>{t('hero.showreel', lang)}</span>
                <span>↗</span>
              </motion.button>

              <motion.button
                className="link cursor-pointer border-none bg-transparent"
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

  // =========================================================================
  // MODE B: ORIGINAL DEFAULT LAYOUT WITH FLOATING VIDEO CARD (Active when heroBgImage is empty)
  // =========================================================================
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
              {t('hero.eyebrow', lang)}
            </motion.div>

            <motion.h1 variants={itemVars}>
              {lang === 'en' ? (
                <>
                  Ideas
                  <br />
                  become
                  <br />
                  <em>visuals.</em>
                </>
              ) : (
                <>
                  Ý tưởng
                  <br />
                  thành
                  <br />
                  <em>hình ảnh.</em>
                </>
              )}
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
                <span>{t('hero.showreel', lang)}</span>
                <span>↗</span>
              </motion.button>

              <a
                className="link"
                onClick={() => onNavigate('work')}
                style={{ cursor: 'pointer' }}
              >
                {t('hero.explore', lang)} ↓
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Floating Video Card */}
          <motion.div
            className="video-wrap cursor-pointer"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
          >
            <div className="orb o1" />
            <div className="orb o2" />
            <div className="orb o3" />

            <motion.div
              className="video-card"
              onClick={onPlayShowreel}
              whileHover={{ scale: 1.025, y: -6 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
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




