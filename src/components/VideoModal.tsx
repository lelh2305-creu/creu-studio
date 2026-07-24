'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Robust URL converter for YouTube, Vimeo, and Direct Video
  const getEmbedInfo = (url?: string) => {
    if (!url) return { type: 'none', src: '' };
    const trimmed = url.trim();

    // Direct MP4 / WebM video file
    if (trimmed.endsWith('.mp4') || trimmed.endsWith('.webm') || trimmed.endsWith('.mov')) {
      return { type: 'video', src: trimmed };
    }

    // YouTube watch URL
    if (trimmed.includes('youtube.com/watch')) {
      try {
        const urlObj = new URL(trimmed);
        const id = urlObj.searchParams.get('v');
        if (id) return { type: 'iframe', src: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&enablejsapi=1` };
      } catch {}
    }

    // YouTube short URL
    if (trimmed.includes('youtu.be/')) {
      const id = trimmed.split('youtu.be/')[1]?.split('?')[0];
      if (id) return { type: 'iframe', src: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&enablejsapi=1` };
    }

    // YouTube embed URL
    if (trimmed.includes('youtube.com/embed/')) {
      const cleanUrl = trimmed.includes('autoplay=1') ? trimmed : `${trimmed}${trimmed.includes('?') ? '&' : '?'}autoplay=1`;
      return { type: 'iframe', src: cleanUrl };
    }

    // Vimeo URL
    if (trimmed.includes('vimeo.com/')) {
      const id = trimmed.split('vimeo.com/')[1]?.split('?')[0];
      if (id) return { type: 'iframe', src: `https://player.vimeo.com/video/${id}?autoplay=1` };
    }

    return { type: 'iframe', src: trimmed };
  };

  const embedInfo = getEmbedInfo(videoUrl);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition-all cursor-pointer shadow-lg"
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </button>

          {/* Centered Modal Content Box */}
          <motion.div
            className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden bg-black border border-white/20 shadow-2xl relative"
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          >
            {embedInfo.type === 'video' ? (
              <video
                src={embedInfo.src}
                controls
                autoPlay
                className="w-full h-full object-contain bg-black"
              />
            ) : embedInfo.type === 'iframe' && embedInfo.src ? (
              <iframe
                src={embedInfo.src}
                title={title || 'CREU Video Player'}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-center color-white bg-[#0e1424] p-8">
                <div>
                  <div className="text-4xl mb-3">🎬</div>
                  <b className="text-xl text-white block mb-2">CHƯA CÓ LINK VIDEO SHOWREEL</b>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Vui lòng truy cập trang <span className="text-[#c499f5] font-bold">/admin</span> để dán link Video YouTube hoặc Vimeo của dự án!
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
