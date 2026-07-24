'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SelectedWorksProps {
  onNavigate: (tab: string) => void;
  onPlayVideo?: (url: string, title: string) => void;
}

export default function SelectedWorks({ onNavigate, onPlayVideo }: SelectedWorksProps) {
  const [works, setWorks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        if (data.works) setWorks(data.works.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  const defaultWorks = [
    { id: 1, title: 'Serenity House', categoryText: 'Residential · 2026', bgClass: 'a1' },
    { id: 2, title: 'Mộc Coffee', categoryText: 'Brand identity · 2026', bgClass: 'a2' },
    { id: 3, title: 'Lễ hội Thủ Đức', categoryText: 'Film · Campaign', bgClass: 'a3' },
    { id: 4, title: 'Atelier Home', categoryText: 'Photography · 2025', bgClass: 'a4' },
  ];

  const listToRender = works.length > 0 ? works : defaultWorks;

  return (
    <section id="work" className="relative">
      <div className="shell">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Selected works</h2>
          <a onClick={() => onNavigate('work')} style={{ cursor: 'pointer' }}>
            View all projects ↗
          </a>
        </motion.div>

        <div className="workgrid">
          {listToRender.map((w, idx) => (
            <motion.article
              className="work relative group"
              key={w.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => {
                if (w.videoUrl && onPlayVideo) {
                  onPlayVideo(w.videoUrl, w.title);
                } else {
                  onNavigate('work');
                }
              }}
            >
              {w.image ? (
                <img src={w.image} alt={w.title} className="art" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              ) : (
                <div className={`art ${w.bgClass || `a${(idx % 4) + 1}`}`} />
              )}
              <div className="work-info">
                <div>
                  <strong>{w.title}</strong>
                  <small>{w.categoryText}</small>
                </div>
                <span className="arrow">↗</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
