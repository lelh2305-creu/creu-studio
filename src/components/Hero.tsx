'use client';

import { motion, Variants } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/translations';

interface HeroProps {
  onPlayShowreel: () => void;
  onNavigate: (tab: string) => void;
  heroTitle?: string;
  heroDesc?: string;
}

export default function Hero({ onPlayShowreel, onNavigate, heroTitle, heroDesc }: HeroProps) {
  const { lang } = useLang();

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

  const descriptionText = lang === 'en'
    ? t('hero.desc', lang)
    : (heroDesc || t('hero.desc', lang));

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
                <>Ideas<br />become<br /><em>visuals.</em></>
              ) : (
                <>Ý tưởng<br />thành<br /><em>hình ảnh.</em></>
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
              <a className="link" onClick={() => onNavigate('work')} style={{ cursor: 'pointer' }}>
                {t('hero.explore', lang)} ↓
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Video Card */}
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
