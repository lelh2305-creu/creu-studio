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

  useEffect(() => {
    fetch('/api/promotion-config?t=' + Date.now(), { cache: 'no-store' })
      .then((res) => res.json())
      .then((pData) => {
        if (pData && pData.catPlayground) {
          setIsCat3DEnabled(pData.catPlayground.enabled !== false);
        }
      })
      .catch(() => {});
  }, []);

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

  return (
    <section className="hero relative w-full min-h-screen flex items-center overflow-hidden bg-zinc-950">
      {/* ========== HERO BACKGROUND SELECTION (CAT 3D WORLD vs STANDARD BACKGROUND) ========== */}
      <div className="absolute inset-0 z-0 w-full h-full">
        {isCat3DEnabled ? (
          <CatPlayground />
        ) : (
          <div className="relative w-full h-full bg-gradient-to-br from-zinc-900 via-purple-950 to-zinc-950">
            {heroBgImage ? (
              <img
                src={heroBgImage}
                alt="CREU Hero Background"
                className="w-full h-full object-cover opacity-80"
              />
            ) : (
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-800 via-zinc-900 to-black" />
            )}
          </div>
        )}
      </div>

      {/* ========== SOFT GRADIENT OVERLAY FOR TEXT READABILITY ========== */}
      <div
        className="absolute inset-0 z-5 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(8,12,22,0.88) 0%, rgba(8,12,22,0.35) 22%, transparent 42%)',
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
