'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';

export default function AnnouncementBar() {
  const [config, setConfig] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);
  const { lang } = useLang();

  useEffect(() => {
    // Check if dismissed in current session
    const isDismissed = sessionStorage.getItem('creu_announcement_dismissed');
    if (isDismissed === 'true') {
      setDismissed(true);
    }

    fetch('/api/promotion-config?t=' + Date.now())
      .then((r) => r.json())
      .then((data) => {
        if (data && data.announcementBar) {
          setConfig(data.announcementBar);
        }
      })
      .catch(() => {});
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    sessionStorage.setItem('creu_announcement_dismissed', 'true');
  };

  if (!config || !config.enabled || dismissed) return null;

  const text = lang === 'en' ? config.textEn || config.text : config.text;
  const ctaText = lang === 'en' ? config.ctaTextEn || config.ctaText : config.ctaText;
  const ctaLink = config.ctaLink || '/?tab=contact';
  const hasBgImage = Boolean(config.backgroundImage && config.backgroundImage.trim());

  // Image mode (Full banner image wrapper)
  if (hasBgImage) {
    return (
      <div className="relative w-full overflow-hidden z-[100] transition-all">
        <Link href={ctaLink} className="block w-full cursor-pointer">
          <div
            style={{
              backgroundImage: `url(${config.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: config.height || '80px',
              minHeight: '60px',
              width: '100%',
            }}
          />
        </Link>
        <button
          onClick={handleDismiss}
          aria-label="Close announcement"
          style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.4)',
            border: 'none',
            color: 'white',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px',
            lineHeight: 1,
            zIndex: 10,
          }}
        >
          ×
        </button>
      </div>
    );
  }

  // Text Mode (Styled bar)
  return (
    <div
      style={{
        background: config.bgColor || '#7C3AED',
        color: config.textColor || '#ffffff',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        fontSize: '14px',
        fontWeight: '500',
        position: 'relative',
        zIndex: 100,
      }}
    >
      {/* Marquee text on mobile, static on desktop */}
      <span className="hidden md:block">{text}</span>
      <div className="md:hidden overflow-hidden whitespace-nowrap w-full text-center">
        <span
          style={{
            display: 'inline-block',
            animation: 'marquee 15s linear infinite',
          }}
        >
          {text}&nbsp;&nbsp;&nbsp;&nbsp;{text}
        </span>
      </div>

      {/* CTA Button */}
      {ctaText && (
        <Link
          href={ctaLink}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.5)',
            color: 'white',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {ctaText} →
        </Link>
      )}

      {/* Close button */}
      <button
        onClick={handleDismiss}
        aria-label="Close announcement"
        style={{
          position: 'absolute',
          right: '16px',
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          fontSize: '20px',
          opacity: 0.8,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}
