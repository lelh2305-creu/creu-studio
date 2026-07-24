'use client';

import { motion } from 'framer-motion';

export default function ContactBanner() {
  return (
    <section id="contact">
      <div className="shell center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="eyebrow">Let's talk</div>
          <h2>
            Let’s build something<br />
            <em style={{ fontWeight: 300, color: '#b386d9' }}>meaningful together.</em>
          </h2>
          <p>Khung preview này đã chừa sẵn vị trí để nhúng YouTube, Vimeo hoặc video tự host.</p>
          <a className="primary" href="mailto:hello@creu.vn">
            <span>hello@creu.vn</span>
            <span>↗</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
