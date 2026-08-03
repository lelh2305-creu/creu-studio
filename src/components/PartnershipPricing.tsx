'use client';

import { motion } from 'framer-motion';
import defaultSiteData from '@/data/siteData.json';
import { useLang } from '@/context/LangContext';
import { t } from '@/lib/translations';

interface PartnershipPricingProps {
  onNavigate: (tab: string) => void;
  pricing?: any[];
}

export default function PartnershipPricing({ onNavigate, pricing }: PartnershipPricingProps) {
  const { lang } = useLang();
  const cardsToRender = pricing && pricing.length > 0 ? pricing : defaultSiteData.pricing;

  const formatPrice = (priceStr: string) => {
    if (!priceStr) return null;
    return priceStr.split(/(\$|\+)/).map((part, i) => {
      if (part === '$' || part === '+') {
        return (
          <span key={i} className="price-symbol">
            {part}
          </span>
        );
      }
      return part;
    });
  };

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
            {lang === 'en' ? (
              <>Long-term partnership.<br />Real value created.</>
            ) : (
              <>Đồng hành dài hạn.<br />Tạo ra giá trị thật.</>
            )}
          </h2>
          <p>
            {lang === 'en'
              ? 'Three flexible partnership plans tailored to your brand goals and budget.'
              : 'Ba gói dịch vụ linh hoạt, đồng hành cùng mục tiêu và ngân sách của bạn.'}
          </p>
        </motion.div>

        <div className="cards">
          {cardsToRender.map((c, idx) => {
            const activeCopy = (lang === 'en' && c.copyEn) ? c.copyEn : c.copy;
            const activeFeatures = (lang === 'en' && c.featuresEn && c.featuresEn.length > 0) ? c.featuresEn : (c.features || []);

            return (
              <motion.article
                key={c.id || idx}
                className={`card ${c.popular ? 'popular' : ''}`}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                whileHover={{ y: -12 }}
              >
                {c.badge && <span className="badge">{lang === 'en' ? t('pricing.popular', lang) : c.badge}</span>}
                <span className="plan">{c.plan}</span>
                <h3>{c.title}</h3>
                <div className="copy">{activeCopy}</div>
                <div className="price">{formatPrice(c.price)}</div>
                <div className="per">USD / month</div>
                <ul className="features">
                  {activeFeatures.map((f: string, fIdx: number) => (
                    <li key={fIdx}>{f}</li>
                  ))}
                </ul>
                <a className="choose" onClick={() => onNavigate('contact')} style={{ cursor: 'pointer' }}>
                  <b>→</b>{c.btnText || t('pricing.cta', lang)}
                </a>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
