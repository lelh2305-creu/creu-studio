'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import defaultSiteData from '@/data/siteData.json';

interface SelectedWorksProps {
  onNavigate: (tab: string) => void;
  onPlayVideo?: (url: string, title: string) => void;
  works?: any[];
}

export default function SelectedWorks({ onNavigate, onPlayVideo, works: propsWorks }: SelectedWorksProps) {
  const [worksList, setWorksList] = useState<any[]>(propsWorks?.slice(0, 4) || []);

  useEffect(() => {
    if (propsWorks && propsWorks.length > 0) {
      setWorksList(propsWorks.slice(0, 4));
      return;
    }

    const saved = localStorage.getItem('creu_site_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.works) {
          setWorksList(parsed.works.slice(0, 4));
          return;
        }
      } catch {}
    }

    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        if (data.works) setWorksList(data.works.slice(0, 4));
      })
      .catch(() => setWorksList(defaultSiteData.works.slice(0, 4)));
  }, [propsWorks]);

  const listToRender = worksList.length > 0 ? worksList : defaultSiteData.works.slice(0, 4);

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
