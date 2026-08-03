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

  // Prevent background body scrolling when modal is open
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

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const galleryImages = project.gallery && project.gallery.length > 0
    ? project.gallery
    : project.image
    ? [project.image]
    : [];

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-hidden">
          {/* Backdrop Blur Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Close Button Top Right */}
          <button
            onClick={onClose}
            className="fixed top-5 right-5 sm:top-8 sm:right-8 z-50 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 dark:bg-white/10 dark:hover:bg-white/25 border border-white/30 text-white flex items-center justify-center text-xl font-bold backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>

          {/* Modal Container (Apple Product Showcase Window) */}
          <motion.div
            className="relative w-full max-w-5xl max-h-[90vh] bg-[#f9fafb] dark:bg-[#0c1220] border border-white/20 dark:border-white/10 rounded-3xl sm:rounded-[36px] shadow-2xl overflow-y-auto z-10 text-gray-900 dark:text-white scrollbar-thin"
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Hero Image / Media Box */}
            <div className="relative w-full h-[320px] sm:h-[450px] md:h-[520px] overflow-hidden bg-gray-900">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full ${project.bgClass || 'b1'} flex items-center justify-center`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#f9fafb] dark:from-[#0c1220] via-transparent to-black/30" />
            </div>

            {/* Content Body */}
            <div className="px-6 sm:px-12 pb-12 pt-4 space-y-8">
              {/* Category & Title */}
              <div>
                <div className="inline-block px-3.5 py-1 rounded-full bg-[#a855f7]/15 border border-[#a855f7]/30 text-[#a855f7] dark:text-[#c499f5] text-xs font-bold uppercase tracking-wider mb-3">
                  {project.categoryText}
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-title)' }}>
                  {project.title}
                </h2>
              </div>

              {/* Description */}
              {project.description && (
                <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-normal max-w-3xl">
                  {project.description}
                </p>
              )}

              {/* Video Embed if Available */}
              {project.videoUrl && (
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400">Video Showcase</h3>
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-black">
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

              {/* Gallery Section */}
              {galleryImages.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400">
                    {lang === 'en' ? 'Project Gallery' : 'Bộ sưu tập hình ảnh'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {galleryImages.map((imgUrl: string, idx: number) => (
                      <div key={idx} className="relative rounded-2xl overflow-hidden border border-white/10 group bg-gray-100 dark:bg-gray-800">
                        <img
                          src={imgUrl}
                          alt={`${project.title} gallery ${idx + 1}`}
                          className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
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
                  className="px-6 py-2.5 rounded-full bg-[#a855f7] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#9333ea] transition-all cursor-pointer shadow-lg"
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
