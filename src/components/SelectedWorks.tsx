'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import defaultSiteData from '@/data/siteData.json';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/translations';
import ProjectModal from './ProjectModal';

interface SelectedWorksProps {
  onNavigate: (tab: string) => void;
  onPlayVideo?: (url: string, title: string) => void;
  works?: any[];
}

export default function SelectedWorks({ onNavigate, onPlayVideo, works }: SelectedWorksProps) {
  const { lang } = useLang();
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const listToRender = works && works.length > 0 ? works : defaultSiteData.works;

  return (
    <>
      <section id="work" className="relative">
        <div className="shell">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>{t('works.title', lang)}</h2>
            <a onClick={() => onNavigate('work')} style={{ cursor: 'pointer' }}>
              {t('works.viewAll', lang)} ↗
            </a>
          </motion.div>

          <div className="workgrid">
            {listToRender.map((w, idx) => (
              <motion.article
                key={w.id || idx}
                className="work cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setSelectedProject(w)}
              >
                {w.image ? (
                  <img src={w.image} alt={w.title} className="art" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                ) : (
                  <div className={`art ${w.bgClass || 'a1'}`} />
                )}

                {w.videoUrl && (
                  <div className="absolute top-3 left-3 z-30 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-[10px] uppercase font-bold text-white flex items-center gap-1">
                    ▶ Play Video
                  </div>
                )}

                <div className="work-info">
                  <div>
                    <strong>{w.title}</strong>
                    <small>{w.categoryText}</small>
                  </div>
                  <div className="arrow">↗</div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Apple Showcase Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
