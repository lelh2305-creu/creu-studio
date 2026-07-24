'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import defaultSiteData from '@/data/siteData.json';

interface PartnershipPricingProps {
  onNavigate: (tab: string) => void;
  pricing?: any[];
}

export default function PartnershipPricing({ onNavigate, pricing: propsPricing }: PartnershipPricingProps) {
  const [pricingList, setPricingList] = useState<any[]>(propsPricing || []);

  useEffect(() => {
    if (propsPricing && propsPricing.length > 0) {
      setPricingList(propsPricing);
      return;
    }

    const saved = localStorage.getItem('creu_site_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.pricing) {
          setPricingList(parsed.pricing);
          return;
        }
      } catch {}
    }

    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        if (data.pricing) setPricingList(data.pricing);
      })
      .catch(() => setPricingList(defaultSiteData.pricing));
  }, [propsPricing]);

  const cardsToRender = pricingList.length > 0 ? pricingList : defaultSiteData.pricing;

  return (
    <section className="pricing" id="pricing">
      <div className="shell">
        <motion.div
          className="center"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="eyebrow">Monthly partnership</div>
          <h2>
            Đồng hành dài hạn.<br />
            Tạo ra giá trị thật.
          </h2>
          <p>Ba gói dịch vụ linh hoạt, đồng hành cùng mục tiêu và ngân sách của bạn.</p>
        </motion.div>

        <div className="cards">
          {cardsToRender.map((c, idx) => (
            <motion.article
              key={c.id || idx}
              className={`card ${c.popular ? 'popular' : ''}`}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -12 }}
            >
              {c.badge && <span className="badge">{c.badge}</span>}
              <span className="plan">{c.plan}</span>
              <h3>{c.title}</h3>
              <div className="copy">{c.copy}</div>
              <div className="price">{c.price}</div>
              <div className="per">{c.per || 'VND / tháng'}</div>
              <ul className="features">
                {(c.features || []).map((f: string, fIdx: number) => (
                  <li key={fIdx}>{f}</li>
                ))}
              </ul>
              <a className="choose" onClick={() => onNavigate('contact')} style={{ cursor: 'pointer' }}>
                <b>→</b>{c.btnText || 'Chọn gói này'}
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
