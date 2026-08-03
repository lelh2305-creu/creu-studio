'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';
import defaultSiteData from '@/data/siteData.json';
import ProjectModal from './ProjectModal';
import { useLang } from '@/context/LangContext';

interface WorkPageProps {
  onPlayVideo?: (url: string, title: string) => void;
  works?: any[];
}

export default function WorkPage({ onPlayVideo, works: propsWorks }: WorkPageProps) {
  const { lang } = useLang();
  const [filter, setFilter] = useState('all');
  const [workItems, setWorkItems] = useState<any[]>(propsWorks || []);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  useEffect(() => {
    if (propsWorks && propsWorks.length > 0) {
      setWorkItems(propsWorks);
    }

    fetch('/api/data?t=' + Date.now(), { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.works && data.works.length > 0) {
          setWorkItems(data.works);
        }
      })
      .catch(() => {
        if (!propsWorks || propsWorks.length === 0) {
          setWorkItems(defaultSiteData.works);
        }
      });
  }, [propsWorks]);

  const displayList = workItems.length > 0 ? workItems : defaultSiteData.works;

  const filteredItems = displayList.filter(
    (item) => filter === 'all' || (item.categories && item.categories.includes(filter))
  );

  return (
    <>
      <div className="min-h-screen pt-12">
        <div className="pg-h">
          <span className="ey" style={{ position: 'relative', zIndex: 1 }}>
            {lang === 'en' ? 'Work' : 'Dự án'}
          </span>
          <h1 className="serif pg-t">
            {lang === 'en' ? (
              <>Every frame<br />tells a <span className="pk">story.</span></>
            ) : (
              <>Mỗi khung hình<br />kể một <span className="pk">câu chuyện.</span></>
            )}
          </h1>
          <p className="pg-s">
            {lang === 'en'
              ? 'A curated collection of campaigns, identity systems, and visual narratives built for brands that dare to stand out.'
              : 'Bộ sưu tập các chiến dịch, hệ thống nhận diện và câu chuyện thị giác dành cho những thương hiệu dám tạo sự khác biệt.'}
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
                {cat === 'all'
                  ? (lang === 'en' ? 'All' : 'Tất cả')
                  : cat === 'photo'
                  ? 'Photography'
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
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
                  className={`wfi relative group cursor-pointer ${item.isWide ? 'wfb' : ''}`}
                  onClick={() => setSelectedProject(item)}
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

      {/* Apple Showcase Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
