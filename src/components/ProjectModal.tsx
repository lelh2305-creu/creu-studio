'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/context/LangContext';

interface ProjectModalProps {
  project: any | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { lang } = useLang();

  // Prevent background body scrolling when modal is active
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const activeDescription = (lang === 'en' && project.descriptionEn)
    ? project.descriptionEn
    : project.description;

  const galleryImages: string[] = project.gallery && project.gallery.length > 0
    ? project.gallery
    : project.image
    ? [project.image]
    : [];

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden">
          {/* Backdrop Blur Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/75 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Close Button Top Right */}
          <button
            onClick={onClose}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 dark:bg-white/10 dark:hover:bg-white/25 border border-white/30 text-white flex items-center justify-center text-lg font-bold backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>

          {/* Modal Container (Apple Showcase Window - Self-Contained Scroll) */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[86vh] bg-[#f9fafb] dark:bg-[#0e1424] border border-white/20 dark:border-white/10 rounded-3xl sm:rounded-[32px] shadow-2xl overflow-y-auto z-10 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Hero Image Box - Contain Mode & Blurred Background Blend */}
            <div className="relative w-full max-h-[58vh] bg-gradient-to-b from-black/80 via-black/60 to-[#f9fafb] dark:to-[#0e1424] p-4 sm:p-8 flex items-center justify-center overflow-hidden">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="max-h-[50vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
                />
              ) : (
                <div className={`w-full h-64 ${project.bgClass || 'b1'} rounded-2xl flex items-center justify-center`} />
              )}
            </div>

            {/* Content Body */}
            <div className="px-6 sm:px-10 pb-10 pt-2 space-y-7">
              {/* Category & Title */}
              <div>
                <div className="inline-block px-3.5 py-1 rounded-full bg-[#a855f7]/15 border border-[#a855f7]/30 text-[#a855f7] dark:text-[#c499f5] text-xs font-bold uppercase tracking-wider mb-2.5">
                  {project.categoryText}
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-title)' }}>
                  {project.title}
                </h2>
              </div>

              {/* Description */}
              {activeDescription && (
                <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                  {activeDescription}
                </p>
              )}

              {/* Video Showcase Embed */}
              {project.videoUrl && (
                <div className="space-y-2.5 pt-2">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400">
                    🎬 {lang === 'en' ? 'Video Showcase' : 'Trình chiếu Video'}
                  </h3>
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-black">
                    <iframe
                      src={project.videoUrl.includes('watch?v=') ? project.videoUrl.replace('watch?v=', 'embed/') : project.videoUrl}
                      title={project.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Gallery Grid */}
              {galleryImages.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400">
                    🖼️ {lang === 'en' ? 'Project Gallery' : 'Bộ sưu tập hình ảnh'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {galleryImages.map((imgUrl: string, idx: number) => (
                      <div key={idx} className="relative rounded-2xl overflow-hidden border border-white/15 group bg-black/40">
                        <img
                          src={imgUrl}
                          alt={`${project.title} gallery ${idx + 1}`}
                          className="w-full h-56 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer CTA */}
              <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs text-gray-400 uppercase font-semibold">CREU Studio · 2026</span>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-full bg-[#a855f7] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#9333ea] transition-all cursor-pointer shadow-lg"
                >
                  {lang === 'en' ? 'Close Showcase ✕' : 'Đóng xem chi tiết ✕'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
