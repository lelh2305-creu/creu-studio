'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';

interface WorkPageProps {
  onPlayVideo?: (url: string, title: string) => void;
}

export default function WorkPage({ onPlayVideo }: WorkPageProps) {
  const [filter, setFilter] = useState('all');
  const [workItems, setWorkItems] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        if (data.works) setWorkItems(data.works);
      })
      .catch(() => {});
  }, []);

  const defaultItems = [
    { id: 1, title: 'Riverside Villa', categoryText: 'Video · Photo — 2026', categories: ['video', 'photo'], videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', bgClass: 'b1', isWide: true },
    { id: 2, title: 'Moc Coffee', categoryText: 'Branding — 2026', categories: ['brand'], bgClass: 'b2' },
    { id: 3, title: 'Le Hoi Thu Duc', categoryText: 'Video · Design — 2025', categories: ['video', 'design'], videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', bgClass: 'b3' },
    { id: 4, title: 'Atelier Home', categoryText: 'Photography — 2025', categories: ['photo'], bgClass: 'b4' },
    { id: 5, title: 'Atelier Home Brand Identity', categoryText: 'Brand Identity — 2025', categories: ['brand', 'design'], bgClass: 'b5', isWide: true },
    { id: 6, title: 'Coastal Brand Co.', categoryText: 'Branding — 2025', categories: ['brand'], bgClass: 'b7' },
  ];

  const displayList = workItems.length > 0 ? workItems : defaultItems;

  const filteredItems = displayList.filter(
    (item) => filter === 'all' || (item.categories && item.categories.includes(filter))
  );

  return (
    <div className="min-h-screen pt-12">
      <div className="pg-h">
        <span className="ey" style={{ position: 'relative', zIndex: 1 }}>Work</span>
        <h1 className="serif pg-t">
          Every frame<br />tells a <span className="pk">story.</span>
        </h1>
        <p className="pg-s">
          A curated collection of campaigns, identity systems, and visual narratives built for brands that dare to stand out.
        </p>
      </div>

      <div className="shell">
        <div className="wf">
          {['all', 'video', 'photo', 'design', 'brand'].map((cat) => (
            <button
              key={cat}
              className={`fb ${filter === cat ? 'on' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? 'All' : cat === 'photo' ? 'Photography' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <motion.div className="wfg" layout>
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className={`wfi relative group ${item.isWide ? 'wfb' : ''}`}
                onClick={() => {
                  if (item.videoUrl && onPlayVideo) {
                    onPlayVideo(item.videoUrl, item.title);
                  }
                }}
              >
                {item.videoUrl && (
                  <div className="absolute top-3 left-3 z-30 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-[10px] uppercase font-bold text-white flex items-center gap-1">
                    ▶ Play Video
                  </div>
                )}

                {item.image ? (
                  <img src={item.image} alt={item.title} className="wb" style={{ objectFit: 'cover' }} />
                ) : (
                  <div className={`wb ${item.bgClass || 'b1'}`} style={{ height: '100%' }} />
                )}
                <div className="wo" />
                <div className="wi-inf">
                  <div className="wi-nm">{item.title}</div>
                  <div className="wi-tp">{item.categoryText}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
