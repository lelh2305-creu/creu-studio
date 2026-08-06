'use client';

import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';

export default function ContactBanner() {
  const { lang } = useLang();

  return (
    <section id="contact">
      <div className="shell center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="eyebrow">{lang === 'en' ? "Let's talk" : 'Bắt đầu ngay'}</div>
          <h2>
            {lang === 'en' ? (
              <>Let’s build something<br /><em style={{ fontWeight: 300, color: '#b386d9' }}>meaningful together.</em></>
            ) : (
              <>Cùng CREU tạo nên<br /><em style={{ fontWeight: 300, color: '#b386d9' }}>trải nghiệm thị giác giàu cảm xúc.</em></>
            )}
          </h2>
          <p>
            {lang === 'en'
              ? 'Whether a new campaign or an emerging idea, let CREU bring it to life with striking visual experiences.'
              : 'Dù là một chiến dịch mới hay một ý tưởng đang ấp ủ, hãy cùng CREU biến nó thành trải nghiệm thị giác ấn tượng.'}
          </p>
          <a className="primary" href="mailto:hello@creu.vn">
            <span>hello@creu.vn</span>
            <span>↗</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
