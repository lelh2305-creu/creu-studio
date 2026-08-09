'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WatermarkLogo3D from '@/components/WatermarkLogo3D';
import { useLang } from '@/context/LangContext';
import type { WallpaperItem } from '@/app/api/wallpapers/route';

const CATEGORIES: { id: string; nameVi: string; nameEn: string; icon: string }[] = [
  { id: 'all', nameVi: 'Tất Cả Tone', nameEn: 'All Tones', icon: '🌟' },
  { id: 'dark-moody', nameVi: 'Dark Moody', nameEn: 'Dark Moody', icon: '🖤' },
  { id: 'minimal-white', nameVi: 'Minimal White', nameEn: 'Minimal White', icon: '🤍' },
  { id: 'purple-aesthetic', nameVi: 'Purple Aesthetic', nameEn: 'Purple Aesthetic', icon: '💜' },
  { id: 'pastel-pink', nameVi: 'Pastel Pink', nameEn: 'Pastel Pink', icon: '🩷' },
  { id: 'blue-ocean', nameVi: 'Blue Ocean', nameEn: 'Blue Ocean', icon: '💙' },
  { id: 'nature-green', nameVi: 'Nature Green', nameEn: 'Nature Green', icon: '🌿' },
  { id: 'warm-amber', nameVi: 'Warm Amber', nameEn: 'Warm Amber', icon: '🧡' },
  { id: 'black-gold', nameVi: 'Black & Gold', nameEn: 'Black & Gold', icon: '✨' },
];

export default function WallpaperPageClient() {
  const { lang } = useLang();
  const [wallpapers, setWallpapers] = useState<WallpaperItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalItem, setActiveModalItem] = useState<WallpaperItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/wallpapers?t=' + Date.now())
      .then((res) => res.json())
      .then((json) => {
        if (json && json.data) {
          setWallpapers(json.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredWallpapers = selectedCategory === 'all'
    ? wallpapers
    : wallpapers.filter((w) => w.category === selectedCategory);

  const handleDownload = (wallpaper: WallpaperItem) => {
    window.open(wallpaper.downloadUrl, '_blank');
  };

  const getPinterestUrl = (wallpaper: WallpaperItem) => {
    const siteUrl = 'https://creu.vn/wallpaper';
    const mediaUrl = wallpaper.downloadUrl || wallpaper.previewUrl;
    const desc = encodeURIComponent(`Hình nền điện thoại đẹp miễn phí từ CREU Studio | ${wallpaper.title} | creu.vn/wallpaper`);
    return `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(siteUrl)}&media=${encodeURIComponent(mediaUrl)}&description=${desc}`;
  };

  return (
    <main className="relative min-h-screen bg-[#080c16] text-white font-sans selection:bg-[#a855f7] selection:text-white">
      {/* 3D Scroll Watermark */}
      <WatermarkLogo3D />

      {/* Navbar Header */}
      <Navbar
        currentTab="wallpaper"
        onTabChange={(tab) => {
          if (tab !== 'wallpaper') {
            window.location.href = tab === 'home' ? '/' : `/?tab=${tab}`;
          }
        }}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Hero Section Banner with Custom Image Background & Dot Grid */}
      <section
        style={{
          position: 'relative',
          minHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: `linear-gradient(to bottom, rgba(10,10,20,0.6) 0%, rgba(10,10,20,0.3) 50%, rgba(10,10,20,0.7) 100%), url(/wallpaper-hero-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          paddingTop: '100px',
          paddingBottom: '60px',
        }}
      >
        {/* Particle Dots Background Pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 20px', maxWidth: '900px', margin: '0 auto' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(124,58,237,0.2)',
              border: '1px solid rgba(124,58,237,0.4)',
              borderRadius: '20px',
              padding: '6px 16px',
              marginBottom: '24px',
              fontSize: '13px',
              color: '#a78bfa',
              fontWeight: '600',
              letterSpacing: '0.05em',
            }}
          >
            ✦ CREU WALLPAPER VAULT 2026
          </div>

          {/* Heading with Be Vietnam Pro (Sans-Serif) */}
          <h1
            style={{
              fontFamily: "var(--font-be-vietnam), 'Be Vietnam Pro', system-ui, sans-serif",
              fontStyle: 'normal',
              fontWeight: '800',
              fontSize: 'clamp(36px, 6vw, 72px)',
              lineHeight: '1.1',
              color: '#ffffff',
              marginBottom: '16px',
            }}
          >
            {lang === 'en' ? (
              <>
                Free <span style={{ color: '#7C3AED' }}>Phone Wallpapers</span> HD 4K
              </>
            ) : (
              <>
                Kho <span style={{ color: '#7C3AED' }}>Hình Nền</span> Điện Thoại Đẹp 4K Miễn Phí
              </>
            )}
          </h1>

          {/* Subtext formatted in 2 clean lines */}
          <p
            style={{
              fontFamily: "var(--font-be-vietnam), 'Be Vietnam Pro', system-ui, sans-serif",
              fontWeight: '400',
              fontSize: '16px',
              lineHeight: '1.6',
              color: 'rgba(255,255,255,0.6)',
              maxWidth: '600px',
              margin: '16px auto 0',
              textAlign: 'center',
              whiteSpace: 'normal',
              padding: '0 20px',
            }}
          >
            {lang === 'en' ? (
              <>
                High-resolution 4K phone wallpapers by CREU Studio.
                <br />
                <span style={{ opacity: 0.7 }}>
                  Filter by color tones · Instant preview · Free 4K download.
                </span>
              </>
            ) : (
              <>
                Tuyển tập hình nền 4K được thiết kế & tuyển chọn bởi CREU Studio.
                <br />
                <span style={{ opacity: 0.7 }}>
                  Lọc theo tone màu · Preview nhanh · Tải file gốc miễn phí.
                </span>
              </>
            )}
          </p>

          {/* Stats Row */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              justifyContent: 'center',
              marginTop: '32px',
            }}
          >
            {[
              { number: '4K', label: lang === 'en' ? 'Quality' : 'Chất lượng' },
              { number: '100%', label: lang === 'en' ? 'Free' : 'Miễn phí' },
              { number: '8', label: lang === 'en' ? 'Color Tones' : 'Tone màu' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#a78bfa' }}>
                  {stat.number}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tone Category Filter Pills with Left/Right Scroll Buttons & Fade Gradients */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-12">
        <div
          style={{
            position: 'relative',
            width: '100%',
            padding: '0 48px',
          }}
        >
          {/* Nút LEFT */}
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
            aria-label="Scroll left"
            style={{
              position: 'absolute',
              left: '0',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
          >
            ←
          </button>

          {/* Filter scroll container */}
          <div
            ref={scrollRef}
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              padding: '8px 4px',
              scrollSnapType: 'x mandatory',
            }}
          >
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>

            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    position: 'relative',
                    flexShrink: 0,
                    scrollSnapAlign: 'start',
                    whiteSpace: 'nowrap',
                    padding: '8px 18px',
                    borderRadius: '20px',
                    border: isActive ? '1px solid #7C3AED' : '1px solid rgba(255,255,255,0.15)',
                    background: isActive ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#a78bfa' : 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    letterSpacing: '0.05em',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{lang === 'en' ? cat.nameEn : cat.nameVi}</span>

                  {/* Active Indicator Dot */}
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: '#7C3AED',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Nút RIGHT */}
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
            aria-label="Scroll right"
            style={{
              position: 'absolute',
              right: '0',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
          >
            →
          </button>

          {/* Fade gradient 2 đầu */}
          <div
            style={{
              position: 'absolute',
              left: '40px',
              top: 0,
              bottom: 0,
              width: '40px',
              background: 'linear-gradient(to right, #080c16, transparent)',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '40px',
              top: 0,
              bottom: 0,
              width: '40px',
              background: 'linear-gradient(to left, #080c16, transparent)',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />
        </div>
      </section>

      {/* Gallery Wallpaper Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="aspect-[9/16] rounded-3xl bg-[#0e1424] animate-pulse border border-white/10" />
            ))}
          </div>
        ) : filteredWallpapers.length === 0 ? (
          <div className="text-center py-20 bg-[#0e1424] border border-white/10 rounded-3xl p-8 max-w-lg mx-auto">
            <div className="text-4xl mb-4">🖼️</div>
            <h3 className="text-lg font-bold text-white mb-2">Chưa có hình nền cho tone này</h3>
            <p className="text-xs text-gray-400 mb-6">Hãy thử chọn tone màu khác hoặc bấm "Tất Cả Tone" để xem kho ảnh.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-6 py-2.5 bg-[#a855f7] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#9333ea]"
            >
              Xem Tất Cả Tone
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredWallpapers.map((wallpaper, idx) => (
              <motion.div
                key={wallpaper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group relative aspect-[9/16] rounded-3xl overflow-hidden bg-[#0e1424] border border-white/15 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1.5"
              >
                {/* Background Wallpaper Image */}
                <img
                  src={wallpaper.previewUrl}
                  alt={`${wallpaper.title} - hình nền điện thoại ${wallpaper.category} CREU Studio`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* CREU Watermark Badge */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-[10px] font-bold text-white/90 tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-pulse" />
                  <span>CREU · 4K</span>
                </div>

                {/* Action Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <a
                      href={getPinterestUrl(wallpaper)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#E60023] hover:bg-[#ad081b] text-white text-[11px] font-bold flex items-center gap-1 shadow-lg transition-transform hover:scale-105"
                    >
                      <span>📌</span>
                      <span>Save</span>
                    </a>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                      {lang === 'en' ? wallpaper.titleEn || wallpaper.title : wallpaper.title}
                    </h3>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveModalItem(wallpaper)}
                        className="flex-1 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[11px] font-bold tracking-wider uppercase border border-white/30 transition-all text-center cursor-pointer"
                      >
                        👁️ Preview
                      </button>

                      <button
                        onClick={() => handleDownload(wallpaper)}
                        className="flex-1 py-2 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-[11px] font-bold tracking-wider uppercase shadow-md transition-all text-center cursor-pointer"
                      >
                        📥 Tải File 4K
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Full Preview Lightbox Modal */}
      <AnimatePresence>
        {activeModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setActiveModalItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full bg-[#0e1424] border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl font-bold cursor-pointer transition-all border border-white/20 z-10"
              >
                ×
              </button>

              {/* Modal Image Box */}
              <div className="relative w-full md:w-1/2 aspect-[9/16] rounded-2xl overflow-hidden bg-black/50 border border-white/10 flex-shrink-0">
                <img
                  src={activeModalItem.previewUrl}
                  alt={activeModalItem.title}
                  className="w-full h-full object-cover"
                />
                {/* Watermark in Preview */}
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs font-bold text-white tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                  <span>CREU STUDIO · 4K WALLPAPER</span>
                </div>
              </div>

              {/* Modal Info & Download Panel */}
              <div className="flex-1 flex flex-col justify-between space-y-6 pt-2">
                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#a855f7]/20 border border-[#a855f7]/40 text-[#c499f5] text-[11px] font-bold uppercase tracking-wider">
                    {activeModalItem.category}
                  </span>

                  <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
                    {lang === 'en' ? activeModalItem.titleEn || activeModalItem.title : activeModalItem.title}
                  </h2>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {lang === 'en'
                      ? 'Free high-resolution original 4K phone wallpaper hosted on CREU Studio Google Drive. Suitable for iOS & Android screens.'
                      : 'Hình nền điện thoại chất lượng cao file gốc 4K từ kho Google Drive của CREU Studio. Tương thích hoàn hảo cho màn hình iPhone & Android.'}
                  </p>

                  <div className="p-4 rounded-xl bg-[#141c30] border border-white/10 text-xs space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Định dạng / Resolution:</span>
                      <span className="text-white font-mono font-bold">4K Ultra HD (1080x1920)</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Bản quyền / License:</span>
                      <span className="text-emerald-400 font-bold">Miễn phí 100% (Personal Use)</span>
                    </div>
                  </div>
                </div>

                {/* Modal Buttons */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleDownload(activeModalItem)}
                    className="w-full py-3.5 rounded-2xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>📥 Tải File Gốc 4K Tối Ưu (Google Drive)</span>
                  </button>

                  <a
                    href={getPinterestUrl(activeModalItem)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-2xl bg-[#E60023] hover:bg-[#ad081b] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>📌 Save to Pinterest</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </main>
  );
}
