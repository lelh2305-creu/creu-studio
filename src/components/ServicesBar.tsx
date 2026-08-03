'use client';

import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';

export default function ServicesBar() {
  const { lang } = useLang();

  const services = [
    {
      icon: '◌',
      title: 'Video Production',
      desc: lang === 'en' ? 'Concept, filming & post-production.' : 'Ý tưởng, quay phim & sản xuất hậu kỳ.',
    },
    {
      icon: '✦',
      title: 'Photography',
      desc: lang === 'en' ? 'Architecture, product & people.' : 'Hình ảnh kiến trúc, sản phẩm & con người.',
    },
    {
      icon: '⌁',
      title: 'Creative Direction',
      desc: lang === 'en' ? 'Branding, visual systems & campaigns.' : 'Định hướng sáng tạo & chiến dịch nhận diện.',
    },
    {
      icon: '◎',
      title: 'Project Management',
      desc: lang === 'en' ? 'Clear process, smooth delivery.' : 'Quy trình rõ ràng, bàn giao đúng tiến độ.',
    },
  ];

  return (
    <motion.div
      className="services-bar"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {services.map((s, idx) => (
        <div className="service" key={idx}>
          <div className="icon">{s.icon}</div>
          <div>
            <strong>{s.title}</strong>
            <small>{s.desc}</small>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
