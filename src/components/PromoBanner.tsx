'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';

interface PromoBannerProps {
  config?: any;
}

export default function PromoBanner({ config: initialConfig }: PromoBannerProps) {
  const { lang } = useLang();
  const [config, setConfig] = useState<any>(initialConfig || null);

  useEffect(() => {
    if (!initialConfig) {
      fetch('/api/promotion-config?t=' + Date.now())
        .then((r) => r.json())
        .then((data) => {
          if (data && data.heroBanner) {
            setConfig(data);
          }
        })
        .catch(() => {});
    } else {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  const b = config?.heroBanner;
  if (!b || !b.enabled) return null;

  const title = lang === 'en' ? b.titleEn || b.title : b.title;
  const desc = lang === 'en' ? b.descriptionEn || b.description : b.description;
  const tag = lang === 'en' ? b.tagEn || b.tag : b.tag;
  const ctaText = lang === 'en' ? b.ctaTextEn || b.ctaText : b.ctaText;
  const ctaLink = b.ctaLink || '/?tab=contact';
  const hasBgImage = Boolean(b.backgroundImage && b.backgroundImage.trim());

  // Image mode (Full Image Banner wrapped in link)
  if (hasBgImage) {
    return (
      <div className="shell my-12">
        <Link href={ctaLink} className="block cursor-pointer overflow-hidden rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-[1.01]">
          <div
            style={{
              backgroundImage: `url(${b.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center left',
              minHeight: '480px',
              width: '100%',
              borderRadius: '24px',
            }}
          />
        </Link>
      </div>
    );
  }

  // Styled Content / Gradient Banner Mode
  const bgStyle = b.thumbnail
    ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${b.thumbnail})`
    : b.bgGradient || 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)';

  return (
    <div className="shell my-12">
      <section
        style={{
          borderRadius: '28px',
          overflow: 'hidden',
          background: bgStyle,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '20px',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(124, 58, 237, 0.25)',
        }}
      >
        {/* Tag */}
        {tag && (
          <span
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.4)',
              color: 'white',
              padding: '6px 18px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              backdropFilter: 'blur(8px)',
            }}
          >
            {tag}
          </span>
        )}

        {/* Title */}
        {title && (
          <h2
            style={{
              color: 'white',
              fontSize: 'clamp(28px, 4.5vw, 48px)',
              fontWeight: '700',
              lineHeight: 1.2,
              maxWidth: '750px',
              margin: 0,
              fontFamily: 'var(--font-title)',
            }}
          >
            {title}
          </h2>
        )}

        {/* Description */}
        {desc && (
          <p
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '16px',
              maxWidth: '560px',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {desc}
          </p>
        )}

        {/* Deadline Badge */}
        {b.deadline && (
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '8px 22px',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: '600',
              backdropFilter: 'blur(8px)',
            }}
          >
            ⏰ {lang === 'en' ? 'Offer ends' : 'Ưu đãi kết thúc'}: {b.deadline}
          </div>
        )}

        {/* CTA Button */}
        {ctaText && (
          <Link
            href={ctaLink}
            style={{
              background: 'white',
              color: '#7C3AED',
              padding: '14px 34px',
              borderRadius: '14px',
              fontSize: '15px',
              fontWeight: '700',
              textDecoration: 'none',
              marginTop: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            className="hover:scale-105 hover:shadow-2xl"
          >
            {ctaText} →
          </Link>
        )}
      </section>
    </div>
  );
}
