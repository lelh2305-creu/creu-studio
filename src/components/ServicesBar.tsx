'use client';

import { motion } from 'framer-motion';

export default function ServicesBar() {
  const services = [
    { icon: '◌', title: 'Video Production', desc: 'Concept, filming & post-production.' },
    { icon: '✦', title: 'Photography', desc: 'Architecture, product & people.' },
    { icon: '⌁', title: 'Creative Direction', desc: 'Branding, visual systems & campaigns.' },
    { icon: '◎', title: 'Project Management', desc: 'Clear process, smooth delivery.' },
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
