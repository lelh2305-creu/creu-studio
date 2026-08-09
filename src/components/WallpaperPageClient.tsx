'use client';

import { useState, useEffect } from 'react';
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

      {/* Hero Section Banner */}
      <section className="relative pt-32 pb-16 px-6 text-center max-w-5xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a855f7]/20 border border-[#a855f7]/40 text-[#c499f5] text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg shadow-purple-500/10"
        >
          <span>📱 CREU WALLPAPER VAULT 2026</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight font-title"
        >
          {lang === 'en' ? (
            <>
              Free HD 4K <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#c499f5] via-[#a855f7] to-[#ec4899]">Phone Wallpapers</span>
            </>
          ) : (
            <>
              Kho <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#c499f5] via-[#a855f7] to-[#ec4899]">Hình Nền Điện Thoại</span> Đẹp 4K Miễn Phí
            </>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-light"
        >
          {lang === 'en'
            ? 'High-resolution aesthetic 4K phone wallpapers by CREU Studio. Categorized by color tones. Instant preview & direct 4K download.'
            : 'Tuyển tập hình nền điện thoại chuẩn 4K chất lượng cao được thiết kế & tuyển chọn bởi CREU Studio. Lọc theo tone màu, preview cực nhanh và tải file gốc 100% miễn phí.'}
        </motion.p>
      </section>

      {/* Tone Category Filter Pills */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-none justify-start md:justify-center">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#a855f7] text-white shadow-xl shadow-purple-500/30 scale-105 border border-purple-300/40'
                    : 'bg-[#0e1424] text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{lang === 'en' ? cat.nameEn : cat.nameVi}</span>
              </button>
            );
          })}
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
